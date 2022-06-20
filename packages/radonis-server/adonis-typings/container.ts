/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Builder as ManifestBuilder } from '@microeinhundert/radonis-manifest'

import type { AssetsManager } from '../src/AssetsManager'
import type { HeadManager } from '../src/HeadManager'
import type { Renderer } from '../src/Renderer'

declare module '@ioc:Adonis/Core/Application' {
  interface ContainerBindings {
    'Microeinhundert/Radonis/ManifestBuilder': ManifestBuilder
    'Microeinhundert/Radonis/AssetsManager': AssetsManager
    'Microeinhundert/Radonis/HeadManager': HeadManager
    'Microeinhundert/Radonis/Renderer': Renderer
  }
}
