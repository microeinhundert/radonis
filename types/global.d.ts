declare global {
  namespace Radonis {
    import type { ReactElement } from 'react'

    type FlashMessage = string | boolean | number

    type Route = { name?: string; pattern?: string }

    type PluginHook = () => void
    type PluginHookWithBuilder<T> = () => (value: T) => T

    type Plugin = {
      onInitClient?: PluginHook
      onBootServer?: PluginHook
      afterCompile?: PluginHookWithBuilder<string>
      beforeRender?: PluginHookWithBuilder<ReactElement>
      afterRender?: PluginHookWithBuilder<string>
    }

    interface Manifest {
      props: Record<string, Record<string, unknown>>
      flashMessages: Record<string, FlashMessage>
      locale: string
      messages: Record<string, string>
      routes: Record<string, any>
      route: Route | null
    }

    type Component = { name: string; source: string; path: string }

    type BuildOutput = Record<string, { publicPath: string }>

    type Asset = {
      type: 'component' | 'entry'
      identifier: string
      path: string
      flashMessages?: Set<string>
      messages?: Set<string>
      routes?: Set<string>
    }

    type AssetManifest = Record<string, Asset>
  }

  var radonisManifest: Radonis.Manifest | undefined

  interface Window {
    radonisManifest: Radonis.Manifest | undefined
  }
}

export {}
