/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '../exception/main'

export const E_CANNOT_FIND_ROUTE = createError<[identifier: string]>(
  'Cannot find a route named "%s"',
  'E_CANNOT_FIND_ROUTE',
  404
)
