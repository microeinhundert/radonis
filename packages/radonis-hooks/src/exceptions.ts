/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CANNOT_FIND_MESSAGE = createError<[identifier: string]>(
  'Cannot find a message named "%s". Make sure that the message exists and that it can be detected by static analysis, see https://radonis.vercel.app/docs/compiler#static-analysis for more information',
  'E_CANNOT_FIND_MESSAGE',
  404
)

export const E_CANNOT_FIND_ROUTE = createError<[identifier: string]>(
  'Cannot find a route named "%s". Make sure that the route exists and that it can be detected by static analysis, see https://radonis.vercel.app/docs/compiler#static-analysis for more information',
  'E_CANNOT_FIND_ROUTE',
  404
)

export const E_CANNOT_RETRIEVE_MANIFEST = createError(
  'Cannot retrieve the Radonis manifest. Ensure that the Radonis server provider is configured correctly',
  'E_CANNOT_RETRIEVE_MANIFEST',
  404
)

export const E_CANNOT_USE_ON_CLIENT = createError<[name: string]>(
  'The hook "%s()" cannot be used client-side',
  'E_CANNOT_USE_ON_CLIENT',
  500
)

export const E_INVALID_MUTATION_ACTION = createError<[action: string]>(
  'Invalid mutation action "%s"',
  'E_INVALID_MUTATION_ACTION',
  500
)
