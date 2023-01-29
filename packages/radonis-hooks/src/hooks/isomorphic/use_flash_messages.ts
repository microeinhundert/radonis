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
      hydrationManager.requireAllFlashMessages()
    }

    return flashMessages
  }

  /**
   * Check if a specific flash message exists
   */
  function has(identifier: string) {
    return Boolean(findFlashMessage(identifier))
  }

  /**
   * Check if any flash messages exist
   */
  function hasAny() {
    return Boolean(Object.keys(all()).length)
  }

  /**
   * Get a specific flash message
   */
  function get(identifier: string) {
    return findFlashMessage(identifier)
  }

  return {
    all,
    has$: has,
    hasAny,
    get$: get,
  }
}
