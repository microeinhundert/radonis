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
export class CannotFindMessageException extends RadonisException {
  constructor(messageIdentifier: string) {
    super(
      `Cannot find message for "${messageIdentifier}". Make sure the message exists and can be detected by static analysis, more on this on https://radonis.vercel.app/docs/compiler#static-analysis`,
      {
        status: 404,
        code: 'E_CANNOT_FIND_MESSAGE',
      }
    )
  }
}
