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

import { HydrationRoot } from '../src/internal/components/HydrationRoot'
import { useApplication } from '../src/internal/hooks/useApplication'
import { useHttpContext } from '../src/internal/hooks/useHttpContext'
import { useRadonis } from '../src/internal/hooks/useRadonis'
import { useRequest } from '../src/internal/hooks/useRequest'
import { useRouter } from '../src/internal/hooks/useRouter'
import { useSession } from '../src/internal/hooks/useSession'
import { FlashMessagesManager } from '../src/internal/managers/FlashMessagesManager'
import { I18nManager } from '../src/internal/managers/I18nManager'
import { RoutesManager } from '../src/internal/managers/RoutesManager'
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

    this.application.container.singleton('Adonis/Addons/Radonis/Manager/FlashMessages', () => {
      return new FlashMessagesManager()
    })

    this.application.container.singleton('Adonis/Addons/Radonis/Manager/I18n', () => {
      return new I18nManager()
    })

    this.application.container.singleton('Adonis/Addons/Radonis/Manager/Routes', () => {
      return new RoutesManager()
    })
  }

  /**
   * Boot
   */
  public boot() {
    const config: RadonisConfig = this.application.container.resolveBinding('Adonis/Core/Config').get('radonis', {})

    this.application.container.withBindings(
      [
        'Adonis/Core/HttpContext',
        'Adonis/Core/Application',
        'Adonis/Core/Route',
        'Adonis/Addons/Radonis/Manager/FlashMessages',
        'Adonis/Addons/Radonis/Manager/I18n',
        'Adonis/Addons/Radonis/Manager/Routes',
      ],
      (HttpContext, application, Route, FlashMessages, I18n, Routes) => {
        const manifestBuilder = new ManifestBuilder(FlashMessages, I18n, Routes)

        HttpContext.getter(
          'radonis',
          function () {
            manifestBuilder.establishNewContext()

            /**
             * Set the available root routes on the ManifestBuilder
             */
            const extractedRoutes = extractRootRoutes(Route)
            manifestBuilder.setRoutes(extractedRoutes)

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

            const reactRenderer = new ReactRenderer(manifestBuilder, [], [], config)

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
