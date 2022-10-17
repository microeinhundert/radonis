/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import superjson from 'superjson'

export default class RadonisProvider {
  static needsApplication = true

  /**
   * The application
   */
  #application: ApplicationContract

  /**
   * Constructor
   */
  constructor(application: ApplicationContract) {
    this.#application = application
  }

  /**
   * Register services
   */
  #registerServices(): void {
    /**
     * AssetsManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/AssetsManager', () => {
      const { AssetsManager } = require('../src/services/assetsManager')

      return AssetsManager.getSingletonInstance(this.#application)
    })

    /**
     * HeadManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/HeadManager', () => {
      const { HeadManager } = require('../src/services/headManager')

      return HeadManager.getSingletonInstance(this.#application)
    })

    /**
     * HydrationManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/HydrationManager', () => {
      const { HydrationManager } = require('../src/services/hydrationManager')

      return HydrationManager.getSingletonInstance(this.#application)
    })

    /**
     * PluginsManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/PluginsManager', () => {
      const { PluginsManager } = require('../src/services/pluginsManager')

      return PluginsManager.getSingletonInstance(this.#application)
    })

    /**
     * ManifestManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/ManifestManager', () => {
      const { ManifestManager } = require('../src/services/manifestManager')

      return ManifestManager.getSingletonInstance(this.#application)
    })

    /**
     * Renderer
     */
    this.#application.container.singleton('Microeinhundert/Radonis/Renderer', () => {
      const { Renderer } = require('../src/services/renderer')

      return Renderer.getSingletonInstance(this.#application)
    })
  }

  /**
   * Register
   */
  register(): void {
    this.#registerServices()

    /**
     * Config
     */
    this.#application.container.singleton('Microeinhundert/Radonis/Config', () => {
      return this.#application.config.get('radonis', {})
    })
  }

  /**
   * Boot
   */
  async boot(): Promise<void> {
    this.#application.container.withBindings(
      ['Microeinhundert/Radonis/Config', 'Microeinhundert/Radonis/PluginsManager'],
      async (Config, PluginsManager) => {
        /**
         * Install plugins
         */
        PluginsManager.install('server', ...Config.plugins)

        /**
         * Execute `onBootServer` plugin hook
         */
        await PluginsManager.execute('onBootServer', null, {
          appRoot: this.#application.appRoot,
          resourcesPath: this.#application.resourcesPath(),
        })
      }
    )

    this.#application.container.withBindings(
      [
        'Adonis/Core/Server',
        'Microeinhundert/Radonis/AssetsManager',
        'Microeinhundert/Radonis/HeadManager',
        'Microeinhundert/Radonis/HydrationManager',
        'Microeinhundert/Radonis/PluginsManager',
        'Microeinhundert/Radonis/ManifestManager',
        'Microeinhundert/Radonis/Renderer',
      ],
      async (Server, AssetsManager, HeadManager, HydrationManager, PluginsManager, ManifestManager, Renderer) => {
        /**
         * Register server hooks
         */
        Server.hooks
          .before(async (ctx) => {
            const { request } = ctx

            /**
             * Reset everything, so incoming requests don't accidentally
             * get data from the previous request
             */
            Renderer.reset()
            HydrationManager.reset()
            ManifestManager.reset()
            HeadManager.reset()
            AssetsManager.reset()

            /**
             * Execute `beforeRequest` plugin hooks
             */
            await PluginsManager.execute('beforeRequest', null, { ctx })

            /**
             * Read the build manifest on incoming HTML
             * requests when not in production
             */
            if (request.accepts(['html']) && !this.#application.inProduction) {
              await AssetsManager.readBuildManifest()
            }
          })
          .after(async (ctx) => {
            const { request, response } = ctx

            /**
             * If the request was made by Radonis,
             * serialize the response with superjson
             */
            if (
              !response.finished &&
              !response.isStreamResponse &&
              request.accepts(['json']) &&
              request.header('X-Radonis-Request') === 'true'
            ) {
              response.json(superjson.serialize(response.getBody()))
            }

            /**
             * Execute `afterRequest` plugin hooks
             */
            await PluginsManager.execute('afterRequest', null, { ctx })
          })
      }
    )

    this.#application.container.withBindings(
      ['Adonis/Core/HttpContext', 'Microeinhundert/Radonis/AssetsManager', 'Microeinhundert/Radonis/Renderer'],
      async (HttpContext, AssetsManager, Renderer) => {
        await AssetsManager.readBuildManifest()

        /**
         * Define getter
         */
        HttpContext.getter(
          'radonis',
          function () {
            return Renderer.getForRequest(this)
          },
          true
        )
      }
    )
  }
}
