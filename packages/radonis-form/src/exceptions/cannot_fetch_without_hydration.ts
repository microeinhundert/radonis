/*
 * @microeinhundert/radonis-form
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
export const E_CANNOT_FETCH_WITHOUT_HYDRATION = createError<[action: string]>(
  'The form with the action "%s" and the "noReload" prop set can\'t work without being hydrated client-side. Convert the component containing this form to an island and wrap it with an HydrationRoot',
  'E_CANNOT_FETCH_WITHOUT_HYDRATION',
  500
)
