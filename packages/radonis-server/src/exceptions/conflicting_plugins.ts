/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_CONFLICTING_PLUGINS } from "../../exceptions.json";

/**
 * @internal
 */
export class ConflictingPluginsException extends RadonisException {
  constructor(pluginName: string, conflictingPlugins: string[]) {
    super(
      interpolate(E_CONFLICTING_PLUGINS.message, {
        pluginName,
        conflictingPlugins: conflictingPlugins.join(", "),
      }),
      E_CONFLICTING_PLUGINS.status,
      E_CONFLICTING_PLUGINS.code
    );
  }
}
