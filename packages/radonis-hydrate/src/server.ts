/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isServer } from '@microeinhundert/radonis-shared'

/**
 * Require a route for hydration
 * Note: This should run only on the server
 */
export function requireRouteForHydration(identifier: string): void {
  if (!isServer) return

  const { RoutesManager } = require('@microeinhundert/radonis-server')

  new RoutesManager().requireRouteForHydration(identifier)
}

/**
 * Require a flash message for hydration
 * Note: This should run only on the server
 */
export function requireFlashMessageForHydration(identifier: string): void {
  if (!isServer) return

  const { FlashMessagesManager } = require('@microeinhundert/radonis-server')

  new FlashMessagesManager().requireFlashMessageForHydration(identifier)
}

/**
 * Require a message for hydration
 * Note: This should run only on the server
 */
export function requireMessageForHydration(identifier: string): void {
  if (!isServer) return

  const { I18nManager } = require('@microeinhundert/radonis-server')

  new I18nManager().requireMessageForHydration(identifier)
}
