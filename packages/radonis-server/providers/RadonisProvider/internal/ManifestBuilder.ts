import hasher from 'node-object-hash';
import type { ReactElement } from 'react';

import { I18nManager } from './I18nManager';
import { RoutesManager } from './RoutesManager';

/**
 * Replacer for stringifying Maps
 */
const replacer = (_, value: any): any => {
  if (value instanceof Map) {
    return Object.fromEntries(value);
  } else {
    return value;
  }
};

export class ManifestBuilder implements Radonis.Manifest {
  /**
   * The hasher used to hash component props
   */
  private propsHasher = hasher({ sort: true, coerce: false, alg: 'md5' });

  /**
   * The props registered with the manifest
   */
  public props: Radonis.Manifest['props'] = new Map();

  /**
   * The current route registered with the manifest
   */
  public route: Radonis.Manifest['route'] = null;

  /**
   * Constructor
   */
  constructor(
    protected routesManager: Radonis.RoutesManagerContract,
    protected i18nManager: Radonis.I18nManagerContract
  ) {}

  /**
   * The routes
   */
  public get routes(): Radonis.Manifest['routes'] {
    return this.routesManager.getRoutes(true);
  }

  /**
   * The referenced routes
   */
  public get referencedRoutes(): Radonis.Manifest['routes'] {
    return this.routesManager.getRoutes();
  }

  /**
   * The locale
   */
  public get locale(): Radonis.Manifest['locale'] {
    return this.i18nManager.getLocale();
  }

  /**
   * The translations
   */
  public get translations(): Radonis.Manifest['translations'] {
    return this.i18nManager.getTranslations(true);
  }

  /**
   * The referenced translations
   */
  public get referencedTranslations(): Radonis.Manifest['translations'] {
    return this.i18nManager.getTranslations();
  }

  /**
   * The server manifest
   */
  public get serverManifest(): Radonis.Manifest {
    return {
      props: this.props,
      route: this.route,
      routes: this.routes,
      locale: this.locale,
      translations: this.translations,
    };
  }

  /**
   * The client manifest
   */
  public get clientManifest(): Radonis.Manifest {
    return {
      props: this.props,
      route: this.route,
      routes: this.referencedRoutes,
      locale: this.locale,
      translations: this.referencedTranslations,
    };
  }

  /**
   * Get the client manifest as JSON
   */
  public getClientManifestAsJSON(): string {
    return JSON.stringify(this.clientManifest, replacer);
  }

  /**
   * Set the server manifest on the global scope
   */
  public setServerManifestOnGlobalScope(): void {
    globalThis.ars_manifest = this.serverManifest;
  }

  /**
   * Register component props with the manifest
   */
  public registerComponentProps(Component: ReactElement<Record<string, unknown>>): string | null {
    const propsKeys = Object.keys(Component.props);

    /**
     * Don't register props if the component has none
     */
    if (!propsKeys.length) return null;

    const propsHash = this.propsHasher.hash(Component.props).slice(10, 20);

    if (!this.props.has(propsHash)) {
      this.props.set(propsHash, Component.props);
    }

    return propsHash;
  }

  /**
   * Set the routes on the manifest
   */
  public setRoutes(routes: Radonis.Manifest['routes']): void {
    this.routesManager.setRoutes(routes);
  }

  /**
   * Set the current route on the manifest
   */
  public setRoute(route: Radonis.Manifest['route']): void {
    this.route = route;
  }

  /**
   * Set the locale on the manifest
   */
  public setLocale(locale: Radonis.Manifest['locale']): void {
    this.i18nManager.setLocale(locale);
  }

  /**
   * Set the translations on the manifest
   */
  public setTranslations(translations: Radonis.Manifest['translations']): void {
    this.i18nManager.setTranslations(translations);
  }

  /**
   * Construct a new ManifestBuilder
   */
  public static construct(): ManifestBuilder {
    return new ManifestBuilder(RoutesManager.construct(), I18nManager.construct());
  }
}
