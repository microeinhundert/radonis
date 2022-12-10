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
export class PluginAlreadyInstalledException extends RadonisException {
  constructor(pluginName: string) {
    super(`The plugin "${pluginName}" is already installed`, {
      status: 500,
      code: 'E_PLUGIN_ALREADY_INSTALLED',
    })
  }
}
