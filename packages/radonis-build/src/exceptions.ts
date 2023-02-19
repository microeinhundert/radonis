/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CANNOT_BUILD_CLIENT = createError<[message: string]>(
  'Cannot build the Radonis client bundle: %s',
  'E_CANNOT_BUILD_CLIENT',
  500
)

export const E_CANNOT_GET_FILE_LOADER = createError<[path: string]>(
  'Cannot get a loader for the file at "%s". This most likely means that the file type you are importing is not currently supported by Radonis. You can add support for this file type yourself by overriding the esbuild configuration in the Radonis config file',
  'E_CANNOT_GET_FILE_LOADER',
  500
)

export const E_CANNOT_FIND_OUTPUT = createError<[key: string]>(
  'Cannot find the output for asset "%s". This is most likely a bug of Radonis',
  'E_CANNOT_FIND_OUTPUT',
  500
)
