/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_SERIALIZE_MANIFEST } from "../../exceptions.json";

/**
 * @internal
 */
export class CannotSerializeManifestException extends RadonisException {
  constructor() {
    super(E_CANNOT_SERIALIZE_MANIFEST.message, E_CANNOT_SERIALIZE_MANIFEST.status, E_CANNOT_SERIALIZE_MANIFEST.code);
  }
}
