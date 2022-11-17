/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_NOT_HYDRATABLE } from "../../exceptions.json";

/**
 * @internal
 */
export class NotHydratableException extends RadonisException {
  constructor(hydrationRootId: string) {
    super(
      interpolate(E_NOT_HYDRATABLE.message, {
        hydrationRootId,
      }),
      E_NOT_HYDRATABLE.status,
      E_NOT_HYDRATABLE.code
    );
  }
}
