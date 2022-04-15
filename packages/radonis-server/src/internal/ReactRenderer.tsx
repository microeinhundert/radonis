/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig, RadonisContextContract } from '@ioc:Adonis/Addons/Radonis'
// @ts-ignore No idea why this import fails in GitHub Actions
import { twindConfig } from '@microeinhundert/radonis'
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

export class ReactRenderer {
  /**
   * The shared context
   */
  private context: RadonisContextContract = null as any

  /**
   * Constructor
   */
  constructor(private compiler: Compiler, private manifestBuilder: ManifestBuilder, private config: RadonisConfig) {
    this.installTwind()
  }

  /**
   * Install Twind
   */
  private installTwind(): void {
    install(twindConfig, this.config.productionMode)
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
   * Share context with the ReactRenderer
   */
  public shareContext(context: RadonisContextContract): this {
    this.context = context

    return this
  }

  /**
   * Share translations with the ReactRenderer
   */
  public shareTranslations(locale: string, messages: Record<string, string>): this {
    this.manifestBuilder.setLocale(locale)
    this.manifestBuilder.setMessages(messages)

    return this
  }

  /**
   * Render the view and return the HTML document
   */
  public render<T>(Component: ComponentType<T>, props?: ComponentPropsWithoutRef<ComponentType<T>>): string {
    /**
     * Set the server manifest on the global scope
     */
    this.manifestBuilder.setServerManifestOnGlobalScope()

    let html = ''

    /**
     * Render the view
     */
    html = renderToString(
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
    )

    /**
     * Inject styles and scripts
     */
    html = this.injectStyles(html)
    html = this.injectScripts(html)

    return `<!DOCTYPE html>\n${html}`
  }
}
