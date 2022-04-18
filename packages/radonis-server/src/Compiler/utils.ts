/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Check if the first character of a string is a lowercase letter
 */
export function isFirstCharLowerCase(string: string): boolean {
  return string.charAt(0).toLowerCase() === string.charAt(0)
}
