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
import { readBuildManifestFromDisk } from '@microeinhundert/radonis-build'
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
    this.application.container.singleton('Adonis/Addons/Radonis/ManifestBuilder', () => {
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
    this.application.container.singleton('Adonis/Addons/Radonis/AssetsManager', () => {
      const { AssetsManager } = require('../src/AssetsManager')

      return new AssetsManager(radonisConfig)
    })

    /**
     * HeadManager
     */
    this.application.container.singleton('Adonis/Addons/Radonis/HeadManager', () => {
      const { HeadManager } = require('../src/HeadManager')

      return new HeadManager(radonisConfig)
    })

    /**
     * Renderer
     */
    this.application.container.singleton('Adonis/Addons/Radonis/Renderer', () => {
      const I18n = this.application.container.resolveBinding('Adonis/Addons/I18n')
      const AssetsManager = this.application.container.resolveBinding('Adonis/Addons/Radonis/AssetsManager')
      const HeadManager = this.application.container.resolveBinding('Adonis/Addons/Radonis/HeadManager')
      const ManifestBuilder = this.application.container.resolveBinding('Adonis/Addons/Radonis/ManifestBuilder')

      const { Renderer } = require('../src/Renderer')

      return new Renderer(I18n, AssetsManager, HeadManager, ManifestBuilder)
    })

    /**
     * Main
     */
    this.application.container.singleton('Adonis/Addons/Radonis', () => {
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
    if (this.application.environment === 'console') {
      return
    }

    await this.pluginsManager.execute('onBootServer', null, null)

    this.application.container.withBindings(
      [
        'Adonis/Core/HttpContext',
        'Adonis/Core/Application',
        'Adonis/Core/Route',
        'Adonis/Addons/Radonis/ManifestBuilder',
        'Adonis/Addons/Radonis/AssetsManager',
        'Adonis/Addons/Radonis/HeadManager',
        'Adonis/Addons/Radonis/Renderer',
      ],
      async (HttpContext, Application, Router, ManifestBuilder, AssetsManager, HeadManager, Renderer) => {
        const radonisConfig: RadonisConfig = Application.config.get('radonis', {})
        const { outputDir } = radonisConfig.client

        Router.commit()

        /**
         * Initialize the AssetsManager
         */
        const buildManifest = await readBuildManifestFromDisk(outputDir)
        await AssetsManager.init(buildManifest ?? {})

        /**
         * Set routes on the ManifestBuilder
         */
        const routes = extractRootRoutes(Router)
        ManifestBuilder.setRoutes(routes)

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
