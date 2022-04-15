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
import { inline, install } from 'twind'

import { Document } from './components/Document'
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
  constructor(
    private manifestBuilder: ManifestBuilder,
    private scripts: string[],
    private stylesheets: string[],
    private config: RadonisConfig
  ) {
    this.installTwind()
  }

  /**
   * Install twind
   */
  private installTwind(): void {
    install(twindConfig, this.config.productionMode)
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
   * Render a React component and return the rendered HTML document as string
   */
  public render<T>(Component: ComponentType<T>, props?: ComponentPropsWithoutRef<ComponentType<T>>): string {
    /**
     * Set the server manifest on the global scope
     * before rendering the view
     */
    this.manifestBuilder.setServerManifestOnGlobalScope()

    const html = renderToString(
      <ManifestBuilderContextProvider value={this.manifestBuilder}>
        <RadonisContextProvider value={this.context}>
          <Document assets={{ scripts: this.scripts, stylesheets: this.stylesheets }}>
            {/* @ts-expect-error Unsure why this errors */}
            <Component {...(props ?? {})} />
          </Document>
        </RadonisContextProvider>
      </ManifestBuilderContextProvider>
    )

    /**
     * Set the server manifest on the global scope
     * after rendering the view
     */
    this.manifestBuilder.setServerManifestOnGlobalScope()

    return `<!DOCTYPE html>\n${inline(html).replace(
      '<div id="rad-manifest"></div>',
      `<script>window.rad_clientManifest = ${this.manifestBuilder.getClientManifestAsJSON()}</script>`
    )}`
  }
}
