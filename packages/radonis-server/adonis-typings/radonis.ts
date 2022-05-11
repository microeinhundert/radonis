/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Addons/Radonis' {
  import type { BuildOptions } from 'esbuild'
  import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  import type { RequestContract } from '@ioc:Adonis/Core/Request'
  import type { RouterContract } from '@ioc:Adonis/Core/Route'
  import type { SessionContract } from '@ioc:Adonis/Addons/Session'
  import type { ReactElement } from 'react'
  import type { Plugin } from '@microeinhundert/radonis-shared'

  interface RadonisContextContract {
    application: ApplicationContract
    httpContext: HttpContextContract
    router: RouterContract
  }

  function useRadonis(): RadonisContextContract

  function useApplication(): ApplicationContract

  function useHttpContext(): HttpContextContract

  function useSession(): SessionContract

  function useRequest(): RequestContract

  function useRouter(): RouterContract

  interface HeadMeta {
    charset?: 'utf-8'
    charSet?: 'utf-8'
    [name: string]: null | string | undefined | Array<Record<string, string> | string>
  }

  interface HeadContract {
    setTitle(title: string): void
    addMeta(meta: HeadMeta): void
  }

  function useHead(): HeadContract

  interface HydrationRootProps {
    children: ReactElement<Record<string, unknown>>
    componentName: string
  }

  function HydrationRoot(props: HydrationRootProps): JSX.Element

  interface RenderOptions {
    title?: string
    meta?: HeadMeta
  }

  interface RadonisConfig {
    plugins: Plugin[]
    client: {
      entryFile: string
      componentsDir: string
      outputDir: string
      limitManifest: boolean
      buildOptions: BuildOptions
    }
  }
}
