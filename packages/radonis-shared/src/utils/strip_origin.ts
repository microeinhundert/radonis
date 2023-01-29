/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Strip the origin from an URL
 * @internal
 */
export function stripOrigin(url: URL) {
  return url.toString().replace(url.origin, '')
}
