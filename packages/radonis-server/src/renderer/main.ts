/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Readable, Transform } from 'node:stream'

import type { I18nManagerContract } from '@ioc:Adonis/Addons/I18n'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { LoggerContract } from '@ioc:Adonis/Core/Logger'
import type { RouterContract } from '@ioc:Adonis/Core/Route'
import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import { stringifyAttributes } from '@microeinhundert/radonis-shared'
import type {
  AssetsManagerContract,
  ErrorPages,
  FlushCallback,
  Globals,
  HeadManagerContract,
  HeadMeta,
  HeadTag,
  HydrationManagerContract,
  ManifestManagerContract,
  PluginsManagerContract,
  RendererContract,
  RenderOptions,
  Resettable,
  ServerContract as Context,
  UnwrapProps,
} from '@microeinhundert/radonis-types'
import { flattie } from 'flattie'
import isbot from 'isbot'
import type { ContiguousData } from 'minipass'
import Minipass from 'minipass'
import type { ComponentPropsWithoutRef, ComponentType, PropsWithoutRef, ReactElement, ReactNode } from 'react'
import { Fragment } from 'react'
import { createElement as h, StrictMode } from 'react'
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server'

import { DefaultErrorPage } from '../components/default_error_page'
import { extractRootRoutes } from '../utils/extract_root_routes'
import { generateHtmlStream } from '../utils/generate_html_stream'
import { transformRouteNode } from '../utils/transform_route_node'
import { withContextProviders } from '../utils/with_context_providers'
import { ABORT_DELAY } from './constants'

/**
 * Service for rendering
 */
export class Renderer implements RendererContract, Resettable {
  /**
   * The singleton instance
   */
  static instance?: Renderer

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(...args: ConstructorParameters<typeof Renderer>): Renderer {
    return (Renderer.instance = Renderer.instance ?? new Renderer(...args))
  }

  /**
   * The Radonis config
   */
  #config: RadonisConfig

  /**
   * The application
   */
  #application: ApplicationContract

  /**
   * The Radonis services
   */
  #assetsManager: AssetsManagerContract
  #headManager: HeadManagerContract
  #hydrationManager: HydrationManagerContract
  #manifestManager: ManifestManagerContract
  #pluginsManager: PluginsManagerContract

  /**
   * The Adonis services
   */
  #logger: LoggerContract
  #router: RouterContract
  #i18nManager: I18nManagerContract

  /**
   * The context
   */
  #context: Context

  /**
   * The error pages
   */
  #errorPages: ErrorPages

  /**
   * The flush callbacks
   */
  #flushCallbacks: FlushCallback[]

  constructor(config: RadonisConfig, application: ApplicationContract) {
    this.#config = config
    this.#application = application

    this.#assetsManager = application.container.resolveBinding('Microeinhundert/Radonis/AssetsManager')
    this.#headManager = application.container.resolveBinding('Microeinhundert/Radonis/HeadManager')
    this.#hydrationManager = application.container.resolveBinding('Microeinhundert/Radonis/HydrationManager')
    this.#manifestManager = application.container.resolveBinding('Microeinhundert/Radonis/ManifestManager')
    this.#pluginsManager = application.container.resolveBinding('Microeinhundert/Radonis/PluginsManager')

    this.#logger = application.container.resolveBinding('Adonis/Core/Logger')
    this.#router = application.container.resolveBinding('Adonis/Core/Route')
    this.#i18nManager = application.container.resolveBinding('Adonis/Addons/I18n')

    this.#setDefaults()
  }

  /**
   * Get for request
   */
  getForRequest(httpContext: HttpContextContract): this {
    this.reset()
    this.#router.commit()

    /**
     * Set the context
     */
    this.#context = {
      application: this.#application,
      httpContext,
      router: this.#router,
    }

    const locale = this.#extractUserLocale(httpContext)

