/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '../exception/main'

export const E_MISSING_FETCH = createError(
  'There is no server-side implementation of the "fetch" API available. Please include a polyfill',
  'E_MISSING_FETCH',
  500
)
