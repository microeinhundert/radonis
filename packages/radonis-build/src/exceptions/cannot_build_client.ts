/*
 * @microeinhundert/radonis-build
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
export class CannotBuildClientException extends RadonisException {
  constructor(message: string) {
    super(`Cannot build the Radonis client bundle: ${message}`, {
      status: 500,
      code: 'E_CANNOT_BUILD',
    })
  }
}
