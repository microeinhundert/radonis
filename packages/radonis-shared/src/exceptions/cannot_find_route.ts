/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_FIND_ROUTE } from "../../exceptions.json";
import { interpolate } from "../utils/interpolate";

/**
 * @internal
 */
export class CannotFindRouteException extends RadonisException {
  constructor(routeIdentifier: string) {
    super(
      interpolate(E_CANNOT_FIND_ROUTE.message, {
        routeIdentifier,
      }),
      E_CANNOT_FIND_ROUTE.status,
      E_CANNOT_FIND_ROUTE.code
    );
  }
}
