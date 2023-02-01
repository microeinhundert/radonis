/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CANNOT_INIT_CLIENT_ON_SERVER = createError(
  'The Radonis client cannot be initialized server-side. Make sure to only call "initClient" in the client bundle, typically in your "entry.client.ts" file',
  'E_CANNOT_INIT_CLIENT_ON_SERVER',
  500
)
