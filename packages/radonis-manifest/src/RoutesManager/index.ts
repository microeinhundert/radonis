/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteIdentifier, Routes, UniqueBetweenRequests } from '@microeinhundert/radonis-types'

/**
 * @internal
 */
export class RoutesManager implements UniqueBetweenRequests {
  /**
   * The singleton instance
   */
  private static instance?: RoutesManager

  /**
   * The routes
   */
  private routes: Routes = {}

  /**
   * The routes required for hydration
   */
  private routesRequiredForHydration: Set<RouteIdentifier> = new Set()

  /**
   * Set the routes
   */
  public setRoutes(routes: Routes): void {
    this.routes = routes
  }

  /**
   * Get the routes
   */
  public getRoutes(all?: boolean): Routes {
    if (all) {
      return this.routes
    }

    const routes = {} as Routes

    for (const identifier of this.routesRequiredForHydration) {
      if (identifier in this.routes) {
        routes[identifier] = this.routes[identifier]
      }
    }

    return routes
  }

  /**
   * Require a route for hydration
   */
  public requireRouteForHydration(identifier: '*' | RouteIdentifier): void {
    if (identifier === '*') {
      /**
       * Require all routes
       */
      this.routesRequiredForHydration = new Set(Object.keys(this.routes))
    } else if (identifier in this.routes) {
      this.routesRequiredForHydration.add(identifier)
    }
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.routesRequiredForHydration.clear()
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): RoutesManager {
    return (RoutesManager.instance = RoutesManager.instance ?? new RoutesManager())
  }
}
