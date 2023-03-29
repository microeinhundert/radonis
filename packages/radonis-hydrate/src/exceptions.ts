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

export const E_CANNOT_HYDRATE = createError<[islandIdentifier: string, hydrationRootId: string]>(
  'The server-rendered island "%s" within HydrationRoot "%s" could not be hydrated. Restart the server and try again',
  'E_CANNOT_HYDRATE',
  500
)

export const E_CANNOT_RETRIEVE_MANIFEST = createError(
  'Cannot retrieve the Radonis manifest. Make sure that the Radonis server provider is configured correctly',
  'E_CANNOT_RETRIEVE_MANIFEST',
  404
)

export const E_ISLAND_ALREADY_REGISTERED = createError<[islandIdentifier: string]>(
  'The island "%s" is already registered for hydration. Make sure you do not use the same name for multiple islands',
  'E_ISLAND_ALREADY_REGISTERED',
  500
)

export const E_NOT_AN_ISLAND = createError<[hydrationRootId: string]>(
  'The component within HydrationRoot "%s" is not an island. Make sure the component is wrapped with the "island" function',
  'E_NOT_AN_ISLAND',
  500
)
