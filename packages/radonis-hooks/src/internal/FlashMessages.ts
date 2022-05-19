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

    if (typeof flashMessage === 'undefined' && !identifier.match(/\.(\d*)$/i)) {
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
   * Check if a error flash message exists
   */
  public hasError(identifier?: FlashMessageIdentifier): boolean {
    if (!identifier) {
      /**
       * Check if error flash messages exist
       */
      return !!Object.keys(this.allErrors()).length
    }

    return this.has(`errors.${identifier}`)
  }

  /**
   * Get a specific flash message
   */
  public get(identifier: FlashMessageIdentifier): ValueOf<FlashMessages> | undefined {
    return this.findFlashMessage(identifier)
  }

  /**
   * Get a specific error flash message
   */
  public getError(identifier: FlashMessageIdentifier): ValueOf<FlashMessages> | undefined {
    return this.get(`errors.${identifier}`)
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
   * Get all error flash messages
   */
  public allErrors(): FlashMessages {
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
