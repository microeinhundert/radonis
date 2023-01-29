/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Remove nullish entries from an array
 * @internal
 */
export function nonNull<T>(array: (T | null)[]): T[] {
  return array.filter((entry): entry is T => entry !== null)
}
