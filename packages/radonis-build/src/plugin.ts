/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Plugin } from 'esbuild'
import { dirname, parse } from 'path'

import { DEFAULT_EXPORT_REGEX } from './constants'
import { BuildException } from './exceptions/buildException'
import { getLoaderForFile } from './loaders'

/**
 * Inject the call to the hydrate function into the source code of a component
 */
function injectHydrateCall(componentName: string, exportName: string, source: string): string {
  return `
    import { registerComponentForHydration } from "@microeinhundert/radonis";
    ${source}
    registerComponentForHydration("${componentName}", ${exportName});
  `
}

/**
 * The esbuild plugin responsible for compiling the components for the client
 * @internal
 */
export const radonisClientPlugin = (components: Map<string, string>): Plugin => ({
  name: 'radonis-client',
  setup(build) {
    build.onResolve({ filter: /\.(ts(x)?|js(x)?)$/ }, ({ path }) => {
      if (components.has(path)) {
        return { path, namespace: 'radonis-client-component' }
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'radonis-client-component' }, ({ path }) => {
      try {
        const componentSource = components.get(path)

        if (!componentSource) {
          throw BuildException.cannotAnalyzeSource(path)
        }

        const { name: componentName } = parse(path)

        const loadOptions = {
          resolveDir: dirname(path),
          loader: getLoaderForFile(path),
        }

        const [defaultExportMatch] = componentSource.matchAll(DEFAULT_EXPORT_REGEX)
        if (defaultExportMatch?.groups?.name) {
          return {
            contents: injectHydrateCall(componentName, defaultExportMatch.groups.name, componentSource),
            ...loadOptions,
          }
        }

        return {
          errors: [
            {
              text: `Found component at "${path}" without default export. All components built for the client must export themselves as default`,
              pluginName: 'radonis-client',
            },
          ],
        }
      } catch (error) {
        return {
          errors: [
            {
              detail: error.message,
              text: `Error compiling component at "${path}"`,
              pluginName: 'radonis-client',
            },
          ],
        }
      }
    })
  },
})
