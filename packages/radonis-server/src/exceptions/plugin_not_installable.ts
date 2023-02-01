/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_PLUGIN_NOT_INSTALLABLE = createError<[plugin: string, environment: string]>(
  'The plugin "%s" is not installable in the "%s" environment',
  'E_PLUGIN_NOT_INSTALLABLE',
  500
)
