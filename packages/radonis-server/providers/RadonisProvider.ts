/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import { FlashMessagesManager, I18nManager, RoutesManager } from '@microeinhundert/radonis-manifest'
import { PluginsManager } from '@microeinhundert/radonis-shared'

import {
  HydrationRoot,
  useAdonis,
  useApplication,
  useHead,
  useHttpContext,
  useRequest,
  useRouter,
  useSession,
} from '../src/React'
import { extractRootRoutes } from '../src/utils/extractRootRoutes'

export default class RadonisProvider {
  public static needsApplication = true

  /**
   * The PluginsManager instance
   */
  private pluginsManager: PluginsManager = PluginsManager.getInstance()

  /**
   * Constructor
   */
  constructor(private application: ApplicationContract) {}

  /**
   * Register
   */
  public register() {
    const radonisConfig: RadonisConfig = this.application.config.get('radonis', {})

    /**
     * Install plugins
     */
    this.pluginsManager.install('server', ...radonisConfig.plugins)

    /**
     * ManifestBuilder
     */
    this.application.container.singleton('Microeinhundert/Radonis/ManifestBuilder', () => {
      const { Builder: ManifestBuilder } = require('@microeinhundert/radonis-manifest')

      const flashMessagesManager = FlashMessagesManager.getInstance()
      const i18nManager = I18nManager.getInstance()
      const routesManager = RoutesManager.getInstance()

      return new ManifestBuilder(flashMessagesManager, i18nManager, routesManager, {
        limitClientManifest: radonisConfig.client.limitManifest,
      })
    })

    /**
     * AssetsManager
     */
    this.application.container.singleton('Microeinhundert/Radonis/AssetsManager', () => {
      const { AssetsManager } = require('../src/AssetsManager')

      return new AssetsManager(this.application, radonisConfig)
    })

    /**
     * HeadManager
     */
    this.application.container.singleton('Microeinhundert/Radonis/HeadManager', () => {
      const { HeadManager } = require('../src/HeadManager')

      return new HeadManager(radonisConfig)
    })

    /**
     * Renderer
     */
    this.application.container.singleton('Microeinhundert/Radonis/Renderer', () => {
      const I18n = this.application.container.resolveBinding('Adonis/Addons/I18n')
      const AssetsManager = this.application.container.resolveBinding('Microeinhundert/Radonis/AssetsManager')
      const HeadManager = this.application.container.resolveBinding('Microeinhundert/Radonis/HeadManager')
      const ManifestBuilder = this.application.container.resolveBinding('Microeinhundert/Radonis/ManifestBuilder')

      const { Renderer } = require('../src/Renderer')

      return new Renderer(I18n, AssetsManager, HeadManager, ManifestBuilder)
    })

    /**
     * Main
     */
    this.application.container.singleton('Microeinhundert/Radonis', () => {
      return {
        useAdonis,
        useApplication,
        useHttpContext,
        useSession,
        useRequest,
        useRouter,
        useHead,
        HydrationRoot,
      }
    })
  }

  /**
   * Boot
   */
  public async boot() {
    await this.pluginsManager.execute('onBootServer', null, null)

    this.application.container.withBindings(
      [
        'Adonis/Core/HttpContext',
        'Adonis/Core/Application',
        'Adonis/Core/Route',
        'Microeinhundert/Radonis/ManifestBuilder',
        'Microeinhundert/Radonis/AssetsManager',
        'Microeinhundert/Radonis/HeadManager',
        'Microeinhundert/Radonis/Renderer',
      ],
      async (HttpContext, Application, Router, ManifestBuilder, AssetsManager, HeadManager, Renderer) => {
        await AssetsManager.readBuildManifest()

        /**
         * Set routes on the ManifestBuilder
         */
        ManifestBuilder.setRoutes(extractRootRoutes(Router))

        /**
         * Define getter
         */
        HttpContext.getter(
          'radonis',
          function () {
            ManifestBuilder.prepareForNewRequest()
            AssetsManager.prepareForNewRequest()
            HeadManager.prepareForNewRequest()

            return Renderer.getRendererForRequest(this, Application, Router)
          },
          true
        )
      }
    )
  }
}
