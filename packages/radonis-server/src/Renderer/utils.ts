/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteNode } from '@ioc:Adonis/Core/Route'
import type { Route } from '@microeinhundert/radonis-types'

/**
 * Transform a RouteNode to the shape expected by the manifest
 * @internal
 */
export function transformRouteNode(routeNode?: RouteNode): Route {
  return {
    identifier: routeNode?.name,
    pattern: routeNode?.pattern,
  }
}
