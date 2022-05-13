/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { RouterContract } from '@ioc:Adonis/Core/Route'
import type { Route } from '@microeinhundert/radonis-types'

/**
 * Extract the root routes from a Router instance
 */
export function extractRootRoutes(Router: RouterContract): Record<string, any> {
  const rootRoutes = Router.toJSON()?.['root'] ?? []

  return rootRoutes.reduce<Record<string, any>>((routes, route) => {
    if (route.name) {
      routes[route.name] = route.pattern
    } else if (typeof route.handler === 'string') {
      routes[route.handler] = route.pattern
    }

    return routes
  }, {})
}

/**
 * Transform a RouteNode to the shape expected by the manifest
 */
export function transformRoute(route: HttpContextContract['route']): Route {
  return {
    name: route?.name,
    pattern: route?.pattern,
  }
}
