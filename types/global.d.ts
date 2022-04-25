declare global {
  namespace Radonis {
    import type { ReactElement } from 'react'

    type FlashMessage = string | boolean | number

    type Route = { name?: string; pattern?: string }

    type Plugin = {
      onInitClient?: () => void
      onBootServer?: () => void
      beforeRender?: (tree: ReactElement) => ReactElement
      afterRender?: (html: string) => string
    }

    interface Manifest {
      props: Record<string, Record<string, unknown>>
      flashMessages: Record<string, FlashMessage>
      locale: string
      messages: Record<string, string>
      routes: Record<string, any>
      route: Route | null
    }
  }

  var radonisManifest: Radonis.Manifest | undefined

  interface Window {
    radonisManifest: Radonis.Manifest | undefined
  }
}

export {}
