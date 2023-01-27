/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createError } from '@microeinhundert/radonis-shared'

/**
 * @internal
 */
export const E_INVALID_MUTATION_ACTION = createError<[action: string]>(
  'Invalid mutation action "%s"',
  'E_INVALID_MUTATION_ACTION',
  500
)
