/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class FlashMessagesManager {
  /**
   * The singleton instance
   */
  private static instance: FlashMessagesManager

  /**
   * The flash messages
   */
  private flashMessages: Record<string, Radonis.FlashMessage> = {}

  /**
   * The flash messages required for hydration
   */
  private flashMessagesRequiredForHydration: Set<string> = new Set()

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
  public setFlashMessages(flashMessages: Record<string, Radonis.FlashMessage>): void {
    this.flashMessages = flashMessages
  }

  /**
   * Get the flash messages
   */
  public getFlashMessages(all?: boolean): Record<string, Radonis.FlashMessage> {
    if (all) {
      return this.flashMessages
    }

    const flashMessages = {} as Record<string, Radonis.FlashMessage>

    for (const identifier of this.flashMessagesRequiredForHydration) {
      if (this.flashMessages[identifier]) {
        flashMessages[identifier] = this.flashMessages[identifier]
      }
    }

    return flashMessages
  }

  /**
   * Require a flash message for hydration
   */
  public requireFlashMessageForHydration(identifier: string): void {
    if (!this.flashMessages[identifier]) return
    this.flashMessagesRequiredForHydration.add(identifier)
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.flashMessagesRequiredForHydration.clear()
  }
}
