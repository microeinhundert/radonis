/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from '../exception/main'

/**
 * @internal
 */
export class MissingRouteParamException extends RadonisException {
  constructor(paramName: string, pattern: string) {
    super(`The "${paramName}" param is required for building the URL to the "${pattern}" route`, {
      status: 500,
      code: 'E_MISSING_ROUTE_PARAM',
    })
  }
}
