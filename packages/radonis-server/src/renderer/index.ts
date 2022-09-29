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
import type { AdonisContextContract } from '@ioc:Microeinhundert/Radonis'
import type { HydrationManager } from '@microeinhundert/radonis-hydrate'
import type { PluginsManager } from '@microeinhundert/radonis-shared'
import { stringifyAttributes } from '@microeinhundert/radonis-shared'
import type {
  Globals,
  HeadMeta,
  HeadTag,
  Locale,
  RendererContract,
  RenderOptions,
  UnwrapProps,
} from '@microeinhundert/radonis-types'
import { flattie } from 'flattie'
import type { ComponentPropsWithoutRef, ComponentType, PropsWithoutRef } from 'react'
import { createElement as h, StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { serialize } from 'superjson'

import type { AssetsManager } from '../assetsManager'
import { ServerException } from '../exceptions/serverException'
import type { HeadManager } from '../headManager'
import type { ManifestManager } from '../manifestManager'
import { wrapTree } from '../react'
import { extractRootRoutes } from '../utils/extractRootRoutes'
import { transformRouteNode } from './utils/transformRouteNode'

/**
 * @internal
 */
export class Renderer implements RendererContract {
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
   * Constructor
   */
  constructor(application: ApplicationContract) {
    this.#application = application

    this.#logger = application.container.resolveBinding('Adonis/Core/Logger')
    this.#router = application.container.resolveBinding('Adonis/Core/Route')
    this.#i18nManager = application.container.resolveBinding('Adonis/Addons/I18n')

    this.#pluginsManager = application.container.resolveBinding('Microeinhundert/Radonis/PluginsManager')
    this.#hydrationManager = application.container.resolveBinding('Microeinhundert/Radonis/HydrationManager')
    this.#assetsManager = application.container.resolveBinding('Microeinhundert/Radonis/AssetsManager')
    this.#headManager = application.container.resolveBinding('Microeinhundert/Radonis/HeadManager')
    this.#manifestManager = application.container.resolveBinding('Microeinhundert/Radonis/ManifestManager')

    this.#adonisContext = null as any
  }

  /**
   * Get for request
   */
  getForRequest(httpContext: HttpContextContract): this {
    this.#assetsManager.reset()
    this.#headManager.reset()
    this.#manifestManager.reset()
    this.#router.commit()
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
   * Render the view and return the full HTML document
   */
  async render<T extends PropsWithoutRef<any>>(
    Component: ComponentType<T>,
    props?: ComponentPropsWithoutRef<ComponentType<T>>,
    options?: RenderOptions
  ): Promise<string | UnwrapProps<T> | undefined> {
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
        /**
         * Render the view
         */
        const tree = await this.#pluginsManager.execute(
          'beforeRender',
          wrapTree(
            this.#hydrationManager,
            this.#assetsManager,
            this.#headManager,
            this.#manifestManager,
            this.#adonisContext,
            Component,
            props
          ),
          null
        )

        let html = renderToString(h(StrictMode, null, tree))

        /**
         * Inject closing head
         */
        html = this.#injectClosingHead(html)

        /**
         * Inject closing body
         */
        html = this.#injectClosingBody(html)

        /**
         * Execute `afterRender` hooks
         */
        html = await this.#pluginsManager.execute('afterRender', html, null)

        return `<!DOCTYPE html>\n${html}`
      } catch (error) {
        this.#logger.error(error)
        throw ServerException.cannotRenderView()
      }
    }

    /**
     * If the request was made by Radonis,
     * serialize the response with superjson
     */
    if (request.header('X-Radonis-Request')) {
      return serialize(props) as UnwrapProps<T>
    }

    return props as UnwrapProps<T>
  }

  /**
   * Inject closing head
   */
  #injectClosingHead(html: string): string {
    const injectionTarget = '</head>'

    return html.replace(injectionTarget, [this.#headManager.getHTML(), injectionTarget].join('\n'))
  }

  /**
   * Inject closing body
   */
  #injectClosingBody(html: string): string {
    const injectionTarget = '</body>'

    const scriptTags = this.#assetsManager.requiredAssets.map((asset) => {
      this.#hydrationManager.requireAsset(asset)

      return `<script ${stringifyAttributes({
        type: 'module',
        defer: true,
        src: asset.path,
      })}></script>`
    })

    return html.replace(
      injectionTarget,
      [
        `<script id="rad-manifest">window.radonisManifest = ${this.#manifestManager.getClientManifestAsJSON()}</script>`,
        ...scriptTags,
        injectionTarget,
      ].join('\n')
    )
  }

  /**
   * Extract the user locale from the http context
   */
  #extractUserLocale({ request }: HttpContextContract): Locale {
    const supportedLocales = this.#i18nManager.supportedLocales()

    return request.language(supportedLocales) || request.input('lang') || this.#i18nManager.defaultLocale
  }
}
