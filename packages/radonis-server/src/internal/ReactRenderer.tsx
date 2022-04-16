/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { I18nManagerContract } from '@ioc:Adonis/Addons/I18n'
import type { RadonisConfig, RadonisContextContract } from '@ioc:Adonis/Addons/Radonis'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { RouterContract } from '@ioc:Adonis/Core/Route'
// @ts-ignore No idea why this import fails in GitHub Actions
import { twindConfig, TwindContextProvider } from '@microeinhundert/radonis'
import type { ComponentPropsWithoutRef, ComponentType } from 'react'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { extract, install } from 'twind'

import type { Compiler } from './Compiler'
import { Document } from './components/Document'
import { CompilerContextProvider } from './contexts/compilerContext'
import { ManifestBuilderContextProvider } from './contexts/manifestBuilderContext'
import { RadonisContextProvider } from './contexts/radonisContext'
import type { ManifestBuilder } from './ManifestBuilder'
import { extractRootRoutes, transformRoute } from './utils/routing'

export class ReactRenderer {
  /**
   * The shared context
   */
  private context: RadonisContextContract = null as any

  /**
   * Constructor
   */
  constructor(
    private i18n: I18nManagerContract,
    private compiler: Compiler,
    private manifestBuilder: ManifestBuilder,
    config: RadonisConfig
  ) {
    install(twindConfig, config.productionMode)
  }

  /**
   * Inject styles
   */
  private injectStyles(html: string): string {
    const { html: twindProcessedHtml, css } = extract(html)

    return twindProcessedHtml.replace(
      '<div id="rad-styles"></div>',
      `<style data-twind>${css}</style>
      ${this.compiler
        .getComponentStyles()
        .map((style) => `<link rel="stylesheet" src="${style}"></link>`)
        .join('')}`
    )
  }

  /**
   * Inject scripts
   */
  private injectScripts(html: string): string {
    return html.replace(
      '<div id="rad-scripts"></div>',
      `<script>window.rad_clientManifest = ${this.manifestBuilder.getClientManifestAsJSON()}</script>
      ${this.compiler
        .getComponentScripts()
        .map((script) => `<script type="module" defer src="${script}"></script>`)
        .join('')}`
    )
  }

  /**
   * Get the user language from the http context
   */
  private getUserLanguage({ request }: HttpContextContract): string {
    const supportedLocales = this.i18n.supportedLocales()
    return request.language(supportedLocales) || request.input('lang') || this.i18n.defaultLocale
  }

  /**
   * Share context with the ReactRenderer
   */
  public shareContext(context: RadonisContextContract): void {
    this.context = context
    this.manifestBuilder.setServerManifestOnGlobalScope()
  }

  /**
   * Share available routes with the ManifestBuilder
   */
  public shareRoutes(router: RouterContract): void {
    this.manifestBuilder.setRoutes(extractRootRoutes(router))
    this.manifestBuilder.setServerManifestOnGlobalScope()
  }

  /**
   * Share the current route with the ManifestBuilder
   */
  public shareRoute(route: HttpContextContract['route']): void {
    this.manifestBuilder.setRoute(transformRoute(route))
    this.manifestBuilder.setServerManifestOnGlobalScope()
  }

  /**
   * Share translations with the ManifestBuilder
   */
  public shareTranslations(locale: string, messages: Record<string, string>): void {
    this.manifestBuilder.setLocale(locale)
    this.manifestBuilder.setMessages(messages)
    this.manifestBuilder.setServerManifestOnGlobalScope()
  }

  /**
   * Share flash messages with the ManifestBuilder
   */
  public shareFlashMessages(flashMessages: Record<string, unknown>): void {
    this.manifestBuilder.setFlashMessages(flashMessages)
    this.manifestBuilder.setServerManifestOnGlobalScope()
  }

  /**
   * Get the ReactRenderer for a request
   */
  public getRendererForRequest(
    httpContext: HttpContextContract,
    application: ApplicationContract,
    router: RouterContract
  ): this {
    /**
     * Share context
     */
    this.shareContext({
      application,
      httpContext,
      router,
    })

    /**
     * Share routes
     */
    this.shareRoutes(router)

    /**
     * Share route
     */
    this.shareRoute(httpContext.route)

    /**
     * Share translations
     */
    const language = this.getUserLanguage(httpContext)
    this.shareTranslations(language, this.i18n.getTranslationsFor(language))

    /**
     * Check if @adonisjs/session is installed
     */
    if ('session' in httpContext) {
      /**
       * Share flash messages
       */
      this.shareFlashMessages(httpContext.session.flashMessages.all())
    }

    return this
  }

  /**
   * Render the view and return the HTML document
   */
  public render<T>(Component: ComponentType<T>, props?: ComponentPropsWithoutRef<ComponentType<T>>): string {
    let html = ''

    /**
     * Render the view
     */
    html = renderToString(
      <ManifestBuilderContextProvider value={this.manifestBuilder}>
        <CompilerContextProvider value={this.compiler}>
          <RadonisContextProvider value={this.context}>
            <TwindContextProvider>
              <Document>
                {/* @ts-expect-error Unsure why this errors */}
                <Component {...(props ?? {})} />
              </Document>
            </TwindContextProvider>
          </RadonisContextProvider>
        </CompilerContextProvider>
      </ManifestBuilderContextProvider>
    )

    /**
     * Inject styles and scripts
     */
    html = this.injectStyles(html)
    html = this.injectScripts(html)

    return `<!DOCTYPE html>\n${html}`
  }
}
