/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Create an internal URL
 */
export function createInternalURL(location: URL | string) {
  return new URL(location, 'http://radonis')
}
