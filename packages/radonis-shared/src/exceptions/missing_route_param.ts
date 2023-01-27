/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '../exception/main'

/**
 * @internal
 */
export const E_MISSING_ROUTE_PARAM = createError<[param: string, pattern: string]>(
  'The param "%s" is required for building the URL to the route "%s"',
  'E_MISSING_ROUTE_PARAM',
  500
)
