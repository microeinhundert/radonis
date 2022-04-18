/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHydration } from '@microeinhundert/radonis-hydrate'

import { useManifest } from './useManifest'

export function useRoute() {
  const { route, routes } = useManifest()
  const hydration = useHydration()

  return {
    current: route,
    isCurrent(identifier: string, exact?: boolean): boolean {
      if (exact) {
        return route?.name === identifier
      }

      if (routes[identifier]) {
        if (hydration.root) {
          globalThis.rad_routesManager?.requireRouteForHydration(identifier)
        }
        return !!route?.pattern?.startsWith(routes[identifier])
      }

      return false
    },
  }
}
