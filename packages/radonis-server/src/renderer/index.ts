/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { I18nManagerContract } from '@ioc:Adonis/Addons/I18n'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { LoggerContract } from '@ioc:Adonis/Core/Logger'
import type { RouterContract } from '@ioc:Adonis/Core/Route'
import type { AdonisContextContract, RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import type { HydrationManager } from '@microeinhundert/radonis-hydrate'
import type { PluginsManager } from '@microeinhundert/radonis-shared'
import { stringifyAttributes } from '@microeinhundert/radonis-shared'
import type {
  CustomErrorPages,
  Globals,
  HeadMeta,
  HeadTag,
  Locale,
  RendererContract,
  RenderOptions,
  Resettable,
  UnwrapProps,
} from '@microeinhundert/radonis-types'
import { flattie } from 'flattie'
import type { ContiguousData } from 'minipass'
import type Minipass from 'minipass'
import type { ComponentPropsWithoutRef, ComponentType, PropsWithoutRef, ReactElement } from 'react'
import { createElement as h, StrictMode } from 'react'
import { Readable, Transform } from 'stream'

import type { AssetsManager } from '../assetsManager'
import type { HeadManager } from '../headManager'
import type { ManifestManager } from '../manifestManager'
import { withContextProviders } from '../react'
import { extractRootRoutes } from '../utils/extractRootRoutes'
import { generateHtmlStream, onAllReady, onShellReady } from './utils/stream'
import { transformRouteNode } from './utils/transformRouteNode'

/**
 * @internal
 */
export class Renderer implements RendererContract, Resettable {
  /**
   * The application
   */
  #application: ApplicationContract

  /**
   * The Logger instance
   */
  #logger: LoggerContract

  /**
   * The Router instance
   */
  #router: RouterContract

  /**
   * The I18nManager instance
   */
  #i18nManager: I18nManagerContract

  /**
   * The Radonis config
   */
  #config: RadonisConfig

  /**
   * The PluginsManager instance
   */
  #pluginsManager: PluginsManager

  /**
   * The HydrationManager instance
   */
  #hydrationManager: HydrationManager

  /**
   * The AssetsManager instance
   */
  #assetsManager: AssetsManager

  /**
   * The HeadManager instance
   */
  #headManager: HeadManager

  /**
   * The ManifestManager instance
   */
  #manifestManager: ManifestManager

  /**
   * The Adonis context
   */
  #adonisContext: AdonisContextContract

  /**
   * The registered custom error pages
   */
  #customErrorPages: CustomErrorPages

  /**
   * Constructor
   */
  constructor(application: ApplicationContract) {
    this.#application = application

    this.#logger = application.container.resolveBinding('Adonis/Core/Logger')
    this.#router = application.container.resolveBinding('Adonis/Core/Route')
    this.#i18nManager = application.container.resolveBinding('Adonis/Addons/I18n')

    this.#config = application.container.resolveBinding('Microeinhundert/Radonis/Config')
    this.#pluginsManager = application.container.resolveBinding('Microeinhundert/Radonis/PluginsManager')
    this.#hydrationManager = application.container.resolveBinding('Microeinhundert/Radonis/HydrationManager')
    this.#assetsManager = application.container.resolveBinding('Microeinhundert/Radonis/AssetsManager')
    this.#headManager = application.container.resolveBinding('Microeinhundert/Radonis/HeadManager')
    this.#manifestManager = application.container.resolveBinding('Microeinhundert/Radonis/ManifestManager')

    this.#setDefaults()
  }

  /**
   * Get for request
   */
  getForRequest(httpContext: HttpContextContract): this {
    this.reset()
    this.#router.commit()

    /**
     * Set Adonis context
     */
    this.#adonisContext = {
      application: this.#application,
      httpContext,
      router: this.#router,
    }

    const locale = this.#extractUserLocale(httpContext)

    /**
     * Set manifest
     */
    this.#manifestManager
      .setLocale(locale)
      .setFlashMessages(flattie(httpContext.session.flashMessages.all()))
      .setMessages(this.#i18nManager.getTranslationsFor(locale))
      .setRoutes(extractRootRoutes(this.#router))
      .setRoute(transformRouteNode(httpContext.route))

    return this
  }

  /**
   * Set title for the current request
   */
  withTitle(title: string): this {
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
   * Register custom error pages for the current request
   */
  withCustomErrorPages(pages: CustomErrorPages): this {
    this.#customErrorPages = { ...this.#customErrorPages, ...pages }

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
    const { request } = this.#adonisContext.httpContext

    /**
     * If the request accepts HTML,
     * return the rendered view
     */
    if (request.accepts(['html'])) {
      /**
       * Re-read the build manifest on every
       * render when not in production
       */
      if (!this.#adonisContext.application.inProduction) {
        await this.#assetsManager.readBuildManifest()
      }

      /**
       * Set the title on the HeadManager
       */
      if (options?.title) {
        this.#headManager.setTitle(options.title)
      }

      /**
       * Add meta to the HeadManager
       */
      if (options?.meta) {
        this.#headManager.addMeta(options.meta)
      }

      /**
       * Add tags to the HeadManager
       */
      if (options?.tags) {
        this.#headManager.addTags(options.tags)
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
        await this.#renderAndStreamComponent(Component, props)
      } catch (error) {
        /**
         * Render a custom error page if one was registered, else rethrow the error
         */
        if (this.#customErrorPages[500]) {
          this.#logger.error(error)
          await this.#renderAndStreamComponent(this.#customErrorPages[500], { error })
        } else {
          throw error
        }
      }
    }

    return props as UnwrapProps<T>
  }

  /**
   * Reset for a new request
   */
  reset(): void {
    this.#assetsManager.reset()
    this.#headManager.reset()
    this.#manifestManager.reset()

    this.#setDefaults()
  }

  /**
   * Get the string containing the <head> as well as the opening <html>
   */
  #getHeadString(): string {
    return [
      '<!DOCTYPE html>',
      `<html ${stringifyAttributes({ lang: this.#manifestManager.locale })}>`,
      this.#headManager.getHTML(),
    ].join('\n')
  }

  /**
   * Get the stream containing the <body>
   */
  #getBodyStream(tree: ReactElement): Promise<Minipass<Buffer, ContiguousData>> {
    const renderToStream = this.#config.server.streaming ? onShellReady : onAllReady

    return renderToStream(h(StrictMode, null, h('body', null, tree)))
  }

  /**
   * Get the string containing the <footer> as well as the closing <html>
   */
  #getFooterString(): string {
    const scripts = this.#assetsManager.requiredAssets.map((asset) => {
      this.#hydrationManager.requireAsset(asset)

      return `<script ${stringifyAttributes({
        type: 'module',
        defer: true,
        src: asset.path,
      })}></script>`
    })

    return [
      `<script id="rad-manifest">window.radonisManifest = ${this.#manifestManager.getClientManifestAsJSON()}</script>`,
      ...scripts,
      '</html>',
    ].join('\n')
  }

  /**
   * Render and stream a component
   */
  async #renderAndStreamComponent<T>(
    Component: ComponentType<T>,
    props?: ComponentPropsWithoutRef<ComponentType<T>>
  ): Promise<void> {
    /**
     * The fully contstructed tree of React elements
     */
    const tree = await this.#pluginsManager.execute(
      'beforeRender',
      withContextProviders(
        this.#hydrationManager,
        this.#assetsManager,
        this.#manifestManager,
        this.#adonisContext,
        Component,
        props
      ),
      null
    )

    /**
     * The readable containing head, body and footer
     */
    const htmlStreamReadable = Readable.from(
      generateHtmlStream({
        head: () => this.#getHeadString(),
        body: () => this.#getBodyStream(tree),
        footer: () => this.#getFooterString(),
      })
    )

    this.#adonisContext.httpContext.response
      .header('Content-Type', 'text/html')
      .header('Connection', 'Transfer-Encoding')
      .header('Transfer-Encoding', 'chunked')
      .stream(htmlStreamReadable.pipe(this.#createAfterRenderTransform()))
  }

  /**
   * Create a Transform calling the `afterRender`
   * plugin hook for every chunk of rendered HTML
   */
  #createAfterRenderTransform() {
    return new Transform({
      transform: async (chunk, _, callback) => {
        callback(null, await this.#pluginsManager.execute('afterRender', chunk.toString(), null))
      },
    })
  }

  /**
   * Extract the user locale from the http context
   */
  #extractUserLocale({ request }: HttpContextContract): Locale {
    const supportedLocales = this.#i18nManager.supportedLocales()

    return request.language(supportedLocales) || request.input('lang') || this.#i18nManager.defaultLocale
  }

  /**
   * Set the defaults
   */
  #setDefaults(): void {
    this.#adonisContext = null as any
    this.#customErrorPages = {}
  }
}
