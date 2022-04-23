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

import { PUBLIC_PATH_SEGMENT } from './constants'

/**
 * Check if the file looks like it contains a component:
 * - Starts with an uppercase letter
 * - Has `.tsx` or `.jsx` extension
 * - Does not end with `.<something>.<ext>`
 */
export function isComponentFile(filePath: string): boolean {
  const fileName = basename(filePath)
  return fileName.match(/^[A-Z]\w+\.(tsx|jsx)$/) !== null
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
