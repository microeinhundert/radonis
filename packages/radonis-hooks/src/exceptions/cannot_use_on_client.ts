/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CANNOT_USE_ON_CLIENT = createError<[name: string]>(
  'The hook "%s()" cannot be used client-side',
  'E_CANNOT_USE_ON_CLIENT',
  500
)
