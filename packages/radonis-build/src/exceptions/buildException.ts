/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception, interpolate } from '@microeinhundert/radonis-shared'

import {
  E_CANNOT_ANALYZE_SOURCE,
  E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY,
  E_CANNOT_GET_FILE_LOADER,
  E_DUPLICATE_BUILD_MANIFEST_ENTRY,
} from '../../exceptions.json'

/**
 * Exceptions related to building
 */
export class BuildException extends Exception {
  static cannotFindMetafileOutputEntry(filePath: string) {
    const error = new this(
      interpolate(E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY.message, { filePath }),
      E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY.status,
      E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY.code
    )

    error.help = E_CANNOT_FIND_METAFILE_OUTPUT_ENTRY.help.join('\n')

    throw error
  }
  static duplicateBuildManifestEntry(fileName: string) {
    const error = new this(
      interpolate(E_DUPLICATE_BUILD_MANIFEST_ENTRY.message, { fileName }),
      E_DUPLICATE_BUILD_MANIFEST_ENTRY.status,
      E_DUPLICATE_BUILD_MANIFEST_ENTRY.code
    )

    error.help = E_DUPLICATE_BUILD_MANIFEST_ENTRY.help.join('\n')

    throw error
  }
  static cannotGetFileLoader(filePath: string) {
    const error = new this(
      interpolate(E_CANNOT_GET_FILE_LOADER.message, { filePath }),
      E_CANNOT_GET_FILE_LOADER.status,
      E_CANNOT_GET_FILE_LOADER.code
    )

    error.help = E_CANNOT_GET_FILE_LOADER.help.join('\n')

    throw error
  }
  static cannotAnalyzeSource(filePath: string) {
    const error = new this(
      interpolate(E_CANNOT_ANALYZE_SOURCE.message, { filePath }),
      E_CANNOT_ANALYZE_SOURCE.status,
      E_CANNOT_ANALYZE_SOURCE.code
    )

    error.help = E_CANNOT_ANALYZE_SOURCE.help.join('\n')

    throw error
  }
}
