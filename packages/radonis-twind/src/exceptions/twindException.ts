/*
 * @microeinhundert/radonis-twind
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@microeinhundert/radonis-shared'

import { E_CONTEXT_UNAVAILABLE } from '../../exceptions.json'

/**
 * Exceptions related to Twind
 * @internal
 */
export class TwindException extends Exception {
  static contextUnavailable() {
    const error = new this(
      E_CONTEXT_UNAVAILABLE.message,
      E_CONTEXT_UNAVAILABLE.status,
      E_CONTEXT_UNAVAILABLE.code
    )

    throw error
  }
}
