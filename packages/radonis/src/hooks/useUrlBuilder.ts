import { useMemo } from 'react';

import { UrlBuilder } from '../internal/UrlBuilder';
import { useHydration } from './useHydration';
import { useRoutes } from './useRoutes';

export const useUrlBuilder = () => {
  const routes = useRoutes();
  const hydration = useHydration();

  return useMemo(() => new UrlBuilder(routes, !!hydration.root), [routes, hydration]);
};
