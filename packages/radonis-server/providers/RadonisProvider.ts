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
  private pluginsManager: PluginsManager

  /**
   * Constructor
   */
  constructor(private application: ApplicationContract) {
    this.pluginsManager = new PluginsManager()
  }

  /**
   * Register
   */
  public register() {
    const radonisConfig: RadonisConfig = this.application.config.get('radonis', {})

    /**
     * Register plugins
     */
    this.pluginsManager.registerPlugins(...radonisConfig.plugins)

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
      const { Compiler } = require('../src/Compiler')

      return new Compiler(radonisConfig)
    })

    /**
     * Renderer
     */
    this.application.container.singleton('Adonis/Addons/Radonis/Renderer', () => {
      const I18n = this.application.container.resolveBinding('Adonis/Addons/I18n')
      const Compiler = this.application.container.resolveBinding('Adonis/Addons/Radonis/Compiler')
      const ManifestBuilder = this.application.container.resolveBinding('Adonis/Addons/Radonis/ManifestBuilder')

      const { Renderer } = require('../src/Renderer')

      return new Renderer(I18n, Compiler, ManifestBuilder)
    })

    /**
     * Main
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
        'Adonis/Addons/Radonis/ManifestBuilder',
        'Adonis/Addons/Radonis/Compiler',
        'Adonis/Addons/Radonis/Renderer',
      ],
      async (HttpContext, Application, Route, ManifestBuilder, Compiler, Renderer) => {
        this.pluginsManager.execute('onBootServer')

        await Compiler.compileComponents()

        HttpContext.getter(
          'radonis',
          function () {
            Compiler.prepareForNewRequest()
            ManifestBuilder.prepareForNewRequest()

            return Renderer.getRendererForRequest(this, Application, Route)
          },
          true
        )
      }
    )
  }
}
