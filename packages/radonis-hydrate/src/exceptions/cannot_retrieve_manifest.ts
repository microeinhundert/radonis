/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CANNOT_RETRIEVE_MANIFEST = createError(
  'Cannot retrieve the Radonis manifest. Ensure that the Radonis server provider is configured correctly',
  'E_CANNOT_RETRIEVE_MANIFEST',
  404
)
