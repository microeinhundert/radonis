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
 * @internal
 */
export const isServer = typeof window === 'undefined'

/**
 * Whether the current environment is a client or not
 * @internal
 */
export const isClient = !isServer

/**
 * Whether the current environment is production or not
 * @internal
 */
export const isProduction = process.env.NODE_ENV === 'production'
