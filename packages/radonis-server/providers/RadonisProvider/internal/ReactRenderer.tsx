import type { AdonisContextContract } from '@ioc:Radonis';
import type { ComponentPropsWithoutRef, ComponentType } from 'react';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { Document } from './components/Document';
import { AdonisContextProvider } from './contexts/adonisContext';
import { ManifestBuilderContextProvider } from './contexts/manifestBuilderContext';
import type { ManifestBuilder } from './ManifestBuilder';

export class ReactRenderer {
  /**
   * The shared context
   */
  private context: AdonisContextContract = null as any;

  /**
   * Constructor
   */
  constructor(
    private manifestBuilder: ManifestBuilder,
    private jsFiles: string[],
    private cssFiles: string[]
  ) {}

  /**
   * Share context with the ReactRenderer
   */
  public shareContext(context: AdonisContextContract): void {
    this.context = context;
  }

  /**
   * Share translations with the ReactRenderer
   */
  public shareTranslations(locale: string, translations: Record<string, string>): void {
    this.manifestBuilder.setLocale(locale);
    this.manifestBuilder.setTranslations(translations);
  }

  /**
   * Render a React component and return the rendered HTML document as string
   */
  public render<T>(
    Component: ComponentType<T>,
    props?: ComponentPropsWithoutRef<ComponentType<T>>
  ): string {
    /**
     * Set the server manifest on the global scope
     * before rendering the view
     */
    this.manifestBuilder.setServerManifestOnGlobalScope();

    const html = renderToString(
      <ManifestBuilderContextProvider value={this.manifestBuilder}>
        <AdonisContextProvider value={this.context}>
          <Document assets={{ jsFiles: this.jsFiles, cssFiles: this.cssFiles }}>
            {/* @ts-expect-error Unsure why this errors */}
            <Component {...(props ?? {})} />
          </Document>
        </AdonisContextProvider>
      </ManifestBuilderContextProvider>
    );

    /**
     * Set the server manifest on the global scope
     * after rendering the view
     */
    this.manifestBuilder.setServerManifestOnGlobalScope();

    return `<!DOCTYPE html>\n${html.replace(
      '<div id="rad-manifest"></div>',
      `<script>window.rad_clientManifest = ${this.manifestBuilder.getClientManifestAsJSON()}</script>`
    )}`;
  }

  /**
   * Construct a new ReactRenderer
   */
  public static construct(
    manifestBuilder: ManifestBuilder,
    jsFiles: string[],
    cssFiles: string[]
  ): ReactRenderer {
    return new ReactRenderer(manifestBuilder, jsFiles, cssFiles);
  }
}
