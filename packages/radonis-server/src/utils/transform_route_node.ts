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

import { getRouteIdentifier } from './get_route_identifier'

/**
 * Transform a RouteNode to match the shape expected by the manifest
 */
export function transformRouteNode(routeNode: RouteNode): Route {
  return {
    identifier: getRouteIdentifier(routeNode),
    pattern: routeNode.pattern,
    params: {},
    searchParams: {},
  }
}
