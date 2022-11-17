/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_FIND_MESSAGE } from "../../exceptions.json";

/**
 * @internal
 */
export class CannotFindMessageException extends RadonisException {
  constructor(messageIdentifier: string) {
    super(
      interpolate(E_CANNOT_FIND_MESSAGE.message, {
        messageIdentifier,
      }),
      E_CANNOT_FIND_MESSAGE.status,
      E_CANNOT_FIND_MESSAGE.code
    );
  }
}
