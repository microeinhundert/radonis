/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  E_CANNOT_FIND_ROUTE,
  E_MISSING_ROUTE_PARAM,
  E_WILDCARD_ROUTES_NOT_SUPPORTED,
} from '../../exceptions.json'
import { Exception } from '../utils/exception'
import { interpolate } from '../utils/interpolate'

/**
 * Exceptions related to the URL builder
 * @internal
 */
export class UrlBuilderException extends Exception {
  static cannotFindRoute(identifier: string) {
    const error = new this(
      interpolate(E_CANNOT_FIND_ROUTE.message, {
        identifier,
      }),
      E_CANNOT_FIND_ROUTE.status,
      E_CANNOT_FIND_ROUTE.code
    )

    throw error
  }
  static missingRouteParam(
    paramName: string,
    pattern: string
  ) {
    const error = new this(
      interpolate(E_MISSING_ROUTE_PARAM.message, {
        paramName,
        pattern,
      }),
      E_MISSING_ROUTE_PARAM.status,
      E_MISSING_ROUTE_PARAM.code
    )

    throw error
  }
  static wildcardRoutesNotSupported() {
    const error = new this(
      E_WILDCARD_ROUTES_NOT_SUPPORTED.message,
      E_WILDCARD_ROUTES_NOT_SUPPORTED.status,
      E_WILDCARD_ROUTES_NOT_SUPPORTED.code
    )

    throw error
  }
}
