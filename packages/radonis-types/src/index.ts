/*
 * @microeinhundert/radonis-types
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { outputFile } from 'fs-extra'
import { join } from 'path'
import type { ComponentPropsWithoutRef, ComponentType, PropsWithoutRef } from 'react'

/**
 * Component identifier (overridden by generated type)
 */
export type ComponentIdentifier = string

/**
 * Components
 */
export type Components = Map<ComponentIdentifier, ComponentType>

/**
 * Generate a union type of all components
 * @internal
 */
export function generateComponentIdentifierUnionType(components: ComponentIdentifier[]): string {
  if (!components.length) return 'type ComponentIdentifier = never'

  return `type ComponentIdentifier = ${components.map((value) => `'${value}'`).join(' | ')}`
}

/* ---------------------------------------- */

/**
 * Props hash
 */
export type PropsHash = string

/**
 * Props
 */
export type Props = Record<PropsHash, Record<string, any>>

/* ---------------------------------------- */

/**
 * Globals (must be an interface for declaration merging, overridden by consumer)
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
 * Message identifier (overridden by generated type)
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
 * @internal
 */
export function generateMessageIdentifierUnionType(messages: MessageIdentifier[]): string {
  if (!messages.length) return 'type MessageIdentifier = never'

  return `type MessageIdentifier = ${messages.map((value) => `'${value}'`).join(' | ')}`
}

/* ---------------------------------------- */

/**
 * Route identifier (overridden by generated type)
 */
export type RouteIdentifier = string

/**
 * Routes
 */
export type Routes = Record<RouteIdentifier, string>

/**
 * Generate a union type of all available routes
 * @internal
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
 * Manifest
 */
export type Manifest = {
  props: Props
  flashMessages: FlashMessages
  locale: Locale
  messages: Messages
  routes: Routes
  route: Route | null
} & { globals: Globals }

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
 * Pick matching
 */
export type PickMatching<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] }

/**
 * Extract methods
 */
export type ExtractMethods<T> = PickMatching<T, Function>

/**
 * Unwrap props
 */
export type UnwrapProps<T> = T extends PropsWithoutRef<infer P> ? P : T

/**
 * Reset between requests
 */
export interface ResetBetweenRequests {
  resetForNewRequest(): void
}

/**
 * Extract controller action return type
 */
export type ExtractControllerActionReturnType<
  TController extends Record<string, any>,
  TAction extends keyof ExtractMethods<TController>
> = Awaited<ReturnType<ExtractMethods<TController>[TAction]>>

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
  render<T extends PropsWithoutRef<any>>(
    Component: ComponentType<T>,
    props?: ComponentPropsWithoutRef<ComponentType<T>>,
    options?: RenderOptions
  ): Promise<string | UnwrapProps<T> | undefined>
}

/* ---------------------------------------- */

/**
 * @internal
 */
export function generateAndWriteTypesToDisk(
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
): void {
  const typeDeclarations = [
    generateComponentIdentifierUnionType(components),
    generateMessageIdentifierUnionType(messages),
    generateRouteIdentifierUnionType(routes),
  ].join('\n')

  outputFile(
    join(outputDir, 'radonis.d.ts'),
    `// This file is auto-generated, DO NOT EDIT\ndeclare module '@microeinhundert/radonis-types' {\n${typeDeclarations}\n}`
  )
}
