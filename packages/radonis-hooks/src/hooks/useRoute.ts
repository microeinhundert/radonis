/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager, useHydration } from '@microeinhundert/radonis-hydrate'

import { useManifest } from './useManifest'

export function useRoute() {
  const { route, routes } = useManifest()
  const hydration = useHydration()

  function isCurrent(identifier: string, exact?: boolean): boolean {
    if (exact) {
      return route?.name === identifier
    }

    if (routes[identifier]) {
      if (hydration.root) {
        new HydrationManager().requireRouteForHydration(identifier)
      }

      return !!route?.pattern?.startsWith(routes[identifier])
    }

    return false
  }

  return {
    current: route,
    isCurrent,
  }
}
