import { hydrate } from './hydrate';
import { getManifestOrFail } from './internal/utils/environment';

export const initClient = () => {
  getManifestOrFail();

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
