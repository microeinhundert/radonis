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
import type { Builder as ManifestBuilder } from '@microeinhundert/radonis-manifest'
import { extract, install, twindConfig, TwindContextProvider } from '@microeinhundert/radonis-twind'
import { flattie } from 'flattie'
import type { ComponentPropsWithoutRef, ComponentType } from 'react'
import React from 'react'
import { renderToString } from 'react-dom/server'

import type { Compiler } from '../Compiler'
import { CompilerContextProvider, Document, ManifestBuilderContextProvider, RadonisContextProvider } from '../React'
import { extractRootRoutes, transformRoute } from './utils'

export class Renderer {
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
    private manifestBuilder: ManifestBuilder,
    private config: RadonisConfig
  ) {
    this.installTwind()
  }

  /**
   * Install Twind
   */
  private installTwind() {
    install(twindConfig, this.config.productionMode)
  }

  /**
   * Inject styles
   */
  private injectStyles(html: string): string {
    const { html: twindProcessedHtml, css } = extract(html)

    return twindProcessedHtml.replace('<div id="rad-styles"></div>', `<style data-twind>${css}</style>`)
  }

  /**
   * Inject scripts
   */
  private injectScripts(html: string): string {
    return html.replace(
      '<div id="rad-scripts"></div>',
      `<script>window.radonisManifest = ${this.manifestBuilder.getClientManifestAsJSON()}</script>
      ${this.compiler
        .getEntryPoints()
        .map((path) => `<script type="module" defer src="${path}"></script>`)
        .join('\n')}`
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
