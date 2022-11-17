/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_FETCH_WITHOUT_HYDRATION } from "../../exceptions.json";

/**
 * @internal
 */
export class CannotFetchWithoutHydrationException extends RadonisException {
  constructor(formAction: string) {
    super(
      interpolate(E_CANNOT_FETCH_WITHOUT_HYDRATION.message, { formAction }),
      E_CANNOT_FETCH_WITHOUT_HYDRATION.status,
      E_CANNOT_FETCH_WITHOUT_HYDRATION.code
    );
  }
}
