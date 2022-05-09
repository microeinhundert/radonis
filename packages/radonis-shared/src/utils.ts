/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isClient, isProduction } from './environment'

/**
 * Sanitize a string to prevent XSS attacks
 */
export function xssSanitize(string: string) {
  return string.replace(/[^\w. ]/gi, (char: string) => '&#' + char.charCodeAt(0) + ';')
}

const fallbackMessage = 'Something went wrong'

/**
 * Throws a message when the passed condition is falsy
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
