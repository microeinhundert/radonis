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
  private static instance?: I18nManager

  /**
   * The locale
   */
  private locale: Locale = DEFAULT_LOCALE

  /**
   * The messages
   */
  private messages: Messages = {}

  /**
   * The messages required for hydration
   */
  private messagesRequiredForHydration: Set<MessageIdentifier> = new Set()

  /**
   * Set the locale
   */
  public setLocale(locale: Locale): void {
    this.locale = locale
  }

  /**
   * Get the locale
   */
  public getLocale(): Locale {
    return this.locale
  }

  /**
   * Set the messages
   */
  public setMessages(messages: Messages): void {
    this.messages = messages
  }

  /**
   * Get the messages
   */
  public getMessages(all?: boolean): Messages {
    if (all) {
      return this.messages
    }

    const messages = {} as Messages

    for (const identifier of this.messagesRequiredForHydration) {
      if (identifier in this.messages) {
        messages[identifier] = this.messages[identifier]
      }
    }

    return messages
  }

  /**
   * Require a message for hydration
   */
  public requireMessageForHydration(identifier: '*' | MessageIdentifier): void {
    if (identifier === '*') {
      /**
       * Require all messages
       */
      this.messagesRequiredForHydration = new Set(Object.keys(this.messages))
    } else if (identifier in this.messages) {
      this.messagesRequiredForHydration.add(identifier)
    }
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.messagesRequiredForHydration.clear()
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): I18nManager {
    return (I18nManager.instance = I18nManager.instance ?? new I18nManager())
  }
}
