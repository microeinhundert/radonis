import { useManifest } from '../internal/hooks/useManifest';

export const useRoutes = () => {
  const { routes } = useManifest();

  return routes;
};
