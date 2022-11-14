/*
 * @microeinhundert/radonis-build
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
  E_CANNOT_BUILD,
  E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY,
  E_CANNOT_GET_FILE_LOADER,
  E_DUPLICATE_BUILD_MANIFEST_ENTRY,
} from "../../exceptions.json";

/**
 * Exceptions related to building
 * @internal
 */
export class BuildException extends RadonisException {
  static cannotBuild(message: string) {
    const error = new this(
      interpolate(E_CANNOT_BUILD.message, { message }),
      E_CANNOT_BUILD.status,
      E_CANNOT_BUILD.code
    );

    throw error;
  }
  static cannotFindMetafileOutputEntry(filePath: string) {
    const error = new this(
      interpolate(
        E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY.message,
        { filePath }
      ),
      E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY.status,
      E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY.code
    );

    throw error;
  }
  static duplicateBuildManifestEntry(fileName: string) {
    const error = new this(
      interpolate(
        E_DUPLICATE_BUILD_MANIFEST_ENTRY.message,
        { fileName }
      ),
      E_DUPLICATE_BUILD_MANIFEST_ENTRY.status,
      E_DUPLICATE_BUILD_MANIFEST_ENTRY.code
    );

    throw error;
  }
  static cannotGetFileLoader(filePath: string) {
    const error = new this(
      interpolate(E_CANNOT_GET_FILE_LOADER.message, {
        filePath,
      }),
      E_CANNOT_GET_FILE_LOADER.status,
      E_CANNOT_GET_FILE_LOADER.code
    );

    throw error;
  }
}
