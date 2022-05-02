/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager } from '@microeinhundert/radonis-hydrate'
import { fsReadAll } from '@poppinss/utils/build/helpers'
import type { Metafile } from 'esbuild'
import { existsSync } from 'fs'
import { join, parse } from 'path'

import { FLASH_MESSAGES_USAGE_REGEX, I18N_USAGE_REGEX, PUBLIC_PATH_SEGMENT, URL_BUILDER_USAGE_REGEX } from './constants'

const hydrationManager = new HydrationManager()

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
export function discoverComponents(directory: string) {
  return fsReadAll(directory, (filePath) => isComponentFile(filePath)).map((path) => join(directory, path))
}

/**
 * Inject the call to the hydrate function into the source code of a component
 */
export function injectHydrateCall(componentSource: string, componentName: string, sourceType: 'esm' | 'cjs'): string {
  return `
    ${
      sourceType === 'esm'
        ? `import { registerComponentForHydration } from "@microeinhundert/radonis";`
        : 'const { registerComponentForHydration } = require("@microeinhundert/radonis");'
    }
    ${componentSource}
    registerComponentForHydration("${componentName}", ${componentName});
  `
}

/**
 * Extract the entry points from an esbuild generated metafile
 */
export function extractEntryPoints(metafile: Metafile): Record<string, string> {
  const entryPoints = {} as Record<string, string>

  for (let path in metafile.outputs) {
    const output = metafile.outputs[path]

    if (output.entryPoint) {
      const { name } = parse(output.entryPoint)

      /**
       * TODO: Remove this hack
       */
      if (path.startsWith(PUBLIC_PATH_SEGMENT)) {
        path = path.replace(PUBLIC_PATH_SEGMENT, '')
      }

      entryPoints[name] = path
    }
  }

  return entryPoints
}

/**
 * Find usages of `.formatMessage` in the source code
 * and require the messages for hydration.
 * False matches do not do any harm
 */
export function findAndRequireMessagesForHydration(source: string): void {
  const matches = source.matchAll(I18N_USAGE_REGEX)

  for (const match of matches) {
    if (match?.groups?.identifier) {
      hydrationManager.requireMessageForHydration(match.groups.identifier)
    }
  }
}

/**
 * Find usages of `.has(ValidationError)?` and `.get(ValidationError)?` in the source code
 * and require the flash messages for hydration.
 * False matches do not do any harm
 */
export function findAndRequireFlashMessagesForHydration(source: string): void {
  const matches = source.matchAll(FLASH_MESSAGES_USAGE_REGEX)

  for (const match of matches) {
    if (match?.groups?.identifier) {
      hydrationManager.requireFlashMessageForHydration(match.groups.identifier)
    }
  }
}

/**
 * Find usages of `.make` in the source code
 * and require the routes for hydration.
 * False matches do not do any harm
 */
export function findAndRequireRoutesForHydration(source: string): void {
  const matches = source.matchAll(URL_BUILDER_USAGE_REGEX)

  for (const match of matches) {
    if (match?.groups?.identifier) {
      hydrationManager.requireRouteForHydration(match.groups.identifier)
    }
  }
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
