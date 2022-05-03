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
import { emptyDir, outputFile as outputFile$ } from 'fs-extra'
import { dirname } from 'path'
import invariant from 'tiny-invariant'

import {
  DEFAULT_EXPORT_CJS_REGEX,
  DEFAULT_EXPORT_ESM_REGEX,
  IOC_IMPORT_CJS_REGEX,
  IOC_IMPORT_ESM_REGEX,
} from './constants'
import { getLoaderForFile } from './loaders'
import { injectHydrateCall, warnAboutIocUsage, warnAboutMissingDefaultExport } from './utils'

const pluginsManager = new PluginsManager()

export const radonisClientPlugin = (components: Radonis.Component[], outputDir: string): Plugin => ({
  name: 'radonis-client',
  setup(build) {
    build.onResolve({ filter: /\.(ts(x)?|js(x)?)$/ }, ({ path }) => {
      if (components.some((component) => component.path === path)) {
        return { path, namespace: 'radonis-client-component' }
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'radonis-client-component' }, ({ path }) => {
      try {
        const { source } = components.find((component) => component.path === path) ?? {}

        invariant(source, `Could not statically analyze source for component at "${path}"`)

        // TODO: This does not check chunks
        const [esmIocImportMatch] = source.matchAll(IOC_IMPORT_ESM_REGEX)
        if (esmIocImportMatch?.groups?.importSpecifier) {
          return warnAboutIocUsage(esmIocImportMatch.groups.importSpecifier, path)
        }

        // TODO: This does not check chunks
        const [cjsIocImportMatch] = source.matchAll(IOC_IMPORT_CJS_REGEX)
        if (cjsIocImportMatch?.groups?.importSpecifier) {
          return warnAboutIocUsage(cjsIocImportMatch.groups.importSpecifier, path)
        }

        const loadOptions = {
          resolveDir: dirname(path),
          loader: getLoaderForFile(path),
        }

        const [esmExportMatch] = source.matchAll(DEFAULT_EXPORT_ESM_REGEX)
        if (esmExportMatch?.groups?.name) {
          return {
            contents: injectHydrateCall(esmExportMatch.groups.name, source, 'esm'),
            ...loadOptions,
          }
        }

        const [cjsExportMatch] = source.matchAll(DEFAULT_EXPORT_CJS_REGEX)
        if (cjsExportMatch?.groups?.name) {
          return {
            contents: injectHydrateCall(cjsExportMatch.groups.name, source, 'cjs'),
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

      const outputFiles = result.outputFiles ?? []

      for (const outputFile of outputFiles) {
        const modifiedFile = pluginsManager.executeHooks('afterCompile', outputFile.text)
        outputFile$(outputFile.path, Buffer.from(modifiedFile))
      }
    })
  },
})
