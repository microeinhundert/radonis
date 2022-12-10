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
export class MissingHydrationDataException extends RadonisException {
  constructor(hydrationRootId: string) {
    super(`The HydrationRoot "${hydrationRootId}" is missing hydration data`, {
      status: 500,
      code: 'E_MISSING_HYDRATION_DATA',
    })
  }
}
