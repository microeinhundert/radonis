/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_MISSING_CLIENT_ENTRY_FILE } from "../../exceptions.json";

/**
 * @internal
 */
export class MissingClientEntryFileException extends RadonisException {
  constructor(path: string) {
    super(
      interpolate(E_MISSING_CLIENT_ENTRY_FILE.message, {
        path,
      }),
      E_MISSING_CLIENT_ENTRY_FILE.status,
      E_MISSING_CLIENT_ENTRY_FILE.code
    );
  }
}
