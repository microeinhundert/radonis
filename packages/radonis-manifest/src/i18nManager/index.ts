/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Locale, MessageIdentifier, Messages, ResetBetweenRequests } from '@microeinhundert/radonis-types'

import { DEFAULT_LOCALE } from './constants'

/**
 * @internal
 */
export class I18nManager implements ResetBetweenRequests {
  /**
   * The singleton instance
   */
  static instance?: I18nManager

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(): I18nManager {
    return (I18nManager.instance = I18nManager.instance ?? new I18nManager())
  }

  /**
   * The locale
   */
  #locale: Locale

  /**
   * The messages
   */
  #messages: Messages

  /**
   * The messages required for hydration
   */
  #messagesRequiredForHydration: Set<MessageIdentifier>

  /**
   * Constructor
   */
  constructor() {
    this.#locale = DEFAULT_LOCALE
    this.#messages = {}
    this.#messagesRequiredForHydration = new Set()
  }

  /**
   * Set the locale
   */
  setLocale(locale: Locale): void {
    this.#locale = locale
  }

  /**
   * Get the locale
   */
  getLocale(): Locale {
    return this.#locale
  }

  /**
   * Set the messages
   */
  setMessages(messages: Messages): void {
    this.#messages = messages
  }

  /**
   * Get the messages
   */
  getMessages(all?: boolean): Messages {
    if (all) {
      return this.#messages
    }

    const messages = {} as Messages

    for (const identifier of this.#messagesRequiredForHydration) {
      if (identifier in this.#messages) {
        messages[identifier] = this.#messages[identifier]
      }
    }

    return messages
  }

  /**
   * Require a message for hydration
   */
  requireMessageForHydration(identifier: '*' | MessageIdentifier): void {
    if (identifier === '*') {
      /**
       * Require all messages
       */
      this.#messagesRequiredForHydration = new Set(Object.keys(this.#messages))
    } else if (identifier in this.#messages) {
      this.#messagesRequiredForHydration.add(identifier)
    }
  }

  /**
   * Reset for a new request
   */
  resetForNewRequest(): void {
    this.#messagesRequiredForHydration.clear()
  }
}
