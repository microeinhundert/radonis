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
import type { BuildManifest, BuildManifestEntry } from '@microeinhundert/radonis-types'
import type { AssetType } from '@microeinhundert/radonis-types'
import { build as build$ } from 'esbuild'
import { emptyDir, outputFile } from 'fs-extra'

import { ISLAND_REGEX } from './constants'
import { CannotBuildException } from './exceptions/cannot_build'
import { CannotFindMetafileOutputEntryException } from './exceptions/cannot_find_metafile_output_entry'
import { getLoaderForFile, loaders } from './loaders'
import type { Asset, BuildOptions, GenerateBuildManifestOptions, Island, MetafileWalkerOptions } from './types/main'
import { extractFlashMessages, extractMessages, extractRoutes } from './utils'

/**
 * Create a metafile walker
 */
function createMetafileWalker({ metafile, assets }: MetafileWalkerOptions) {
  function walk({ path, type }: Pick<BuildManifestEntry, 'path' | 'type'>): BuildManifestEntry {
    const output = metafile.outputs[path]
    const asset = assets.get(path)

    if (!output || !asset) {
      throw new CannotFindMetafileOutputEntryException(path)
    }

    return {
      type,
      path: asset.path,
      flashMessages: extractFlashMessages(asset.source),
      messages: extractMessages(asset.source),
      routes: extractRoutes(asset.source),
      imports: output.imports.map(({ path: path$ }) => walk({ path: path$, type: 'chunk-script' })),
    }
  }

  return { walk }
}

/**
 * Generate the build manifest
 */
function generateBuildManifest({ metafile, assets, islands }: GenerateBuildManifestOptions): BuildManifest {
  return Object.entries(metafile.outputs).reduce<BuildManifest>((buildManifest, [path, { entryPoint }]) => {
    if (!entryPoint) {
      /**
       * We only want entry points
       * on the topmost level
       */
      return buildManifest
    }

    const asset = assets.get(path)

    if (!asset) {
      return buildManifest
    }

    const [type, originalPath] = entryPoint.split(':')
    const island = islands.get(originalPath)

    return {
      ...buildManifest,
      [island?.identifier ?? asset.name]: createMetafileWalker({ metafile, assets }).walk({
        type: type as AssetType,
        path,
      }),
    }
  }, {})
}

/**
 * Get environment related `define` entries for esbuild
 */
function getEnvironment(): Record<string, string> {
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
 * Build the client
 * @internal
 */
export async function build({
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
   * This map stores the built assets with metadata
   */
  const assets = new Map<string, Asset>()

  /**
   * This map stores the islands
   */
  const islands = new Map<string, Island>()

  try {
    /**
     * Run the build
     */
    const buildResult = await build$({
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

              function injectIslandHydration(source: string) {
                const matches = source.matchAll(ISLAND_REGEX)

                for (const match of matches) {
                  if (match?.groups?.symbol) {
                    const identifier = match.groups.symbol.trim()

                    islands.set(path, { identifier })
                    source = source.replace(match[0], `hydrateIsland('${identifier}', ${identifier})`)
                  }
                }

                return ["import { hydrateIsland } from '@microeinhundert/radonis';", source].join('\n')
              }

              return {
                contents: injectIslandHydration(contents),
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
        ...getEnvironment(),
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

    /**
     * Generate the build manifest
     */
    const buildManifest = generateBuildManifest({
      metafile: buildResult.metafile!,
      assets,
      islands,
    })

    return buildManifest
  } catch (error) {
    if (error instanceof RadonisException) {
      throw error
    }

    throw new CannotBuildException(error instanceof Error ? error.message : 'Unknown error')
  } finally {
    assets.clear()
    islands.clear()
  }
}
