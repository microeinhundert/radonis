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
import type { ComponentPropsWithoutRef, ComponentType, PropsWithoutRef } from 'react'

const MODULE_NAME = '@microeinhundert/radonis-types'

/**
 * Component identifier
 */
export type ComponentIdentifier = string

/**
 * Components
 */
export type Components = Map<ComponentIdentifier, ComponentType>

/**
 * Generate a union type of all components
 */
export function generateComponentIdentifierUnionType(components: ComponentIdentifier[]): string {
  if (!components.length) return 'type ComponentIdentifier = never'

  return `type ComponentIdentifier = ${components.map((value) => `'${value}'`).join(' | ')}`
}

/* ---------------------------------------- */

/**
 * Hydration
 */
export type Hydration = Record<string, { componentIdentifier: string; props: Record<string, any> }>

/* ---------------------------------------- */

/**
 * Globals (must be an interface for declaration merging from userland)
 */
export interface Globals {}

/* ---------------------------------------- */

/**
 * Flash message identifier
 */
export type FlashMessageIdentifier = string

/**
 * Flash messages
 */
export type FlashMessages = Record<FlashMessageIdentifier, any>

/* ---------------------------------------- */

/**
 * Locale
 */
export type Locale = string

/**
 * Message identifier
 */
export type MessageIdentifier = string

/**
 * Message data
 */
export type MessageData = Record<string, any>

/**
 * Messages
 */
export type Messages = Record<MessageIdentifier, string>

/**
 * Generate a union type of all available messages
 */
export function generateMessageIdentifierUnionType(messages: MessageIdentifier[]): string {
  if (!messages.length) return 'type MessageIdentifier = never'

  return `type MessageIdentifier = ${messages.map((value) => `'${value}'`).join(' | ')}`
}

/* ---------------------------------------- */

/**
 * Route identifier
 */
export type RouteIdentifier = string

/**
 * Routes
 */
export type Routes = Record<RouteIdentifier, string>

/**
 * Generate a union type of all available routes
 */
export function generateRouteIdentifierUnionType(routes: RouteIdentifier[]): string {
  if (!routes.length) return 'type RouteIdentifier = never'

  return `type RouteIdentifier = ${routes.map((value) => `'${value}'`).join(' | ')}`
}

/* ---------------------------------------- */

/**
 * Route
 */
export type Route = { identifier?: string; pattern?: string }

/**
 * Route params
 */
export type RouteParams = Record<string, string | number>

/**
 * Route query params
 */
export type RouteQueryParams = Record<string, string | number | (string | number)[]>

/* ---------------------------------------- */

/**
 * ManifestContract contract
 */
export type ManifestContract = {
  hydration: Hydration
  globals: Globals
  locale: Locale
  route: Route | null
  flashMessages: FlashMessages
  messages: Messages
  routes: Routes
}

/* ---------------------------------------- */

/**
 * Hydration requirements
 */
export interface HydrationRequirements {
  flashMessages: FlashMessageIdentifier[]
  messages: MessageIdentifier[]
  routes: RouteIdentifier[]
}

/* ---------------------------------------- */

/**
 * Value of
 */
export type ValueOf<T> = T[keyof T]

/**
 * Unwrap props
 */
export type UnwrapProps<T> = T extends PropsWithoutRef<infer P> ? P : T

/**
 * Resettable
 */
export interface Resettable {
  reset(): void
}

/* ---------------------------------------- */

/**
 * Head meta
 */
export interface HeadMeta {
  charset?: 'utf-8'
  charSet?: 'utf-8'
  [name: string]: null | string | undefined | (Record<string, string> | string)[]
}

/**
 * Head tag
 */
export interface HeadTag {
  name: string
  content: string
  attributes?: Record<string, unknown>
}

/**
 * Head contract
 */
export interface HeadContract {
  setTitle(title: string): void
  addMeta(meta: HeadMeta): void
  addTags(tags: HeadTag[]): void
}

/**
 * Custom error pages
 */
export interface CustomErrorPages {
  500?: ComponentType<{ error: unknown }>
}

/**
 * Render options
 */
export interface RenderOptions {
  title?: string
  meta?: HeadMeta
  tags?: HeadTag[]
  globals?: Globals
}

/**
 * Renderer contract
 */
export interface RendererContract {
  withTitle(string: string): RendererContract
  withHeadMeta(meta: HeadMeta): RendererContract
  withHeadTags(tags: HeadTag[]): RendererContract
  withGlobals(globals: Globals): RendererContract
  withCustomErrorPages(pages: CustomErrorPages): RendererContract
  render<T extends PropsWithoutRef<any>>(
    Component: ComponentType<T>,
    props?: ComponentPropsWithoutRef<ComponentType<T>>,
    options?: RenderOptions
  ): Promise<UnwrapProps<T>>
}

/* ---------------------------------------- */

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
    components,
    messages,
    routes,
  }: {
    components: ComponentIdentifier[]
    messages: MessageIdentifier[]
    routes: RouteIdentifier[]
  },
  outputDir: string
): Promise<void> {
  await emptyDir(outputDir)

  const originalTypes = await readTypeDeclarationFileFromDisk()

  if (!originalTypes) {
    throw new Error('Could not get original types')
  }

  const generatedTypes = Object.entries({
    ComponentIdentifier: generateComponentIdentifierUnionType(components),
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
