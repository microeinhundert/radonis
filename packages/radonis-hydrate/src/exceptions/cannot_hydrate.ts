/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_HYDRATE } from "../../exceptions.json";

/**
 * @internal
 */
export class CannotHydrateException extends RadonisException {
  constructor(hydrationRootId: string, componentIdentifier: string) {
    super(
      interpolate(E_CANNOT_HYDRATE.message, {
        hydrationRootId,
        componentIdentifier,
      }),
      E_CANNOT_HYDRATE.status,
      E_CANNOT_HYDRATE.code
    );
  }
}
