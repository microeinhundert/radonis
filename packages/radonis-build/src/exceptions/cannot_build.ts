/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_BUILD } from "../../exceptions.json";

/**
 * @internal
 */
export class CannotBuildException extends RadonisException {
  constructor(message: string) {
    super(interpolate(E_CANNOT_BUILD.message, { message }), E_CANNOT_BUILD.status, E_CANNOT_BUILD.code);
  }
}
