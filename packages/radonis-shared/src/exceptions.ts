/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from './exception/main'

export const E_CANNOT_FIND_ROUTE = createError<[identifier: string]>(
  'Cannot find a route named "%s"',
  'E_CANNOT_FIND_ROUTE',
  404
)

export const E_MISSING_FETCH = createError(
  'There is no server-side implementation of the "fetch" API available. Please include a polyfill',
  'E_MISSING_FETCH',
  500
)

export const E_MISSING_ROUTE_PARAM = createError<[param: string, pattern: string]>(
  'The param "%s" is required for building the URL to the route "%s"',
  'E_MISSING_ROUTE_PARAM',
  500
)

export const E_WILDCARD_ROUTES_NOT_SUPPORTED = createError(
  'Wildcard routes are not currently supported by the URL builder',
  'E_WILDCARD_ROUTES_NOT_SUPPORTED',
  500
)
