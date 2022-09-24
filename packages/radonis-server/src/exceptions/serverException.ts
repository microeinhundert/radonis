/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception, interpolate } from '@microeinhundert/radonis-shared'

import {
  E_CANNOT_NEST_HYDRATION_ROOT,
  E_MISSING_CLIENT_ENTRY_FILE,
  E_MISSING_COMPONENTS_DIRECTORY,
} from '../../exceptions.json'

/**
 * Exceptions related to the server
 */
export class ServerException extends Exception {
  static missingClientEntryFile(path: string) {
    const error = new this(
      interpolate(E_MISSING_CLIENT_ENTRY_FILE.message, { path }),
      E_MISSING_CLIENT_ENTRY_FILE.status,
      E_MISSING_CLIENT_ENTRY_FILE.code
    )

    throw error
  }
  static missingComponentsDirectory(path: string) {
    const error = new this(
      interpolate(E_MISSING_COMPONENTS_DIRECTORY.message, { path }),
      E_MISSING_COMPONENTS_DIRECTORY.status,
      E_MISSING_COMPONENTS_DIRECTORY.code
    )

    throw error
  }
  static cannotNestHydrationRoot(
    hydrationRootIdentifier: string,
    componentIdentifier: string,
    parentHydrationRootIdentifier: string,
    parentComponentIdentifier: string
  ) {
    const error = new this(
      interpolate(E_CANNOT_NEST_HYDRATION_ROOT.message, {
        hydrationRootIdentifier,
        componentIdentifier,
        parentHydrationRootIdentifier,
        parentComponentIdentifier,
      }),
      E_CANNOT_NEST_HYDRATION_ROOT.status,
      E_CANNOT_NEST_HYDRATION_ROOT.code
    )

    error.help = E_CANNOT_NEST_HYDRATION_ROOT.help.join('\n')

    throw error
  }
}
