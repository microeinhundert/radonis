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
 * Hook for retrieving info about the current route
 * @see https://radonis.vercel.app/docs/hooks/use-route
 */
export function useRoute() {
  const { route, routes } = useManifest()
  const hydration = useHydration()

  function isCurrent(identifier: string, options?: { exact?: boolean }) {
    if (options?.exact) {
      return route?.identifier === identifier
    }

    if (routes[identifier]) {
      if (hydration.id) {
        hydrationManager.requireRoute(identifier)
      }

      return Boolean(route?.pattern?.startsWith(routes[identifier]))
    }

    return false
  }

  return {
    current: route!,
    isCurrent,
  }
}
