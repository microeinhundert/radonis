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
import { isProduction } from '@microeinhundert/radonis-shared'
import type {
  Globals,
  Hydration,
  HydrationManagerContract,
  ManifestContract,
  ManifestManagerContract,
  Resettable,
  Route,
} from '@microeinhundert/radonis-types'
import superjson from 'superjson'

import { E_CANNOT_SERIALIZE_MANIFEST } from '../exceptions'
import { DEFAULT_LOCALE } from './constants'

/**
 * Service for managing the manifest
 */
export class ManifestManager implements ManifestManagerContract, Resettable {
  /**
   * The singleton instance
   */
  static instance?: ManifestManager

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(...args: ConstructorParameters<typeof ManifestManager>): ManifestManager {
    return (ManifestManager.instance = ManifestManager.instance ?? new ManifestManager(...args))
  }

  /**
   * The Radonis config
   */
  #config: RadonisConfig

  /**
   * The HydrationManager instance
   */
  #hydrationManager: HydrationManagerContract

  /**
   * The hydration
   */
  #hydration: Hydration

  /**
   * The globals
   */
  #globals: Globals

  /**
   * The locale
   */
  #locale: string

  /**
   * The current route
   */
  #route: Route | null

  constructor(config: RadonisConfig, application: ApplicationContract) {
    this.#config = config

    this.#hydrationManager = application.container.resolveBinding('Microeinhundert/Radonis/HydrationManager')

    this.#setDefaults()
  }

  /**
   * The server manifest
   */
  get #serverManifest(): ManifestContract {
    return {
      hydration: this.#hydration,
      globals: this.#globals,
      locale: this.#locale,
      route: this.#route,
      flashMessages: this.flashMessages,
      messages: this.messages,
      routes: this.routes,
    }
  }

  /**
   * The client manifest
   */
  get #clientManifest(): ManifestContract {
    return {
      hydration: this.#hydration,
      globals: this.#globals,
      locale: this.#locale,
      route: this.#route,
      flashMessages: this.#config.client.limitManifest ? this.flashMessagesRequiredForHydration : this.flashMessages,
      messages: this.#config.client.limitManifest ? this.messagesRequiredForHydration : this.messages,
      routes: this.#config.client.limitManifest ? this.routesRequiredForHydration : this.routes,
    }
  }

  /**
   * The flash messages
   */
  get flashMessages(): Record<string, string> {
    return this.#hydrationManager.flashMessages
  }
  get flashMessagesRequiredForHydration(): Record<string, string> {
    return this.#hydrationManager.requiredFlashMessages
  }

  /**
   * Set the flash messages
   */
  setFlashMessages(flashMessages: Record<string, string>): this {
    this.#hydrationManager.setFlashMessages(flashMessages)

    return this
  }

  /**
   * The messages
   */
  get messages(): Record<string, string> {
    return this.#hydrationManager.messages
  }
  get messagesRequiredForHydration(): Record<string, string> {
    return this.#hydrationManager.requiredMessages
  }

  /**
   * Set the messages
   */
  setMessages(messages: Record<string, string>): this {
    this.#hydrationManager.setMessages(messages)

    return this
  }

  /**
   * The routes
   */
  get routes(): Record<string, string> {
    return this.#hydrationManager.routes
  }
  get routesRequiredForHydration(): Record<string, string> {
    return this.#hydrationManager.requiredRoutes
  }

  /**
   * Set the routes
   */
  setRoutes(routes: Record<string, string>): this {
    this.#hydrationManager.setRoutes(routes)

    return this
  }

  /**
   * The hydration
   */
  get hydration(): Hydration {
    return this.#hydration
  }

  /**
   * Register hydration
   */
  registerHydration(hydrationRootId: string, islandIdentifier: string, props: Record<string, unknown>): this {
    this.#hydration = {
      ...this.#hydration,
      [hydrationRootId]: { islandIdentifier, props },
    }

    return this
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
  get locale(): string {
    return this.#locale
  }

  /**
   * Set the locale
   */
  setLocale(locale: string): this {
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
      throw new E_CANNOT_SERIALIZE_MANIFEST()
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
  }

  /**
   * Set the defaults
   */
  #setDefaults(): void {
    this.#hydration = {}
    this.#globals = {}
    this.#locale = DEFAULT_LOCALE
    this.#route = null
  }
}
