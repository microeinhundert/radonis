/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Core/HttpContext' {
  import type { ComponentPropsWithoutRef, ComponentType } from 'react'
  import type { RadonisContextContract } from '@ioc:Adonis/Addons/Radonis'
  import type { RouterContract } from '@ioc:Adonis/Core/Route'

  interface HttpContextContract {
    radonis: {
      shareContext(context: RadonisContextContract): void
      shareRoutes(router: RouterContract): void
      shareRoute(route: HttpContextContract['route']): void
      shareTranslations(locale: string, messages: Record<string, string>): void
      shareFlashMessages(flashMessages: Record<string, unknown>): void
      render<T>(Component: ComponentType<T>, props?: ComponentPropsWithoutRef<ComponentType<T>>): string
    }
  }
}
