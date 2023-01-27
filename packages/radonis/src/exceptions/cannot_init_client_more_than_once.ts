/*
 * @microeinhundert/radonis
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
export const E_CANNOT_INIT_CLIENT_MORE_THAN_ONCE = createError(
  'The Radonis client cannot be initialized more than once. Make sure you initialize the client only once in your application, typically in your entry.client.ts file',
  'E_CANNOT_INIT_CLIENT_MORE_THAN_ONCE',
  500
)
