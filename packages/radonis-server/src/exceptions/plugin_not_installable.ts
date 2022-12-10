/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from '@microeinhundert/radonis-shared'

/**
 * @internal
 */
export class PluginNotInstallableException extends RadonisException {
  constructor(pluginName: string, environment: string) {
    super(`The plugin "${pluginName}" is not installable in the "${environment}" environment`, {
      status: 500,
      code: 'E_PLUGIN_NOT_INSTALLABLE',
    })
  }
}
