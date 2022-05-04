/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Plugin } from './PluginsManager/types'

export function definePlugin(plugin: Plugin): Plugin {
  return plugin
}

export { getManifestOrFail, isClient, isProduction, isServer } from './environment'
export { invariant } from './invariant'
export { PluginsManager } from './PluginsManager'
export type { Plugin }
