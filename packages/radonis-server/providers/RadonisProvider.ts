import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

import { HydrationRoot } from '../src/internal/components/HydrationRoot'
import { useApplication } from '../src/internal/hooks/useApplication'
import { useHttpContext } from '../src/internal/hooks/useHttpContext'
import { useRadonis } from '../src/internal/hooks/useRadonis'
import { useRequest } from '../src/internal/hooks/useRequest'
import { useRouter } from '../src/internal/hooks/useRouter'
import { useSession } from '../src/internal/hooks/useSession'
import { ManifestBuilder } from '../src/internal/ManifestBuilder'
import { ReactRenderer } from '../src/internal/ReactRenderer'
import { extractRoutesFromRouter } from '../src/internal/utils/router'

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
  }

  /**
   * Boot
   */
  public boot() {
    const config: RadonisConfig = this.application.container
      .resolveBinding('Adonis/Core/Config')
      .get('radonis', {})

    this.application.container.withBindings(
      ['Adonis/Core/HttpContext', 'Adonis/Core/Application', 'Adonis/Core/Route'],
      (HttpContext, application, Router) => {
        HttpContext.getter(
          'radonis',
          function () {
            const manifestBuilder = ManifestBuilder.construct()

            /**
             * Set routing related data on the ManifestBuilder
             */
            const routes = extractRoutesFromRouter(Router)
            manifestBuilder.setRoutes(routes)
            manifestBuilder.setRoute({
              name: this.route?.name,
              pattern: this.route?.pattern,
            })

            if (this.session) {
              /**
               * Set flash messages on the ManifestBuilder
               */
              manifestBuilder.setFlashMessages(this.session.flashMessages?.all() ?? {})
            }

            const reactRenderer = ReactRenderer.construct(manifestBuilder, [], [], config)

            /**
             * Share context with the ReactRenderer
             */
            reactRenderer.shareContext({
              application,
              ctx: this,
              request: this.request,
              router: Router,
            })

            return reactRenderer
          },
          true
        )
      }
    )
  }
}
