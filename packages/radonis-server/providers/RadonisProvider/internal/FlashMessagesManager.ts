export class FlashMessagesManager implements Radonis.FlashMessagesManagerContract {
  /**
   * The flash messages
   */
  private flashMessages: Record<string, any> = {};

  /**
   * The flash messages required for hydration
   */
  private flashMessagesRequiredForHydration: Set<string> = new Set();

  /**
   * Set the flash messages
   */
  public setFlashMessages(flashMessages: Record<string, any>): void {
    this.flashMessages = flashMessages;
  }

  /**
   * Get the flash messages
   */
  public getFlashMessages(all?: boolean): Record<string, any> {
    if (all) {
      return this.flashMessages;
    }

    const flashMessages = {} as Record<string, any>;

    for (const identifier of this.flashMessagesRequiredForHydration) {
      if (this.flashMessages[identifier]) {
        flashMessages[identifier] = this.flashMessages[identifier];
      }
    }

    return flashMessages;
  }

  /**
   * Require a flash message for hydration
   */
  public requireFlashMessageForHydration(identifier: string): void {
    if (!this.flashMessages[identifier]) return;
    this.flashMessagesRequiredForHydration.add(identifier);
  }

  /**
   * Get a fresh instance
   */
  public fresh(): this {
    this.flashMessagesRequiredForHydration.clear();

    return this;
  }

  /**
   * Construct a new FlashMessagesManager
   */
  public static construct(): Radonis.FlashMessagesManagerContract {
    return (globalThis.rad_flashMessagesManager =
      globalThis.rad_flashMessagesManager?.fresh() ?? new FlashMessagesManager());
  }
}
