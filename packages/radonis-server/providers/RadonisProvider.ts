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

import { Compiler } from '../src/internal/Compiler'
import { HydrationRoot } from '../src/internal/components/HydrationRoot'
import { useApplication } from '../src/internal/hooks/useApplication'
import { useHttpContext } from '../src/internal/hooks/useHttpContext'
import { useRadonis } from '../src/internal/hooks/useRadonis'
import { useRequest } from '../src/internal/hooks/useRequest'
import { useRouter } from '../src/internal/hooks/useRouter'
import { useSession } from '../src/internal/hooks/useSession'
import { FlashMessagesManager as FlashMessagesManagerInstance } from '../src/internal/managers/FlashMessagesManager'
import { I18nManager as I18nManagerInstance } from '../src/internal/managers/I18nManager'
import { RoutesManager as RoutesManagerInstance } from '../src/internal/managers/RoutesManager'
import { ManifestBuilder } from '../src/internal/ManifestBuilder'
import { ReactRenderer } from '../src/internal/ReactRenderer'
import { extractRootRoutes, transformRoute } from '../src/internal/utils/routing'

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
    this.application.container.singleton('Adonis/Addons/Radonis/Manager/FlashMessages', () => {
      return new FlashMessagesManagerInstance()
    })

    this.application.container.singleton('Adonis/Addons/Radonis/Manager/I18n', () => {
      return new I18nManagerInstance()
    })

    this.application.container.singleton('Adonis/Addons/Radonis/Manager/Routes', () => {
      return new RoutesManagerInstance()
    })

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
  public boot() {
    this.application.container.withBindings(
      [
        'Adonis/Core/HttpContext',
        'Adonis/Core/Application',
        'Adonis/Core/Route',
        'Adonis/Core/Config',
        'Adonis/Addons/Radonis/Manager/FlashMessages',
        'Adonis/Addons/Radonis/Manager/I18n',
        'Adonis/Addons/Radonis/Manager/Routes',
      ],
      async (HttpContext, application, Route, Config, FlashMessagesManager, I18nManager, RoutesManager) => {
        const radonisConfig: RadonisConfig = Config.get('radonis', {})

        /**
         * Create the Compiler
         */
        const compiler = new Compiler(radonisConfig)

        /**
         * Compile the components
         */
        await compiler.compileComponents()

        HttpContext.getter(
          'radonis',
          function () {
            const manifestBuilder = new ManifestBuilder(
              FlashMessagesManager,
              I18nManager,
              RoutesManager
            ).establishNewContext()

            /**
             * Set the root routes on the ManifestBuilder
             */
            const rootRoutes = extractRootRoutes(Route)
            manifestBuilder.setRoutes(rootRoutes)

            /**
             * Set the current route on the ManifestBuilder
             */
            const route = transformRoute(this.route)
            manifestBuilder.setRoute(route)

            /**
             * Check if @adonisjs/session is installed
             */
            if (this.session) {
              /**
               * Set the flash messages on the ManifestBuilder
               */
              manifestBuilder.setFlashMessages(this.session.flashMessages?.all() ?? {})
            }

            /**
             * Establish a new Compiler context
             */
            compiler.establishNewContext()

            /**
             * Create the ReactRenderer
             */
            const reactRenderer = new ReactRenderer(compiler, manifestBuilder, radonisConfig)

            /**
             * Share context with the ReactRenderer
             */
            return reactRenderer.shareContext({
              application,
              httpContext: this,
              router: Route,
            })
          },
          true
        )
      }
    )
  }
}
