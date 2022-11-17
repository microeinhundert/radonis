/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY } from "../../exceptions.json";

/**
 * @internal
 */
export class CannotFindMetafileOutputEntryException extends RadonisException {
  constructor(filePath: string) {
    super(
      interpolate(E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY.message, { filePath }),
      E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY.status,
      E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY.code
    );
  }
}
