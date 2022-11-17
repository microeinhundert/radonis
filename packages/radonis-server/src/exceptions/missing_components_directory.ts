/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_MISSING_COMPONENTS_DIRECTORY } from "../../exceptions.json";

/**
 * @internal
 */
export class MissingComponentsDirectoryException extends RadonisException {
  constructor(path: string) {
    super(
      interpolate(E_MISSING_COMPONENTS_DIRECTORY.message, {
        path,
      }),
      E_MISSING_COMPONENTS_DIRECTORY.status,
      E_MISSING_COMPONENTS_DIRECTORY.code
    );
  }
}
