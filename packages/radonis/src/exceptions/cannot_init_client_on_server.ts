/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from "@microeinhundert/radonis-shared";

import { E_CANNOT_INIT_CLIENT_ON_SERVER } from "../../exceptions.json";

/**
 * @internal
 */
export class CannotInitClientOnServerException extends RadonisException {
  constructor() {
    super(
      E_CANNOT_INIT_CLIENT_ON_SERVER.message,
      E_CANNOT_INIT_CLIENT_ON_SERVER.status,
      E_CANNOT_INIT_CLIENT_ON_SERVER.code
    );
  }
}
