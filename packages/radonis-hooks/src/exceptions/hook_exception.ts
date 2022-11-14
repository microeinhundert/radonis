/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  interpolate,
  RadonisException,
} from "@microeinhundert/radonis-shared";

import {
  E_CANNOT_FIND_MESSAGE,
  E_CANNOT_USE_ON_CLIENT,
  E_INVALID_MUTATION_ACTION,
  E_MISSING_MANIFEST,
} from "../../exceptions.json";

/**
 * Exceptions related to hooks
 * @internal
 */
export class HookException extends RadonisException {
  static cannotFindMessage(messageIdentifier: string) {
    const error = new this(
      interpolate(E_CANNOT_FIND_MESSAGE.message, {
        messageIdentifier,
      }),
      E_CANNOT_FIND_MESSAGE.status,
      E_CANNOT_FIND_MESSAGE.code
    );

    throw error;
  }
  static missingManifest() {
    const error = new this(
      E_MISSING_MANIFEST.message,
      E_MISSING_MANIFEST.status,
      E_MISSING_MANIFEST.code
    );

    throw error;
  }
  static cannotUseOnClient(hookName: string) {
    const error = new this(
      interpolate(E_CANNOT_USE_ON_CLIENT.message, {
        hookName,
      }),
      E_CANNOT_USE_ON_CLIENT.status,
      E_CANNOT_USE_ON_CLIENT.code
    );

    throw error;
  }
  static invalidMutationAction(action: string) {
    const error = new this(
      interpolate(E_INVALID_MUTATION_ACTION.message, {
        action,
      }),
      E_INVALID_MUTATION_ACTION.status,
      E_INVALID_MUTATION_ACTION.code
    );

    throw error;
  }
}
