/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from "@microeinhundert/radonis-shared";

import { E_MISSING_MANIFEST } from "../../exceptions.json";

/**
 * @internal
 */
export class MissingManifestException extends RadonisException {
  constructor() {
    super(E_MISSING_MANIFEST.message, E_MISSING_MANIFEST.status, E_MISSING_MANIFEST.code);
  }
}
