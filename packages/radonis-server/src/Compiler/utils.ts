/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isProduction } from '@microeinhundert/radonis-shared'
import { fsReadAll } from '@poppinss/utils/build/helpers'
import type { BuildOptions, Metafile } from 'esbuild'
import { build } from 'esbuild'
import { existsSync, readFileSync } from 'fs'
import { join, parse } from 'path'
import invariant from 'tiny-invariant'

import { FLASH_MESSAGES_USAGE_REGEX, I18N_USAGE_REGEX, PUBLIC_PATH_SEGMENT, URL_BUILDER_USAGE_REGEX } from './constants'
import { loaders } from './loaders'
import { radonisClientPlugin } from './plugins'

/**
 * Check if the file looks like it contains a component:
 * - Starts with an uppercase letter
 * - Ends with `.ts(x)` or `.js(x)` extension
 * - Does not end with `.<something>.<ext>`
 */
export function isComponentFile(filePath: string): boolean {
  const { base } = parse(filePath)
  return base.match(/^[A-Z]\w+\.(ts(x)?|js(x)?)$/) !== null
}

/**
 * Discover all components in a specific directory
 */
export function discoverComponents(directory: string): Radonis.Component[] {
  return fsReadAll(directory, (filePath) => isComponentFile(filePath))
    .map((path) => join(directory, path))
    .map((path) => {
      const { name } = parse(path)
      const source = readFileSync(path, 'utf8')

      return { name, source, path }
    })
}

/**
 * Inject the call to the hydrate function into the source code of a component
 */
export function injectHydrateCall(componentName: string, source: string, sourceType: 'esm' | 'cjs'): string {
  return `
    ${
      sourceType === 'esm'
        ? `import { registerComponentForHydration } from "@microeinhundert/radonis";`
        : 'const { registerComponentForHydration } = require("@microeinhundert/radonis");'
    }
    ${source}
    registerComponentForHydration("${componentName}", ${componentName});
  `
}

/**
 * Extract identifiers from usages of `.has(ValidationError)?` and `.get(ValidationError)?` from the source code
 */
export function extractFlashMessages(source: string): Set<string> {
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
export function extractMessages(source: string): Set<string> {
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
export function extractRoutes(source: string): Set<string> {
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
 * Extract the entry points from an esbuild generated metafile
 */
function extractEntryPoints(metafile: Metafile): Radonis.BuildOutput {
  const entryPoints = {} as Radonis.BuildOutput

  for (let path in metafile.outputs) {
    const output = metafile.outputs[path]

    if (!output.entryPoint) {
      continue
    }

    const { name } = parse(output.entryPoint)

    /**
     * TODO: Remove this hack
     */
    if (path.startsWith(PUBLIC_PATH_SEGMENT)) {
      path = path.replace(PUBLIC_PATH_SEGMENT, '')
    }

    entryPoints[name] = {
      publicPath: path,
    }
  }

  return entryPoints
}

/**
 * Build the entry file as well as the components
 */
export async function buildEntryFileAndComponents(
  entryFilePath: string,
  components: Radonis.Component[],
  outputDir: string,
  buildOptions: BuildOptions
): Promise<Radonis.BuildOutput> {
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

  return extractEntryPoints(metafile!)
}

/**
 * Generate the asset manifest
 */
export function generateAssetManifest(
  buildOutput: Radonis.BuildOutput,
  entryFileName: string,
  components: Radonis.Component[]
): Radonis.AssetManifest {
  const manifest = {} as Radonis.AssetManifest

  for (const identifier in buildOutput) {
    const path = buildOutput[identifier].publicPath
    const isEntryFile = entryFileName.startsWith(identifier)

    manifest[identifier] = {
      type: isEntryFile ? 'entry' : 'component',
      identifier: identifier,
      path,
    }

    if (isEntryFile) {
      continue
    }

    const component = components.find(({ name }) => name === identifier)

    invariant(component?.source, `Could not analyze source for component "${identifier}" at "${path}"`)

    manifest[identifier] = {
      ...manifest[identifier],
      flashMessages: extractFlashMessages(component.source),
      messages: extractMessages(component.source),
      routes: extractRoutes(component.source),
    }
  }

  return manifest
}

/**
 * Extract the required assets from the asset manifest
 */
export function extractRequiredAssets(
  assetManifest: Radonis.AssetManifest,
  requiredAssets: { components: Set<string> }
): Radonis.Asset[] {
  const assets = Object.values(assetManifest)

  return assets.reduce<Radonis.Asset[]>((assetsAcc, asset) => {
    /**
     * Always include the entry file
     */
    if (asset.type === 'entry') {
      return [...assetsAcc, asset]
    }

    /**
     * Include the component if it is required
     */
    if (requiredAssets.components.has(asset.identifier)) {
      return [asset, ...assetsAcc]
    }

    return assetsAcc
  }, [])
}

/**
 * Yield a script path
 */
export function yieldScriptPath(path: string): string {
  if (existsSync(path)) {
    return path
  }

  const { ext } = parse(path)

  return ext ? path.replace(ext, '.js') : yieldScriptPath(`${path}.ts`)
}

/**
 * Warn about the usage of IoC imports
 */
export function warnAboutIocUsage(importSpecifier: string, path: string) {
  const { name, ext } = parse(path)

  return {
    errors: [
      {
        text: `Found AdonisJS IoC import "${importSpecifier}" in "${path}". Importing from the AdonisJS IoC Container in components built for the client is not allowed. Rename the component to "${name}.server${ext}" to exclude it from the build`,
        pluginName: 'radonis-client',
      },
    ],
  }
}

/**
 * Warn about a missing default export
 */
export function warnAboutMissingDefaultExport(path: string) {
  return {
    errors: [
      {
        text: `Found component at "${path}" without default export. All components built for the client must export themselves as default`,
        pluginName: 'radonis-client',
      },
    ],
  }
}
