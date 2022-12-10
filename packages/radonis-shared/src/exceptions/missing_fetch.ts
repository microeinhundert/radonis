/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from '../exception/main'

/**
 * @internal
 */
export class MissingFetchException extends RadonisException {
  constructor() {
    super('No implementation of "fetch" is available server-side. Please include a polyfill', {
      status: 500,
      code: 'E_MISSING_FETCH',
    })
  }
}
