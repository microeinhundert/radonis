import type { Plugin } from 'esbuild'
import { readFileSync } from 'fs'

import { injectHydrateCall } from './utils'

const DEFAULT_EXPORT_REGEX = /export[ \t]+default[ \t]+(function[ \t]+)?(?<name>\w+)/gs
const COMPONENTS_PLUGIN_NAME = 'radonis-components'

/**
 * This plugin is responsible for bundling each component into its own file,
 * while wrapping the component with the code required for hydration.
 */
export const componentsPlugin = (componentsDir: string): Plugin => ({
  name: COMPONENTS_PLUGIN_NAME,
  setup(build) {
    build.onResolve({ filter: /\.tsx$/ }, ({ path }) => {
      if (path.startsWith(componentsDir)) {
        return { path, namespace: COMPONENTS_PLUGIN_NAME }
      }
    })

    build.onLoad({ filter: /.*/, namespace: COMPONENTS_PLUGIN_NAME }, ({ path }) => {
      try {
        const componentSource = readFileSync(path, 'utf8')
        const [match] = [...componentSource.matchAll(DEFAULT_EXPORT_REGEX)]

        if (!match.groups?.name) {
          return {
            errors: [
              {
                text: `Found component at "${path}" without default export`,
                pluginName: COMPONENTS_PLUGIN_NAME,
              },
            ],
          }
        }

        return {
          contents: injectHydrateCall(componentSource, match.groups.name),
          resolveDir: process.cwd(),
          loader: 'tsx',
        }
      } catch {
        return {
          errors: [
            {
              text: `Error compiling component at "${path}"`,
              pluginName: COMPONENTS_PLUGIN_NAME,
            },
          ],
        }
      }
    })
  },
})
