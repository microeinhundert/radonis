/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isProduction } from '@microeinhundert/radonis-shared'
import type { BuildOptions, Metafile } from 'esbuild'
import { build } from 'esbuild'
import { writeFile } from 'fs'
import { join, parse } from 'path'
import invariant from 'tiny-invariant'

import { loaders } from './loaders'
import { builtFiles, radonisClientPlugin } from './plugins'
import { extractFlashMessages, extractMessages, extractRoutes, stripPublicDir } from './utils'

/**
 * Walk the esbuild generated metafile and generate the build manifest entries
 */
function walkMetafile(
  metafile: Metafile,
  path: string,
  type?: Radonis.BuildManifestEntry['type']
): Radonis.BuildManifestEntry {
  const output = metafile.outputs[path]
  const absolutePath = join(process.cwd(), path)
  const builtFileSource = builtFiles.get(absolutePath) ?? ''

  return {
    type: type ?? 'chunk',
    path: absolutePath,
    publicPath: stripPublicDir(path),
    flashMessages: extractFlashMessages(builtFileSource),
    messages: extractMessages(builtFileSource),
    routes: extractRoutes(builtFileSource),
    imports: output.imports.map(({ path: path$ }) => walkMetafile(metafile, path$)),
  }
}

/**
 * Generate the build manifest
 */
function generateBuildManifest(metafile: Metafile, entryFilePath: string): Radonis.BuildManifest {
  const { name: entryFileName } = parse(entryFilePath)
  const buildManifest = {} as Radonis.BuildManifest

  for (let path in metafile.outputs) {
    const metafileOutput = metafile.outputs[path]

    if (!metafileOutput.entryPoint) {
      /**
       * We only want entry points
       * on the topmost level
       */
      continue
    }

    const { name: fileName } = parse(path)

    invariant(
      !(fileName in buildManifest),
      `A build manifest entry for "${fileName}" already exists.
      Please make sure to not use the same name for multiple components`
    )

    buildManifest[fileName] = walkMetafile(metafile, path, fileName === entryFileName ? 'entry' : 'component')
  }

  return buildManifest
}

/**
 * Write the build manifest to disk
 */
function writeBuildManifestToDisk(buildManifest: Radonis.BuildManifest, outputDir: string): void {
  writeFile(
    join(outputDir, 'manifest.json'),
    JSON.stringify(buildManifest, (_, value) => (value instanceof Set ? [...value] : value), 2),
    (error) => {
      invariant(!error, 'Error writing manifest to disk')
    }
  )
}

/**
 * Build the entry file as well as the components
 */
export async function buildEntryFileAndComponents(
  entryFilePath: string,
  components: Radonis.Component[],
  outputDir: string,
  buildOptions: BuildOptions
): Promise<Radonis.BuildManifest> {
  const { metafile } = await build({
    entryPoints: [...components.map(({ path }) => path), entryFilePath],
    outdir: outputDir,
    metafile: true,
    write: false,
    bundle: true,
    splitting: true,
    treeShaking: true,
    platform: 'browser',
    format: 'esm',
    logLevel: 'silent',
    minify: isProduction,
    ...buildOptions,
    loader: { ...loaders, ...(buildOptions.loader ?? {}) },
    plugins: [radonisClientPlugin(components, outputDir), ...(buildOptions.plugins ?? [])],
    external: [
      '@microeinhundert/radonis-manifest',
      '@microeinhundert/radonis-server',
      ...(buildOptions.external ?? []),
    ],
    define: {
      'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
      ...(buildOptions.define ?? {}),
    },
  })

  const buildManifest = generateBuildManifest(metafile!, entryFilePath)

  writeBuildManifestToDisk(buildManifest, outputDir)

  return buildManifest
}
