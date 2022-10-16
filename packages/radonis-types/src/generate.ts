/*
 * @microeinhundert/radonis-types
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readFile } from 'fs/promises'
import { emptyDir, outputFile } from 'fs-extra'
import { dirname, join } from 'path'

import type { MessageIdentifier, RouteIdentifier } from './'

const MODULE_NAME = '@microeinhundert/radonis-types'

/**
 * Generate a union type of all available messages
 */
function generateMessageIdentifierUnionType(messages: MessageIdentifier[]): string {
  if (!messages.length) return 'type MessageIdentifier = never'

  return `type MessageIdentifier = ${messages.map((value) => `'${value}'`).join(' | ')}`
}

/**
 * Generate a union type of all available routes
 */
function generateRouteIdentifierUnionType(routes: RouteIdentifier[]): string {
  if (!routes.length) return 'type RouteIdentifier = never'

  return `type RouteIdentifier = ${routes.map((value) => `'${value}'`).join(' | ')}`
}

/**
 * @internal
 */
export async function readTypeDeclarationFileFromDisk(): Promise<string | null> {
  try {
    const modulePath = dirname(require.resolve(MODULE_NAME))
    const filePath = join(modulePath, 'index.d.ts')
    const fileContents = await readFile(filePath, 'utf-8')

    return fileContents
  } catch {
    return null
  }
}

/**
 * @internal
 */
export async function generateAndWriteTypeDeclarationFileToDisk(
  {
    messages,
    routes,
  }: {
    messages: MessageIdentifier[]
    routes: RouteIdentifier[]
  },
  outputDir: string
): Promise<void> {
  await emptyDir(outputDir)

  const originalTypes = await readTypeDeclarationFileFromDisk()

  if (!originalTypes) {
    throw new Error('Could not read original type declaration file')
  }

  const generatedTypes = Object.entries({
    MessageIdentifier: generateMessageIdentifierUnionType(messages),
    RouteIdentifier: generateRouteIdentifierUnionType(routes),
  }).reduce((types, [typeName, typeValue]) => {
    return types.replace(`type ${typeName} = string`, typeValue)
  }, originalTypes)

  await outputFile(
    join(outputDir, 'radonis.d.ts'),
    `// This file is auto-generated, DO NOT EDIT\ndeclare module '${MODULE_NAME}' {\n${generatedTypes}\n}`
  )
}
