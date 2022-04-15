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

  interface HttpContextContract {
    radonis: {
      shareContext(context: RadonisContextContract): void
      shareTranslations(locale: string, messages: Record<string, string>): void
      render<T>(Component: ComponentType<T>, props?: ComponentPropsWithoutRef<ComponentType<T>>): string
    }
  }
}
