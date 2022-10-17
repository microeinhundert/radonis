/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@microeinhundert/radonis-shared'
import { build as build$ } from 'esbuild'
import { emptyDir, outputFile } from 'fs-extra'
import { join, parse, relative } from 'path'

import { BuildException } from './exceptions/buildException'
import { loaders } from './loaders'
import type {
  BuildManifest,
  BuildManifestEntry,
  BuildOptions,
  GenerateBuildManifestOptions,
  MetafileWalkerOptions,
} from './types'
import { extractFlashMessages, extractMessages, extractRoutes, filePathToFileUrl } from './utils'

/**
 * Create a metafile walker
 */
function createMetafileWalker({ metafile, builtAssets, publicPath }: MetafileWalkerOptions) {
  function walk(assetPath: string, assetType: BuildManifestEntry['type']): BuildManifestEntry {
    const output = metafile.outputs[assetPath]

    if (!output) {
      throw BuildException.cannotFindMetafileOutputEntry(assetPath)
    }

    const absoluteAssetPath = join(process.cwd(), assetPath)
    const builtAssetSource = builtAssets.get(absoluteAssetPath) ?? ''

    return {
      type: assetType,
      path: join('/', filePathToFileUrl(relative(publicPath, assetPath))),
      flashMessages: extractFlashMessages(builtAssetSource),
      messages: extractMessages(builtAssetSource),
      routes: extractRoutes(builtAssetSource),
      imports: output.imports.map(({ path: path$ }) => walk(path$, 'chunk')),
    }
  }

  return { walk }
}

/**
 * Generate a build manifest
 */
function generateBuildManifest({
  metafile,
  entryFileName,
  builtAssets,
  publicPath,
}: GenerateBuildManifestOptions): BuildManifest {
  return Object.entries(metafile.outputs).reduce<BuildManifest>((buildManifest, [assetPath, { entryPoint }]) => {
    if (!entryPoint) {
      /**
       * We only want entry points
       * on the topmost level
       */
      return buildManifest
    }

    const { name: assetFileName } = parse(assetPath)

    if (assetFileName in buildManifest) {
      throw BuildException.duplicateBuildManifestEntry(assetFileName)
    }

    return {
      ...buildManifest,
      [assetFileName]: createMetafileWalker({ metafile, builtAssets, publicPath }).walk(
        assetPath,
        assetFileName === entryFileName ? 'entry' : 'component'
      ),
    }
  }, {})
}

/**
 * Build the entry file as well as the components
 * @internal
 */
export async function build({
  entryFilePath,
  entryPoints,
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

  try {
    /**
     * Run the build
     */
    const buildResult = await build$({
      entryPoints: [...entryPoints, entryFilePath],
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
    const buildManifest = generateBuildManifest({
      metafile: buildResult.metafile!,
      entryFileName,
      builtAssets,
      publicPath,
    })

    return buildManifest
  } catch (error) {
    if (error instanceof Exception) {
      throw error
    }

    throw BuildException.cannotBuild(error instanceof Error ? error.message : 'Unknown error')
  }
}
