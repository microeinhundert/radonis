/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AttributeValue } from '@microeinhundert/radonis-types'

import { nonNull } from './non_null'

/**
 * Stringify attributes
 * @internal
 */
export function stringifyAttributes(attributes: Record<string, AttributeValue>) {
  return nonNull(
    Object.entries(attributes).map(([name, value]) => {
      if (typeof value === 'boolean') {
        return value ? name.trim() : null
      }

      if (value === null || value === undefined) {
        return null
      }

      return `${name.trim()}="${value}"`
    })
  ).join(' ')
}
