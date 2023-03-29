/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CANNOT_SERIALIZE_MANIFEST = createError(
  'The Radonis manifest cannot be serialized. Make sure you only pass data to islands that can be serialized by superjson',
  'E_CANNOT_SERIALIZE_MANIFEST',
  500
)

export const E_CONFLICTING_PLUGINS = createError<[plugin: string, conflictingPlugins: string]>(
  'The plugin "%s" conflicts with the following installed plugins: %s',
  'E_CONFLICTING_PLUGINS',
  500
)

export const E_PLUGIN_ALREADY_INSTALLED = createError<[plugin: string]>(
  'The plugin "%s" is already installed',
  'E_PLUGIN_ALREADY_INSTALLED',
  500
)

export const E_PLUGIN_NOT_INSTALLABLE = createError<[plugin: string, environment: string]>(
  'The plugin "%s" is not installable in the "%s" environment',
  'E_PLUGIN_NOT_INSTALLABLE',
  500
)
