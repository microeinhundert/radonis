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
export class CannotHydrateWithChildrenException extends RadonisException {
  constructor(hydrationRootId: string, islandIdentifier: string) {
    super(`The island "${islandIdentifier}" inside HydrationRoot "${hydrationRootId}" has children`, {
      status: 500,
      code: 'E_CANNOT_HYDRATE_WITH_CHILDREN',
    })
  }
}
