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
  static missingHydrationData(hydrationRootId: string) {
    const error = new this(
      interpolate(E_MISSING_HYDRATION_DATA.message, {
        hydrationRootId,
      }),
      E_MISSING_HYDRATION_DATA.status,
      E_MISSING_HYDRATION_DATA.code
    )

    throw error
  }
  static cannotHydrate(
    componentIdentifier: string,
    hydrationRootId: string
  ) {
    const error = new this(
      interpolate(E_CANNOT_HYDRATE.message, {
        componentIdentifier,
        hydrationRootId,
      }),
      E_CANNOT_HYDRATE.status,
      E_CANNOT_HYDRATE.code
    )

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

    throw error
  }
  static manifestUnavailable() {
    const error = new this(
      E_MANIFEST_UNAVAILABLE.message,
      E_MANIFEST_UNAVAILABLE.status,
      E_MANIFEST_UNAVAILABLE.code
    )

    throw error
  }
}
