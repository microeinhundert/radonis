/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class RoutesManager {
  /**
   * The singleton instance
   */
  private static instance: RoutesManager

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
    if (RoutesManager.instance) {
      return RoutesManager.instance
    }

    RoutesManager.instance = this
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
      if (identifier in this.routes) {
        routes[identifier] = this.routes[identifier]
      }
    }

    return routes
  }

  /**
   * Require a route for hydration
   */
  public requireRouteForHydration(identifier: string): void {
    if (!(identifier in this.routes)) return
    this.routesRequiredForHydration.add(identifier)
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.routesRequiredForHydration.clear()
  }
}
