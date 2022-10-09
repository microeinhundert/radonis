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

import {
  HydrationRoot,
  useAdonis,
  useApplication,
  useHttpContext,
  useRequest,
  useRouter,
  useSession,
} from '../src/react'

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
   * Register
   */
  register(): void {
    /**
     * Config
     */
    this.#application.container.singleton('Microeinhundert/Radonis/Config', () => {
      return this.#application.config.get('radonis', {})
    })

    /**
     * PluginsManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/PluginsManager', () => {
      const { PluginsManager } = require('@microeinhundert/radonis-shared')

      return PluginsManager.getSingletonInstance()
    })

    /**
     * HydrationManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/HydrationManager', () => {
      const { HydrationManager } = require('@microeinhundert/radonis-hydrate')

      return HydrationManager.getSingletonInstance()
    })

    /**
     * AssetsManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/AssetsManager', () => {
      const { AssetsManager } = require('../src/assetsManager')

      return new AssetsManager(this.#application)
    })

    /**
     * HeadManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/HeadManager', () => {
      const { HeadManager } = require('../src/headManager')

      return new HeadManager(this.#application)
    })

    /**
     * ManifestManager
     */
    this.#application.container.singleton('Microeinhundert/Radonis/ManifestManager', () => {
      const { ManifestManager } = require('../src/manifestManager')

      return new ManifestManager(this.#application)
    })

    /**
     * Renderer
     */
    this.#application.container.singleton('Microeinhundert/Radonis/Renderer', () => {
      const { Renderer } = require('../src/renderer')

      return new Renderer(this.#application)
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
        HydrationRoot,
      }
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
      ['Adonis/Core/Server', 'Microeinhundert/Radonis/PluginsManager'],
      async (Server, PluginsManager) => {
        /**
         * Register server hooks
         */
        Server.hooks
          .before(async () => {
            await PluginsManager.execute('beforeRequest', null, null)
          })
          .after(async ({ request, response }) => {
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

            await PluginsManager.execute('afterRequest', null, null)
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
