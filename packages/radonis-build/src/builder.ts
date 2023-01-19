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
export class Builder {
  /**
   * Build the client
   */
  async build({
    entryPoints,
    publicDir,
    outputDir,
    outputToDisk,
    outputForProduction,
    esbuildOptions,
  }: BuildOptions): Promise<AssetsManifest> {
    if (outputToDisk) {
      await emptyDir(outputDir)
    }

    /**
     * This Map stores the built assets with metadata
     */
    const builtAssets: BuiltAssets = new Map()

    /**
     * This Map stores the islands grouped by file
     */
    const islandsByFile: IslandsByFile = new Map()

    try {
      /**
       * Run the build
       */
      const buildResult = await build({
        entryPoints,
        outdir: outputDir,
        outbase: process.cwd(),
        platform: 'browser',
        metafile: true,
        bundle: true,
        splitting: true,
        treeShaking: true,
        format: 'esm',
        logLevel: 'silent',
        minify: outputForProduction,
        write: false,
        jsx: 'automatic',
        ...esbuildOptions,
        plugins: [
          radonisIslandsPlugin({
            onIslandFound: (identifier, path) => {
              const islandsInFile = islandsByFile.get(path)

              if (!islandsInFile) {
                islandsByFile.set(path, [])
              }

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

        const relativePath = relative(process.cwd(), path)

        builtAssets.set(relativePath, {
          name: basename(relativePath),
          path: join('/', relative(publicDir, relativePath)),
          source: text,
        })
      }

      const assetsManifest = new AssetsManifestBuilder(buildResult.metafile!, builtAssets, islandsByFile)

      return assetsManifest.build()
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
