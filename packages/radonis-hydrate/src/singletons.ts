/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PluginsManager } from '@microeinhundert/radonis-server/standalone'

import { Hydrator } from './hydrator/main'

/**
 * @internal
 */
export const pluginsManager = PluginsManager.getSingletonInstance()

/**
 * @internal
 */
export const hydrator = Hydrator.getSingletonInstance(pluginsManager)
