/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

/**
 * @internal
 */
export const E_CANNOT_GET_FILE_LOADER = createError<[path: string]>(
  'Cannot get a loader for the file at "%s". This most likely means that the file type you are importing is not currently supported by Radonis. You can add support for this file type yourself by overriding the esbuild configuration in the Radonis config file',
  'E_CANNOT_GET_FILE_LOADER',
  500
)
