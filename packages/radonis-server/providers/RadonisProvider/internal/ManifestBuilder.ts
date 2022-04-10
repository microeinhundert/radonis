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
    private routesManager: Radonis.RoutesManagerContract,
    private i18nManager: Radonis.I18nManagerContract
  ) {}

  /**
   * The routes
   */
  public get routes(): Radonis.Manifest['routes'] {
    return this.routesManager.getRoutes(true);
  }

  /**
   * The routes required for hydration
   */
  public get routesRequiredForHydration(): Radonis.Manifest['routes'] {
    return this.routesManager.getRoutes();
  }

  /**
   * The locale
   */
  public get locale(): Radonis.Manifest['locale'] {
    return this.i18nManager.getLocale();
  }

  /**
   * The messages
   */
  public get messages(): Radonis.Manifest['messages'] {
    return this.i18nManager.getMessages(true);
  }

  /**
   * The messages required for hydration
   */
  public get messagesRequiredForHydration(): Radonis.Manifest['messages'] {
    return this.i18nManager.getMessages();
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
      messages: this.messages,
    };
  }

  /**
   * The client manifest
   */
  public get clientManifest(): Radonis.Manifest {
    return {
      props: this.props,
      route: this.route,
      routes: this.routesRequiredForHydration,
      locale: this.locale,
      messages: this.messagesRequiredForHydration,
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
    globalThis.rad_serverManifest = this.serverManifest;
  }

  /**
   * Register component props with the ManifestBuilder
   */
  public registerComponentProps(Component: ReactElement<Record<string, unknown>>): string | null {
    const propsKeys = Object.keys(Component.props);

    /**
     * Don't register props if the component has none
     */
    if (!propsKeys.length) return null;

    const propsHash = this.propsHasher.hash(Component.props).slice(0, 20);

    if (!this.props.has(propsHash)) {
      this.props.set(propsHash, Component.props);
    }

    return propsHash;
  }

  /**
   * Set the routes on the RoutesManager
   */
  public setRoutes(routes: Radonis.Manifest['routes']): void {
    this.routesManager.setRoutes(routes);
  }

  /**
   * Set the current route on the ManifestBuilder
   */
  public setRoute(route: Radonis.Manifest['route']): void {
    this.route = route;
  }

  /**
   * Set the locale on the I18nManager
   */
  public setLocale(locale: Radonis.Manifest['locale']): void {
    this.i18nManager.setLocale(locale);
  }

  /**
   * Set the messages on the I18nManager
   */
  public setMessages(messages: Radonis.Manifest['messages']): void {
    this.i18nManager.setMessages(messages);
  }

  /**
   * Construct a new ManifestBuilder
   */
  public static construct(): ManifestBuilder {
    return new ManifestBuilder(RoutesManager.construct(), I18nManager.construct());
  }
}
