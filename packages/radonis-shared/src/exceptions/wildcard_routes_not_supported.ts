/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { E_WILDCARD_ROUTES_NOT_SUPPORTED } from "../../exceptions.json";
import { RadonisException } from "../exception";

/**
 * @internal
 */
export class WildcardRoutesNotSupportedException extends RadonisException {
  constructor() {
    super(
      E_WILDCARD_ROUTES_NOT_SUPPORTED.message,
      E_WILDCARD_ROUTES_NOT_SUPPORTED.status,
      E_WILDCARD_ROUTES_NOT_SUPPORTED.code
    );
  }
}
