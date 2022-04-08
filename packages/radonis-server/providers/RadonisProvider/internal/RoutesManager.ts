export class RoutesManager implements Radonis.RoutesManagerContract {
  /**
   * The routes
   */
  private routes: Record<string, any> = {};

  /**
   * The referenced routes
   */
  private referencedRoutes: Set<string> = new Set();

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

    const referencedRoutes = {};

    for (const identifier of this.referencedRoutes) {
      if (this.routes[identifier]) {
        referencedRoutes[identifier] = this.routes[identifier];
      }
    }

    return referencedRoutes;
  }

  /**
   * Mark a route as referenced
   */
  public markRouteAsReferenced(identifier: string): void {
    if (!this.routes[identifier]) return;
    this.referencedRoutes.add(identifier);
  }

  /**
   * Clear the referenced routes
   */
  public clearReferencedRoutes(): this {
    this.referencedRoutes.clear();

    return this;
  }

  /**
   * Construct a new RoutesManager
   */
  public static construct(): Radonis.RoutesManagerContract {
    return (globalThis.ars_routesManager =
      globalThis.ars_routesManager?.clearReferencedRoutes() ?? new RoutesManager());
  }
}
