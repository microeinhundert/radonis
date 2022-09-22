/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FlashMessageIdentifier, FlashMessages, ResetBetweenRequests } from '@microeinhundert/radonis-types'

/**
 * @internal
 */
export class FlashMessagesManager implements ResetBetweenRequests {
  /**
   * The singleton instance
   */
  static instance?: FlashMessagesManager

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(): FlashMessagesManager {
    return (FlashMessagesManager.instance = FlashMessagesManager.instance ?? new FlashMessagesManager())
  }

  /**
   * The flash messages
   */
  #flashMessages: FlashMessages

  /**
   * The flash messages required for hydration
   */
  #flashMessagesRequiredForHydration: Set<FlashMessageIdentifier>

  /**
   * Constructor
   */
  constructor() {
    this.#flashMessages = {}
    this.#flashMessagesRequiredForHydration = new Set()
  }

  /**
   * Set the flash messages
   */
  setFlashMessages(flashMessages: FlashMessages): void {
    this.#flashMessages = flashMessages
  }

  /**
   * Get the flash messages
   */
  getFlashMessages(all?: boolean): FlashMessages {
    if (all) {
      return this.#flashMessages
    }

    const flashMessages = {} as FlashMessages

    for (const identifier of this.#flashMessagesRequiredForHydration) {
      if (identifier in this.#flashMessages) {
        flashMessages[identifier] = this.#flashMessages[identifier]
      }
    }

    return flashMessages
  }

  /**
   * Require a flash message for hydration
   */
  requireFlashMessageForHydration(identifier: '*' | 'errors.*' | FlashMessageIdentifier): void {
    if (identifier === '*') {
      /**
       * Require all flash messages
       */
      this.#flashMessagesRequiredForHydration = new Set(Object.keys(this.#flashMessages))
    } else if (identifier === 'errors.*') {
      /**
       * Require all error flash messages
       */
      this.#flashMessagesRequiredForHydration = new Set(
        Object.keys(this.#flashMessages).filter((key) => key.startsWith('errors.'))
      )
    } else if (identifier in this.#flashMessages) {
      this.#flashMessagesRequiredForHydration.add(identifier)
    }
  }

  /**
   * Reset for a new request
   */
  resetForNewRequest(): void {
    this.#flashMessagesRequiredForHydration.clear()
  }
}
