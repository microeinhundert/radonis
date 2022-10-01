/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHydration } from '@microeinhundert/radonis-hydrate'
import type { FlashMessageIdentifier, FlashMessages } from '@microeinhundert/radonis-types'

import { hydrationManager } from '../singletons'
import { useManifest } from './useManifest'

const ERRORS_NAMESPACE = 'errors'

/**
 * Hook for retrieving session flash messages
 * @see https://radonis.vercel.app/docs/hooks/use-flash-messages
 */
export function useFlashMessages() {
  const { flashMessages } = useManifest()
  const hydration = useHydration()

  /**
   * Find the flash message inside the registered flash messages
   */
  function findFlashMessage(identifier: FlashMessageIdentifier) {
    const flashMessage = flashMessages[identifier]

    /**
     * If the flash message does not exist, check if it exists on the zero index
     */
    if (typeof flashMessage === 'undefined' && identifier && !identifier.match(/\.(\d*)$/i)) {
      return findFlashMessage(`${identifier}.0`)
    }

    if (hydration.root && flashMessage) {
      hydrationManager.requireFlashMessage(identifier)
    }

    return flashMessage
  }

  /**
   * Get all flash messages
   */
  function all() {
    if (hydration.root) {
      hydrationManager.requireFlashMessage('*')
    }

    return flashMessages
  }

  /**
   * Check if a specific flash message exists
   */
  function has(identifier: FlashMessageIdentifier) {
    return !!findFlashMessage(identifier)
  }

  /**
   * Check if any flash messages exist
   */
  function hasAny() {
    return !!Object.keys(all()).length
  }

  /**
   * Get a specific flash message
   */
  function get(identifier: FlashMessageIdentifier) {
    return findFlashMessage(identifier)
  }

  /**
   * Get all error flash messages
   */
  function allErrors() {
    if (hydration.root) {
      hydrationManager.requireFlashMessage(`${ERRORS_NAMESPACE}.*`)
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

  /**
   * Check if a specific error flash message exists
   */
  function hasError(identifier: FlashMessageIdentifier) {
    return has(`${ERRORS_NAMESPACE}.${identifier}`)
  }

  /**
   * Check if any error flash messages exist
   */
  function hasAnyError() {
    return !!Object.keys(allErrors()).length
  }

  /**
   * Get a specific error flash message
   */
  function getError(identifier: FlashMessageIdentifier) {
    return get(`${ERRORS_NAMESPACE}.${identifier}`)
  }

  return {
    all,
    has,
    hasAny,
    get,
    //
    allErrors,
    hasError,
    hasAnyError,
    getError,
  }
}
