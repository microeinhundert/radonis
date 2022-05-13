/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export { getManifestOrFail, isClient, isProduction, isServer } from './environment'
export { definePlugin, PluginsManager } from './PluginsManager'
export { invariant, separateArray } from './utils'

/**
 * Types
 */
export type {
  AssetsManifest,
  AssetsManifestEntry,
  BuildManifest,
  BuildManifestEntry,
  FlashMessage,
  Globals,
  Manifest,
  Plugin,
  PluginEnvironment,
  PluginHook,
  PluginHooks,
  PluginHookWithBuilder,
  Props,
  PropsHash,
  Route,
} from './types'
