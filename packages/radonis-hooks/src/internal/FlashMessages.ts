/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager } from '@microeinhundert/radonis-hydrate'

export class FlashMessages {
  /**
   * Constructor
   */
  constructor(private flashMessages: Record<string, Radonis.FlashMessage>, private willHydrate?: boolean) {}

  /**
   * Find the flash message inside the registered flash messages
   */
  private findFlashMessage(identifier: string): Radonis.FlashMessage | undefined {
    const flashMessage = this.flashMessages[identifier]

    if (!flashMessage && !identifier.match(/\.(\d*)$/i)) {
      return this.findFlashMessage(`${identifier}.0`)
    }

    if (this.willHydrate) {
      new HydrationManager().requireFlashMessageForHydration(identifier)
    }

    return flashMessage
  }

  /**
   * Check if a specific flash message exists
   */
  public has(identifier: string): boolean {
    return !!this.findFlashMessage(identifier)
  }

  /**
   * Check if a specific validation error flash message exists
   */
  public hasValidationError(identifier: string): boolean {
    return this.has(`errors.${identifier}`)
  }

  /**
   * Get a specific flash message
   */
  public get<T extends Radonis.FlashMessage>(identifier: string, defaultValue: T): T
  public get<T extends Radonis.FlashMessage>(identifier: string, defaultValue?: T): T | undefined
  public get<T extends Radonis.FlashMessage>(identifier: string, defaultValue?: T): T | undefined {
    // @ts-ignore
    return this.findFlashMessage(identifier) ?? defaultValue
  }

  /**
   * Get a specific validation error flash message
   */
  public getValidationError<T extends string>(identifier: string, defaultValue: T): T
  public getValidationError<T extends string>(identifier: string, defaultValue?: T): T | undefined
  public getValidationError<T extends string>(identifier: string, defaultValue?: T): T | undefined {
    return this.get<T>(`errors.${identifier}`, defaultValue)
  }

  /**
   * Get all flash messages
   */
  public all(): Record<string, Radonis.FlashMessage> {
    return Object.keys(this.flashMessages).reduce<Record<string, Radonis.FlashMessage>>(
      (flashMessages, flashMessageIdentifier) => {
        return {
          ...flashMessages,
          [flashMessageIdentifier]: this.findFlashMessage(flashMessageIdentifier) as Radonis.FlashMessage,
        }
      },
      {}
    )
  }
}
