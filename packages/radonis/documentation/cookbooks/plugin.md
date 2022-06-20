# Creating A Plugin

Take a look at this snippet to see which hooks are available to plugins:

```typescript
import { definePlugin } from '@microeinhundert/radonis'

function yourPlugin() {
  return definePlugin({
    /**
     * The name of the plugin
     */
    name: 'your-plugin',

    /**
     * The environments the plugin is compatible with
     */
    environments: ['client', 'server'],

    /**
     * This plugin hook is called after the client has been initialized
     */
    onInitClient() {},

    /**
     * This plugin hook is called before a component is hydrated
     */
    beforeHydrate() {
      return (tree: ReactElement) => {
        // Return modified React tree
        return tree
      }
    },

    /**
     * This plugin hook is called after the server has been booted
     */
    onBootServer() {},

    /**
     * This plugin hook is called on scan of a previously output file
     */
    onScanFile(file: [string, string]) {},

    /**
     * This plugin hook is called before a file is output
     */
    beforeOutput() {
      return (source: string) => {
        // Return modified file source
        return source
      }
    },

    /**
     * This plugin hook is called after all files have been output
     */
    afterOutput(files: Map<string, string>) {},

    /**
     * This plugin hook is called before the page is rendered
     */
    beforeRender() {
      return (tree: ReactElement) => {
        // Return modified React tree
        return tree
      }
    },

    /**
     * This plugin hook is called after the page has been rendered
     */
    afterRender() {
      return (html: string) => {
        // Return modified HTML
        return html
      }
    },
  })
}
```

## Example Plugin

Here's an example of a plugin that injects a React context provider into the server-side rendering as well as the client-side hydration:

```tsx
import { definePlugin } from '@microeinhundert/radonis'
import React from 'react'

export function contextProviderPlugin() {
  const contextProviderValue = {
    hello: 'world',
  }

  return definePlugin({
    name: 'context-provider-plugin',
    environments: ['client', 'server'],
    beforeHydrate() {
      return (tree) => <SomeContextProvider value={contextProviderValue}>{tree}</SomeContextProvider>
    },
    beforeRender() {
      return (tree) => <SomeContextProvider value={contextProviderValue}>{tree}</SomeContextProvider>
    },
  })
}
```

## Official Plugins

[Twind](https://github.com/microeinhundert/radonis/tree/main/packages/radonis-twind)  
[UnoCSS](https://github.com/microeinhundert/radonis/tree/main/packages/radonis-unocss)

## License

[MIT](LICENSE)
