/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteNode } from '@ioc:Adonis/Core/Route'

/**
 * Get the route identifier
 */
export function getRouteIdentifier(routeNode: RouteNode | undefined): string | undefined {
  return routeNode?.name ?? (typeof routeNode?.handler === 'string' ? routeNode.handler : undefined)
}
