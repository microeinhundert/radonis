/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHydration } from '@microeinhundert/radonis-hydrate'
import type { MessageData, MessageIdentifier } from '@microeinhundert/radonis-types'
import IntlMessageFormat from 'intl-messageformat'

import { HookException } from '../exceptions/hookException'
import { hydrationManager } from '../singletons'
import { useManifest } from './useManifest'

/**
 * Hook for retrieving and formatting translation messages
 * @see https://radonis.vercel.app/docs/hooks/use-i18n
 */
export function useI18n() {
  const { locale, messages } = useManifest()
  const hydration = useHydration()

  /**
   * Find the message inside the registered messages and
   * raise exception when unable to
   */
  function findMessageOrFail(identifier: MessageIdentifier) {
    const message = messages[identifier]

    if (!message) {
      throw HookException.cannotFindMessage(identifier)
    }

    if (hydration.root) {
      hydrationManager.requireMessage(identifier)
    }

    return message
  }

  /**
   * Format a message
   */
  function formatMessage(identifier: MessageIdentifier, data?: MessageData) {
    const message = findMessageOrFail(identifier)

    return new IntlMessageFormat(
      message,
      locale,
      {},
      {
        formatters: {
          getNumberFormat: (...args) => new Intl.NumberFormat(...args),
          getDateTimeFormat: (...args) => new Intl.DateTimeFormat(...args),
          getPluralRules: (...args) => new Intl.PluralRules(...args),
        },
        ignoreTag: true,
      }
    ).format(data || {})
  }

  return {
    formatMessage,
  }
}
