import { DEFAULT_LOCALE } from '../constants'

export class I18nManager implements Radonis.I18nManagerContract {
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
   * Get a fresh instance
   */
  public fresh(): this {
    this.messagesRequiredForHydration.clear()

    return this
  }

  /**
   * Construct a new I18nManager
   */
  public static construct(): Radonis.I18nManagerContract {
    /**
     * Setting on the global scope is required in order for the client package
     * to be able to access this class without having a dependency to the server package
     */
    return (globalThis.rad_i18nManager = globalThis.rad_i18nManager?.fresh() ?? new I18nManager())
  }
}
