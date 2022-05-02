/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PluginsManager } from '@microeinhundert/radonis-shared'
import type { Plugin } from 'esbuild'
import { readFileSync } from 'fs'
import { emptyDir, outputFile } from 'fs-extra'
import { dirname } from 'path'

import {
  DEFAULT_EXPORT_CJS_REGEX,
  DEFAULT_EXPORT_ESM_REGEX,
  IOC_IMPORT_CJS_REGEX,
  IOC_IMPORT_ESM_REGEX,
} from './constants'
import { getLoaderForFile } from './loaders'
import {
  findAndRequireFlashMessagesForHydration,
  findAndRequireMessagesForHydration,
  findAndRequireRoutesForHydration,
  injectHydrateCall,
  warnAboutIocUsage,
  warnAboutMissingDefaultExport,
} from './utils'

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
        const componentSource = readFileSync(path, 'utf8')

        // TODO: Checking inside `onLoad` does not check chunks
        const [esmIocImportMatch] = componentSource.matchAll(IOC_IMPORT_ESM_REGEX)
        if (esmIocImportMatch?.groups?.importSpecifier) {
          return warnAboutIocUsage(esmIocImportMatch.groups.importSpecifier, path)
        }

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
      await emptyDir(outDir)

      const files = result.outputFiles ?? []

      for (const file of files) {
        findAndRequireFlashMessagesForHydration(file.text)
        findAndRequireMessagesForHydration(file.text)
        findAndRequireRoutesForHydration(file.text)

        const modifiedFile = pluginsManager.executeHooks('afterCompile', file.text)
        outputFile(file.path, Buffer.from(modifiedFile))
      }
    })
  },
})
