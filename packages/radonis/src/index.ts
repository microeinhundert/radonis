import { setup } from 'twind'

import { hydrate } from './internal/hydrate'
import { twindConfig } from './twind'

export function initClient() {
  setup(twindConfig)

  return {
    hydrate,
  }
}

export { hydrationContext, HydrationContextProvider } from './contexts/hydrationContext'
export { useFlashMessages } from './hooks/useFlashMessages'
export { useHydrated } from './hooks/useHydrated'
export { useHydration } from './hooks/useHydration'
export { useI18n } from './hooks/useI18n'
export { useManifest } from './hooks/useManifest'
export { useRoute } from './hooks/useRoute'
export { useRoutes } from './hooks/useRoutes'
export { useUrlBuilder } from './hooks/useUrlBuilder'
export * from './twind'
