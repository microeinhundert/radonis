/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CANNOT_HYDRATE_WITH_CHILDREN = createError<[islandIdentifier: string, hydrationRootId: string]>(
  'The island "%s" within HydrationRoot "%s" has children',
  'E_CANNOT_HYDRATE_WITH_CHILDREN',
  500
)
