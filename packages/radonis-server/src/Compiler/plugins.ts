/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant, PluginsManager } from '@microeinhundert/radonis-shared'
import type { Plugin } from 'esbuild'
import { emptyDir, outputFile as outputFile$ } from 'fs-extra'
import { dirname } from 'path'

import {
  DEFAULT_EXPORT_CJS_REGEX,
  DEFAULT_EXPORT_ESM_REGEX,
  IOC_IMPORT_CJS_REGEX,
  IOC_IMPORT_ESM_REGEX,
} from './constants'
import { getLoaderForFile } from './loaders'
import { injectHydrateCall, warnAboutIocUsage, warnAboutMissingDefaultExport } from './utils'

const pluginsManager = new PluginsManager()

export let compiledFiles = new Map<string, string>()

export const radonisClientPlugin = (components: Map<string, string>, outputDir: string): Plugin => ({
  name: 'radonis-client',
  setup(build) {
    build.onStart(async () => {
      compiledFiles.clear()
      await pluginsManager.execute('beforeCompile', null)
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

        // TODO: This does not check chunks
        const [esmIocImportMatch] = componentSource.matchAll(IOC_IMPORT_ESM_REGEX)
        if (esmIocImportMatch?.groups?.importSpecifier) {
          return warnAboutIocUsage(esmIocImportMatch.groups.importSpecifier, path)
        }

        // TODO: This does not check chunks
        const [cjsIocImportMatch] = componentSource.matchAll(IOC_IMPORT_CJS_REGEX)
        if (cjsIocImportMatch?.groups?.importSpecifier) {
          return warnAboutIocUsage(cjsIocImportMatch.groups.importSpecifier, path)
        }

        const loadOptions = {
          resolveDir: dirname(path),
          loader: getLoaderForFile(path),
        }

        const [esmExportMatch] = componentSource.matchAll(DEFAULT_EXPORT_ESM_REGEX)
        if (esmExportMatch?.groups?.name) {
          return {
            contents: injectHydrateCall(esmExportMatch.groups.name, componentSource, 'esm'),
            ...loadOptions,
          }
        }

        const [cjsExportMatch] = componentSource.matchAll(DEFAULT_EXPORT_CJS_REGEX)
        if (cjsExportMatch?.groups?.name) {
          return {
            contents: injectHydrateCall(cjsExportMatch.groups.name, componentSource, 'cjs'),
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
      await emptyDir(outputDir)

      if (!result.outputFiles?.length) {
        return
      }

      for (let { path, text } of result.outputFiles) {
        compiledFiles.set(path, text)
        outputFile$(path, Buffer.from(await pluginsManager.execute('beforeOutput', text)))
      }

      await pluginsManager.execute('afterCompile', null)
    })
  },
})
