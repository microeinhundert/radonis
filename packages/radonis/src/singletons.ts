/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Hydrator } from '@microeinhundert/radonis-hydrate'
import { PluginsManager } from '@microeinhundert/radonis-server/standalone'

export const pluginsManager = PluginsManager.getSingletonInstance()
export const hydrator = Hydrator.getSingletonInstance(pluginsManager)
