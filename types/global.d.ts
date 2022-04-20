declare global {
  namespace Radonis {
    type FlashMessage = string | boolean | number

    type Route = { name?: string; pattern?: string }

    interface Manifest {
      props: Record<string, Record<string, unknown>>
      route: Route | null
      routes: Record<string, any>
      locale: string
      messages: Record<string, string>
      flashMessages: Record<string, FlashMessage>
    }
  }

  var manifest: Radonis.Manifest | undefined

  interface Window {
    manifest: Radonis.Manifest | undefined
  }
}

export {}
