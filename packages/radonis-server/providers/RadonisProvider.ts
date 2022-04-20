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
import { ManifestBuilder as ManifestBuilderInstance } from '@microeinhundert/radonis-manifest'

import { Compiler as CompilerInstance } from '../src/Compiler'
import { HydrationRoot } from '../src/React/components/HydrationRoot'
import { useApplication } from '../src/React/hooks/useApplication'
import { useHttpContext } from '../src/React/hooks/useHttpContext'
import { useRadonis } from '../src/React/hooks/useRadonis'
import { useRequest } from '../src/React/hooks/useRequest'
import { useRouter } from '../src/React/hooks/useRouter'
import { useSession } from '../src/React/hooks/useSession'
import { Renderer as RendererInstance } from '../src/Renderer'

export default class RadonisProvider {
  public static needsApplication = true

  /**
   * Constructor
   */
  constructor(private application: ApplicationContract) {}

  /**
   * Register
   */
  public register() {
    /**
     * ManifestBuilder
     */
    this.application.container.singleton('Adonis/Addons/Radonis/ManifestBuilder', () => {
      const { limitClientManifest }: RadonisConfig = this.application.container
        .resolveBinding('Adonis/Core/Config')
        .get('radonis', {})

      return new ManifestBuilderInstance(limitClientManifest)
    })

    /**
     * Compiler
     */
    this.application.container.singleton('Adonis/Addons/Radonis/Compiler', () => {
      const radonisConfig: RadonisConfig = this.application.container
        .resolveBinding('Adonis/Core/Config')
        .get('radonis', {})

      return new CompilerInstance(radonisConfig)
    })

    /**
     * Renderer
     */
    this.application.container.singleton('Adonis/Addons/Radonis/Renderer', () => {
      const radonisConfig: RadonisConfig = this.application.container
        .resolveBinding('Adonis/Core/Config')
        .get('radonis', {})

      const I18n = this.application.container.resolveBinding('Adonis/Addons/I18n')
      const Compiler = this.application.container.resolveBinding('Adonis/Addons/Radonis/Compiler')
      const ManifestBuilder = this.application.container.resolveBinding('Adonis/Addons/Radonis/ManifestBuilder')

      return new RendererInstance(I18n, Compiler, ManifestBuilder, radonisConfig)
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
        'Adonis/Addons/Radonis/Compiler',
        'Adonis/Addons/Radonis/ManifestBuilder',
        'Adonis/Addons/Radonis/Renderer',
      ],
      async (HttpContext, Application, Route, Compiler, ManifestBuilder, Renderer) => {
        await Compiler.compileComponents(Application.appRoot)

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
