/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fsReadAll } from '@poppinss/utils/build/helpers'
import type { Metafile } from 'esbuild'
import { basename, join, parse } from 'path'

/**
 * Check if the first character of a string is a lowercase letter
 */
export function isFirstCharLowerCase(string: string): boolean {
  return string.charAt(0).toLowerCase() === string.charAt(0)
}

/**
 * Discover all components in a specific directory
 */
export function discoverComponents(directory: string) {
  return fsReadAll(directory, (filePath) => {
    const fileName = basename(filePath)
    return fileName.endsWith('.tsx') && !fileName.endsWith('.server.tsx') && !isFirstCharLowerCase(fileName)
  }).map((path) => join(directory, path))
}

/**
 * Inject the call to the hydrate function into the source code of a component
 */
export function injectHydrateCall(componentSource: string, componentName: string): string {
  return `
    import { registerComponentForHydration } from '@microeinhundert/radonis';
    ${componentSource}
    registerComponentForHydration('${componentName}', ${componentName});
  `
}

/**
 * Extract the entry points from an esbuild generated metafile
 */
export function extractEntryPoints(metafile: Metafile): Record<string, string> {
  const entryPoints: Record<string, string> = {}

  for (const path in metafile.outputs) {
    const output = metafile.outputs[path]

    if (output.entryPoint) {
      const { name } = parse(output.entryPoint)
      entryPoints[name] = path
    }
  }

  return entryPoints
}
