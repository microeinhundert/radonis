import { hydrate } from './hydrate';

export const initClient = () => {
  return {
    hydrate,
  };
};

export { hydrationContext, HydrationContextProvider } from './contexts/hydrationContext';
export { useHydration } from './hooks/useHydration';
export { useI18n } from './hooks/useI18n';
export { useRoute } from './hooks/useRoute';
export { useRoutes } from './hooks/useRoutes';
export { useUrlBuilder } from './hooks/useUrlBuilder';
