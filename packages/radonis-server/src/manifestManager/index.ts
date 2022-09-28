/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import type { HydrationManager } from '@microeinhundert/radonis-hydrate'
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

import { DEFAULT_LOCALE } from './constants'

const PROPS_HASHER = hasher({ sort: true, coerce: false, alg: 'md5' })

/**
 * @internal
 */
export class ManifestManager implements ResetBetweenRequests {
  /**
   * The Radonis config
   */
  #config: RadonisConfig

  /**
   * The HydrationManager instance
   */
  #hydrationManager: HydrationManager

  /**
   * The props
   */
  #props: Props

  /**
   * The globals
   */
  #globals: Globals

  /**
   * The locale
   */
  #locale: Locale

  /**
   * The current route
   */
  #route: Route | null

  /**
   * Constructor
   */
  constructor(application: ApplicationContract) {
    this.#config = application.container.resolveBinding('Microeinhundert/Radonis/Config')
    this.#hydrationManager = application.container.resolveBinding('Microeinhundert/Radonis/HydrationManager')

    this.#setDefaults()
  }

  /**
   * The server manifest
   */
  get #serverManifest(): Manifest {
    return {
      props: this.#props,
      globals: this.#globals,
      locale: this.locale,
      route: this.#route,
      flashMessages: this.flashMessages,
      messages: this.messages,
      routes: this.routes,
    }
  }

  /**
   * The client manifest
   */
  get #clientManifest(): Manifest {
    return {
      props: this.#props,
      globals: this.#globals,
      locale: this.locale,
      route: this.#route,
      flashMessages: this.#config.client.limitManifest ? this.flashMessagesRequiredForHydration : this.flashMessages,
      messages: this.#config.client.limitManifest ? this.messagesRequiredForHydration : this.messages,
      routes: this.#config.client.limitManifest ? this.routesRequiredForHydration : this.routes,
    }
  }

  /**
   * The locale
   */
  get locale(): Locale {
    return this.#locale
  }

  /**
   * The flash messages
   */
  get flashMessages(): FlashMessages {
    return this.#hydrationManager.flashMessages
  }

  /**
   * The flash messages required for hydration
   */
  get flashMessagesRequiredForHydration(): FlashMessages {
    return this.#hydrationManager.requiredFlashMessages
  }

  /**
   * The messages
   */
  get messages(): Messages {
    return this.#hydrationManager.messages
  }

  /**
   * The messages required for hydration
   */
  get messagesRequiredForHydration(): Messages {
    return this.#hydrationManager.requiredMessages
  }

  /**
   * The routes
   */
  get routes(): Routes {
    return this.#hydrationManager.routes
  }

  /**
   * The routes required for hydration
   */
  get routesRequiredForHydration(): Routes {
    return this.#hydrationManager.requiredRoutes
  }

  /**
   * Register props
   */
  registerProps(props: ValueOf<Props>): PropsHash | null {
    const propsKeys = Object.keys(props)

    if (!propsKeys.length) return null

    const propsHash = PROPS_HASHER.hash(props)

    if (!(propsHash in this.#props)) {
      this.#props[propsHash] = props
    }

    return propsHash
  }

  /**
   * Add globals
   */
  addGlobals(globals: Globals): this {
    this.#globals = { ...this.#globals, ...globals }

    return this
  }

  /**
   * Set the locale
   */
  setLocale(locale: Locale): this {
    this.#locale = locale

    return this
  }

  /**
   * Set the current route
   */
  setRoute(route: Route): this {
    this.#route = route

    return this
  }

  /**
   * Set the flash messages
   */
  setFlashMessages(flashMessages: FlashMessages): this {
    this.#hydrationManager.setFlashMessages(flashMessages)

    return this
  }

  /**
   * Set the messages
   */
  setMessages(messages: Messages): this {
    this.#hydrationManager.setMessages(messages)

    return this
  }

  /**
   * Set the routes
   */
  setRoutes(routes: Routes): this {
    this.#hydrationManager.setRoutes(routes)

    return this
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
   * Reset for a new request
   */
  resetForNewRequest(): void {
    this.#setDefaults()
    this.#hydrationManager.resetForNewRequest()
  }

  /**
   * Set the defaults
   */
  #setDefaults() {
    this.#props = {}
    this.#globals = {}
    this.#locale = DEFAULT_LOCALE
    this.#route = null
  }
}
