import { UrlBuilder } from '../internal/UrlBuilder';
import { useHydration } from './useHydration';
import { useRoutes } from './useRoutes';

export const useUrlBuilder = () => {
  const routes = useRoutes();
  const { isChildOfHydrationRoot } = useHydration();

  return new UrlBuilder(routes, isChildOfHydrationRoot);
};
