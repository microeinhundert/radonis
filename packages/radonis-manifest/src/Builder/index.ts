/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant, isProduction } from '@microeinhundert/radonis-shared'
import type {
  FlashMessages,
  Globals,
  Locale,
  Manifest,
  Messages,
  PropsGroupHash,
  PropsGroups,
  Route,
  Routes,
  ValueOf,
} from '@microeinhundert/radonis-types'
import hasher from 'node-object-hash'

import { FlashMessagesManager } from '../FlashMessagesManager'
import { I18nManager } from '../I18nManager'
import { RoutesManager } from '../RoutesManager'

const PROPS_HASHER = hasher({ sort: true, coerce: false, alg: 'md5' })

export class Builder implements Manifest {
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
   * The props registered with the Builder
   */
  public props: PropsGroups = {}

  /**
   * The globals added to the Builder
   */
  public globals: Globals = {}

  /**
   * The current route set on the Builder
   */
  public route: Route | null = null

  /**
   * Constructor
   */
  constructor(private limitClientManifest: boolean) {}

  /**
   * The flash messages
   */
  public get flashMessages(): FlashMessages {
    return this.flashMessagesManager.getFlashMessages(true)
  }

  /**
   * The flash messages required for hydration
   */
  public get flashMessagesRequiredForHydration(): FlashMessages {
    return this.flashMessagesManager.getFlashMessages()
  }

  /**
   * The locale
   */
  public get locale(): Locale {
    return this.i18nManager.getLocale()
  }

  /**
   * The messages
   */
  public get messages(): Messages {
    return this.i18nManager.getMessages(true)
  }

  /**
   * The messages required for hydration
   */
  public get messagesRequiredForHydration(): Messages {
    return this.i18nManager.getMessages()
  }

  /**
   * The routes
   */
  public get routes(): Routes {
    return this.routesManager.getRoutes(true)
  }

  /**
   * The routes required for hydration
   */
  public get routesRequiredForHydration(): Routes {
    return this.routesManager.getRoutes()
  }

  /**
   * The server manifest
   */
  private get serverManifest(): Manifest {
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
  private get clientManifest(): Manifest {
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
  public setServerManifestOnGlobalScope(): void {
    globalThis.radonisManifest = this.serverManifest
  }

  /**
   * Register props with the Builder
   */
  public registerProps(componentName: string, rawProps: ValueOf<PropsGroups>): PropsGroupHash | null {
    try {
      const props = JSON.parse(JSON.stringify(rawProps))
      const propsKeys = Object.keys(props)

      if (!propsKeys.length) return null

      const propsHash = PROPS_HASHER.hash(props)

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
  public addGlobals(globals: Globals): this {
    this.globals = { ...this.globals, ...globals }

    return this
  }

  /**
   * Set the flash messages on the FlashMessagesManager
   */
  public setFlashMessages(flashMessages: FlashMessages): this {
    this.flashMessagesManager.setFlashMessages(flashMessages)

    return this
  }

  /**
   * Set the locale on the I18nManager
   */
  public setLocale(locale: Locale): this {
    this.i18nManager.setLocale(locale)

    return this
  }

  /**
   * Set the messages on the I18nManager
   */
  public setMessages(messages: Messages): this {
    this.i18nManager.setMessages(messages)

    return this
  }

  /**
   * Set the routes on the RoutesManager
   */
  public setRoutes(routes: Routes): this {
    this.routesManager.setRoutes(routes)

    return this
  }

  /**
   * Set the current route on the Builder
   */
  public setRoute(route: Route): this {
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
