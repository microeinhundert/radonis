/*
 * @microeinhundert/radonis-hooks
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
export const E_CANNOT_FIND_ROUTE = createError<[identifier: string]>(
  'Cannot find a route named "%s". Make sure that the route exists and that it can be detected by static analysis, see https://radonis.vercel.app/docs/compiler#static-analysis for more information',
  'E_CANNOT_FIND_ROUTE',
  404
)
