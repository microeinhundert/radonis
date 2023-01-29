/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @internal
 */
export const TOKEN_REGEX = new RegExp(/\$(\(|=|:)(\W+)?["'](?<identifier>\S+)["']/g)

/**
 * @internal
 */
export const ISLAND_REGEX = new RegExp(/island\((\s+)?["'](?<identifier>\S+)["'],(\s+)?(?<symbol>\S+)(\s+)?\)/g)

/**
 * @internal
 */
export const ASSETS_MANIFEST_FILE_NAME = 'assets-manifest.json'
