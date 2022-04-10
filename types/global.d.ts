declare global {
  namespace Radonis {
    interface Manifest {
      props: Map<string, Record<string, unknown>>;
      route: { name: string | null; pattern: string | null } | null;
      routes: Record<string, any>;
      locale: string;
      messages: Record<string, string>;
    }

    interface I18nManagerContract {
      setLocale: (locale: Manifest['locale']) => void;
      getLocale: () => Manifest['locale'];

      setMessages: (messages: Manifest['messages']) => void;
      getMessages: (all?: boolean) => Manifest['messages'];

      requireMessageForHydration: (identifier: string) => void;
      fresh: () => this;
    }

    interface RoutesManagerContract {
      setRoutes: (routes: Manifest['routes']) => void;
      getRoutes: (all?: boolean) => Manifest['routes'];

      requireRouteForHydration: (identifier: string) => void;
      fresh: () => this;
    }
  }

  /* eslint-disable @typescript-eslint/naming-convention */
  var rad_clientManifest: Radonis.Manifest | undefined;
  var rad_serverManifest: Radonis.Manifest | undefined;
  var rad_i18nManager: Radonis.I18nManagerContract | undefined;
  var rad_routesManager: Radonis.RoutesManagerContract | undefined;

  interface Window {
    rad_clientManifest: Radonis.Manifest | undefined;
  }
}

export {};
