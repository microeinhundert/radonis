/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant, PluginsManager } from '@microeinhundert/radonis-shared'
import type { Plugin } from 'esbuild'
import { emptyDir, outputFile } from 'fs-extra'
import { dirname } from 'path'

import { DEFAULT_EXPORT_REGEX } from './constants'
import { getLoaderForFile } from './loaders'

const pluginsManager = PluginsManager.getInstance()
export const builtFiles = new Map<string, string>()

/**
 * Inject the call to the hydrate function into the source code of a component
 */
function injectHydrateCall(componentIdentifier: string, source: string): string {
  return `
    import { registerComponentForHydration } from "@microeinhundert/radonis";
    ${source}
    registerComponentForHydration("${componentIdentifier}", ${componentIdentifier});
  `
}

/**
 * Warn about a missing default export
 */
function warnAboutMissingDefaultExport(path: string) {
  return {
    errors: [
      {
        text: `Found component at "${path}" without default export. All components built for the client must export themselves as default`,
        pluginName: 'radonis-client',
      },
    ],
  }
}

/**
 * The esbuild plugin responsible for compiling the components for the client
 */
export const radonisClientPlugin = (components: Map<string, string>): Plugin => ({
  name: 'radonis-client',
  setup(build) {
    build.onStart(async () => {
      builtFiles.clear()
      await emptyDir(build.initialOptions.outdir)
    })

    build.onResolve({ filter: /\.(ts(x)?|js(x)?)$/ }, ({ path }) => {
      if (components.has(path)) {
        return { path, namespace: 'radonis-client-component' }
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'radonis-client-component' }, ({ path }) => {
      try {
        const componentSource = components.get(path)

        invariant(componentSource, `Could not statically analyze source for component at "${path}"`)

        const loadOptions = {
          resolveDir: dirname(path),
          loader: getLoaderForFile(path),
        }

        const [defaultExportMatch] = componentSource.matchAll(DEFAULT_EXPORT_REGEX)
        if (defaultExportMatch?.groups?.name) {
          return {
            contents: injectHydrateCall(defaultExportMatch.groups.name, componentSource),
            ...loadOptions,
          }
        }

        return warnAboutMissingDefaultExport(path)
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

    build.onEnd(async (result) => {
      if (!result.outputFiles?.length) {
        return
      }

      for (const { path, text } of result.outputFiles) {
        builtFiles.set(path, text)
        outputFile(path, Buffer.from(await pluginsManager.execute('beforeOutput', text, null)))
      }

      await pluginsManager.execute('afterOutput', null, builtFiles)
    })
  },
})
