/*
 * @microeinhundert/radonis-form
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
  E_CANNOT_FETCH_WITHOUT_HYDRATION,
  E_CANNOT_USE_HOOKS_WHEN_RELOADING,
  E_REQUEST_FAILED,
} from '../../exceptions.json'

/**
 * Exceptions related to forms
 * @internal
 */
export class FormException extends Exception {
  static cannotUseHooksWhenReloading(formAction: string) {
    const error = new this(
      interpolate(
        E_CANNOT_USE_HOOKS_WHEN_RELOADING.message,
        { formAction }
      ),
      E_CANNOT_USE_HOOKS_WHEN_RELOADING.status,
      E_CANNOT_USE_HOOKS_WHEN_RELOADING.code
    )

    throw error
  }
  static cannotFetchWithoutHydration(formAction: string) {
    const error = new this(
      interpolate(
        E_CANNOT_FETCH_WITHOUT_HYDRATION.message,
        { formAction }
      ),
      E_CANNOT_FETCH_WITHOUT_HYDRATION.status,
      E_CANNOT_FETCH_WITHOUT_HYDRATION.code
    )

    throw error
  }
  static requestFailed(
    routeIdentifier: string,
    status: number
  ) {
    const error = new this(
      interpolate(E_REQUEST_FAILED.message, {
        routeIdentifier,
      }),
      status || E_REQUEST_FAILED.status,
      E_REQUEST_FAILED.code
    )

    throw error
  }
}
