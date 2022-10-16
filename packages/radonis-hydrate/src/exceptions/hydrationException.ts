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
  E_CANNOT_HYDRATE_WITH_CHILDREN,
  E_COMPONENT_ALREADY_REGISTERED,
  E_MISSING_HYDRATION_DATA,
  E_MISSING_MANIFEST,
  E_NOT_HYDRATABLE,
} from '../../exceptions.json'

/**
 * Exceptions related to hydration
 * @internal
 */
export class HydrationException extends Exception {
  static notHydratable(hydrationRootId: string) {
    const error = new this(
      interpolate(E_NOT_HYDRATABLE.message, {
        hydrationRootId,
      }),
      E_NOT_HYDRATABLE.status,
      E_NOT_HYDRATABLE.code
    )

    throw error
  }
  static cannotHydrateWithChildren(
    hydrationRootId: string,
    componentIdentifier: string
  ) {
    const error = new this(
      interpolate(E_CANNOT_HYDRATE_WITH_CHILDREN.message, {
        hydrationRootId,
        componentIdentifier,
      }),
      E_CANNOT_HYDRATE_WITH_CHILDREN.status,
      E_CANNOT_HYDRATE_WITH_CHILDREN.code
    )

    throw error
  }
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
    hydrationRootId: string,
    componentIdentifier: string
  ) {
    const error = new this(
      interpolate(E_CANNOT_HYDRATE.message, {
        hydrationRootId,
        componentIdentifier,
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
  static missingManifest() {
    const error = new this(
      E_MISSING_MANIFEST.message,
      E_MISSING_MANIFEST.status,
      E_MISSING_MANIFEST.code
    )

    throw error
  }
}
