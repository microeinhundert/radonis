/*
 * @microeinhundert/radonis
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
export class CannotInitClientMultipleTimesException extends RadonisException {
  constructor() {
    super(
      'The Radonis client cannot be initialized multiple times. Make sure to only initialize the client once in your application, typically in your "entry.client.ts" file',
      {
        status: 500,
        code: 'E_CANNOT_INIT_CLIENT_MULTIPLE_TIMES',
      }
    )
  }
}
