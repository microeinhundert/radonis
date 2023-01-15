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
export class CannotHydrateException extends RadonisException {
  constructor(hydrationRootId: string, islandIdentifier: string) {
    super(
      `The server-rendered island "${islandIdentifier}" inside of HydrationRoot "${hydrationRootId}" could not be hydrated`,
      {
        status: 500,
        code: 'E_CANNOT_HYDRATE',
      }
    )
  }
}
