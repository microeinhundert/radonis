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
import type { Globals, HeadMeta, HeadTag, Locale, RenderOptions, UnwrapProps } from '@microeinhundert/radonis-types'
import { flattie } from 'flattie'
import type { ComponentPropsWithoutRef, ComponentType, PropsWithoutRef } from 'react'
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { serialize } from 'superjson'

import type { AssetsManager } from '../AssetsManager'
import type { HeadManager } from '../HeadManager'
import { wrapTree } from '../React'
import { transformRoute } from './utils'

/**
 * @internal
 */
export class Renderer {
  /**
   * The PluginsManager instance
   */
  private pluginsManager: PluginsManager = PluginsManager.getInstance()

  /**
   * The HydrationManager instance
   */
  private hydrationManager: HydrationManager = HydrationManager.getInstance()

  /**
   * The context
   */
  private context: AdonisContextContract = null as any

  /**
   * Constructor
   */
  constructor(
    private i18n: I18nManagerContract,
    private assetsManager: AssetsManager,
    private headManager: HeadManager,
    private manifestBuilder: ManifestBuilder
  ) {}

  /**
   * Inject closing head
   */
  private injectClosingHead(html: string): string {
    const target = '</head>'

    return html.replace(target, [this.headManager.getHTML(), target].join('\n'))
  }

  /**
   * Inject closing body
   */
  private injectClosingBody(html: string): string {
    const target = '</body>'

    const scriptTags = this.assetsManager.components.requiredForHydration.map((asset) => {
      this.hydrationManager.requireAssetForHydration(asset)

      const attributes = {
        type: 'module',
        defer: true,
        src: asset.path,
      }

      return `<script ${stringifyAttributes(attributes)}></script>`
    })

    return html.replace(
      target,
      [
        `<script id="rad-manifest">window.radonisManifest = ${this.manifestBuilder.getClientManifestAsJSON()}</script>`,
        ...scriptTags,
        target,
      ].join('\n')
    )
  }

  /**
   * Extract the user locale from the http context
   */
  private extractUserLocale({ request }: HttpContextContract): Locale {
    const supportedLocales = this.i18n.supportedLocales()

    return request.language(supportedLocales) || request.input('lang') || this.i18n.defaultLocale
  }

  /**
   * Get the Renderer for a request
   */
  public getRendererForRequest(
    httpContext: HttpContextContract,
    application: ApplicationContract,
    router: RouterContract
  ): this {
    router.commit()

    /**
     * Set context
     */
    this.context = {
      application,
      httpContext,
      router,
    }

    const locale = this.extractUserLocale(httpContext)

    /**
     * Set manifest
     */
    this.manifestBuilder
      .setFlashMessages(flattie(httpContext.session.flashMessages.all()))
      .setLocale(locale)
      .setMessages(this.i18n.getTranslationsFor(locale))
      .setRoute(transformRoute(httpContext.route))

    return this
  }

  /**
   * Set title for the current request
   */
  public withTitle(title: string): this {
    this.headManager.setTitle(title)

    return this
  }

  /**
   * Add head meta for the current request
   */
  public withHeadMeta(meta: HeadMeta): this {
    this.headManager.addMeta(meta)

    return this
  }

  /**
   * Add head tags for the current request
   */
  public withHeadTags(tags: HeadTag[]): this {
    this.headManager.addTags(tags)

    return this
  }

  /**
   * Add globals for the current request
   */
  public withGlobals(globals: Globals): this {
    this.manifestBuilder.addGlobals(globals)

    return this
  }

  /**
   * Render the view and return the full HTML document
   */
  public async render<T extends PropsWithoutRef<any>>(
    Component: ComponentType<T>,
    props?: ComponentPropsWithoutRef<ComponentType<T>>,
    options?: RenderOptions
  ): Promise<string | UnwrapProps<T> | undefined> {
    const request = this.context.httpContext.request

    /**
     * If the request accepts HTML,
     * return the rendered view
     */
    if (request.accepts(['html'])) {
      /**
       * Re-read the build manifest on every
       * render when not in production
       */
      if (!this.context.application.inProduction) {
        await this.assetsManager.readBuildManifest()
      }

      /**
       * Set the title on the HeadManager
       */
      if (options?.title) {
        this.headManager.setTitle(options.title)
      }

      /**
       * Add meta to the HeadManager
       */
      if (options?.meta) {
        this.headManager.addMeta(options.meta)
      }

      /**
       * Add tags to the HeadManager
       */
      if (options?.tags) {
        this.headManager.addTags(options.tags)
      }

      /**
       * Add globals to the ManifestBuilder
       */
      if (options?.globals) {
        this.manifestBuilder.addGlobals(options.globals)
      }

      /**
       * Set the server manifest on the global scope
       */
      this.manifestBuilder.setServerManifestOnGlobalScope()

      /**
       * Render the view
       */
      const tree = await this.pluginsManager.execute(
        'beforeRender',
        wrapTree(this.assetsManager, this.headManager, this.manifestBuilder, this.context, Component, props),
        null
      )
      let html = renderToString(<StrictMode>{tree}</StrictMode>)

      /**
       * Inject closing head
       */
      html = this.injectClosingHead(html)

      /**
       * Inject closing body
       */
      html = this.injectClosingBody(html)

      /**
       * Execute `afterRender` hooks
       */
      html = await this.pluginsManager.execute('afterRender', html, null)

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
