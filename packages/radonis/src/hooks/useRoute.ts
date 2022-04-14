import { useHydration } from './useHydration';
import { useManifest } from './useManifest';

export const useRoute = () => {
  const { route, routes } = useManifest();
  const hydration = useHydration();

  return {
    current: route,
    isCurrent(identifier: string, exact?: boolean): boolean {
      if (exact) {
        return route?.name === identifier;
      }

      if (routes[identifier]) {
        if (hydration.root) {
          globalThis.rad_routesManager?.requireRouteForHydration(identifier);
        }
        return !!route?.pattern?.startsWith(routes[identifier]);
      }

      return false;
    },
  };
};
