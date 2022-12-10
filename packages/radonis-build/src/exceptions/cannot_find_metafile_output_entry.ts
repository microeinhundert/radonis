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
export class CannotFindMetafileOutputEntryException extends RadonisException {
  constructor(filePath: string) {
    super(
      `Cannot find the metafile output entry for path "${filePath}". Make sure the latest client build was successful`,
      {
        status: 500,
        code: 'E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY',
      }
    )
  }
}
