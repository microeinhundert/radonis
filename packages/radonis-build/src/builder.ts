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
import type { BuildManifest } from '@microeinhundert/radonis-types'
import { build } from 'esbuild'
import { emptyDir, outputFile } from 'fs-extra'

import { BuildManifestBuilder } from './build_manifest_builder'
import { CannotBuildException } from './exceptions/cannot_build'
import { loaders } from './loaders'
import { radonisPlugin } from './plugin'
import type { BuildOptions, BuiltAsset } from './types/main'

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
  }: BuildOptions): Promise<BuildManifest> {
    if (outputToDisk) {
      await emptyDir(outputDir)
    }

    /**
     * This Map stores the built assets with metadata
     */
    const assets = new Map<string, BuiltAsset>()

    /**
     * This Map stores the islands grouped by file
     */
    const islandsByFile = new Map<string, string[]>()

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
          radonisPlugin({
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

        assets.set(relativePath, {
          name: basename(relativePath),
          path: join('/', relative(publicDir, relativePath)),
          source: text,
        })
      }

      const buildManifestBuilder = new BuildManifestBuilder(buildResult.metafile!, assets, islandsByFile)

      return buildManifestBuilder.build()
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
