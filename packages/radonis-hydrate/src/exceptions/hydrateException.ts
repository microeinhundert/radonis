/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  Exception,
  interpolate,
} from '@microeinhundert/radonis-shared'

import {
  E_CANNOT_HYDRATE,
  E_COMPONENT_ALREADY_REGISTERED,
  E_MANIFEST_UNAVAILABLE,
  E_MISSING_HYDRATION_DATA,
} from '../../exceptions.json'

/**
 * Exceptions related to hydration
 * @internal
 */
export class HydrateException extends Exception {
  static missingHydrationData() {
    const error = new this(
      E_MISSING_HYDRATION_DATA.message,
      E_MISSING_HYDRATION_DATA.status,
      E_MISSING_HYDRATION_DATA.code
    )

    error.help = E_MISSING_HYDRATION_DATA.help.join('\n')

    throw error
  }
  static cannotHydrate(
    componentIdentifier: string,
    hydrationRootIdentifier: string
  ) {
    const error = new this(
      interpolate(E_CANNOT_HYDRATE.message, {
        componentIdentifier,
        hydrationRootIdentifier,
      }),
      E_CANNOT_HYDRATE.status,
      E_CANNOT_HYDRATE.code
    )

    error.help = E_CANNOT_HYDRATE.help.join('\n')

    throw error
  }
  static componentAlreadyRegistered(
    componentIdentifier: string
  ) {
    const error = new this(
      interpolate(E_COMPONENT_ALREADY_REGISTERED.message, {
        componentIdentifier,
      }),
      E_COMPONENT_ALREADY_REGISTERED.status,
      E_COMPONENT_ALREADY_REGISTERED.code
    )

    error.help =
      E_COMPONENT_ALREADY_REGISTERED.help.join('\n')

    throw error
  }
  static manifestUnavailable() {
    const error = new this(
      E_MANIFEST_UNAVAILABLE.message,
      E_MANIFEST_UNAVAILABLE.status,
      E_MANIFEST_UNAVAILABLE.code
    )

    error.help = E_MANIFEST_UNAVAILABLE.help.join('\n')

    throw error
  }
}
