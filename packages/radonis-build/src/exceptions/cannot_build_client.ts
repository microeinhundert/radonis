/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CANNOT_BUILD_CLIENT = createError<[message: string]>(
  'Cannot build the Radonis client bundle: %s',
  'E_CANNOT_BUILD_CLIENT',
  500
)
