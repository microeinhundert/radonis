/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import hasher from 'node-object-hash'

/**
 * @internal
 */
export const DEFAULT_LOCALE = 'en'

/**
 * @internal
 */
export const PROPS_HASHER = hasher({ sort: true, coerce: false, alg: 'md5' })
