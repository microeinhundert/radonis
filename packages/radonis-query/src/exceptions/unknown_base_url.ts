/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

/**
 * @internal
 */
export const E_UNKNOWN_BASE_URL = createError(
  'Cannot retrieve request data server-side because of an unknown base URL. Make sure that the "host" header is present on the request. Alternatively, you can set the base URL manually by passing it to the query plugin',
  'E_UNKNOWN_BASE_URL',
  500
)
