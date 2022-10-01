/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  E_CONFLICTING_PLUGINS,
  E_PLUGIN_ALREADY_INSTALLED,
  E_PLUGIN_NOT_INSTALLABLE,
} from '../../exceptions.json'
import { Exception } from '../utils/exception'
import { interpolate } from '../utils/interpolate'

/**
 * Exceptions related to plugins
 * @internal
 */
export class PluginException extends Exception {
  static conflictingPlugins(
    pluginName: string,
    conflictingPlugins: string[]
  ) {
    const error = new this(
      interpolate(E_CONFLICTING_PLUGINS.message, {
        pluginName,
        conflictingPlugins: conflictingPlugins.join(', '),
      }),
      E_CONFLICTING_PLUGINS.status,
      E_CONFLICTING_PLUGINS.code
    )

    throw error
  }
  static pluginAlreadyInstalled(pluginName: string) {
    const error = new this(
      interpolate(E_PLUGIN_ALREADY_INSTALLED.message, {
        pluginName,
      }),
      E_PLUGIN_ALREADY_INSTALLED.status,
      E_PLUGIN_ALREADY_INSTALLED.code
    )

    throw error
  }
  static pluginNotInstallable(
    pluginName: string,
    environment: string
  ) {
    const error = new this(
      interpolate(E_PLUGIN_NOT_INSTALLABLE.message, {
        pluginName,
        environment,
      }),
      E_PLUGIN_NOT_INSTALLABLE.status,
      E_PLUGIN_NOT_INSTALLABLE.code
    )

    throw error
  }
}
