/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_DUPLICATE_BUILD_MANIFEST_ENTRY } from "../../exceptions.json";

/**
 * @internal
 */
export class DuplicateBuildManifestEntryException extends RadonisException {
  constructor(entryName: string) {
    super(
      interpolate(E_DUPLICATE_BUILD_MANIFEST_ENTRY.message, { entryName }),
      E_DUPLICATE_BUILD_MANIFEST_ENTRY.status,
      E_DUPLICATE_BUILD_MANIFEST_ENTRY.code
    );
  }
}
