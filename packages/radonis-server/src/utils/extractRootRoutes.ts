/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouterContract } from '@ioc:Adonis/Core/Route'

/**
 * Extract the root routes
 * @internal
 */
export function extractRootRoutes(router: RouterContract): Record<string, any> {
  const rootRoutes = router.toJSON()?.['root'] ?? []

  return rootRoutes.reduce<Record<string, any>>((routes, route) => {
    if (route.name) {
      routes[route.name] = route.pattern
    } else if (typeof route.handler === 'string') {
      routes[route.handler] = route.pattern
    }

    return routes
  }, {})
}
