/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CONFLICTING_PLUGINS = createError<[plugin: string, conflictingPlugins: string]>(
  'The plugin "%s" conflicts with the following installed plugins: %s',
  'E_CONFLICTING_PLUGINS',
  500
)
