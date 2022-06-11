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
import type { RouterContract } from '@ioc:Adonis/Core/Route'
import { FlashMessagesManager, I18nManager, RoutesManager } from '@microeinhundert/radonis-manifest'
import { isProduction, PluginsManager } from '@microeinhundert/radonis-shared'
import { generateAndWriteTypesToDisk } from '@microeinhundert/radonis-types'

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

/**
 * Extract the root routes from a Router instance
 */
export function extractRootRoutes(Router: RouterContract): Record<string, any> {
  const rootRoutes = Router.toJSON()?.['root'] ?? []

  return rootRoutes.reduce<Record<string, any>>((routes, route) => {
    if (route.name) {
      routes[route.name] = route.pattern
    } else if (typeof route.handler === 'string') {
      routes[route.handler] = route.pattern
    }

    return routes
  }, {})
}

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
    await this.pluginsManager.execute('onBootServer', null, null)

    this.application.container.withBindings(
      [
        'Adonis/Core/HttpContext',
        'Adonis/Core/Application',
        'Adonis/Core/Route',
        'Adonis/Addons/I18n',
        'Adonis/Addons/Radonis/ManifestBuilder',
        'Adonis/Addons/Radonis/AssetsManager',
        'Adonis/Addons/Radonis/HeadManager',
        'Adonis/Addons/Radonis/Renderer',
      ],
      async (HttpContext, Application, Route, I18n, ManifestBuilder, AssetsManager, HeadManager, Renderer) => {
        /**
         * Initialize the AssetsManager
         */
        await AssetsManager.init()

        /**
         * Set routes on the ManifestBuilder
         */
        const routes = extractRootRoutes(Route)
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

            return Renderer.getRendererForRequest(this, Application, Route)
          },
          true
        )

        if (!isProduction) {
          const messagesForDefaultLocale = I18n.getTranslationsFor(I18n.defaultLocale)

          /**
           * Generate types
           */
          generateAndWriteTypesToDisk(
            {
              components: AssetsManager.components.all,
              messages: Object.keys(messagesForDefaultLocale),
              routes: Object.keys(routes),
            },
            Application.tmpPath('types')
          )
        }
      }
    )
  }
}
