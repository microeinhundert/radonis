/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class RoutesManager implements Radonis.RoutesManagerContract {
  /**
   * The routes
   */
  private routes: Record<string, any> = {}

  /**
   * The routes required for hydration
   */
  private routesRequiredForHydration: Set<string> = new Set()

  /**
   * Constructor
   */
  constructor() {
    /**
     * Setting on the global scope is required in order for the client package
     * to be able to access this class without having a dependency to the server package
     */
    globalThis.rad_routesManager = this
  }

  /**
   * Set the routes
   */
  public setRoutes(routes: Record<string, any>): void {
    this.routes = routes
  }

  /**
   * Get the routes
   */
  public getRoutes(all?: boolean): Record<string, any> {
    if (all) {
      return this.routes
    }

    const routes = {} as Record<string, any>

    for (const identifier of this.routesRequiredForHydration) {
      if (this.routes[identifier]) {
        routes[identifier] = this.routes[identifier]
      }
    }

    return routes
  }

  /**
   * Require a route for hydration
   */
  public requireRouteForHydration(identifier: string): void {
    if (!this.routes[identifier]) return
    this.routesRequiredForHydration.add(identifier)
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.routesRequiredForHydration.clear()
  }
}
