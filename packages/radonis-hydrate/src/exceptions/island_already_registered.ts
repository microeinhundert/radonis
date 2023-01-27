/*
 * @microeinhundert/radonis-hydrate
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
export const E_ISLAND_ALREADY_REGISTERED = createError<[islandIdentifier: string]>(
  'The island "%s" is already registered for hydration. Make sure you do not use the same name for multiple islands',
  'E_ISLAND_ALREADY_REGISTERED',
  500
)
