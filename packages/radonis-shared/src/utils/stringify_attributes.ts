/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { nonNull } from './non_null'

/**
 * Stringify attributes
 * @internal
 */
export function stringifyAttributes(attributes: Record<string, string | number | boolean>) {
  return nonNull(
    Object.entries(attributes).map(([attributeName, attributeValue]) => {
      if (typeof attributeValue === 'boolean') {
        return attributeValue ? attributeName.trim() : null
      }

      return `${attributeName.trim()}="${attributeValue}"`
    })
  ).join(' ')
}
