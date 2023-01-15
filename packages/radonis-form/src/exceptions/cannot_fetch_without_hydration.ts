/*
 * @microeinhundert/radonis-form
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
export class CannotFetchWithoutHydrationException extends RadonisException {
  constructor(formAction: string) {
    super(
      `The form with action "${formAction}" and the "noReload" prop set can't work without being hydrated client-side. Convert the component containing this form into an island and wrap it with an HydrationRoot`,
      {
        status: 500,
        code: 'E_CANNOT_FETCH_WITHOUT_HYDRATION',
      }
    )
  }
}
