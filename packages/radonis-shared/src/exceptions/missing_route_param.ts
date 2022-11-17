/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { E_MISSING_ROUTE_PARAM } from "../../exceptions.json";
import { RadonisException } from "../exception";
import { interpolate } from "../utils/interpolate";

/**
 * @internal
 */
export class MissingRouteParamException extends RadonisException {
  constructor(paramName: string, pattern: string) {
    super(
      interpolate(E_MISSING_ROUTE_PARAM.message, {
        paramName,
        pattern,
      }),
      E_MISSING_ROUTE_PARAM.status,
      E_MISSING_ROUTE_PARAM.code
    );
  }
}
