/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isProduction } from '@microeinhundert/radonis-shared'
import type {
  FlashMessages,
  Globals,
  Locale,
  Manifest,
  Messages,
  Props,
  PropsHash,
  ResetBetweenRequests,
  Route,
  Routes,
  ValueOf,
} from '@microeinhundert/radonis-types'
import hasher from 'node-object-hash'
import superjson from 'superjson'

import type { FlashMessagesManager } from '../flashMessagesManager'
import type { I18nManager } from '../i18nManager'
import type { RoutesManager } from '../routesManager'

const PROPS_HASHER = hasher({ sort: true, coerce: false, alg: 'md5' })

type BuilderConfig = {
  limitClientManifest: boolean
}

/**
 * @internal
 */
export class Builder implements Manifest, ResetBetweenRequests {
  /**
   * The FlashMessagesManager instance
   */
  #flashMessagesManager: FlashMessagesManager

  /**
   * The I18nManager instance
   */
  #i18nManager: I18nManager

  /**
   * The RoutesManager instance
   */
  #routesManager: RoutesManager

  /**
   * The Builder config
   */
  #config: BuilderConfig

  /**
   * The props registered with the Builder
   */
  props: Props

  /**
   * The globals added to the Builder
   */
  globals: Globals

  /**
   * The current route set on the Builder
   */
  route: Route | null

  /**
   * Constructor
   */
  constructor(
    flashMessagesManager: FlashMessagesManager,
    i18nManager: I18nManager,
    routesManager: RoutesManager,
    config: BuilderConfig
  ) {
    this.#flashMessagesManager = flashMessagesManager
    this.#i18nManager = i18nManager
    this.#routesManager = routesManager
    this.#config = config

    this.props = {}
    this.globals = {}
    this.route = null
  }

  /**
   * The server manifest
   */
  get #serverManifest(): Manifest {
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
  get #clientManifest(): Manifest {
    return {
      props: this.props,
      globals: this.globals,
      flashMessages: this.#config.limitClientManifest ? this.flashMessagesRequiredForHydration : this.flashMessages,
      locale: this.locale,
      messages: this.#config.limitClientManifest ? this.messagesRequiredForHydration : this.messages,
      routes: this.#config.limitClientManifest ? this.routesRequiredForHydration : this.routes,
      route: this.route,
    }
  }

  /**
   * The flash messages
   */
  get flashMessages(): FlashMessages {
    return this.#flashMessagesManager.getFlashMessages(true)
  }

  /**
   * The flash messages required for hydration
   */
  get flashMessagesRequiredForHydration(): FlashMessages {
    return this.#flashMessagesManager.getFlashMessages()
  }

  /**
   * The locale
   */
  get locale(): Locale {
    return this.#i18nManager.getLocale()
  }

  /**
   * The messages
   */
  get messages(): Messages {
    return this.#i18nManager.getMessages(true)
  }

  /**
   * The messages required for hydration
   */
  get messagesRequiredForHydration(): Messages {
    return this.#i18nManager.getMessages()
  }

  /**
   * The routes
   */
  get routes(): Routes {
    return this.#routesManager.getRoutes(true)
  }

  /**
   * The routes required for hydration
   */
  get routesRequiredForHydration(): Routes {
    return this.#routesManager.getRoutes()
  }

  /**
   * Get the client manifest as JSON
   */
  getClientManifestAsJSON(): string {
    return JSON.stringify(superjson.serialize(this.#clientManifest), null, isProduction ? 0 : 2)
  }

  /**
   * Set the server manifest on the global scope
   */
  setServerManifestOnGlobalScope(): void {
    globalThis.radonisManifest = this.#serverManifest
  }

  /**
   * Register props with the Builder
   */
  registerProps(props: ValueOf<Props>): PropsHash | null {
    const propsKeys = Object.keys(props)

    if (!propsKeys.length) return null

    const propsHash = PROPS_HASHER.hash(props)

    if (!(propsHash in this.props)) {
      this.props[propsHash] = props
    }

    return propsHash
  }

  /**
   * Add globals to the Builder
   */
  addGlobals(globals: Globals): this {
    this.globals = { ...this.globals, ...globals }

    return this
  }

  /**
   * Set the flash messages on the FlashMessagesManager
   */
  setFlashMessages(flashMessages: FlashMessages): this {
    this.#flashMessagesManager.setFlashMessages(flashMessages)

    return this
  }

  /**
   * Set the locale on the I18nManager
   */
  setLocale(locale: Locale): this {
    this.#i18nManager.setLocale(locale)

    return this
  }

  /**
   * Set the messages on the I18nManager
   */
  setMessages(messages: Messages): this {
    this.#i18nManager.setMessages(messages)

    return this
  }

  /**
   * Set the routes on the RoutesManager
   */
  setRoutes(routes: Routes): this {
    this.#routesManager.setRoutes(routes)

    return this
  }

  /**
   * Set the current route on the Builder
   */
  setRoute(route: Route): this {
    this.route = route

    return this
  }

  /**
   * Reset for a new request
   */
  resetForNewRequest(): void {
    this.props = {}
    this.globals = {}
    this.route = null

    this.#flashMessagesManager.resetForNewRequest()
    this.#i18nManager.resetForNewRequest()
    this.#routesManager.resetForNewRequest()
  }
}
