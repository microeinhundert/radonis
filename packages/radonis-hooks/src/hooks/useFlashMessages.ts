/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager, useHydration } from '@microeinhundert/radonis-hydrate'
import type { FlashMessageIdentifier, FlashMessages } from '@microeinhundert/radonis-types'

import { useManifest } from './useManifest'

const ERRORS_NAMESPACE = 'errors'

/**
 * Hook for retrieving session flash messages
 */
export function useFlashMessages() {
  const { flashMessages } = useManifest()
  const hydration = useHydration()

  /**
   * Find the flash message inside the registered flash messages
   */
  function findFlashMessage(identifier: FlashMessageIdentifier) {
    const flashMessage = flashMessages[identifier]

    if (typeof flashMessage === 'undefined' && !identifier.match(/\.(\d*)$/i)) {
      return findFlashMessage(`${identifier}.0`)
    }

    if (hydration.root && flashMessage) {
      HydrationManager.getInstance().requireFlashMessageForHydration(identifier)
    }

    return flashMessage
  }

  /**
   * Check if a flash message exists
   */
  function has(identifier?: FlashMessageIdentifier) {
    if (!identifier) {
      /**
       * Check if flash messages exist
       */
      return !!Object.keys(all()).length
    }

    return !!findFlashMessage(identifier)
  }

  /**
   * Check if a error flash message exists
   */
  function hasError(identifier?: FlashMessageIdentifier) {
    if (!identifier) {
      /**
       * Check if error flash messages exist
       */
      return !!Object.keys(allErrors()).length
    }

    return has(`${ERRORS_NAMESPACE}.${identifier}`)
  }

  /**
   * Get a specific flash message
   */
  function get(identifier: FlashMessageIdentifier) {
    return findFlashMessage(identifier)
  }

  /**
   * Get a specific error flash message
   */
  function getError(identifier: FlashMessageIdentifier) {
    return get(`${ERRORS_NAMESPACE}.${identifier}`)
  }

  /**
   * Get all flash messages
   */
  function all() {
    if (hydration.root) {
      HydrationManager.getInstance().requireFlashMessageForHydration('*')
    }

    return flashMessages
  }

  /**
   * Get all error flash messages
   */
  function allErrors() {
    if (hydration.root) {
      HydrationManager.getInstance().requireFlashMessageForHydration(`${ERRORS_NAMESPACE}.*`)
    }

    return Object.entries(flashMessages)
      .filter(([identifier]) => identifier.startsWith(`${ERRORS_NAMESPACE}.`))
      .reduce<FlashMessages>((errorFlashMessages, [identifier, value]) => {
        return {
          ...errorFlashMessages,
          [identifier]: value,
        }
      }, {})
  }

  return {
    has,
    hasError,
    get,
    getError,
    all,
    allErrors,
  }
}
