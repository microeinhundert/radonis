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
export class WildcardRoutesNotSupportedException extends RadonisException {
  constructor() {
    super('Wildcard routes are currently not supported by the URL builder', {
      status: 500,
      code: 'E_WILDCARD_ROUTES_NOT_SUPPORTED',
    })
  }
}
