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
export class CannotFindClientEntryFileException extends RadonisException {
  constructor(path: string) {
    super(`The Radonis client entry file could not be found at "${path}"`, {
      status: 404,
      code: 'E_MISSING_CLIENT_ENTRY_FILE',
    })
  }
}
