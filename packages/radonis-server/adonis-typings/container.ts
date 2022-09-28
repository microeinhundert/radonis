/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import type { HydrationManager } from '@microeinhundert/radonis-hydrate'
import type { PluginsManager } from '@microeinhundert/radonis-shared'

import type { AssetsManager } from '../src/assetsManager'
import type { HeadManager } from '../src/headManager'
import type { ManifestManager } from '../src/manifestManager'
import type { Renderer } from '../src/renderer'

declare module '@ioc:Adonis/Core/Application' {
  interface ContainerBindings {
    'Microeinhundert/Radonis/Config': RadonisConfig
    'Microeinhundert/Radonis/PluginsManager': PluginsManager
    'Microeinhundert/Radonis/HydrationManager': HydrationManager
    'Microeinhundert/Radonis/ManifestManager': ManifestManager
    'Microeinhundert/Radonis/AssetsManager': AssetsManager
    'Microeinhundert/Radonis/HeadManager': HeadManager
    'Microeinhundert/Radonis/Renderer': Renderer
  }
}
