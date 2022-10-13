/*
 * @microeinhundert/radonis-query
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

import { E_REQUEST_FAILED } from '../../exceptions.json'

/**
 * Exceptions related to querying
 * @internal
 */
export class QueryException extends Exception {
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
