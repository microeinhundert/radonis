import { isServer } from './utils/environment';

export class FlashMessages {
  /**
   * FlashMessagesManager
   */
  private flashMessagesManager?: Radonis.FlashMessagesManagerContract;

  /**
   * Constructor
   */
  constructor(private flashMessages: Record<string, any>, private willHydrate?: boolean) {
    this.flashMessagesManager = globalThis.rad_flashMessagesManager;
  }

  /**
   * Find the flash message inside the registered flash messages
   */
  private findFlashMessage(identifier: string): any {
    const flashMessage = this.flashMessages[identifier];

    if (!flashMessage && !identifier.match(/\.(\d*)$/i)) {
      return this.findFlashMessage(`${identifier}.0`);
    }

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
   * Check if a specific validation error flash message exists
   */
  public hasValidationError(identifier: string): boolean {
    return this.has(`errors.${identifier}`);
  }

  /**
   * Get a specific flash message
   */
  public get<T>(identifier: string, defaultValue?: T): T | undefined {
    return this.findFlashMessage(identifier) ?? defaultValue;
  }

  /**
   * Get a specific validation error flash message
   */
  public getValidationError<T>(identifier: string, defaultValue?: T): T | undefined {
    return this.get(`errors.${identifier}`, defaultValue);
  }

  /**
   * Get all flash messages
   */
  public all(): Record<string, any> {
    return Object.keys(this.flashMessages).reduce<Record<string, any>>(
      (flashMessages, flashMessageIdentifier) => {
        return {
          ...flashMessages,
          [flashMessageIdentifier]: this.findFlashMessage(flashMessageIdentifier),
        };
      },
      {}
    );
  }
}
