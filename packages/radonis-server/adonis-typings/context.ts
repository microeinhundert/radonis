/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Core/HttpContext' {
  import type { Globals, RadonisJSONResponse, UnwrapProps } from '@microeinhundert/radonis-types'
  import type { HeadMeta, HeadTag, RenderOptions } from '@ioc:Microeinhundert/Radonis'
  import type { ComponentPropsWithoutRef, PropsWithoutRef, ComponentType } from 'react'

  interface RadonisContract {
    withTitle(string: string): RadonisContract
    withHeadMeta(meta: HeadMeta): RadonisContract
    withHeadTags(tags: HeadTag[]): RadonisContract
    withGlobals(globals: Globals): RadonisContract
    json<T>(body: T): RadonisJSONResponse
    render<T extends PropsWithoutRef<any>>(
      Component: ComponentType<T>,
      props?: ComponentPropsWithoutRef<ComponentType<T>>,
      options?: RenderOptions
    ): Promise<string | UnwrapProps<T> | undefined>
  }

  interface HttpContextContract {
    radonis: RadonisContract
  }
}
