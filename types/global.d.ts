declare global {
  namespace Radonis {
    interface Manifest {
      props: Map<string, Record<string, unknown>>;
      route: { name: string | null; pattern: string | null } | null;
      routes: Record<string, any>;
      locale: string;
      translations: Record<string, string>;
    }

    interface I18nManagerContract {
      setLocale: (locale: Manifest['locale']) => void;
      getLocale: () => Manifest['locale'];

      setTranslations: (translations: Manifest['translations']) => void;
      getTranslations: (all?: boolean) => Manifest['translations'];

      markTranslationAsReferenced: (identifier: string) => void;
      clearReferencedTranslations: () => this;
    }

    interface RoutesManagerContract {
      setRoutes: (routes: Manifest['routes']) => void;
      getRoutes: (all?: boolean) => Manifest['routes'];

      markRouteAsReferenced: (identifier: string) => void;
      clearReferencedRoutes: () => this;
    }
  }

  /* eslint-disable @typescript-eslint/naming-convention */
  var arc_manifest: Radonis.Manifest | undefined;
  var ars_manifest: Radonis.Manifest | undefined;
  var ars_i18nManager: Radonis.I18nManagerContract | undefined;
  var ars_routesManager: Radonis.RoutesManagerContract | undefined;

  interface Window {
    arc_manifest: Radonis.Manifest | undefined;
  }
}

export {};
