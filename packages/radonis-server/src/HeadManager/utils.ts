/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { separateArray } from '@microeinhundert/radonis-shared'

/**
 * Build the title
 */
export function buildTitle(title: string, prefix: string, suffix: string, separator: string): string {
  return separateArray(
    [prefix, title, suffix].filter(Boolean).map((part) => part.trim()),
    separator
  ).join(' ')
}
