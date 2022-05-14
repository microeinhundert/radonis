/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export { initClient, registerComponentForHydration } from './client'
export {
  useFlashMessages,
  useI18n,
  useManifest,
  useRoute,
  useRoutes,
  useUrlBuilder,
} from '@microeinhundert/radonis-hooks'
export { useHydrated, useHydration } from '@microeinhundert/radonis-hydrate'
export { definePlugin } from '@microeinhundert/radonis-shared'
export type {
  FlashMessageIdentifier,
  HydratableComponentName,
  MessageIdentifier,
  Plugin,
  RouteIdentifier,
} from '@microeinhundert/radonis-types'
