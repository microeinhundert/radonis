/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from '@microeinhundert/radonis-shared'

/**
 * @internal
 */
export class UnknownBaseUrlException extends RadonisException {
  constructor() {
    super(
      'Cannot retrieve query data server-side because the base URL is not known. Make sure the "host" header is present on the request. You can alternatively set the base URL manually by passing it to the query plugin',
      {
        status: 500,
        code: 'E_UNKNOWN_BASE_URL',
      }
    )
  }
}
