/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'

import type { AssetsManager } from '../src/services/assetsManager'
import type { HeadManager } from '../src/services/headManager'
import type { HydrationManager } from '../src/services/hydrationManager'
import type { ManifestManager } from '../src/services/manifestManager'
import type { PluginsManager } from '../src/services/pluginsManager'
import type { Renderer } from '../src/services/renderer'

declare module '@ioc:Adonis/Core/Application' {
  interface ContainerBindings {
    'Microeinhundert/Radonis/Config': RadonisConfig
    'Microeinhundert/Radonis/AssetsManager': AssetsManager
    'Microeinhundert/Radonis/HeadManager': HeadManager
    'Microeinhundert/Radonis/HydrationManager': HydrationManager
    'Microeinhundert/Radonis/PluginsManager': PluginsManager
    'Microeinhundert/Radonis/ManifestManager': ManifestManager
    'Microeinhundert/Radonis/Renderer': Renderer
  }
}
