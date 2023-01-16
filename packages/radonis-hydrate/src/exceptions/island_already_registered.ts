/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from '@microeinhundert/radonis-shared'

/**
 * @internal
 */
export class IslandAlreadyRegisteredException extends RadonisException {
  constructor(islandIdentifier: string) {
    super(
      `The island "${islandIdentifier}" is already registered for hydration. Make sure to not use the same name for multiple islands`,
      {
        status: 500,
        code: 'E_ISLAND_ALREADY_REGISTERED',
      }
    )
  }
}
