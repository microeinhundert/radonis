/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_GET_FILE_LOADER } from "../../exceptions.json";

/**
 * @internal
 */
export class CannotGetFileLoaderException extends RadonisException {
  constructor(filePath: string) {
    super(
      interpolate(E_CANNOT_GET_FILE_LOADER.message, {
        filePath,
      }),
      E_CANNOT_GET_FILE_LOADER.status,
      E_CANNOT_GET_FILE_LOADER.code
    );
  }
}
