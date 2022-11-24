/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from "@microeinhundert/radonis-shared";

import { E_UNKNOWN_BASE_URL } from "../../exceptions.json";

/**
 * @internal
 */
export class UnknownBaseUrlException extends RadonisException {
  constructor() {
    super(E_UNKNOWN_BASE_URL.message, E_UNKNOWN_BASE_URL.status, E_UNKNOWN_BASE_URL.code);
  }
}
