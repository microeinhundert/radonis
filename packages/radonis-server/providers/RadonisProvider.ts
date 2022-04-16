/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

import { Compiler as CompilerInstance } from '../src/internal/Compiler'
import { HydrationRoot } from '../src/internal/components/HydrationRoot'
import { useApplication } from '../src/internal/hooks/useApplication'
import { useHttpContext } from '../src/internal/hooks/useHttpContext'
import { useRadonis } from '../src/internal/hooks/useRadonis'
import { useRequest } from '../src/internal/hooks/useRequest'
import { useRouter } from '../src/internal/hooks/useRouter'
import { useSession } from '../src/internal/hooks/useSession'
import { FlashMessagesManager as FlashMessagesManagerInstance } from '../src/internal/managers/FlashMessagesManager'
import { I18nManager as I18nManagerInstance } from '../src/internal/managers/I18nManager'
import { RoutesManager as RoutesManagerInstance } from '../src/internal/managers/RoutesManager'
import { ManifestBuilder as ManifestBuilderInstance } from '../src/internal/ManifestBuilder'
import { ReactRenderer as ReactRendererInstance } from '../src/internal/ReactRenderer'
export default class RadonisProvider {
  public static needsApplication = true

  /**
   * Constructor
   */
  constructor(private application: ApplicationContract) {}

  /**
   * Register
   */
  public register() {
    /**
     * Compiler
     */
    this.application.container.singleton('Adonis/Addons/Radonis/Compiler', () => {
      const radonisConfig: RadonisConfig = this.application.container
        .resolveBinding('Adonis/Core/Config')
        .get('radonis', {})

      return new CompilerInstance(radonisConfig)
    })

    /**
     * FlashMessagesManager
     */
    this.application.container.singleton('Adonis/Addons/Radonis/Manager/FlashMessages', () => {
      return new FlashMessagesManagerInstance()
    })

    /**
     * I18nManager
     */
    this.application.container.singleton('Adonis/Addons/Radonis/Manager/I18n', () => {
      return new I18nManagerInstance()
    })

    /**
     * RoutesManager
     */
    this.application.container.singleton('Adonis/Addons/Radonis/Manager/Routes', () => {
      return new RoutesManagerInstance()
    })

    /**
     * ManifestBuilder
     */
    this.application.container.singleton('Adonis/Addons/Radonis/ManifestBuilder', () => {
      const FlashMessagesManager = this.application.container.resolveBinding(
        'Adonis/Addons/Radonis/Manager/FlashMessages'
      )
      const I18nManager = this.application.container.resolveBinding('Adonis/Addons/Radonis/Manager/I18n')
      const RoutesManager = this.application.container.resolveBinding('Adonis/Addons/Radonis/Manager/Routes')

      return new ManifestBuilderInstance(FlashMessagesManager, I18nManager, RoutesManager)
    })

    /**
     * ReactRenderer
     */
    this.application.container.singleton('Adonis/Addons/Radonis/ReactRenderer', () => {
      const radonisConfig: RadonisConfig = this.application.container
        .resolveBinding('Adonis/Core/Config')
        .get('radonis', {})

      const I18n = this.application.container.resolveBinding('Adonis/Addons/I18n')
      const Compiler = this.application.container.resolveBinding('Adonis/Addons/Radonis/Compiler')
      const ManifestBuilder = this.application.container.resolveBinding('Adonis/Addons/Radonis/ManifestBuilder')

      return new ReactRendererInstance(I18n, Compiler, ManifestBuilder, radonisConfig)
    })

    /**
     * Radonis
     */
    this.application.container.singleton('Adonis/Addons/Radonis', () => {
      return {
        useRadonis,
        useApplication,
        useHttpContext,
        useRequest,
        useRouter,
        useSession,
        HydrationRoot,
      }
    })
  }

  /**
   * Boot
   */
  public async boot() {
    this.application.container.withBindings(
      [
        'Adonis/Core/HttpContext',
        'Adonis/Core/Application',
        'Adonis/Core/Route',
        'Adonis/Addons/Radonis/Compiler',
        'Adonis/Addons/Radonis/ManifestBuilder',
        'Adonis/Addons/Radonis/ReactRenderer',
      ],
      async (HttpContext, Application, Route, Compiler, ManifestBuilder, ReactRenderer) => {
        await Compiler.compileComponents()

        HttpContext.getter(
          'radonis',
          function () {
            Compiler.prepareForNewRequest()
            ManifestBuilder.prepareForNewRequest()

            return ReactRenderer.getRendererForRequest(this, Application, Route)
          },
          true
        )
      }
    )
  }
}
