/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const DEFAULT_EXPORT_ESM_REGEX = new RegExp(/export\s+default\s+(function\s+)?(?<name>\w+)/g)
export const DEFAULT_EXPORT_CJS_REGEX = new RegExp(/exports.default\s+=\s+(function\s+)?(?<name>\w+)/g)

export const IOC_IMPORT_ESM_REGEX = new RegExp(/from\s+["'](?<importSpecifier>@ioc:.+)["']/g)
export const IOC_IMPORT_CJS_REGEX = new RegExp(/require\(\W?["'](?<importSpecifier>@ioc:.+)["']/g)

export const FLASH_MESSAGES_USAGE_REGEX = new RegExp(
  /\.(get(ValidationError)?|has(ValidationError)?)\(\W?["'](?<identifier>.+)["']/g
)
export const I18N_USAGE_REGEX = new RegExp(/\.formatMessage\(\W?["'](?<identifier>.+)["']/g)
export const URL_BUILDER_USAGE_REGEX = new RegExp(/\.make\(\W?["'](?<identifier>.+)["']/g)
