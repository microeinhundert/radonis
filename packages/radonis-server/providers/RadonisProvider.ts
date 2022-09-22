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
} from '../src/react'
import { extractRootRoutes } from '../src/utils/extractRootRoutes'

export default class RadonisProvider {
  static needsApplication = true

  /**
   * The PluginsManager instance
   */
  #pluginsManager: PluginsManager

  /**
   * The application
   */
  #application: ApplicationContract

  /**
   * The Radonis config
   */
  #config: RadonisConfig

  /**
   * Constructor
   */
  constructor(application: ApplicationContract) {
    this.#pluginsManager = PluginsManager.getSingletonInstance()
    this.#application = application
    this.#config = this.#application.config.get('radonis', {})
  }

  /**
   * Register
   */
  register() {
    /**
     * Install plugins
     */
    this.#pluginsManager.install('server', ...this.#config.plugins)

    /**
     * ManifestBuilder
     */
    this.#application.container.singleton('Microeinhundert/Radonis/ManifestBuilder', () => {
      const { Builder: ManifestBuilder } = require('@microeinhundert/radonis-manifest')

      const flashMessagesManager = FlashMessagesManager.getSingletonInstance()
      const i18nManager = I18nManager.getSingletonInstance()
      const routesManager = RoutesManager.getSingletonInstance()

      return new ManifestBuilder(flashMessagesManager, i18nManager, routesManager, {
        limitClientManifest: this.#config.client.limitManifest,
      })
    })

    /**
     * AssetsManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/AssetsManager', () => {
      const { AssetsManager } = require('../src/assetsManager')

      return new AssetsManager(this.#application, this.#config)
    })

    /**
     * HeadManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/HeadManager', () => {
      const { HeadManager } = require('../src/headManager')

      return new HeadManager(this.#config)
    })

    /**
     * Renderer
     */
    this.#application.container.singleton('Microeinhundert/Radonis/Renderer', () => {
      const AssetsManager = this.#application.container.resolveBinding('Microeinhundert/Radonis/AssetsManager')
      const HeadManager = this.#application.container.resolveBinding('Microeinhundert/Radonis/HeadManager')
      const ManifestBuilder = this.#application.container.resolveBinding('Microeinhundert/Radonis/ManifestBuilder')

      const { Renderer } = require('../src/renderer')

      return new Renderer(AssetsManager, HeadManager, ManifestBuilder)
    })

    /**
     * Main
     */
    this.#application.container.singleton('Microeinhundert/Radonis', () => {
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
  async boot() {
    await this.#pluginsManager.execute('onBootServer', null, null)

    this.#application.container.withBindings(['Adonis/Core/Server'], (Server) => {
      Server.hooks
        .before(async () => {
          await this.#pluginsManager.execute('beforeRequest', null, null)
        })
        .after(async () => {
          await this.#pluginsManager.execute('afterRequest', null, null)
        })
    })

    this.#application.container.withBindings(
      [
        'Adonis/Core/HttpContext',
        'Adonis/Core/Application',
        'Adonis/Core/Route',
        'Adonis/Addons/I18n',
        'Microeinhundert/Radonis/ManifestBuilder',
        'Microeinhundert/Radonis/AssetsManager',
        'Microeinhundert/Radonis/HeadManager',
        'Microeinhundert/Radonis/Renderer',
      ],
      async (HttpContext, Application, Route, I18n, ManifestBuilder, AssetsManager, HeadManager, Renderer) => {
        await AssetsManager.readBuildManifest()

        /**
         * Set routes on the ManifestBuilder
         */
        ManifestBuilder.setRoutes(extractRootRoutes(Route))

        /**
         * Define getter
         */
        HttpContext.getter(
          'radonis',
          function () {
            ManifestBuilder.resetForNewRequest()
            AssetsManager.resetForNewRequest()
            HeadManager.resetForNewRequest()

            return Renderer.getForRequest(this, Application, Route, I18n)
          },
          true
        )
      }
    )
  }
}
