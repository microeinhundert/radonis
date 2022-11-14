/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Separate items of an array with a specific value
 * @internal
 */
export function separateArray(array: unknown[], separator: unknown) {
  return array.flatMap((item) => [item, separator]).slice(0, -1);
}
