/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_PLUGIN_ALREADY_INSTALLED = createError<[plugin: string]>(
  'The plugin "%s" is already installed',
  'E_PLUGIN_ALREADY_INSTALLED',
  500
)
