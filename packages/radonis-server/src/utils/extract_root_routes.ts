/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouterContract } from '@ioc:Adonis/Core/Route'

import { getRouteIdentifier } from './get_route_identifier'

/**
 * Extract the root routes
 */
export function extractRootRoutes(router: RouterContract): Record<string, string> {
  const rootRoutes = router.toJSON()?.['root'] ?? []

  return rootRoutes.reduce<Record<string, string>>((routes, route) => {
    const routeIdentifier = getRouteIdentifier(route)

    if (routeIdentifier) {
      routes[routeIdentifier] = route.pattern
    }

    return routes
  }, {})
}
