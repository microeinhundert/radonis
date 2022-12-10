/*
 * @microeinhundert/radonis-hooks
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
export class CannotRetrieveManifestException extends RadonisException {
  constructor() {
    super('Cannot retrieve the Radonis manifest. Make sure the Radonis server provider was configured properly', {
      status: 404,
      code: 'E_CANNOT_RETRIEVE_MANIFEST',
    })
  }
}
