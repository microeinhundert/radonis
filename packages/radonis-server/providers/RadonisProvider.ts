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
import { PluginsManager } from '@microeinhundert/radonis-shared'

import {
  HydrationRoot,
  useApplication,
  useHead,
  useHttpContext,
  useRadonis,
  useRequest,
  useRouter,
  useSession,
} from '../src/React'

export default class RadonisProvider {
  public static needsApplication = true

  /**
   * The PluginsManager instance
   */
  private pluginsManager: PluginsManager = new PluginsManager()

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

      return new ManifestBuilder(radonisConfig.client.limitManifest)
    })

    /**
     * Compiler
     */
    this.application.container.singleton('Adonis/Addons/Radonis/Compiler', () => {
      const Logger = this.application.container.resolveBinding('Adonis/Core/Logger')

      const { Compiler } = require('../src/Compiler')

      return new Compiler(Logger, radonisConfig)
    })

    /**
     * HeadManager
     */
    this.application.container.singleton('Adonis/Addons/Radonis/HeadManager', () => {
      const { HeadManager } = require('../src/HeadManager')

      return new HeadManager(this.application)
    })

    /**
     * Renderer
     */
    this.application.container.singleton('Adonis/Addons/Radonis/Renderer', () => {
      const I18n = this.application.container.resolveBinding('Adonis/Addons/I18n')
      const Compiler = this.application.container.resolveBinding('Adonis/Addons/Radonis/Compiler')
      const HeadManager = this.application.container.resolveBinding('Adonis/Addons/Radonis/HeadManager')
      const ManifestBuilder = this.application.container.resolveBinding('Adonis/Addons/Radonis/ManifestBuilder')

      const { Renderer } = require('../src/Renderer')

      return new Renderer(I18n, Compiler, HeadManager, ManifestBuilder)
    })

    /**
     * Main
     */
    this.application.container.singleton('Adonis/Addons/Radonis', () => {
      return {
        useRadonis,
        useApplication,
        useHead,
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
    await this.pluginsManager.execute('onBootServer', null, null)

    this.application.container.withBindings(
      [
        'Adonis/Core/HttpContext',
        'Adonis/Core/Application',
        'Adonis/Core/Route',
        'Adonis/Addons/Radonis/ManifestBuilder',
        'Adonis/Addons/Radonis/Compiler',
        'Adonis/Addons/Radonis/HeadManager',
        'Adonis/Addons/Radonis/Renderer',
      ],
      async (HttpContext, Application, Route, ManifestBuilder, Compiler, HeadManager, Renderer) => {
        await Compiler.compile()

        HttpContext.getter(
          'radonis',
          function () {
            ManifestBuilder.prepareForNewRequest()
            Compiler.prepareForNewRequest()
            HeadManager.prepareForNewRequest()

            return Renderer.getRendererForRequest(this, Application, Route)
          },
          true
        )
      }
    )
  }
}
