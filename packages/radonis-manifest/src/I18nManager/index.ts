/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DEFAULT_LOCALE } from './constants'

export class I18nManager {
  /**
   * The singleton instance
   */
  private static instance: I18nManager

  /**
   * The locale
   */
  private locale: string = DEFAULT_LOCALE

  /**
   * The messages
   */
  private messages: Record<string, string> = {}

  /**
   * The messages required for hydration
   */
  private messagesRequiredForHydration: Set<string> = new Set()

  /**
   * Constructor
   */
  constructor() {
    if (I18nManager.instance) {
      return I18nManager.instance
    }

    I18nManager.instance = this
  }

  /**
   * Set the locale
   */
  public setLocale(locale: string): void {
    this.locale = locale
  }

  /**
   * Get the locale
   */
  public getLocale(): string {
    return this.locale
  }

  /**
   * Set the messages
   */
  public setMessages(messages: Record<string, string>): void {
    this.messages = messages
  }

  /**
   * Get the messages
   */
  public getMessages(all?: boolean): Record<string, string> {
    if (all) {
      return this.messages
    }

    const messages = {} as Record<string, string>

    for (const identifier of this.messagesRequiredForHydration) {
      if (this.messages[identifier]) {
        messages[identifier] = this.messages[identifier]
      }
    }

    return messages
  }

  /**
   * Require a message for hydration
   */
  public requireMessageForHydration(identifier: string): void {
    if (!this.messages[identifier]) return
    this.messagesRequiredForHydration.add(identifier)
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.messagesRequiredForHydration.clear()
  }
}
