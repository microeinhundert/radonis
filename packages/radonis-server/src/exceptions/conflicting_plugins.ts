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
export class ConflictingPluginsException extends RadonisException {
  constructor(pluginName: string, conflictingPlugins: string[]) {
    super(
      `The plugin "${pluginName}" conflicts with the following installed plugins: ${conflictingPlugins.join(', ')}`,
      {
        status: 500,
        code: 'E_CONFLICTING_PLUGINS',
      }
    )
  }
}
