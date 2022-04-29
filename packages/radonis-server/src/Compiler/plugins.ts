import { PluginsManager } from '@microeinhundert/radonis-shared'
import type { Plugin } from 'esbuild'
import { readFileSync } from 'fs'
import { emptyDir, outputFile } from 'fs-extra'
import { dirname } from 'path'

import { DEFAULT_EXPORT_CJS_REGEX, DEFAULT_EXPORT_ESM_REGEX } from './constants'
import { getLoaderForFile } from './loaders'
import { injectHydrateCall } from './utils'

const pluginsManager = new PluginsManager()

export const radonisClientPlugin = (components: string[], outDir: string): Plugin => ({
  name: 'radonis-client',
  setup(build) {
    build.onResolve({ filter: /\.(ts(x)?|js(x)?)$/ }, ({ path }) => {
      if (components.includes(path)) {
        return { path, namespace: 'radonis-client-component' }
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'radonis-client-component' }, ({ path }) => {
      try {
        const loadOptions = {
          resolveDir: dirname(path),
          loader: getLoaderForFile(path),
        }

        const componentSource = readFileSync(path, 'utf8')

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

    build.onEnd(async (result) => {
      await emptyDir(outDir)

      const files = result.outputFiles ?? []

      for (const file of files) {
        const modifiedFile = pluginsManager.executeHooks('afterCompile', file.text)
        outputFile(file.path, Buffer.from(modifiedFile))
      }
    })
  },
})
