/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Compiler } from '../src/Compiler'
import type { ManifestBuilder } from '../src/ManifestBuilder'
import type { Renderer } from '../src/Renderer'

declare module '@ioc:Adonis/Core/Application' {
  interface ContainerBindings {
    'Adonis/Addons/Radonis/Compiler': Compiler
    'Adonis/Addons/Radonis/ManifestBuilder': ManifestBuilder
    'Adonis/Addons/Radonis/Renderer': Renderer
  }
}
