/*
 * @microeinhundert/radonis-server
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
export class CannotSerializeManifestException extends RadonisException {
  constructor() {
    super(
      'The Radonis manifest cannot be serialized. Make sure to only pass data serializable by superjson to components hydrated client-side',
      {
        status: 500,
        code: 'E_CANNOT_SERIALIZE_MANIFEST',
      }
    )
  }
}
