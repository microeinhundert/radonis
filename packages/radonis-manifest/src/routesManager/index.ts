/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ResetBetweenRequests, RouteIdentifier, Routes } from '@microeinhundert/radonis-types'

/**
 * @internal
 */
export class RoutesManager implements ResetBetweenRequests {
  /**
   * The singleton instance
   */
  static instance?: RoutesManager

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(): RoutesManager {
    return (RoutesManager.instance = RoutesManager.instance ?? new RoutesManager())
  }

  /**
   * The routes
   */
  #routes: Routes

  /**
   * The routes required for hydration
   */
  #routesRequiredForHydration: Set<RouteIdentifier>

  /**
   * Constructor
   */
  constructor() {
    this.#routes = {}
    this.#routesRequiredForHydration = new Set()
  }

  /**
   * Set the routes
   */
  setRoutes(routes: Routes): void {
    this.#routes = routes
  }

  /**
   * Get the routes
   */
  getRoutes(all?: boolean): Routes {
    if (all) {
      return this.#routes
    }

    const routes = {} as Routes

    for (const identifier of this.#routesRequiredForHydration) {
      if (identifier in this.#routes) {
        routes[identifier] = this.#routes[identifier]
      }
    }

    return routes
  }

  /**
   * Require a route for hydration
   */
  requireRouteForHydration(identifier: '*' | RouteIdentifier): void {
    if (identifier === '*') {
      /**
       * Require all routes
       */
      this.#routesRequiredForHydration = new Set(Object.keys(this.#routes))
    } else if (identifier in this.#routes) {
      this.#routesRequiredForHydration.add(identifier)
    }
  }

  /**
   * Reset for a new request
   */
  resetForNewRequest(): void {
    this.#routesRequiredForHydration.clear()
  }
}
