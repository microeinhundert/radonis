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
export const COMPONENT_IDENTIFIER_REGEX = new RegExp(/hydratable\((\W+)?["'](?<identifier>\S+)["']/g)

/**
 * @internal
 */
export const FLASH_MESSAGE_IDENTIFIER_REGEX = new RegExp(/(get(Error)?|has(Error)?)\((\W+)?["'](?<identifier>\S+)["']/g)

/**
 * @internal
 */
export const MESSAGE_IDENTIFIER_REGEX = new RegExp(/formatMessage\((\W+)?["'](?<identifier>\S+)["']/g)

/**
 * @internal
 */
export const ROUTE_IDENTIFIER_REGEX = new RegExp(/(make\(|(action|to|route):)(\W+)?["'](?<identifier>\S+)["']/g)

/**
 * @internal
 */
export const BUILD_MANIFEST_FILE_NAME = 'build-manifest.json'
