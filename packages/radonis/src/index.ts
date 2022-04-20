/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export { initClient } from './initClient'
export {
  useFlashMessages,
  useI18n,
  useManifest,
  useRoute,
  useRoutes,
  useUrlBuilder,
} from '@microeinhundert/radonis-hooks'
export { useHydrated, useHydration } from '@microeinhundert/radonis-hydrate'
export { useTwind } from '@microeinhundert/radonis-twind'

/**
 * This must be exported from the main package in order for esbuild
 * to pick up the package when bundling the components for the client.
 */
export { hydrate as __internal__hydrate } from '@microeinhundert/radonis-hydrate'
