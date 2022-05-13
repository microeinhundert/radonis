/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isClient, isProduction } from './environment'

const fallbackMessage = 'Something went wrong'

/**
 * Throw a message when the passed condition is falsy
 */
export function invariant(condition: unknown, message?: string): asserts condition {
  if (condition) {
    return
  }

  if (isProduction && isClient) {
    throw new Error(fallbackMessage)
  }

  throw new Error(`[Radonis] ${message ?? fallbackMessage}`)
}

/**
 * Separate items of an array with a specific value
 */
export function separateArray(array: unknown[], separator: unknown) {
  return array.flatMap((item) => [item, separator]).slice(0, -1)
}
