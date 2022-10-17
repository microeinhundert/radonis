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

import {
  E_MISSING_HOST_HEADER,
  E_REQUEST_FAILED,
} from '../../exceptions.json'

/**
 * Exceptions related to querying
 * @internal
 */
export class QueryException extends Exception {
  static missingHostHeader() {
    const error = new this(
      E_MISSING_HOST_HEADER.message,
      E_MISSING_HOST_HEADER.status,
      E_MISSING_HOST_HEADER.code
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
