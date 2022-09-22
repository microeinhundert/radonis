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
import type { RouterContract } from '@ioc:Adonis/Core/Route'
import type { AdonisContextContract } from '@ioc:Microeinhundert/Radonis'
import { HydrationManager } from '@microeinhundert/radonis-hydrate'
import type { Builder as ManifestBuilder } from '@microeinhundert/radonis-manifest'
import { PluginsManager, stringifyAttributes } from '@microeinhundert/radonis-shared'
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
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { serialize } from 'superjson'

import type { AssetsManager } from '../assetsManager'
import type { HeadManager } from '../headManager'
import { wrapTree } from '../react'
import { transformRouteNode } from './utils/transformRouteNode'

/**
 * @internal
 */
export class Renderer implements RendererContract {
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
   * The ManifestBuilder instance
   */
  #manifestBuilder: ManifestBuilder

  /**
   * The Adonis context
   */
  #adonisContext: AdonisContextContract

  /**
   * Constructor
   */
  constructor(assetsManager: AssetsManager, headManager: HeadManager, manifestBuilder: ManifestBuilder) {
    this.#pluginsManager = PluginsManager.getSingletonInstance()
    this.#hydrationManager = HydrationManager.getSingletonInstance()
    this.#assetsManager = assetsManager
    this.#headManager = headManager
    this.#manifestBuilder = manifestBuilder
    this.#adonisContext = null as any
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

    const scriptTags = this.#assetsManager.components.requiredForHydration.map((asset) => {
      this.#hydrationManager.requireAssetForHydration(asset)

      return `<script ${stringifyAttributes({
        type: 'module',
        defer: true,
        src: asset.path,
      })}></script>`
    })

    return html.replace(
      injectionTarget,
      [
        `<script id="rad-manifest">window.radonisManifest = ${this.#manifestBuilder.getClientManifestAsJSON()}</script>`,
        ...scriptTags,
        injectionTarget,
      ].join('\n')
    )
  }

  /**
   * Extract the user locale from the http context
   */
  #extractUserLocale({ request }: HttpContextContract, i18nManager: I18nManagerContract): Locale {
    const supportedLocales = i18nManager.supportedLocales()

    return request.language(supportedLocales) || request.input('lang') || i18nManager.defaultLocale
  }

  /**
   * Get for request
   */
  getForRequest(
    httpContext: HttpContextContract,
    application: ApplicationContract,
    router: RouterContract,
    i18nManager: I18nManagerContract
  ): this {
    router.commit()

    /**
     * Set Adonis context
     */
    this.#adonisContext = {
      application,
      httpContext,
      router,
    }

    const locale = this.#extractUserLocale(httpContext, i18nManager)

    /**
     * Set manifest
     */
    this.#manifestBuilder
      .setFlashMessages(flattie(httpContext.session.flashMessages.all()))
      .setLocale(locale)
      .setMessages(i18nManager.getTranslationsFor(locale))
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
    this.#manifestBuilder.addGlobals(globals)

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
    const request = this.#adonisContext.httpContext.request

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
       * Add globals to the ManifestBuilder
       */
      if (options?.globals) {
        this.#manifestBuilder.addGlobals(options.globals)
      }

      /**
       * Set the server manifest on the global scope
       */
      this.#manifestBuilder.setServerManifestOnGlobalScope()

      /**
       * Render the view
       */
      const tree = await this.#pluginsManager.execute(
        'beforeRender',
        wrapTree(this.#assetsManager, this.#headManager, this.#manifestBuilder, this.#adonisContext, Component, props),
        null
      )
      let html = renderToString(<StrictMode>{tree}</StrictMode>)

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
}
