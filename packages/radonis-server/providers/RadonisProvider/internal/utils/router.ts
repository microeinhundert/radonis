import type { RouterContract } from '@ioc:Adonis/Core/Route';

export function extractRoutesFromRouter(Router: RouterContract): Record<string, any> {
  const rootRoutes = Router.toJSON()['root'];

  return rootRoutes.reduce<Record<string, any>>((routes, route) => {
    if (route.name) {
      routes[route.name] = route.pattern;
    } else if (typeof route.handler === 'string') {
      routes[route.handler] = route.pattern;
    }

    return routes;
  }, {});
}
