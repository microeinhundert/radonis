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

/**
 * Hook for retrieving all routes available in the application
 * @see {@link https://radonis.vercel.app/docs/hooks/use-routes}
 */
export function useRoutes() {
  const { routes } = useManifest()
  const hydration = useHydration()

  if (hydration.root) {
    HydrationManager.getInstance().requireRouteForHydration('*')
  }

  return routes
}
