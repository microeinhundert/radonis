/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Strip the leading slash if it exists
 */
export function stripLeadingSlash(path: string) {
  return path.startsWith('/') ? path.slice(1) : path
}
