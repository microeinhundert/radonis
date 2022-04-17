/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isServer } from '@microeinhundert/radonis-shared'
import { IntlMessageFormat } from 'intl-messageformat'

export class I18n {
  /**
   * I18nManager
   */
  private i18nManager?: Radonis.I18nManagerContract

  /**
   * Constructor
   */
  constructor(private locale: string, private messages: Record<string, string>, private willHydrate?: boolean) {
    this.i18nManager = globalThis.rad_i18nManager
  }

  /**
   * Find the message inside the registered messages and
   * raise exception when unable to
   */
  private findMessageOrFail(identifier: string): string {
    const message = this.messages[identifier]

    if (!message) {
      throw new Error(`Cannot find message for "${identifier}"`)
    }

    if (isServer() && this.willHydrate) {
      this.i18nManager?.requireMessageForHydration(identifier)
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
