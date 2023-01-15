/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AssetsManifestEntry, HydrationManagerContract, Resettable } from '@microeinhundert/radonis-types'

import { ERRORS_NAMESPACE } from './constants'

/**
 * Service for managing hydration requirements
 * @internal
 */
export class HydrationManager implements HydrationManagerContract, Resettable {
  /**
   * The singleton instance
   */
  static instance?: HydrationManager

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(...args: ConstructorParameters<typeof HydrationManager>): HydrationManager {
    return (HydrationManager.instance = HydrationManager.instance ?? new HydrationManager(...args))
  }

  /**
   * The flash messages
   */
  #flashMessages: Record<string, string>
  #requiredFlashMessages: Set<string>

  /**
   * The messages
   */
  #messages: Record<string, string>
  #requiredMessages: Set<string>

  /**
   * The routes
   */
  #routes: Record<string, string>
  #requiredRoutes: Set<string>

  /**
   * Constructor
   */
  constructor() {
    this.#setDefaults()
  }

  /**
   * The flash messages
   */
  get flashMessages(): Record<string, string> {
    return this.#flashMessages
  }
  get requiredFlashMessages(): Record<string, string> {
    const flashMessages = {} as Record<string, string>

    for (const identifier of this.#requiredFlashMessages) {
      if (identifier in this.#flashMessages) {
        flashMessages[identifier] = this.#flashMessages[identifier]
      }
    }

    return flashMessages
  }

  /**
   * Set the flash messages
   */
  setFlashMessages(flashMessages: Record<string, string>): this {
    this.#flashMessages = flashMessages

    return this
  }

  /**
   * Require a flash message
   */
  requireFlashMessage(identifier: string): this {
    if (identifier === '*') {
      /**
       * Require all flash messages
       */
      this.#requiredFlashMessages = new Set(Object.keys(this.#flashMessages))
    } else if (identifier === `${ERRORS_NAMESPACE}.*`) {
      /**
       * Require all error flash messages
       */
      this.#requiredFlashMessages = new Set(
        Object.keys(this.#flashMessages).filter((key) => key.startsWith(`${ERRORS_NAMESPACE}.`))
      )
    } else if (identifier in this.#flashMessages) {
      this.#requiredFlashMessages.add(identifier)
    }

    return this
  }

  /**
   * The messages
   */
  get messages(): Record<string, string> {
    return this.#messages
  }
  get requiredMessages(): Record<string, string> {
    const messages = {} as Record<string, string>

    for (const identifier of this.#requiredMessages) {
      if (identifier in this.#messages) {
        messages[identifier] = this.#messages[identifier]
      }
    }

    return messages
  }

  /**
   * Set the messages
   */
  setMessages(messages: Record<string, string>): this {
    this.#messages = messages

    return this
  }

  /**
   * Require a message
   */
  requireMessage(identifier: string): this {
    if (identifier === '*') {
      /**
       * Require all messages
       */
      this.#requiredMessages = new Set(Object.keys(this.#messages))
    } else if (identifier in this.#messages) {
      this.#requiredMessages.add(identifier)
    }

    return this
  }

  /**
   * The routes
   */
  get routes(): Record<string, string> {
    return this.#routes
  }
  get requiredRoutes(): Record<string, string> {
    const routes = {} as Record<string, string>

    for (const identifier of this.#requiredRoutes) {
      if (identifier in this.#routes) {
        routes[identifier] = this.#routes[identifier]
      }
    }

    return routes
  }

  /**
   * Set the routes
   */
  setRoutes(routes: Record<string, string>): this {
    this.#routes = routes

    return this
  }

  /**
   * Require a route
   */
  requireRoute(identifier: string): this {
    if (identifier === '*') {
      /**
       * Require all routes
       */
      this.#requiredRoutes = new Set(Object.keys(this.#routes))
    } else if (identifier in this.#routes) {
      this.#requiredRoutes.add(identifier)
    }

    return this
  }

  /**
   * Require the flash messages, messages and routes used by an asset
   */
  requireAsset(asset: AssetsManifestEntry): this {
    if (asset.type === 'client-script') return this

    for (const identifier of asset.flashMessages) {
      this.requireFlashMessage(identifier)
    }

    for (const identifier of asset.messages) {
      this.requireMessage(identifier)
    }

    for (const identifier of asset.routes) {
      this.requireRoute(identifier)
    }

    return this
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
    this.#flashMessages = {}
    this.#requiredFlashMessages = new Set()

    this.#messages = {}
    this.#requiredMessages = new Set()

    this.#routes = {}
    this.#requiredRoutes = new Set()
  }
}
