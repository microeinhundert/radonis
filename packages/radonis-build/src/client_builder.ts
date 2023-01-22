/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { basename, join, relative } from 'node:path/posix'

import { RadonisException } from '@microeinhundert/radonis-shared'
import type { AssetsManifest } from '@microeinhundert/radonis-types'
import type { BuildOptions as EsbuildOptions } from 'esbuild'
import { build } from 'esbuild'
import { emptyDir, outputFile } from 'fs-extra'

import { AssetsManifestBuilder } from './assets_manifest_builder'
import { CannotBuildException } from './exceptions/cannot_build'
import { loaders } from './loaders'
import { radonisClientPlugin, radonisIslandsPlugin } from './plugins'
import type { BuildOptions, BuiltAssets, IslandsByFile } from './types/main'

/**
 * @internal
 */
export class ClientBuilder {
  /**
   * Options passed to esbuild
   */
  #baseOptions: EsbuildOptions = {
    platform: 'browser',
    metafile: true,
    bundle: true,
    splitting: true,
    treeShaking: true,
    format: 'esm',
    logLevel: 'silent',
    write: false,
    jsx: 'automatic',
  }

  /**
   * Build the client
   */
  async build({
    entryPoints,
    appRootPath,
    publicPath,
    outputPath,
    outputToDisk,
    outputForProduction,
    esbuildOptions,
  }: BuildOptions): Promise<AssetsManifest> {
    if (outputToDisk) {
      await emptyDir(outputPath)
    }

    /**
     * The built assets
     */
    const builtAssets: BuiltAssets = new Map()

    /**
     * The islands grouped by file
     */
    const islandsByFile: IslandsByFile = new Map()

    /**
     * The output base
     */
    const outbase = appRootPath

    try {
      /**
       * Run the build
       */
      const buildResult = await build({
        ...this.#baseOptions,
        entryPoints,
        outbase,
        outdir: outputPath,
        minify: outputForProduction,
        ...esbuildOptions,
        plugins: [
          radonisIslandsPlugin({
            onIslandFound: (identifier, path) => {
              if (!islandsByFile.has(path)) {
                islandsByFile.set(path, [])
              }

              const islandsInFile = islandsByFile.get(path)

              if (islandsInFile && !islandsInFile.includes(identifier)) {
                islandsByFile.set(path, [...islandsInFile, identifier])
              }
            },
          }),
          radonisClientPlugin(),
          ...(esbuildOptions?.plugins ?? []),
        ],
        loader: { ...loaders, ...(esbuildOptions?.loader ?? {}) },
        define: {
          ...this.#getEnvironment(),
          'process.env.NODE_ENV': outputForProduction ? '"production"' : '"development"',
          ...(esbuildOptions?.define ?? {}),
        },
      })

      for (const { path, text, contents } of buildResult.outputFiles ?? []) {
        if (outputToDisk) {
          outputFile(path, contents)
        }

        const pathRelativeToOutbase = relative(outbase, path)
        const pathRelativeToPublic = relative(publicPath, path)

        const output = buildResult.metafile?.outputs[pathRelativeToOutbase]
        if (!output) {
          continue
        }

        /**
         * TODO: Evaluate whether these checks
         * conflict with third-party esbuild plugins
         */
        if (output.entryPoint?.includes(':')) {
          const [type, originalPath] = output.entryPoint.split(':')
          const islands = islandsByFile.get(originalPath) ?? []

          if (!(type === 'radonis-client-script' || type === 'radonis-island-script')) {
            continue
          }

          builtAssets.set(pathRelativeToOutbase, {
            type,
            name: basename(pathRelativeToOutbase),
            path: join('/', pathRelativeToPublic),
            source: text,
            islands,
            imports: output.imports,
          })
        } else {
          builtAssets.set(pathRelativeToOutbase, {
            type: 'radonis-chunk-script',
            name: basename(pathRelativeToOutbase),
            path: join('/', pathRelativeToPublic),
            source: text,
            islands: [],
            imports: [],
          })
        }
      }

      return new AssetsManifestBuilder(builtAssets).build()
    } catch (error) {
      if (error instanceof RadonisException) {
        throw error
      }

      throw new CannotBuildException(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get environment related `define` entries for esbuild
   */
  #getEnvironment(): Record<string, string> {
    return Object.entries(process.env).reduce<Record<string, string>>((environment, [key, value]) => {
      if (!key.startsWith('PUBLIC_')) {
        return environment
      }

      return {
        ...environment,
        [`process.env.${key}`]: JSON.stringify(value),
      }
    }, {})
  }
}
