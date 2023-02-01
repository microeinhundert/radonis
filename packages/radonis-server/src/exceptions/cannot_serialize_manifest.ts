/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CANNOT_SERIALIZE_MANIFEST = createError(
  'The Radonis manifest cannot be serialized. Make sure you only pass data to islands that can be serialized by superjson',
  'E_CANNOT_SERIALIZE_MANIFEST',
  500
)
