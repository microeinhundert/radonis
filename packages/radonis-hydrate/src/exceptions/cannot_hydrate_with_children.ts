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
  constructor(hydrationRootId: string, componentIdentifier: string) {
    super(
      `The component "${componentIdentifier}" inside HydrationRoot "${hydrationRootId}" has children. Children are not supported on the direct child of an HydrationRoot`,
      {
        status: 500,
        code: 'E_CANNOT_HYDRATE_WITH_CHILDREN',
      }
    )
  }
}
