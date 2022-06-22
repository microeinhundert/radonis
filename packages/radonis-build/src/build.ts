/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant, PluginsManager } from '@microeinhundert/radonis-shared'
import type { FlashMessageIdentifier, MessageIdentifier, RouteIdentifier } from '@microeinhundert/radonis-types'
import type { BuildOptions, Metafile } from 'esbuild'
import { build } from 'esbuild'
import { emptyDir, outputFile } from 'fs-extra'
import { join, parse } from 'path'

import { FLASH_MESSAGE_IDENTIFIER_REGEX, MESSAGE_IDENTIFIER_REGEX, ROUTE_IDENTIFIER_REGEX } from './constants'
import { loaders } from './loaders'
import { radonisClientPlugin } from './plugin'
import type { BuildManifest, BuildManifestEntry } from './types'
import { stripPublicDir } from './utils'

const pluginsManager = PluginsManager.getInstance()

/**
 * Extract identifiers from usage of `.has(Error)?` and `.get(Error)?` from the source code
 */
function extractFlashMessages(source: string): FlashMessageIdentifier[] {
  const matches = source.matchAll(FLASH_MESSAGE_IDENTIFIER_REGEX)
  const identifiers = new Set<FlashMessageIdentifier>()

  for (const match of matches) {
    if (match?.groups?.identifier) {
      identifiers.add(match.groups.identifier.trim())
    }
  }

  return Array.from(identifiers)
}

/**
 * Extract identifiers from usage of `.formatMessage` from the source code
 */
function extractMessages(source: string): MessageIdentifier[] {
  const matches = source.matchAll(MESSAGE_IDENTIFIER_REGEX)
  const identifiers = new Set<MessageIdentifier>()

  for (const match of matches) {
    if (match?.groups?.identifier) {
      identifiers.add(match.groups.identifier.trim())
    }
  }

  return Array.from(identifiers)
}

/**
 * Extract identifiers from usage of `.make` as well as specific component props from the source code
 */
function extractRoutes(source: string): RouteIdentifier[] {
  const matches = source.matchAll(ROUTE_IDENTIFIER_REGEX)
  const identifiers = new Set<RouteIdentifier>()

  for (const match of matches) {
    if (match?.groups?.identifier) {
      identifiers.add(match.groups.identifier.trim())
    }
  }

  return Array.from(identifiers)
}

/**
 * Walk the esbuild generated metafile and generate the build manifest entries
 */
function walkMetafile(
  metafile: Metafile,
  path: string,
  builtFiles: Map<string, string>,
  type?: BuildManifestEntry['type']
): BuildManifestEntry {
  const output = metafile.outputs[path]

  invariant(output, `Could not find metafile output entry for path "${path}"`)

  const absolutePath = join(process.cwd(), path)
  const builtFileSource = builtFiles.get(absolutePath) ?? ''

  return {
    type: type ?? 'chunk',
    path: absolutePath,
    publicPath: stripPublicDir(path),
    flashMessages: extractFlashMessages(builtFileSource),
    messages: extractMessages(builtFileSource),
    routes: extractRoutes(builtFileSource),
    imports: output.imports.map(({ path: path$ }) => walkMetafile(metafile, path$, builtFiles)),
  }
}

/**
 * Generate the build manifest
 */
function generateBuildManifest(
  metafile: Metafile,
  entryFilePath: string,
  builtFiles: Map<string, string>
): BuildManifest {
  const { name: entryFileName } = parse(entryFilePath)
  const buildManifest = {} as BuildManifest

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
      Please make sure to not use the same name for multiple components, regardless of what directory they are in`
    )

    buildManifest[fileName] = walkMetafile(
      metafile,
      path,
      builtFiles,
      fileName === entryFileName ? 'entry' : 'component'
    )
  }

  return buildManifest
}

/**
 * Build the entry file as well as the components
 */
export async function buildEntryFileAndComponents(
  entryFilePath: string,
  components: Map<string, string>,
  outputDir: string,
  forProduction: boolean,
  buildOptions: BuildOptions
): Promise<BuildManifest> {
  await emptyDir(outputDir)

  /**
   * Run the build
   */
  const buildResult = await build({
    entryPoints: [...components.keys(), entryFilePath],
    outdir: outputDir,
    platform: 'browser',
    metafile: true,
    bundle: true,
    splitting: true,
    treeShaking: true,
    format: 'esm',
    logLevel: 'silent',
    minify: forProduction,
    write: false,
    ...buildOptions,
    loader: { ...loaders, ...(buildOptions.loader ?? {}) },
    plugins: [radonisClientPlugin(components), ...(buildOptions.plugins ?? [])],
    external: [
      '@microeinhundert/radonis-manifest',
      '@microeinhundert/radonis-server',
      ...(buildOptions.external ?? []),
    ],
    define: {
      'process.env.NODE_ENV': forProduction ? '"production"' : '"development"',
      ...(buildOptions.define ?? {}),
    },
  })

  const builtFiles = new Map<string, string>()

  for (const { path, text, contents } of buildResult.outputFiles ?? []) {
    builtFiles.set(path, text)
    outputFile(path, contents)
  }

  await pluginsManager.execute('afterOutput', null, builtFiles)

  /**
   * Generate the build manifest
   */
  const buildManifest = generateBuildManifest(buildResult.metafile!, entryFilePath, builtFiles)

  return buildManifest
}
