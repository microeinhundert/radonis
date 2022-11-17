/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_PLUGIN_NOT_INSTALLABLE } from "../../exceptions.json";

/**
 * @internal
 */
export class PluginNotInstallableException extends RadonisException {
  constructor(pluginName: string, environment: string) {
    super(
      interpolate(E_PLUGIN_NOT_INSTALLABLE.message, {
        pluginName,
        environment,
      }),
      E_PLUGIN_NOT_INSTALLABLE.status,
      E_PLUGIN_NOT_INSTALLABLE.code
    );
  }
}
