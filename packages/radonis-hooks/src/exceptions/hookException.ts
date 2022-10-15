/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  Exception,
  interpolate,
} from '@microeinhundert/radonis-shared'

import {
  E_CANNOT_FIND_MESSAGE,
  E_CANNOT_USE_ON_CLIENT,
  E_MANIFEST_UNAVAILABLE,
} from '../../exceptions.json'

/**
 * Exceptions related to hooks
 * @internal
 */
export class HookException extends Exception {
  static cannotFindMessage(identifier: string) {
    const error = new this(
      interpolate(E_CANNOT_FIND_MESSAGE.message, {
        identifier,
      }),
      E_CANNOT_FIND_MESSAGE.status,
      E_CANNOT_FIND_MESSAGE.code
    )

    throw error
  }
  static manifestUnavailable() {
    const error = new this(
      E_MANIFEST_UNAVAILABLE.message,
      E_MANIFEST_UNAVAILABLE.status,
      E_MANIFEST_UNAVAILABLE.code
    )

    throw error
  }
  static cannotUseOnClient(hookName: string) {
    const error = new this(
      interpolate(E_CANNOT_USE_ON_CLIENT.message, {
        hookName,
      }),
      E_CANNOT_USE_ON_CLIENT.status,
      E_CANNOT_USE_ON_CLIENT.code
    )

    throw error
  }
}
