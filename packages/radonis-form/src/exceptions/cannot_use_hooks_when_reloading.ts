/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_USE_HOOKS_WHEN_RELOADING } from "../../exceptions.json";

/**
 * @internal
 */
export class CannotUseHooksWhenReloadingException extends RadonisException {
  constructor(formAction: string) {
    super(
      interpolate(E_CANNOT_USE_HOOKS_WHEN_RELOADING.message, { formAction }),
      E_CANNOT_USE_HOOKS_WHEN_RELOADING.status,
      E_CANNOT_USE_HOOKS_WHEN_RELOADING.code
    );
  }
}
