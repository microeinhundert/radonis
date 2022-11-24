/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { E_MISSING_FETCH } from "../../exceptions.json";
import { RadonisException } from "../exception";

/**
 * @internal
 */
export class MissingFetchException extends RadonisException {
  constructor() {
    super(E_MISSING_FETCH.message, E_MISSING_FETCH.status, E_MISSING_FETCH.code);
  }
}
