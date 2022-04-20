/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import { FlashMessagesManager, I18nManager, RoutesManager } from '@microeinhundert/radonis-manifest'
import hasher from 'node-object-hash'
import type { ReactElement } from 'react'

export class ManifestBuilder implements Radonis.Manifest {
  /**
   * The FlashMessagesManager instance
   */
  private flashMessagesManager: FlashMessagesManager

  /**
   * The I18nManager instance
   */
  private i18nManager: I18nManager

  /**
   * The RoutesManager instance
   */
  private routesManager: RoutesManager

  /**
   * The hasher used to hash component props
   */
  private propsHasher = hasher({ sort: true, coerce: false, alg: 'md5' })

  /**
   * The props registered with the manifest
   */
  public props: Radonis.Manifest['props'] = {}

  /**
   * The current route registered with the manifest
   */
  public route: Radonis.Manifest['route'] = null

  /**
   * Constructor
   */
  constructor(private config: RadonisConfig) {
    this.routesManager = new RoutesManager()
    this.flashMessagesManager = new FlashMessagesManager()
    this.i18nManager = new I18nManager()
  }

  /**
   * The routes
   */
  public get routes(): Radonis.Manifest['routes'] {
    return this.routesManager.getRoutes(true)
  }

  /**
   * The routes required for hydration
   */
  public get routesRequiredForHydration(): Radonis.Manifest['routes'] {
    return this.routesManager.getRoutes()
  }

  /**
   * The locale
   */
  public get locale(): Radonis.Manifest['locale'] {
    return this.i18nManager.getLocale()
  }

  /**
   * The messages
   */
  public get messages(): Radonis.Manifest['messages'] {
    return this.i18nManager.getMessages(true)
  }

  /**
   * The messages required for hydration
   */
  public get messagesRequiredForHydration(): Radonis.Manifest['messages'] {
    return this.i18nManager.getMessages()
  }

  /**
   * The flash messages
   */
  public get flashMessages(): Radonis.Manifest['flashMessages'] {
    return this.flashMessagesManager.getFlashMessages(true)
  }

  /**
   * The flash messages required for hydration
   */
  public get flashMessagesRequiredForHydration(): Radonis.Manifest['flashMessages'] {
    return this.flashMessagesManager.getFlashMessages()
  }

  /**
   * The server manifest
   */
  private get serverManifest(): Radonis.Manifest {
    return {
      props: this.props,
      route: this.route,
      routes: this.routes,
      locale: this.locale,
      messages: this.messages,
      flashMessages: this.flashMessages,
    }
  }

  /**
   * The client manifest
   */
  private get clientManifest(): Radonis.Manifest {
    return {
      props: this.props,
      route: this.route,
      routes: this.config.limitClientManifest ? this.routesRequiredForHydration : this.routes,
      locale: this.locale,
      messages: this.config.limitClientManifest ? this.messagesRequiredForHydration : this.messages,
      flashMessages: this.config.limitClientManifest ? this.flashMessagesRequiredForHydration : this.flashMessages,
    }
  }

  /**
   * Get the client manifest as JSON
   */
  public getClientManifestAsJSON(): string {
    return JSON.stringify(this.clientManifest)
  }

  /**
   * Set the server manifest on the global scope
   */
  public setServerManifestOnGlobalScope(): void {
    globalThis.manifest = this.serverManifest
  }

  /**
   * Register component props with the ManifestBuilder
   */
  public registerComponent(component: ReactElement<Record<string, unknown>>): string | null {
    const propsKeys = Object.keys(component.props)

    /**
     * Don't register props if the component has none
     */
    if (!propsKeys.length) return null

    const propsHash = this.propsHasher.hash(component.props).slice(0, 20)

    if (!this.props[propsHash]) {
      this.props[propsHash] = component.props
    }

    return propsHash
  }

  /**
   * Set the routes on the RoutesManager
   */
  public setRoutes(routes: Radonis.Manifest['routes']): void {
    this.routesManager.setRoutes(routes)
  }

  /**
   * Set the current route on the ManifestBuilder
   */
  public setRoute(route: Radonis.Manifest['route']): void {
    this.route = route
  }

  /**
   * Set the locale on the I18nManager
   */
  public setLocale(locale: Radonis.Manifest['locale']): void {
    this.i18nManager.setLocale(locale)
  }

  /**
   * Set the messages on the I18nManager
   */
  public setMessages(messages: Radonis.Manifest['messages']): void {
    this.i18nManager.setMessages(messages)
  }

  /**
   * Set the flash messages on the FlashMessagesManager
   */
  public setFlashMessages(flashMessages: Radonis.Manifest['flashMessages']): void {
    this.flashMessagesManager.setFlashMessages(flashMessages)
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.props = {}
    this.route = null

    this.flashMessagesManager.prepareForNewRequest()
    this.i18nManager.prepareForNewRequest()
    this.routesManager.prepareForNewRequest()
  }
}
