import { UrlBuilder } from '../internal/UrlBuilder';
import { useRoutes } from './useRoutes';

export const useUrlBuilder = () => {
  const routes = useRoutes();

  return new UrlBuilder(routes);
};
