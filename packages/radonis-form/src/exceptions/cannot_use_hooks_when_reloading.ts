/*
 * @microeinhundert/radonis-form
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
export class CannotUseHooksWhenReloadingException extends RadonisException {
  constructor(formAction: string) {
    super(
      `The form with action "${formAction}" cannot use the "hooks" prop without the "noReload" prop also being set`,
      {
        status: 500,
        code: 'E_CANNOT_USE_HOOKS_WHEN_RELOADING',
      }
    )
  }
}
