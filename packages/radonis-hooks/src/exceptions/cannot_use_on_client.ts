/*
 * @microeinhundert/radonis-hooks
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
export class CannotUseOnClientException extends RadonisException {
  constructor(hookName: string) {
    super(`The "${hookName}()" hook cannot be used client-side`, {
      status: 500,
      code: 'E_CANNOT_USE_ON_CLIENT',
    })
  }
}
