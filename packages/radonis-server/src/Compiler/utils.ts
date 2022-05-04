/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fsReadAll } from '@poppinss/utils/build/helpers'
import { existsSync, readFileSync } from 'fs'
import { join, parse } from 'path'

import { FLASH_MESSAGES_USAGE_REGEX, I18N_USAGE_REGEX, URL_BUILDER_USAGE_REGEX } from './constants'

/**
 * Strip the public dir from the beginning of a path
 */
export function stripPublicDir(path: string): string {
  return join('/', path.replace(/^public\//, ''))
}

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
export function discoverComponents(directory: string): Map<string, string> {
  return fsReadAll(directory, (filePath) => isComponentFile(filePath)).reduce<Map<string, string>>((acc, path) => {
    const absolutePath = join(directory, path)
    return acc.set(absolutePath, readFileSync(absolutePath, 'utf8'))
  }, new Map())
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
