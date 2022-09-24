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
  E_CANNOT_FIND_MESSAGE,
  E_CANNOT_FIND_ROUTE,
  E_MANIFEST_UNAVAILABLE,
  E_MISSING_ROUTE_PARAM,
  E_WILDCARD_ROUTES_NOT_SUPPORTED,
} from '../../exceptions.json'

/**
 * Exceptions related to hooks
 */
export class HookException extends Exception {
  static cannotFindMessage(identifier: string) {
    const error = new this(
      interpolate(E_CANNOT_FIND_MESSAGE.message, { identifier }),
      E_CANNOT_FIND_MESSAGE.status,
      E_CANNOT_FIND_MESSAGE.code
    )

    error.help = E_CANNOT_FIND_MESSAGE.help.join('\n')

    throw error
  }
  static cannotFindRoute(identifier: string) {
    const error = new this(
      interpolate(E_CANNOT_FIND_ROUTE.message, { identifier }),
      E_CANNOT_FIND_ROUTE.status,
      E_CANNOT_FIND_ROUTE.code
    )

    error.help = E_CANNOT_FIND_ROUTE.help.join('\n')

    throw error
  }
  static missingRouteParam(paramName: string, pattern: string) {
    const error = new this(
      interpolate(E_MISSING_ROUTE_PARAM.message, { paramName, pattern }),
      E_MISSING_ROUTE_PARAM.status,
      E_MISSING_ROUTE_PARAM.code
    )

    error.help = E_MISSING_ROUTE_PARAM.help.join('\n')

    throw error
  }
  static manifestUnavailable() {
    const error = new this(E_MANIFEST_UNAVAILABLE.message, E_MANIFEST_UNAVAILABLE.status, E_MANIFEST_UNAVAILABLE.code)

    error.help = E_MANIFEST_UNAVAILABLE.help.join('\n')

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
