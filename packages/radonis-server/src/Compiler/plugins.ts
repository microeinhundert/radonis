import type { Plugin } from 'esbuild'
import { readFileSync } from 'fs'
import { dirname } from 'path'

import { COMPONENTS_PLUGIN_NAME, DEFAULT_EXPORT_CJS_REGEX, DEFAULT_EXPORT_ESM_REGEX } from './constants'
import { getLoaderForFile } from './loaders'
import { injectHydrateCall } from './utils'

/**
 * This plugin is responsible for bundling each component into its own file,
 * while wrapping the component with the code required for hydration.
 */
export const componentsPlugin = (components: string[]): Plugin => ({
  name: COMPONENTS_PLUGIN_NAME,
  setup(build) {
    build.onResolve({ filter: /\.(ts(x)?|js(x)?)$/ }, ({ path }) => {
      if (components.includes(path)) {
        return { path, namespace: COMPONENTS_PLUGIN_NAME }
      }
    })

    build.onLoad({ filter: /.*/, namespace: COMPONENTS_PLUGIN_NAME }, ({ path }) => {
      try {
        const componentSource = readFileSync(path, 'utf8')
        const loadOptions = {
          resolveDir: dirname(path),
          loader: getLoaderForFile(path),
        }

        const [esmExportMatch] = componentSource.matchAll(DEFAULT_EXPORT_ESM_REGEX)
        if (esmExportMatch?.groups?.name) {
          return {
            contents: injectHydrateCall(componentSource, esmExportMatch.groups.name, 'esm'),
            ...loadOptions,
          }
        }

        const [cjsExportMatch] = componentSource.matchAll(DEFAULT_EXPORT_CJS_REGEX)
        if (cjsExportMatch?.groups?.name) {
          return {
            contents: injectHydrateCall(componentSource, cjsExportMatch.groups.name, 'cjs'),
            ...loadOptions,
          }
        }

        return {
          errors: [
            {
              text: `Found component at "${path}" without default export`,
              pluginName: COMPONENTS_PLUGIN_NAME,
            },
          ],
        }
      } catch (error) {
        return {
          errors: [
            {
              detail: error.message,
              text: `Error compiling component at "${path}"`,
              pluginName: COMPONENTS_PLUGIN_NAME,
            },
          ],
        }
      }
    })
  },
})
