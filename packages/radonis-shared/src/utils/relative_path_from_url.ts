/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Convert an URL to a relative path
 * @internal
 */
export function relativePathFromURL(url: URL) {
  return url.toString().replace(url.origin, '')
}
