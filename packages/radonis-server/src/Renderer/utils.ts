import type { RouteNode } from '@ioc:Adonis/Core/Route'
import type { Route } from '@microeinhundert/radonis-types'

/**
 * Transform a RouteNode to the shape expected by the manifest
 */
export function transformRoute(routeNode?: RouteNode): Route {
  return {
    name: routeNode?.name,
    pattern: routeNode?.pattern,
  }
}
