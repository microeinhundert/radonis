/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readFile } from 'node:fs/promises'
import { basename, dirname, join, relative } from 'node:path/posix'

import { RadonisException } from '@microeinhundert/radonis-shared'
import type { BuildManifest } from '@microeinhundert/radonis-types'
import { build } from 'esbuild'
import { emptyDir, outputFile } from 'fs-extra'

import { BuildManifestBuilder } from './build_manifest_builder'
import { ISLAND_REGEX } from './constants'
import { CannotBuildException } from './exceptions/cannot_build'
import { getLoaderForFile, loaders } from './loaders'
import type { Asset, BuildOptions } from './types/main'

/**
 * @internal
 */
export class Builder {
  /**
   * This Map stores the built assets with metadata
   */
  #assets: Map<string, Asset>

  /**
   * This Map stores the islands grouped by file
   */
  #islandsByFile: Map<string, string[]>

  /**
   * Constructor
   */
  constructor() {
    this.#setDefaults()
  }

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
          {
            name: 'radonis',
            setup({ onResolve, onLoad }) {
              onResolve({ filter: /\.client\.(ts(x)?|js(x)?)$/ }, async ({ path }) => {
                return { path, namespace: 'client-script' }
              })
              onLoad({ filter: /.*/, namespace: 'client-script' }, async ({ path }) => {
                const contents = await readFile(path, 'utf8')

                return {
                  contents,
                  resolveDir: dirname(path),
                  loader: getLoaderForFile(path),
                }
              })

              onResolve({ filter: /\.island\.(ts(x)?|js(x)?)$/ }, async ({ path }) => {
                return { path, namespace: 'island-script' }
              })
              onLoad({ filter: /.*/, namespace: 'island-script' }, async ({ path }) => {
                let contents = await readFile(path, 'utf8')

                function injectIslandsHydration(source: string) {
                  const matches = source.matchAll(ISLAND_REGEX)

                  let islandsInFile: string[] = []

                  for (const match of matches) {
                    if (match?.groups?.identifier && match?.groups?.symbol) {
                      const identifier = match.groups.identifier.trim()
                      const symbol = match.groups.symbol.trim()

                      islandsInFile.push(identifier)
                      source = source.replace(match[0], `hydrateIsland('${identifier}', ${symbol})`)
                    }
                  }

                  this.#islandsByFile.set(path, islandsInFile)

                  return ["import { hydrateIsland } from '@microeinhundert/radonis';", source].join('\n')
                }

                return {
                  contents: injectIslandsHydration(contents),
                  resolveDir: dirname(path),
                  loader: getLoaderForFile(path),
                }
              })
            },
          },
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

        this.#assets.set(relativePath, {
          name: basename(relativePath),
          path: join('/', relative(publicDir, relativePath)),
          source: text,
        })
      }

      const buildManifestBuilder = new BuildManifestBuilder(buildResult.metafile!, this.#assets, this.#islandsByFile)

      return buildManifestBuilder.build()
    } catch (error) {
      if (error instanceof RadonisException) {
        throw error
      }

      throw new CannotBuildException(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      this.#setDefaults()
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

  /**
   * Set the defaults
   */
  #setDefaults(): void {
    this.#assets = new Map()
    this.#islandsByFile = new Map()
  }
}
