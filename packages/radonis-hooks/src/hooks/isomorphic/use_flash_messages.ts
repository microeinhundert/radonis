/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHydration } from '@microeinhundert/radonis-hydrate'

import { hydrationManager } from '../../singletons'
import { useManifest } from './use_manifest'

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
  function findFlashMessage(identifier: string) {
    const flashMessage = flashMessages[identifier]

    /**
     * If the flash message does not exist, check if it exists on the zero index
     */
    if (typeof flashMessage === 'undefined' && identifier && !identifier.match(/\.(\d*)$/i)) {
      return findFlashMessage(`${identifier}.0`)
    }

    if (hydration.id && flashMessage) {
      hydrationManager.requireFlashMessage(identifier)
    }

    return flashMessage
  }

  /**
   * Get all flash messages
   */
  function all() {
    if (hydration.id) {
      hydrationManager.requireFlashMessage('*')
    }

    return flashMessages
  }

  /**
   * Check if a specific flash message exists
   */
  function has(identifier: string) {
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
  function get(identifier: string) {
    return findFlashMessage(identifier)
  }

  /**
   * Get all error flash messages
   */
  function allErrors() {
    if (hydration.id) {
      hydrationManager.requireFlashMessage(`${ERRORS_NAMESPACE}.*`)
    }

    return Object.entries(flashMessages)
      .filter(([identifier]) => identifier.startsWith(`${ERRORS_NAMESPACE}.`))
      .reduce<Record<string, string>>((errorFlashMessages, [identifier, value]) => {
        return {
          ...errorFlashMessages,
          [identifier]: value,
        }
      }, {})
  }

  /**
   * Check if a specific error flash message exists
   */
  function hasError(identifier: string) {
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
  function getError(identifier: string) {
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
