declare global {
  namespace Radonis {
    type FlashMessage = string | boolean | number

    interface Manifest {
      props: Map<string, Record<string, unknown>>
      route: { name?: string; pattern?: string } | null
      routes: Record<string, any>
      locale: string
      messages: Record<string, string>
      flashMessages: Record<string, FlashMessage>
    }

    interface I18nManagerContract {
      setLocale: (locale: Manifest['locale']) => void
      getLocale: () => Manifest['locale']

      setMessages: (messages: Manifest['messages']) => void
      getMessages: (all?: boolean) => Manifest['messages']

      requireMessageForHydration: (identifier: string) => void
      fresh: () => this
    }

    interface RoutesManagerContract {
      setRoutes: (routes: Manifest['routes']) => void
      getRoutes: (all?: boolean) => Manifest['routes']

      requireRouteForHydration: (identifier: string) => void
      fresh: () => this
    }

    interface FlashMessagesManagerContract {
      setFlashMessages: (flashMessages: Manifest['flashMessages']) => void
      getFlashMessages: (all?: boolean) => Manifest['flashMessages']

      requireFlashMessageForHydration: (identifier: string) => void
      fresh: () => this
    }
  }

  /* eslint-disable @typescript-eslint/naming-convention */
  var rad_clientManifest: Radonis.Manifest | undefined
  var rad_serverManifest: Radonis.Manifest | undefined
  var rad_i18nManager: Radonis.I18nManagerContract | undefined
  var rad_routesManager: Radonis.RoutesManagerContract | undefined
  var rad_flashMessagesManager: Radonis.FlashMessagesManagerContract | undefined

  interface Window {
    rad_clientManifest: Radonis.Manifest | undefined
  }
}

export {}
