/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager } from '@microeinhundert/radonis-hydrate'
import { IntlMessageFormat } from 'intl-messageformat'

export class I18n {
  /**
   * Constructor
   */
  constructor(private locale: string, private messages: Record<string, string>, private willHydrate?: boolean) {}

  /**
   * Find the message inside the registered messages and
   * raise exception when unable to
   */
  private findMessageOrFail(identifier: string): string {
    const message = this.messages[identifier]

    if (!message) {
      throw new Error(`Cannot find message for "${identifier}"`)
    }

    if (this.willHydrate) {
      new HydrationManager().requireMessageForHydration(identifier)
    }

    return message
  }

  /**
   * Format a message
   */
  public formatMessage(identifier: string, data?: Record<string, any>): string {
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
