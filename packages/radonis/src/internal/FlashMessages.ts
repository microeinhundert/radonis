import { isServer } from './utils/environment';

export class FlashMessages {
  /**
   * FlashMessagesManager
   */
  private flashMessagesManager?: Radonis.FlashMessagesManagerContract;

  /**
   * Constructor
   */
  constructor(private flashMessages: Record<string, string>, private willHydrate?: boolean) {
    this.flashMessagesManager = globalThis.rad_flashMessagesManager;
  }

  /**
   * Find the flash message inside the registered flash messages
   */
  private findFlashMessage(identifier: string): string | undefined {
    const flashMessage = this.flashMessages[identifier];

    if (isServer() && this.willHydrate) {
      this.flashMessagesManager?.requireFlashMessageForHydration(identifier);
    }

    return flashMessage;
  }

  /**
   * Check if a specific flash message exists
   */
  public has(identifier: string): boolean {
    return !!this.findFlashMessage(identifier);
  }

  /**
   * Get a specific flash message
   */
  public get(identifier: string): string | undefined {
    return this.findFlashMessage(identifier);
  }

  /**
   * Get all flash messages
   */
  public all(): Record<string, string> {
    return Object.keys(this.flashMessages).reduce<Record<string, string>>(
      (flashMessages, flashMessageKey) => {
        return {
          ...flashMessages,
          [flashMessageKey]: this.findFlashMessage(flashMessageKey) as string,
        };
      },
      {}
    );
  }
}
