/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_INIT_CLIENT_MULTIPLE_TIMES } from "../../exceptions.json";

/**
 * @internal
 */
export class CannotInitClientMultipleTimesException extends RadonisException {
  constructor() {
    super(
      E_CANNOT_INIT_CLIENT_MULTIPLE_TIMES.message,
      E_CANNOT_INIT_CLIENT_MULTIPLE_TIMES.status,
      E_CANNOT_INIT_CLIENT_MULTIPLE_TIMES.code
    );
  }
}
