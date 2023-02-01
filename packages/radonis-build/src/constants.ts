/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const TOKEN_REGEX = new RegExp(/\S\$(\(|=|:)(\W+)?["'](?<identifier>\S+)["']/g)
export const ISLAND_REGEX = new RegExp(/\bisland\((\s+)?["'](?<identifier>\S+)["'],(\s+)?(?<symbol>\S+)(\s+)?\)/g)
export const ASSETS_MANIFEST_FILE_NAME = 'assets-manifest.json'
