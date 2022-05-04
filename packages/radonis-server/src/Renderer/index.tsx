/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { I18nManagerContract } from '@ioc:Adonis/Addons/I18n'
import type { RadonisContextContract } from '@ioc:Adonis/Addons/Radonis'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { RouterContract } from '@ioc:Adonis/Core/Route'
import { HydrationManager } from '@microeinhundert/radonis-hydrate'
import type { Builder as ManifestBuilder } from '@microeinhundert/radonis-manifest'
import { PluginsManager } from '@microeinhundert/radonis-shared'
import { flattie } from 'flattie'
import type { ComponentPropsWithoutRef, ComponentType } from 'react'
import { StrictMode } from 'react'
import React from 'react'
import { renderToString } from 'react-dom/server'

import type { Compiler } from '../Compiler'
import { CompilerContextProvider, Document, ManifestBuilderContextProvider, RadonisContextProvider } from '../React'
import { extractRootRoutes, transformRoute } from './utils'

export class Renderer {
  /**
   * The PluginsManager instance
   */
  private pluginsManager: PluginsManager = new PluginsManager()

  /**
   * The HydrationManager instance
   */
  private hydrationManager: HydrationManager = new HydrationManager()

  /**
   * The context
   */
  private context: RadonisContextContract = null as any

  /**
   * Constructor
   */
  constructor(
    private i18n: I18nManagerContract,
    private compiler: Compiler,
    private manifestBuilder: ManifestBuilder
  ) {}

  /**
   * Inject scripts
   */
  private injectScripts(html: string): string {
    const scripts = this.compiler
      .getAssetsRequiredForHydration()
      .map((asset) => {
        this.hydrationManager.requireAssetForHydration(asset)
        return `<script type="module" defer src="${asset.path}"></script>`
      })
      .join('\n')

    return html.replace(
      '<div id="rad-scripts"></div>',
      `<script>window.radonisManifest = ${this.manifestBuilder.getClientManifestAsJSON()}</script>\n${scripts}`
    )
  }

  /**
   * Extract the user locale from the http context
   */
  private extractUserLocale({ request }: HttpContextContract): string {
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
      .setRoutes(extractRootRoutes(router))
      .setRoute(transformRoute(httpContext.route))
      .setServerManifestOnGlobalScope()

    return this
  }

  /**
   * Render the view and return the HTML document
   */
  public render<T>(Component: ComponentType<T>, props?: ComponentPropsWithoutRef<ComponentType<T>>): string {
    /**
     * Render the view
     */
    let html = renderToString(
      this.pluginsManager.executeHooks(
        'beforeRender',
        <StrictMode>
          <ManifestBuilderContextProvider value={this.manifestBuilder}>
            <CompilerContextProvider value={this.compiler}>
              <RadonisContextProvider value={this.context}>
                <Document>
                  {/* @ts-expect-error Unsure why this errors */}
                  <Component {...(props ?? {})} />
                </Document>
              </RadonisContextProvider>
            </CompilerContextProvider>
          </ManifestBuilderContextProvider>
        </StrictMode>
      )
    )

    /**
     * Inject scripts
     */
    html = this.injectScripts(html)

    /**
     * Execute `afterRender` hooks
     */
    html = this.pluginsManager.executeHooks('afterRender', html)

    return `<!DOCTYPE html>\n${html}`
  }
}
