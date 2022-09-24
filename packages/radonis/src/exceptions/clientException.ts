/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@microeinhundert/radonis-shared'

import { E_CANNOT_INIT_CLIENT_MULTIPLE_TIMES, E_CANNOT_INIT_CLIENT_ON_SERVER } from '../../exceptions.json'

/**
 * Exceptions related to the client
 */
export class ClientException extends Exception {
  static cannotInitClientOnServer() {
    const error = new this(
      E_CANNOT_INIT_CLIENT_ON_SERVER.message,
      E_CANNOT_INIT_CLIENT_ON_SERVER.status,
      E_CANNOT_INIT_CLIENT_ON_SERVER.code
    )

    error.help = E_CANNOT_INIT_CLIENT_ON_SERVER.help.join('\n')

    throw error
  }
  static cannotInitClientMultipleTimes() {
    const error = new this(
      E_CANNOT_INIT_CLIENT_MULTIPLE_TIMES.message,
      E_CANNOT_INIT_CLIENT_MULTIPLE_TIMES.status,
      E_CANNOT_INIT_CLIENT_MULTIPLE_TIMES.code
    )

    error.help = E_CANNOT_INIT_CLIENT_MULTIPLE_TIMES.help.join('\n')

    throw error
  }
}
