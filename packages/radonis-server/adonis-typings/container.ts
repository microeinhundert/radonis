/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Compiler } from '../src/internal/Compiler'
import type { ManifestBuilder } from '../src/internal/ManifestBuilder'
import type { ReactRenderer } from '../src/internal/ReactRenderer'

declare module '@ioc:Adonis/Core/Application' {
  interface ContainerBindings {
    'Adonis/Addons/Radonis/Compiler': Compiler
    'Adonis/Addons/Radonis/Manager/FlashMessages': Radonis.FlashMessagesManagerContract
    'Adonis/Addons/Radonis/Manager/I18n': Radonis.I18nManagerContract
    'Adonis/Addons/Radonis/Manager/Routes': Radonis.RoutesManagerContract
    'Adonis/Addons/Radonis/ManifestBuilder': ManifestBuilder
    'Adonis/Addons/Radonis/ReactRenderer': ReactRenderer
  }
}
