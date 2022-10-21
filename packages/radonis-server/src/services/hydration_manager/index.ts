/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type {
  AssetsManifestEntry,
  FlashMessageIdentifier,
  FlashMessages,
  HydrationManagerContract,
  MessageIdentifier,
  Messages,
  Resettable,
  RouteIdentifier,
  Routes,
} from '@microeinhundert/radonis-types'

import { ERRORS_NAMESPACE } from './constants'

/**
 * Service for managing hydration requirements
 * @internal
 */
export class HydrationManager implements HydrationManagerContract, Resettable {
  /**
   * The singleton instance
   */
  static instance?: HydrationManagerContract

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(...args: ConstructorParameters<typeof HydrationManager>): HydrationManagerContract {
    return (HydrationManager.instance = HydrationManager.instance ?? new HydrationManager(...args))
  }

  /**
   * The flash messages
   */
  #flashMessages: FlashMessages
  #requiredFlashMessages: Set<FlashMessageIdentifier>

  /**
   * The messages
   */
  #messages: Messages
  #requiredMessages: Set<MessageIdentifier>

  /**
   * The routes
   */
  #routes: Routes
  #requiredRoutes: Set<RouteIdentifier>

  /**
   * Constructor
   */
  constructor() {
    this.#setDefaults()
  }

  /**
   * The flash messages
   */
  get flashMessages(): FlashMessages {
    return this.#flashMessages
  }
  get requiredFlashMessages(): FlashMessages {
    const flashMessages = {} as FlashMessages

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
  setFlashMessages(flashMessages: FlashMessages): this {
    this.#flashMessages = flashMessages

    return this
  }

  /**
   * Require a flash message
   */
  requireFlashMessage(identifier: '*' | 'errors.*' | FlashMessageIdentifier): this {
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
  get messages(): Messages {
    return this.#messages
  }
  get requiredMessages(): Messages {
    const messages = {} as Messages

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
  setMessages(messages: Messages): this {
    this.#messages = messages

    return this
  }

  /**
   * Require a message
   */
  requireMessage(identifier: '*' | MessageIdentifier): this {
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
  get routes(): Routes {
    return this.#routes
  }
  get requiredRoutes(): Routes {
    const routes = {} as Routes

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
  setRoutes(routes: Routes): this {
    this.#routes = routes

    return this
  }

  /**
   * Require a route
   */
  requireRoute(identifier: '*' | RouteIdentifier): this {
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
    if (asset.type === 'entry') return this

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
