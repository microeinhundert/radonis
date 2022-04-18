declare global {
  namespace Radonis {
    type FlashMessage = string | boolean | number

    interface Manifest {
      props: Record<string, Record<string, unknown>>
      route: { name?: string; pattern?: string } | null
      routes: Record<string, any>
      locale: string
      messages: Record<string, string>
      flashMessages: Record<string, FlashMessage>
    }
  }

  /* eslint-disable @typescript-eslint/naming-convention */
  var rad_clientManifest: Radonis.Manifest | undefined
  var rad_serverManifest: Radonis.Manifest | undefined

  interface Window {
    rad_clientManifest: Radonis.Manifest | undefined
  }
}

export {}
