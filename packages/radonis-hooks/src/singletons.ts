/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager } from '@microeinhundert/radonis-hydrate'
import { PluginsManager } from '@microeinhundert/radonis-shared'

/**
 * @internal
 */
export const pluginsManager = PluginsManager.getSingletonInstance()

/**
 * @internal
 */
export const hydrationManager = HydrationManager.getSingletonInstance(pluginsManager)
