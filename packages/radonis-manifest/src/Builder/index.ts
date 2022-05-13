/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant, isProduction } from '@microeinhundert/radonis-shared'
import hasher from 'node-object-hash'

import { FlashMessagesManager } from '../FlashMessagesManager'
import { I18nManager } from '../I18nManager'
import { RoutesManager } from '../RoutesManager'

export class Builder implements Radonis.Manifest {
  /**
   * The FlashMessagesManager instance
   */
  private flashMessagesManager: FlashMessagesManager = new FlashMessagesManager()

  /**
   * The I18nManager instance
   */
  private i18nManager: I18nManager = new I18nManager()

  /**
   * The RoutesManager instance
   */
  private routesManager: RoutesManager = new RoutesManager()

  /**
   * The hasher used to hash component props
   */
  private propsHasher = hasher({ sort: true, coerce: false, alg: 'md5' })

  /**
   * The props registered with the Builder
   */
  public props: Radonis.Manifest['props'] = {}

  /**
   * The globals added to the Builder
   */
  public globals: Radonis.Manifest['globals'] = {}

  /**
   * The current route set on the Builder
   */
  public route: Radonis.Manifest['route'] = null

  /**
   * Constructor
   */
  constructor(private limitClientManifest: boolean) {}

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
   * The server manifest
   */
  private get serverManifest(): Radonis.Manifest {
    return {
      props: this.props,
      globals: this.globals,
      flashMessages: this.flashMessages,
      locale: this.locale,
      messages: this.messages,
      routes: this.routes,
      route: this.route,
    }
  }

  /**
   * The client manifest
   */
  private get clientManifest(): Radonis.Manifest {
    return {
      props: this.props,
      globals: this.globals,
      flashMessages: this.limitClientManifest ? this.flashMessagesRequiredForHydration : this.flashMessages,
      locale: this.locale,
      messages: this.limitClientManifest ? this.messagesRequiredForHydration : this.messages,
      routes: this.limitClientManifest ? this.routesRequiredForHydration : this.routes,
      route: this.route,
    }
  }

  /**
   * Get the client manifest as JSON
   */
  public getClientManifestAsJSON(): string {
    try {
      return JSON.stringify(this.clientManifest, null, isProduction ? 0 : 2)
    } catch {
      invariant(false, `The manifest is not serializable`)
    }
  }

  /**
   * Set the server manifest on the global scope
   */
  public setServerManifestOnGlobalScope(): this {
    globalThis.radonisManifest = this.serverManifest

    return this
  }

  /**
   * Register props with the Builder
   */
  public registerProps(componentName: string, rawProps: Record<string, any>): string | null {
    try {
      const props = JSON.parse(JSON.stringify(rawProps))
      const propsKeys = Object.keys(props)

      if (!propsKeys.length) return null

      const propsHash = this.propsHasher.hash(props)

      if (!(propsHash in this.props)) {
        this.props[propsHash] = props
      }

      return propsHash
    } catch {
      invariant(false, `The props passed to the component "${componentName}" are not serializable`)
    }
  }

  /**
   * Add globals to the Builder
   */
  public addGlobals(globals: Radonis.Manifest['globals']): this {
    this.globals = { ...this.globals, ...globals }

    return this
  }

  /**
   * Set the flash messages on the FlashMessagesManager
   */
  public setFlashMessages(flashMessages: Radonis.Manifest['flashMessages']): this {
    this.flashMessagesManager.setFlashMessages(flashMessages)

    return this
  }

  /**
   * Set the locale on the I18nManager
   */
  public setLocale(locale: Radonis.Manifest['locale']): this {
    this.i18nManager.setLocale(locale)

    return this
  }

  /**
   * Set the messages on the I18nManager
   */
  public setMessages(messages: Radonis.Manifest['messages']): this {
    this.i18nManager.setMessages(messages)

    return this
  }

  /**
   * Set the routes on the RoutesManager
   */
  public setRoutes(routes: Radonis.Manifest['routes']): this {
    this.routesManager.setRoutes(routes)

    return this
  }

  /**
   * Set the current route on the Builder
   */
  public setRoute(route: Radonis.Manifest['route']): this {
    this.route = route

    return this
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.props = {}
    this.globals = {}
    this.route = null

    this.flashMessagesManager.prepareForNewRequest()
    this.i18nManager.prepareForNewRequest()
    this.routesManager.prepareForNewRequest()
  }
}
