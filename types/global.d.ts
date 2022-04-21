declare global {
  namespace Radonis {
    type FlashMessage = string | boolean | number

    type Route = { name?: string; pattern?: string }

    interface Manifest {
      props: Record<string, Record<string, unknown>>
      flashMessages: Record<string, FlashMessage>
      locale: string
      messages: Record<string, string>
      routes: Record<string, any>
      route: Route | null
    }
  }

  var manifest: Radonis.Manifest | undefined

  interface Window {
    manifest: Radonis.Manifest | undefined
  }
}

export {}
