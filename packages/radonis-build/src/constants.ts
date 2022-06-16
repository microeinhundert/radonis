/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const DEFAULT_EXPORT_REGEX = new RegExp(/export\s+default\s+(function\s+)?(?<name>\w+)/g)
export const FLASH_MESSAGE_IDENTIFIER_REGEX = new RegExp(
  /\.(get(Error)?|has(Error)?)\((\W+)?["'](?<identifier>.+?)["']/g
)
export const MESSAGE_IDENTIFIER_REGEX = new RegExp(/\.formatMessage\((\W+)?["'](?<identifier>.+?)["']/g)
export const ROUTE_IDENTIFIER_REGEX = new RegExp(/(\.make\(|(action|to|route):)(\W+)?["'](?<identifier>.+?)["']/g)
