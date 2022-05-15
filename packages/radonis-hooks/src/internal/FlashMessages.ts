/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager } from '@microeinhundert/radonis-hydrate'
import type { FlashMessageIdentifier, FlashMessages, ValueOf } from '@microeinhundert/radonis-types'

export class FlashMessagesImpl {
  /**
   * Constructor
   */
  constructor(private flashMessages: FlashMessages, private willHydrate?: boolean) {}

  /**
   * Find the flash message inside the registered flash messages
   */
  private findFlashMessage(identifier: FlashMessageIdentifier): ValueOf<FlashMessages> | undefined {
    const flashMessage = this.flashMessages[identifier]

    if (!flashMessage && !identifier.match(/\.(\d*)$/i)) {
      return this.findFlashMessage(`${identifier}.0`)
    }

    if (this.willHydrate) {
      HydrationManager.getInstance().requireFlashMessageForHydration(identifier)
    }

    return flashMessage
  }

  /**
   * Check if a flash message exists
   */
  public has(identifier?: FlashMessageIdentifier): boolean {
    if (!identifier) {
      /**
       * Check if flash messages exist
       */
      return !!Object.keys(this.all()).length
    }

    return !!this.findFlashMessage(identifier)
  }

  /**
   * Check if a validation error flash message exists
   */
  public hasValidationError(identifier?: FlashMessageIdentifier): boolean {
    if (!identifier) {
      /**
       * Check if validation error flash messages exist
       */
      return !!Object.keys(this.allValidationErrors()).length
    }

    return this.has(`errors.${identifier}`)
  }

  /**
   * Get a specific flash message
   */
  public get<T extends ValueOf<FlashMessages>>(identifier: FlashMessageIdentifier, defaultValue: T): T
  public get<T extends ValueOf<FlashMessages>>(identifier: FlashMessageIdentifier, defaultValue?: T): T | undefined
  public get<T extends ValueOf<FlashMessages>>(identifier: FlashMessageIdentifier, defaultValue?: T): T | undefined {
    // @ts-ignore
    return this.findFlashMessage(identifier) ?? defaultValue
  }

  /**
   * Get a specific validation error flash message
   */
  public getValidationError<T extends ValueOf<FlashMessages>>(identifier: FlashMessageIdentifier, defaultValue: T): T
  public getValidationError<T extends ValueOf<FlashMessages>>(
    identifier: FlashMessageIdentifier,
    defaultValue?: T
  ): T | undefined
  public getValidationError<T extends ValueOf<FlashMessages>>(
    identifier: FlashMessageIdentifier,
    defaultValue?: T
  ): T | undefined {
    return this.get<T>(`errors.${identifier}`, defaultValue)
  }

  /**
   * Get all flash messages
   */
  public all(): FlashMessages {
    if (this.willHydrate) {
      HydrationManager.getInstance().requireFlashMessageForHydration('*')
    }

    return this.flashMessages
  }

  /**
   * Get all validation error flash messages
   */
  public allValidationErrors(): FlashMessages {
    if (this.willHydrate) {
      HydrationManager.getInstance().requireFlashMessageForHydration('errors.*')
    }

    const flashMessages = {} as FlashMessages

    for (const identifier in this.flashMessages) {
      if (identifier.startsWith('errors.')) {
        flashMessages[identifier] = this.flashMessages[identifier]
      }
    }

    return flashMessages
  }
}
