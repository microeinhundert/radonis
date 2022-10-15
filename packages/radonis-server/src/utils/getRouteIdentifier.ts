/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteNode } from '@ioc:Adonis/Core/Route'
import type { RouteIdentifier } from '@microeinhundert/radonis-types'

/**
 * Get the route identifier
 * @internal
 */
export function getRouteIdentifier(routeNode: RouteNode | undefined): RouteIdentifier | undefined {
  return typeof routeNode?.handler === 'string' ? routeNode.handler : undefined
}
