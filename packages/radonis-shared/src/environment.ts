/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Whether the current environment is a server or not
 */
export const isServer = typeof document === 'undefined' && typeof globalThis !== 'undefined'

/**
 * Whether the current environment is a client or not
 */
export const isClient = !isServer

/**
 * Whether the current environment is production or not
 */
export const isProduction = process.env.NODE_ENV === 'production'

/**
 * Whether the current environment is testing or not
 */
export const isTesting = process.env.NODE_ENV === 'test'
