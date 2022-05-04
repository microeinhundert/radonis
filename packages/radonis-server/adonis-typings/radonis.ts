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

  export interface RadonisContextContract {
    application: ApplicationContract
    httpContext: HttpContextContract
    router: RouterContract
  }

  export function useRadonis(): RadonisContextContract

  export function useApplication(): ApplicationContract

  export function useHttpContext(): HttpContextContract

  export function useSession(): SessionContract

  export function useRequest(): RequestContract

  export function useRouter(): RouterContract

  export interface HydrationRootProps {
    children: ReactElement<Record<string, unknown>>
    componentName: string
  }

  export function HydrationRoot(props: HydrationRootProps): JSX.Element

  export interface RadonisConfig {
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
