/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

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
  register() {
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
        useHead,
        HydrationRoot,
      }
    })
  }

  /**
   * Boot
   */
  async boot() {
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
        await PluginsManager.execute('onBootServer', null, null)
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
          .after(async () => {
            await PluginsManager.execute('afterRequest', null, null)
          })
      }
    )

    this.#application.container.withBindings(
      [
        'Adonis/Core/HttpContext',
        'Microeinhundert/Radonis/AssetsManager',
        'Microeinhundert/Radonis/HeadManager',
        'Microeinhundert/Radonis/ManifestManager',
        'Microeinhundert/Radonis/Renderer',
      ],
      async (HttpContext, AssetsManager, HeadManager, ManifestManager, Renderer) => {
        await AssetsManager.readBuildManifest()

        /**
         * Define getter
         */
        HttpContext.getter(
          'radonis',
          function () {
            AssetsManager.resetForNewRequest()
            HeadManager.resetForNewRequest()
            ManifestManager.resetForNewRequest()

            return Renderer.getForRequest(this)
          },
          true
        )
      }
    )
  }
}
