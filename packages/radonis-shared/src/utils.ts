/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isClient, isProduction, isTesting } from './environment'

const prefix = isTesting ? '' : '[Radonis]'
const fallbackMessage = 'Something went wrong'

/**
 * Throw a message when the passed condition is falsy
 * @internal
 */
export function invariant(condition: unknown, message?: string): asserts condition {
  if (condition) {
    return
  }

  if (isProduction && isClient) {
    throw new Error(fallbackMessage)
  }

  throw new Error([prefix, message ?? fallbackMessage].filter(Boolean).join(' '))
}

/**
 * Separate items of an array with a specific value
 * @internal
 */
export function separateArray(array: unknown[], separator: unknown) {
  return array.flatMap((item) => [item, separator]).slice(0, -1)
}

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