    /**
     * Initialize the manifest
     */
    this.#manifestManager
      .setLocale(locale)
      .setFlashMessages(flattie(httpContext.session.flashMessages.all()))
      .setMessages(this.#i18nManager.getTranslationsFor(locale))
      .setRoutes(extractRootRoutes(this.#router))
      .setRoute({
        ...transformRouteNode(httpContext.route!),
        params: httpContext.request.params(),
        searchParams: httpContext.request.qs(),
      })

    return this
  }

  /**
   * Set the head title for the current request
   */
  withHeadTitle(title: string): this {
    this.#headManager.setTitle(title)

    return this
  }

  /**
   * Add head meta for the current request
   */
  withHeadMeta(meta: HeadMeta): this {
    this.#headManager.addMeta(meta)

    return this
  }

  /**
   * Add head tags for the current request
   */
  withHeadTags(tags: HeadTag[]): this {
    this.#headManager.addTags(tags)

    return this
  }

  /**
   * Add globals for the current request
   */
  withGlobals(globals: Globals): this {
    this.#manifestManager.addGlobals(globals)

    return this
  }

  /**
   * Add error pages for the current request
   */
  withErrorPages(errorPages: ErrorPages): this {
    this.#errorPages = { ...this.#errorPages, ...errorPages }

    return this
  }

  /**
   * Add flush callbacks to be executed after
   * rendering the view for the current request
   */
  withFlushCallbacks(flushCallbacks: FlushCallback[]): this {
    this.#flushCallbacks = [...this.#flushCallbacks, ...flushCallbacks]

    return this
  }

  /**
   * Render the view and stream the response
   */
  async render<T extends PropsWithoutRef<any>>(
    Component: ComponentType<T>,
    props?: ComponentPropsWithoutRef<ComponentType<T>>,
    options?: RenderOptions
  ): Promise<UnwrapProps<T>> {
    const { request } = this.#context.httpContext

    /**
     * If the request accepts HTML,
     * return the rendered view
     */
    if (request.accepts(['html'])) {
      /**
       * Set the title on the HeadManager
       */
      if (options?.head?.title) {
        this.#headManager.setTitle(options.head.title)
      }

      /**
       * Add meta to the HeadManager
       */
      if (options?.head?.meta) {
        this.#headManager.addMeta(options.head.meta)
      }

      /**
       * Add tags to the HeadManager
       */
      if (options?.head?.tags) {
        this.#headManager.addTags(options.head.tags)
      }

      /**
       * Add globals to the ManifestManager
       */
      if (options?.globals) {
        this.#manifestManager.addGlobals(options.globals)
      }

      /**
       * Set the server manifest on the global scope
       */
      this.#manifestManager.setServerManifestOnGlobalScope()

      try {
        /**
         * Render view
         */
        const readable = await this.#renderToReadable(Component, props)

        this.#context.httpContext.response
          .header('Content-Type', 'text/html')
          .stream(readable.pipe(this.#createAfterRenderTransform()))
      } catch (error) {
        this.#logger.error(error)

        /**
         * Render error page
         */
        const readable = await this.#renderToReadable(this.#errorPages[500] ?? DefaultErrorPage, { error })

        this.#context.httpContext.response
          .header('Content-Type', 'text/html')
          .stream(readable.pipe(this.#createAfterRenderTransform()))
      }
    }

    return props as UnwrapProps<T>
  }

  /**
   * Reset for a new request
   */
  reset(): void {
    this.#setDefaults()
  }

  /**
   * Get the markup containing the head as well as the opening html tag
   */
  #getHeadMarkup(): string {
    return [
      '<!DOCTYPE html>',
      `<html ${stringifyAttributes({ lang: this.#manifestManager.locale })}>`,
      this.#headManager.getMarkup(),
    ].join('\n')
  }

  /**
   * Get the stream containing the body
   */
  #getBodyStream(tree: ReactElement): Promise<Minipass<Buffer, ContiguousData>> {
    const { request } = this.#context.httpContext
    const userAgent = request.header('user-agent')
    const isBot = isbot(userAgent)

    const duplex = new Minipass()

    return new Promise<Minipass<Buffer, ContiguousData>>((resolve, reject) => {
      try {
        const { pipe, abort } = renderToPipeableStream(h(StrictMode, null, h('body', null, tree)), {
          [this.#config.server.streaming && !isBot ? 'onShellReady' : 'onAllReady']() {
            resolve(pipe(duplex))
          },
          onShellError: (error) => {
            reject(error)
          },
          onError: (error) => {
            reject(error)
          },
        })

        setTimeout(abort, ABORT_DELAY)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Get the markup containing the footer scripts as well as the closing html tag
   */
  async #getFooterMarkup(): Promise<string> {
    const resolvedFlushCallbacks = await Promise.all(
      this.#flushCallbacks.map((flushCallback) => flushCallback.apply(null, []))
    )
    const flushCallbackInjects = resolvedFlushCallbacks.filter((value): value is ReactNode => !!value)

    const scripts = this.#assetsManager.requiredAssets.map((asset) => {
      this.#hydrationManager.requireTokens(asset.tokens)

      return h('script', {
        type: 'module',
        defer: true,
        src: asset.path,
      })
    })

    const tree = h(
      Fragment,
      null,
      h('script', {
        id: 'rad-manifest',
        dangerouslySetInnerHTML: {
          __html: `window.radonisManifest = ${this.#manifestManager.getClientManifestAsJSON()}`,
        },
      }),
      ...flushCallbackInjects,
      ...scripts
    )

    return [renderToStaticMarkup(tree), '</html>'].join('\n')
  }

  /**
   * Render to a Readable
   */
  async #renderToReadable<T>(
    Component: ComponentType<T>,
    props?: ComponentPropsWithoutRef<ComponentType<T>>
  ): Promise<Readable> {
    const tree = withContextProviders(
      this,
      this.#assetsManager,
      this.#manifestManager,
      this.#context,
      /* @ts-ignore Unsure why this errors */
      await this.#pluginsManager.execute('beforeRender', h(Component, props), {
        ctx: this.#context.httpContext,
        manifest: this.#manifestManager,
        props: props as Record<string, unknown> | undefined,
      })
    )

    const bodyStream = await this.#getBodyStream(tree)
    const htmlStream = generateHtmlStream({
      head: () => this.#getHeadMarkup(),
      body: () => bodyStream,
      footer: () => this.#getFooterMarkup(),
    })

    return Readable.from(htmlStream)
  }

  /**
   * Create the Transform calling the `afterRender`
   * plugin hook for every chunk of rendered HTML
   */
  #createAfterRenderTransform() {
    return new Transform({
      transform: async (chunk, _, callback) => {
        callback(
          null,
          await this.#pluginsManager.execute('afterRender', chunk.toString(), { ctx: this.#context.httpContext })
        )
      },
    })
  }

  /**
   * Extract the user locale from the HttpContext
   */
  #extractUserLocale({ request }: HttpContextContract): string {
    const supportedLocales = this.#i18nManager.supportedLocales()

    return request.language(supportedLocales) || request.input('lang') || this.#i18nManager.defaultLocale
  }

  /**
   * Set the defaults
   */
  #setDefaults(): void {
    this.#context = null as any
    this.#errorPages = {}
    this.#flushCallbacks = []
  }
}
