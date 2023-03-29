/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createInternalURL } from './create_internal_url'

/**
 * Normalize a path
 */
export function normalizePath(path: string) {
  return createInternalURL(path).pathname
}
