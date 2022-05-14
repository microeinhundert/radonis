/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager } from '@microeinhundert/radonis-hydrate'
import { invariant } from '@microeinhundert/radonis-shared'
import type { Locale, MessageData, MessageIdentifier, Messages, ValueOf } from '@microeinhundert/radonis-types'
import { IntlMessageFormat } from 'intl-messageformat'

export class I18nImpl {
  /**
   * Constructor
   */
  constructor(private locale: Locale, private messages: Messages, private willHydrate?: boolean) {}

  /**
   * Find the message inside the registered messages and
   * raise exception when unable to
   */
  private findMessageOrFail(identifier: MessageIdentifier): ValueOf<Messages> {
    const message = this.messages[identifier]

    invariant(message, `Cannot find message for "${identifier}"`)

    if (this.willHydrate) {
      new HydrationManager().requireMessageForHydration(identifier)
    }

    return message
  }

  /**
   * Format a message
   */
  public formatMessage(identifier: MessageIdentifier, data?: MessageData): ValueOf<Messages> {
    const message = this.findMessageOrFail(identifier)

    return new IntlMessageFormat(
      message,
      this.locale,
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
}
