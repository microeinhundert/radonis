declare module '@ioc:Adonis/Core/HttpContext' {
  import type { ComponentPropsWithoutRef, ComponentType } from 'react';
  import type { AdonisContextContract } from '@ioc:Radonis';

  interface HttpContextContract {
    radonis: {
      shareContext(context: AdonisContextContract): void;
      shareTranslations(locale: string, messages: Record<string, string>): void;
      render<T>(
        Component: ComponentType<T>,
        props?: ComponentPropsWithoutRef<ComponentType<T>>
      ): string;
    };
  }
}

declare module '@ioc:Radonis' {
  import type { ApplicationContract } from '@ioc:Adonis/Core/Application';
  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
  import type { RequestContract } from '@ioc:Adonis/Core/Request';
  import type { RouterContract } from '@ioc:Adonis/Core/Route';
  import type { SessionContract } from '@ioc:Adonis/Addons/Session';
  import type { ReactElement } from 'react';

  interface AdonisContextContract {
    app: ApplicationContract;
    ctx: HttpContextContract;
    request: RequestContract;
    router: RouterContract;
  }

  function useAdonis(): AdonisContextContract;

  function useApp(): ApplicationContract;

  function useHttpContext(): HttpContextContract;

  function useSession(): SessionContract;

  function useRequest(): RequestContract;

  function useRouter(): RouterContract;

  interface HydrationRootProps {
    children: ReactElement;
    componentName: string;
  }

  function HydrationRoot(props: HydrationRootProps): JSX.Element;
}
