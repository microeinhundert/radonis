/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const DEFAULT_EXPORT_ESM_REGEX = /export\s+default\s+(function\s+)?(?<name>\w+)/g
export const DEFAULT_EXPORT_CJS_REGEX = /exports.default\s+=\s+(function\s+)?(?<name>\w+)/g
export const IOC_IMPORT_ESM_REGEX = /from\s+["'](?<importSpecifier>@ioc:.+)["']/g
export const IOC_IMPORT_CJS_REGEX = /require\(["'](?<importSpecifier>@ioc:.+)["']\)/g

export const PUBLIC_PATH_SEGMENT = 'public'
