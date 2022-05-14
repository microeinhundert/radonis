/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FlashMessageIdentifier, FlashMessages } from '@microeinhundert/radonis-types'

export class FlashMessagesManager {
  /**
   * The singleton instance
   */
  private static instance: FlashMessagesManager

  /**
   * The flash messages
   */
  private flashMessages: FlashMessages = {}

  /**
   * The flash messages required for hydration
   */
  private flashMessagesRequiredForHydration: Set<FlashMessageIdentifier> = new Set()

  /**
   * Constructor
   */
  constructor() {
    if (FlashMessagesManager.instance) {
      return FlashMessagesManager.instance
    }

    FlashMessagesManager.instance = this
  }

  /**
   * Set the flash messages
   */
  public setFlashMessages(flashMessages: FlashMessages): void {
    this.flashMessages = flashMessages
  }

  /**
   * Get the flash messages
   */
  public getFlashMessages(all?: boolean): FlashMessages {
    if (all) {
      return this.flashMessages
    }

    const flashMessages = {} as FlashMessages

    for (const identifier of this.flashMessagesRequiredForHydration) {
      if (identifier in this.flashMessages) {
        flashMessages[identifier] = this.flashMessages[identifier]
      }
    }

    return flashMessages
  }

  /**
   * Require a flash message for hydration
   */
  public requireFlashMessageForHydration(identifier: '*' | 'errors.*' | FlashMessageIdentifier): void {
    if (identifier === '*') {
      /**
       * Require all flash messages
       */
      this.flashMessagesRequiredForHydration = new Set(Object.keys(this.flashMessages))
    } else if (identifier === 'errors.*') {
      /**
       * Require all validation error flash messages
       */
      this.flashMessagesRequiredForHydration = new Set(
        Object.keys(this.flashMessages).filter((key) => key.startsWith('errors.'))
      )
    } else if (identifier in this.flashMessages) {
      this.flashMessagesRequiredForHydration.add(identifier)
    }
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.flashMessagesRequiredForHydration.clear()
  }
}
