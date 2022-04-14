import { useManifest } from './useManifest';

export function useRoutes() {
  const { routes } = useManifest();

  return routes;
}
