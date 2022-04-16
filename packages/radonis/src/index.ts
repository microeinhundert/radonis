/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { setup } from 'twind'

import { hydrate } from './internal/hydrate'
import { twindConfig } from './twindConfig'

export function initClient() {
  setup(twindConfig)

  return {
    hydrate,
  }
}

export { hydrationContext, HydrationContextProvider } from './contexts/hydrationContext'
export { twindContext, TwindContextProvider } from './contexts/twindContext'
export { useFlashMessages } from './hooks/useFlashMessages'
export { useHydrated } from './hooks/useHydrated'
export { useHydration } from './hooks/useHydration'
export { useI18n } from './hooks/useI18n'
export { useManifest } from './hooks/useManifest'
export { useRoute } from './hooks/useRoute'
export { useRoutes } from './hooks/useRoutes'
export { useTwind } from './hooks/useTwind'
export { useUrlBuilder } from './hooks/useUrlBuilder'
export { twindConfig }
