export class RoutesManager implements Radonis.RoutesManagerContract {
  /**
   * The routes
   */
  private routes: Record<string, any> = {};

  /**
   * The routes required for hydration
   */
  private routesRequiredForHydration: Set<string> = new Set();

  /**
   * Set the routes
   */
  public setRoutes(routes: Record<string, any>): void {
    this.routes = routes;
  }

  /**
   * Get the routes
   */
  public getRoutes(all?: boolean): Record<string, any> {
    if (all) {
      return this.routes;
    }

    const routes = {};

    for (const identifier of this.routesRequiredForHydration) {
      if (this.routes[identifier]) {
        routes[identifier] = this.routes[identifier];
      }
    }

    return routes;
  }

  /**
   * Require a route for hydration
   */
  public requireRouteForHydration(identifier: string): void {
    if (!this.routes[identifier]) return;
    this.routesRequiredForHydration.add(identifier);
  }

  /**
   * Get a fresh instance
   */
  public fresh(): this {
    this.routesRequiredForHydration.clear();

    return this;
  }

  /**
   * Construct a new RoutesManager
   */
  public static construct(): Radonis.RoutesManagerContract {
    return (globalThis.rad_routesManager =
      globalThis.rad_routesManager?.fresh() ?? new RoutesManager());
  }
}
