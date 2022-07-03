/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Microeinhundert/Radonis' {
  import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  import type { RequestContract } from '@ioc:Adonis/Core/Request'
  import type { RouterContract } from '@ioc:Adonis/Core/Route'
  import type { SessionContract } from '@ioc:Adonis/Addons/Session'
  import type { Globals, ComponentIdentifier } from '@microeinhundert/radonis-types'
  import type { BuildOptions } from '@microeinhundert/radonis-build'
  import type { Plugin } from '@microeinhundert/radonis-shared'
  import type { ReactElement } from 'react'

  interface AdonisContextContract {
    application: ApplicationContract
    httpContext: HttpContextContract
    router: RouterContract
  }

  function useAdonis(): AdonisContextContract
  function useApplication(): ApplicationContract
  function useHttpContext(): HttpContextContract
  function useSession(): SessionContract
  function useRequest(): RequestContract
  function useRouter(): RouterContract

  interface HeadMeta {
    charset?: 'utf-8'
    charSet?: 'utf-8'
    [name: string]: null | string | undefined | (Record<string, string> | string)[]
  }

  interface HeadContract {
    setTitle(title: string): void
    addMeta(meta: HeadMeta): void
    addData(data: string): void
  }

  function useHead(): HeadContract

  function HydrationRoot(props: {
    children: ReactElement<Record<string, any>>
    component: ComponentIdentifier
    disabled?: boolean
  }): JSX.Element

  interface RenderOptions {
    title?: string
    meta?: HeadMeta
    globals?: Globals
  }

  interface RadonisConfig {
    plugins: Plugin[]
    head: {
      title: {
        default: string
        prefix: string
        suffix: string
        separator: string
      }
      defaultMeta: HeadMeta
    }
    client: {
      entryFile: string
      alwaysIncludeEntryFile: boolean
      componentsDir: string
      limitManifest: boolean
      buildOptions: BuildOptions
    }
  }
}
