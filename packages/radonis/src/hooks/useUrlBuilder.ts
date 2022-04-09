import { UrlBuilder } from '../internal/UrlBuilder';
import { useHydration } from './useHydration';
import { useRoutes } from './useRoutes';

export const useUrlBuilder = () => {
  const routes = useRoutes();
  const { isInsideHydrationRoot } = useHydration();

  return new UrlBuilder(routes, isInsideHydrationRoot);
};
