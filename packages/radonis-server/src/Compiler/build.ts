/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { BuildManifest, BuildManifestEntry } from '@microeinhundert/radonis-shared'
import { invariant, isProduction } from '@microeinhundert/radonis-shared'
import type { BuildOptions, Metafile } from 'esbuild'
import { build } from 'esbuild'
import { writeFile } from 'fs'
import { join, parse } from 'path'

import { FLASH_MESSAGES_USAGE_REGEX, I18N_USAGE_REGEX, URL_BUILDER_USAGE_REGEX } from './constants'
import { loaders } from './loaders'
import { compiledFiles, radonisClientPlugin } from './plugins'
import { stripPublicDir } from './utils'

/**
 * Extract identifiers from usages of `.has(ValidationError)?` and `.get(ValidationError)?` from the source code
 */
function extractFlashMessages(source: string): Set<string> {
  const matches = source.matchAll(FLASH_MESSAGES_USAGE_REGEX)
  const identifiers = new Set<string>()

  for (const match of matches) {
    if (match?.groups?.identifier) {
      identifiers.add(match.groups.identifier)
    }
  }

  return identifiers
}

/**
 * Extract identifiers from usages of `.formatMessage` from the source code
 */
function extractMessages(source: string): Set<string> {
  const matches = source.matchAll(I18N_USAGE_REGEX)
  const identifiers = new Set<string>()

  for (const match of matches) {
    if (match?.groups?.identifier) {
      identifiers.add(match.groups.identifier)
    }
  }

  return identifiers
}

/**
 * Extract identifiers from usages of `.make` from the source code
 */
function extractRoutes(source: string): Set<string> {
  const matches = source.matchAll(URL_BUILDER_USAGE_REGEX)
  const identifiers = new Set<string>()

  for (const match of matches) {
    if (match?.groups?.identifier) {
      identifiers.add(match.groups.identifier)
    }
  }

  return identifiers
}

/**
 * Walk the esbuild generated metafile and generate the build manifest entries
 */
function walkMetafile(metafile: Metafile, path: string, type?: BuildManifestEntry['type']): BuildManifestEntry {
  const output = metafile.outputs[path]

  invariant(output, `Could not find metafile output entry for path "${path}"`)

  const absolutePath = join(process.cwd(), path)
  const compiledFileSource = compiledFiles.get(absolutePath) ?? ''

  return {
    type: type ?? 'chunk',
    path: absolutePath,
    publicPath: stripPublicDir(path),
    flashMessages: extractFlashMessages(compiledFileSource),
    messages: extractMessages(compiledFileSource),
    routes: extractRoutes(compiledFileSource),
    imports: output.imports.map(({ path: path$ }) => walkMetafile(metafile, path$)),
  }
}

/**
 * Generate the build manifest
 */
function generateBuildManifest(metafile: Metafile, entryFilePath: string): BuildManifest {
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
      Please make sure to not use the same name for multiple components`
    )

    buildManifest[fileName] = walkMetafile(metafile, path, fileName === entryFileName ? 'entry' : 'component')
  }

  return buildManifest
}

/**
 * Write the build manifest to disk
 */
function writeBuildManifestToDisk(buildManifest: BuildManifest, outputDir: string): void {
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
  components: Map<string, string>,
  outputDir: string,
  buildOptions: BuildOptions
): Promise<BuildManifest> {
  const { metafile } = await build({
    entryPoints: [...components.keys(), entryFilePath],
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
