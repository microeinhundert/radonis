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
 * Available components (overridden by generated type)
 */
export interface AvailableComponents {
  value: string
}

/**
 * Components
 */
export type Components = Map<AvailableComponents['value'], ComponentType>

/**
 * Generate an interface of all available components
 * @internal
 */
export function generateAvailableComponentsInterface(components: AvailableComponents['value'][]): string {
  if (!components.length) return 'interface AvailableComponents { value: never }'

  return `interface AvailableComponents { value: ${components.map((value) => `'${value}'`).join(' | ')} }`
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
 * Available flash messages
 */
export interface AvailableFlashMessages {
  value: string
}

/**
 * Flash messages
 */
export type FlashMessages = Record<AvailableFlashMessages['value'], any>

/* ---------------------------------------- */

/**
 * Locale
 */
export type Locale = string

/**
 * Available messages (overridden by generated type)
 */
export interface AvailableMessages {
  value: string
}

/**
 * Message data
 */
export type MessageData = Record<string, any>

/**
 * Messages
 */
export type Messages = Record<AvailableMessages['value'], string>

/**
 * Generate an interface of all available messages
 * @internal
 */
export function generateAvailableMessagesInterface(messages: AvailableMessages['value'][]): string {
  if (!messages.length) return 'interface AvailableMessages { value: never }'

  return `interface AvailableMessages { value: ${messages.map((value) => `'${value}'`).join(' | ')} }`
}

/* ---------------------------------------- */

/**
 * Available routes (overridden by generated type)
 */
export interface AvailableRoutes {
  value: string
}

/**
 * Routes
 */
export type Routes = Record<AvailableRoutes['value'], string>

/**
 * Generate an interface of all available routes
 * @internal
 */
export function generateAvailableRoutesInterface(routes: AvailableRoutes['value'][]): string {
  if (!routes.length) return 'interface AvailableRoutes { value: never }'

  return `interface AvailableRoutes { value: ${routes.map((value) => `'${value}'`).join(' | ')} }`
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
  flashMessages: AvailableFlashMessages['value'][]
  messages: AvailableMessages['value'][]
  routes: AvailableRoutes['value'][]
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
    components: AvailableComponents['value'][]
    messages: AvailableMessages['value'][]
    routes: AvailableRoutes['value'][]
  },
  outputDir: string
): void {
  const typeDeclarations = [
    generateAvailableComponentsInterface(components),
    generateAvailableMessagesInterface(messages),
    generateAvailableRoutesInterface(routes),
  ].join('\n')

  outputFile(
    join(outputDir, 'radonis.d.ts'),
    `// This file is auto-generated, DO NOT EDIT\ndeclare module '@microeinhundert/radonis-types' {\n${typeDeclarations}\n}`
  )
}
