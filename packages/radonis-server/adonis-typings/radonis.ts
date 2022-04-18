/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Addons/Radonis' {
  import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  import type { RequestContract } from '@ioc:Adonis/Core/Request'
  import type { RouterContract } from '@ioc:Adonis/Core/Route'
  import type { SessionContract } from '@ioc:Adonis/Addons/Session'
  import type { ReactElement } from 'react'

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
    children: ReactElement
    componentName: string
  }

  export function HydrationRoot(props: HydrationRootProps): JSX.Element

  export interface RadonisConfig {
    productionMode: boolean
    componentsDir: string
    clientBundleOutputDir: string
  }
}

declare module '@microeinhundert/radonis-server' {
  export class FlashMessagesManager {
    public requireFlashMessageForHydration: (identifier: string) => void
  }

  export class I18nManager {
    public requireMessageForHydration: (identifier: string) => void
  }

  export class RoutesManager {
    public requireRouteForHydration: (identifier: string) => void
  }
}
