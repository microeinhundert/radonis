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
export class NotHydratableException extends RadonisException {
  constructor(hydrationRootId: string) {
    super(
      `The component inside of HydrationRoot "${hydrationRootId}" is not hydratable. Make sure the component was wrapped with the "hydratable" function`,
      {
        status: 500,
        code: 'E_NOT_HYDRATABLE',
      }
    )
  }
}
