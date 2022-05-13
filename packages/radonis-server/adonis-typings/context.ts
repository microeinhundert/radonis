/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Core/HttpContext' {
  import type { Globals } from '@microeinhundert/radonis-shared'
  import type { RenderOptions } from '@ioc:Adonis/Addons/Radonis'
  import type { ComponentPropsWithoutRef, ComponentType } from 'react'

  interface RadonisContract {
    withGlobals(globals: Globals): RadonisContract
    render<T>(
      Component: ComponentType<T>,
      props?: ComponentPropsWithoutRef<ComponentType<T>>,
      options?: RenderOptions
    ): Promise<string>
  }

  interface HttpContextContract {
    radonis: RadonisContract
  }
}
