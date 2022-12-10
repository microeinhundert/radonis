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
export class DuplicateBuildManifestEntryException extends RadonisException {
  constructor(entryName: string) {
    super(
      `A build manifest entry for "${entryName}" already exists. Make sure to not use the same name for multiple components, regardless of which directory they are in`,
      {
        status: 500,
        code: 'E_DUPLICATE_BUILD_MANIFEST_ENTRY',
      }
    )
  }
}
