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
import superjson from 'superjson'

export default class RadonisProvider {
  static needsApplication = true

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
    this.#application = application
    this.#config = application.config.get('radonis', {})
  }

  /**
   * Register services
   */
  #registerServices(): void {
    /**
     * AssetsManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/AssetsManager', () => {
      const { AssetsManager } = require('../src/assets_manager/main')

      return AssetsManager.getSingletonInstance(this.#application)
    })

    /**
     * HeadManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/HeadManager', () => {
      const { HeadManager } = require('../src/head_manager/main')

      return HeadManager.getSingletonInstance(this.#config, this.#application)
    })

    /**
     * HydrationManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/HydrationManager', () => {
      const { HydrationManager } = require('../src/hydration_manager/main')

      return HydrationManager.getSingletonInstance(this.#config, this.#application)
    })

    /**
     * ManifestManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/ManifestManager', () => {
      const { ManifestManager } = require('../src/manifest_manager/main')

      return ManifestManager.getSingletonInstance(this.#config, this.#application)
    })

    /**
     * PluginsManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/PluginsManager', () => {
      const { PluginsManager } = require('../src/plugins_manager/main')

      return PluginsManager.getSingletonInstance(this.#config, this.#application)
    })

    /**
     * Renderer
     */
    this.#application.container.singleton('Microeinhundert/Radonis/Renderer', () => {
      const { Renderer } = require('../src/renderer/main')

      return Renderer.getSingletonInstance(this.#config, this.#application)
    })
  }

  /**
   * Register
   */
  register(): void {
    this.#registerServices()
  }

  /**
   * Boot
   */
  async boot(): Promise<void> {
    this.#application.container.withBindings(['Microeinhundert/Radonis/PluginsManager'], async (PluginsManager) => {
      /**
       * Install plugins
       */
      PluginsManager.install('server', ...this.#config.plugins)

      /**
       * Execute `onBootServer` plugin hook
       */
      await PluginsManager.execute('onBootServer', null, {
        appRoot: this.#application.appRoot,
        resourcesPath: this.#application.resourcesPath(),
      })
    })

    this.#application.container.withBindings(
      [
        'Adonis/Core/Server',
        'Microeinhundert/Radonis/AssetsManager',
        'Microeinhundert/Radonis/HeadManager',
        'Microeinhundert/Radonis/HydrationManager',
        'Microeinhundert/Radonis/ManifestManager',
        'Microeinhundert/Radonis/PluginsManager',
        'Microeinhundert/Radonis/Renderer',
      ],
      async (Server, AssetsManager, HeadManager, HydrationManager, ManifestManager, PluginsManager, Renderer) => {
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
             * Update the assets manifest on incoming HTML
             * requests (when not in production)
             */
            if (request.accepts(['html']) && !this.#application.inProduction) {
              await AssetsManager.updateAssetsManifest()
            }

            /**
             * Execute `beforeRequest` plugin hooks
             */
            await PluginsManager.execute('beforeRequest', null, { ctx })
          })
          .after(async (ctx) => {
            const { request, response } = ctx

            /**
             * Execute `afterRequest` plugin hooks
             */
            await PluginsManager.execute('afterRequest', null, { ctx })

            /**
             * If the request was made by Radonis,
             * serialize the response with superjson
             */
            if (
              !response.finished &&
              !response.isStreamResponse &&
              request.accepts(['json']) &&
              request.header('x-radonis-request') === 'true'
            ) {
              response.header('x-radonis-response', 'true').json(superjson.serialize(response.getBody()))
            }
          })
      }
    )

    this.#application.container.withBindings(
      ['Adonis/Core/HttpContext', 'Microeinhundert/Radonis/AssetsManager', 'Microeinhundert/Radonis/Renderer'],
      async (HttpContext, AssetsManager, Renderer) => {
        await AssetsManager.updateAssetsManifest()

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
