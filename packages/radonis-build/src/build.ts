/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Metafile } from 'esbuild'
import { build as build$ } from 'esbuild'
import { emptyDir, outputFile } from 'fs-extra'
import { join, parse, relative } from 'path'

import { BuildException } from './exceptions/buildException'
import { loaders } from './loaders'
import { radonisClientPlugin } from './plugin'
import type { BuildManifest, BuildManifestEntry, BuildOptions } from './types'
import { extractFlashMessages, extractMessages, extractRoutes, filePathToFileUrl } from './utils'

/**
 * Create a metafile walker
 */
function createMetafileWalker(metafile: Metafile, builtAssets: Map<string, string>, publicPath: string) {
  function walk(assetPath: string, assetType: BuildManifestEntry['type']): BuildManifestEntry {
    const output = metafile.outputs[assetPath]

    if (!output) {
      throw BuildException.cannotFindMetafileOutputEntry(assetPath)
    }

    const absoluteAssetPath = join(process.cwd(), assetPath)
    const builtAsset = builtAssets.get(absoluteAssetPath) ?? ''

    return {
      type: assetType,
      path: join('/', filePathToFileUrl(relative(publicPath, assetPath))),
      flashMessages: extractFlashMessages(builtAsset),
      messages: extractMessages(builtAsset),
      routes: extractRoutes(builtAsset),
      imports: output.imports.map(({ path: path$ }) => walk(path$, 'chunk')),
    }
  }

  return { walk }
}

/**
 * Generate the build manifest
 */
function generateBuildManifest(
  metafile: Metafile,
  entryFileName: string,
  builtAssets: Map<string, string>,
  publicPath: string
): BuildManifest {
  const buildManifest = {} as BuildManifest

  for (let assetPath in metafile.outputs) {
    const outputs = metafile.outputs[assetPath]

    if (!outputs.entryPoint) {
      /**
       * We only want entry points
       * on the topmost level
       */
      continue
    }

    const { name: assetFileName } = parse(assetPath)

    if (assetFileName in buildManifest) {
      throw BuildException.duplicateBuildManifestEntry(assetFileName)
    }

    buildManifest[assetFileName] = createMetafileWalker(metafile, builtAssets, publicPath).walk(
      assetPath,
      assetFileName === entryFileName ? 'entry' : 'component'
    )
  }

  return buildManifest
}

/**
 * Build the entry file as well as the components
 * @internal
 */
export async function build({
  entryFilePath,
  components,
  publicPath,
  outputDir,
  outputToDisk,
  outputForProduction,
  esbuildOptions,
}: BuildOptions): Promise<BuildManifest> {
  if (outputToDisk) {
    await emptyDir(outputDir)
  }

  const environment = {}

  for (const key in process.env) {
    if (key.startsWith('PUBLIC_')) {
      environment[`process.env.${key}`] = JSON.stringify(process.env[key])
    }
  }

  /**
   * Run the build
   */
  const buildResult = await build$({
    entryPoints: [...components.keys(), entryFilePath],
    outdir: outputDir,
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
    loader: { ...loaders, ...(esbuildOptions?.loader ?? {}) },
    plugins: [radonisClientPlugin(components), ...(esbuildOptions?.plugins ?? [])],
    external: ['@microeinhundert/radonis-server', ...(esbuildOptions?.external ?? [])],
    define: {
      ...environment,
      'process.env.NODE_ENV': outputForProduction ? '"production"' : '"development"',
      ...(esbuildOptions?.define ?? {}),
    },
  })

  const builtAssets = new Map<string, string>()

  for (const { path, text, contents } of buildResult.outputFiles ?? []) {
    builtAssets.set(path, text)
    if (outputToDisk) {
      outputFile(path, contents)
    }
  }

  const { name: entryFileName } = parse(entryFilePath)

  /**
   * Generate the build manifest
   */
  const buildManifest = generateBuildManifest(buildResult.metafile!, entryFileName, builtAssets, publicPath)

  return buildManifest
}
