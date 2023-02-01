/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

export const E_CANNOT_USE_HOOKS_WHEN_RELOADING = createError<[action: string]>(
  'The form with action "%s" cannot use the "hooks" prop without also setting the "noReload" prop',
  'E_CANNOT_USE_HOOKS_WHEN_RELOADING',
  500
)
