/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_MISSING_HYDRATION_DATA } from "../../exceptions.json";

/**
 * @internal
 */
export class MissingHydrationDataException extends RadonisException {
  constructor(hydrationRootId: string) {
    super(
      interpolate(E_MISSING_HYDRATION_DATA.message, {
        hydrationRootId,
      }),
      E_MISSING_HYDRATION_DATA.status,
      E_MISSING_HYDRATION_DATA.code
    );
  }
}
