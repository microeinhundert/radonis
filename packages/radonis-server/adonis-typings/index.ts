declare module '@ioc:Adonis/Core/HttpContext' {
  import type { ComponentPropsWithoutRef, ComponentType } from 'react'
  import type { RadonisContextContract } from '@ioc:Adonis/Addons/Radonis'

  interface HttpContextContract {
    radonis: {
      shareContext(context: RadonisContextContract): void
      shareTranslations(locale: string, messages: Record<string, string>): void
      render<T>(
        Component: ComponentType<T>,
        props?: ComponentPropsWithoutRef<ComponentType<T>>
      ): string
    }
  }
}

declare module '@ioc:Adonis/Addons/Radonis' {
  import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  import type { RequestContract } from '@ioc:Adonis/Core/Request'
  import type { RouterContract } from '@ioc:Adonis/Core/Route'
  import type { SessionContract } from '@ioc:Adonis/Addons/Session'
  import type { ReactElement } from 'react'

  interface RadonisContextContract {
    application: ApplicationContract
    ctx: HttpContextContract
    request: RequestContract
    router: RouterContract
  }

  function useRadonis(): RadonisContextContract

  function useApplication(): ApplicationContract

  function useHttpContext(): HttpContextContract

  function useSession(): SessionContract

  function useRequest(): RequestContract

  function useRouter(): RouterContract

  interface HydrationRootProps {
    children: ReactElement
    componentName: string
  }

  function HydrationRoot(props: HydrationRootProps): JSX.Element

  interface RadonisConfig {
    productionMode: boolean
  }
}
