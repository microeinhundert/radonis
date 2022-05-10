declare global {
  namespace Radonis {
    import type { ReactElement } from 'react'

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

    interface BuildManifestEntry {
      type: 'component' | 'entry' | 'chunk'
      path: string
      publicPath: string
      flashMessages: Set<string>
      messages: Set<string>
      routes: Set<string>
      imports: BuildManifestEntry[]
    }

    type BuildManifest = Record<string, BuildManifestEntry>

    interface AssetsManifestEntry {
      type: 'component' | 'entry'
      identifier: string
      path: string
      flashMessages: Set<string>
      messages: Set<string>
      routes: Set<string>
    }

    type AssetsManifest = AssetsManifestEntry[]

    interface HTMLMetaDescriptor {
      charset?: 'utf-8'
      charSet?: 'utf-8'
      title?: string
      [name: string]: null | string | undefined | Array<Record<string, string> | string>
    }
  }

  var radonisManifest: Radonis.Manifest | undefined

  interface Window {
    radonisManifest: Radonis.Manifest | undefined
  }
}

export {}
