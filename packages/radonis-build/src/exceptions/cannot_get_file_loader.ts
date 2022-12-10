/*
 * @microeinhundert/radonis-build
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
export class CannotGetFileLoaderException extends RadonisException {
  constructor(filePath: string) {
    super(
      `Cannot get a loader for the file at "${filePath}". This most likely means the file type you imported is currently not supported by Radonis. You can add support for this file type yourself by overriding the esbuild configuration from inside the Radonis config file`,
      {
        status: 500,
        code: 'E_CANNOT_GET_FILE_LOADER',
      }
    )
  }
}
