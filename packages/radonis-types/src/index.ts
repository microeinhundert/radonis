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
import type { ComponentType } from 'react'

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
 */
export function generateRouteIdentifierUnionType(routes: RouteIdentifier[]): string {
  if (!routes.length) return 'type RouteIdentifier = never'

  return `type RouteIdentifier = ${routes.map((value) => `'${value}'`).join(' | ')}`
}

/* ---------------------------------------- */

/**
 * Route
 */
export type Route = { name?: string; pattern?: string }

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
 * Unique between requests
 */
export interface UniqueBetweenRequests {
  prepareForNewRequest(): void
}

/**
 * Extract controller action return type
 */
export type ExtractControllerActionReturnType<
  Controller extends Record<string, any>,
  ActionName extends keyof Controller
> = Awaited<ReturnType<Controller[ActionName]>>

/* ---------------------------------------- */

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
