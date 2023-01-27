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
export const E_WILDCARD_ROUTES_NOT_SUPPORTED = createError(
  'Wildcard routes are not currently supported by the URL builder',
  'E_WILDCARD_ROUTES_NOT_SUPPORTED',
  500
)
