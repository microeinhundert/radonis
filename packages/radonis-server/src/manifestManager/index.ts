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
  Resettable,
  Route,
  Routes,
  ValueOf,
} from '@microeinhundert/radonis-types'
import superjson from 'superjson'

import { ServerException } from '../exceptions/serverException'
import { DEFAULT_LOCALE, PROPS_HASHER } from './constants'

/**
 * @internal
 */
export class ManifestManager implements Resettable {
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
   * The flash messages
   */
  get flashMessages(): FlashMessages {
    return this.#hydrationManager.flashMessages
  }
  get flashMessagesRequiredForHydration(): FlashMessages {
    return this.#hydrationManager.requiredFlashMessages
  }

  /**
   * Set the flash messages
   */
  setFlashMessages(flashMessages: FlashMessages): this {
    this.#hydrationManager.setFlashMessages(flashMessages)

    return this
  }

  /**
   * The messages
   */
  get messages(): Messages {
    return this.#hydrationManager.messages
  }
  get messagesRequiredForHydration(): Messages {
    return this.#hydrationManager.requiredMessages
  }

  /**
   * Set the messages
   */
  setMessages(messages: Messages): this {
    this.#hydrationManager.setMessages(messages)

    return this
  }

  /**
   * The routes
   */
  get routes(): Routes {
    return this.#hydrationManager.routes
  }
  get routesRequiredForHydration(): Routes {
    return this.#hydrationManager.requiredRoutes
  }

  /**
   * Set the routes
   */
  setRoutes(routes: Routes): this {
    this.#hydrationManager.setRoutes(routes)

    return this
  }

  /**
   * The props
   */
  get props(): Props {
    return this.#props
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
   * The globals
   */
  get globals(): Globals {
    return this.#globals
  }

  /**
   * Add globals
   */
  addGlobals(globals: Globals): this {
    this.#globals = { ...this.#globals, ...globals }

    return this
  }

  /**
   * The locale
   */
  get locale(): Locale {
    return this.#locale
  }

  /**
   * Set the locale
   */
  setLocale(locale: Locale): this {
    this.#locale = locale

    return this
  }

  /**
   * The current route
   */
  get route(): Route | null {
    return this.#route
  }

  /**
   * Set the current route
   */
  setRoute(route: Route): this {
    this.#route = route

    return this
  }

  /**
   * Get the client manifest as JSON
   */
  getClientManifestAsJSON(): string {
    try {
      const serializedManifest = superjson.serialize(this.#clientManifest)
      return JSON.stringify(serializedManifest, null, isProduction ? 0 : 2)
    } catch {
      throw ServerException.cannotSerializeManifest()
    }
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
  reset(): void {
    this.#setDefaults()
    this.#hydrationManager.reset()
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
