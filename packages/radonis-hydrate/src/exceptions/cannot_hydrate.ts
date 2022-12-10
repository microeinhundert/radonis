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
  constructor(hydrationRootId: string, componentIdentifier: string) {
    super(
      `The server-rendered component "${componentIdentifier}" inside of HydrationRoot "${hydrationRootId}" could not be hydrated. Make sure the component exists in the client bundle`,
      {
        status: 500,
        code: 'E_CANNOT_HYDRATE',
      }
    )
  }
}
