/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from "@microeinhundert/radonis-shared";

import { E_MISSING_HOST_HEADER } from "../../exceptions.json";

/**
 * @internal
 */
export class MissingHostHeaderException extends RadonisException {
  constructor() {
    super(E_MISSING_HOST_HEADER.message, E_MISSING_HOST_HEADER.status, E_MISSING_HOST_HEADER.code);
  }
}
