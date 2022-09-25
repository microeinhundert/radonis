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
  E_CANNOT_COMBINE_RELOAD_WITH_HOOKS,
  E_CANNOT_FETCH_WITHOUT_HYDRATION,
  E_REQUEST_FAILED,
} from '../../exceptions.json'

/**
 * Exceptions related to forms
 * @internal
 */
export class FormException extends Exception {
  static cannotCombineReloadWithHooks() {
    const error = new this(
      E_CANNOT_COMBINE_RELOAD_WITH_HOOKS.message,
      E_CANNOT_COMBINE_RELOAD_WITH_HOOKS.status,
      E_CANNOT_COMBINE_RELOAD_WITH_HOOKS.code
    )

    error.help =
      E_CANNOT_COMBINE_RELOAD_WITH_HOOKS.help.join('\n')

    throw error
  }
  static cannotFetchWithoutHydration() {
    const error = new this(
      E_CANNOT_FETCH_WITHOUT_HYDRATION.message,
      E_CANNOT_FETCH_WITHOUT_HYDRATION.status,
      E_CANNOT_FETCH_WITHOUT_HYDRATION.code
    )

    error.help =
      E_CANNOT_FETCH_WITHOUT_HYDRATION.help.join('\n')

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
