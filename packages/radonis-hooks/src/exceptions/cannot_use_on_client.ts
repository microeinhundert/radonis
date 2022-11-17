/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_USE_ON_CLIENT } from "../../exceptions.json";

/**
 * @internal
 */
export class CannotUseOnClientException extends RadonisException {
  constructor(hookName: string) {
    super(
      interpolate(E_CANNOT_USE_ON_CLIENT.message, {
        hookName,
      }),
      E_CANNOT_USE_ON_CLIENT.status,
      E_CANNOT_USE_ON_CLIENT.code
    );
  }
}
