import { useManifest } from './useManifest';

export const useRoutes = () => {
  const { routes } = useManifest();

  return routes;
};
