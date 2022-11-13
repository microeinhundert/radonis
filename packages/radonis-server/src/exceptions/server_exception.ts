/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  interpolate,
  RadonisException,
} from "@microeinhundert/radonis-shared";

import {
  E_CANNOT_SERIALIZE_MANIFEST,
  E_MISSING_CLIENT_ENTRY_FILE,
  E_MISSING_COMPONENTS_DIRECTORY,
} from "../../exceptions.json";

/**
 * Exceptions related to the server
 * @internal
 */
export class ServerException extends RadonisException {
  static missingClientEntryFile(path: string) {
    const error = new this(
      interpolate(E_MISSING_CLIENT_ENTRY_FILE.message, {
        path,
      }),
      E_MISSING_CLIENT_ENTRY_FILE.status,
      E_MISSING_CLIENT_ENTRY_FILE.code
    );

    throw error;
  }
  static missingComponentsDirectory(path: string) {
    const error = new this(
      interpolate(E_MISSING_COMPONENTS_DIRECTORY.message, {
        path,
      }),
      E_MISSING_COMPONENTS_DIRECTORY.status,
      E_MISSING_COMPONENTS_DIRECTORY.code
    );

    throw error;
  }
  static cannotSerializeManifest() {
    const error = new this(
      E_CANNOT_SERIALIZE_MANIFEST.message,
      E_CANNOT_SERIALIZE_MANIFEST.status,
      E_CANNOT_SERIALIZE_MANIFEST.code
    );

    throw error;
  }
}
