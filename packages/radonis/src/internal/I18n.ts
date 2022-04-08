import { IntlMessageFormat } from 'intl-messageformat';

import { isServer } from './utils/environment';

export class I18n {
  /**
   * Constructor
   */
  constructor(private locale: string, private translations: Record<string, string>) {}

  /**
   * Find the message inside the registered translations and
   * raise exception when unable to
   */
  private findMessageOrFail(identifier: string): string {
    const message = this.translations[identifier];

    if (!message) {
      throw new Error(`Cannot find message for "${identifier}"`);
    }

    if (isServer()) {
      globalThis.ars_i18nManager?.markTranslationAsReferenced(identifier);
    }

    return message;
  }

  /**
   * Format a message
   */
  public formatMessage(identifier: string, data?: Record<string, any>): string {
    const message = this.findMessageOrFail(identifier);

    return new IntlMessageFormat(
      message,
      this.locale,
      {},
      {
        formatters: {
          getNumberFormat: Intl.NumberFormat,
          getDateTimeFormat: Intl.DateTimeFormat,
          getPluralRules: Intl.PluralRules,
        },
        ignoreTag: true,
      }
    ).format(data || {});
  }
}
