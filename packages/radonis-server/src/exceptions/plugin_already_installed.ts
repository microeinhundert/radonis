/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_PLUGIN_ALREADY_INSTALLED } from "../../exceptions.json";

/**
 * @internal
 */
export class PluginAlreadyInstalledException extends RadonisException {
  constructor(pluginName: string) {
    super(
      interpolate(E_PLUGIN_ALREADY_INSTALLED.message, {
        pluginName,
      }),
      E_PLUGIN_ALREADY_INSTALLED.status,
      E_PLUGIN_ALREADY_INSTALLED.code
    );
  }
}
