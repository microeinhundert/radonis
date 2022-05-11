/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Builder as ManifestBuilder } from '@microeinhundert/radonis-manifest'

import type { Compiler } from '../src/Compiler'
import type { HeadManager } from '../src/HeadManager'
import type { Renderer } from '../src/Renderer'

declare module '@ioc:Adonis/Core/Application' {
  interface ContainerBindings {
    'Adonis/Addons/Radonis/ManifestBuilder': ManifestBuilder
    'Adonis/Addons/Radonis/Compiler': Compiler
    'Adonis/Addons/Radonis/HeadManager': HeadManager
    'Adonis/Addons/Radonis/Renderer': Renderer
  }
}
