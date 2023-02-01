/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CANNOT_HYDRATE = createError<[islandIdentifier: string, hydrationRootId: string]>(
  'The server-rendered island "%s" within HydrationRoot "%s" could not be hydrated',
  'E_CANNOT_HYDRATE',
  500
)
