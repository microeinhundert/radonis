/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Plugin } from "@microeinhundert/radonis-types";

/**
 * Helper to define plugins in a type-safe manner
 */
export function definePlugin(plugin: Plugin): Plugin {
  return plugin;
}
