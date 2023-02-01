/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_NOT_AN_ISLAND = createError<[hydrationRootId: string]>(
  'The component within HydrationRoot "%s" is not an island. Make sure the component is wrapped with the "island" function',
  'E_NOT_AN_ISLAND',
  500
)
