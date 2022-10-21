/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Stringify attributes
 * @internal
 */
export function stringifyAttributes(attributes: Record<string, unknown>) {
  return Object.entries(attributes)
    .filter(([_, attributeValue]) => attributeValue)
    .map(([attributeName, attributeValue]) =>
      typeof attributeValue === 'boolean' ? attributeName : `${attributeName}="${attributeValue}"`
    )
    .join(' ')
}
