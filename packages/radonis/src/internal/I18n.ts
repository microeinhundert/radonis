import { IntlMessageFormat } from 'intl-messageformat';

import { isServer } from './utils/environment';

export class I18n {
  /**
   * I18nManager
   */
  private i18nManager?: Radonis.I18nManagerContract;

  /**
   * Constructor
   */
  constructor(
    private locale: string,
    private translations: Record<string, string>,
    private willHydrate?: boolean
  ) {
    this.i18nManager = globalThis.rad_i18nManager;
  }

  /**
   * Find the message inside the registered translations and
   * raise exception when unable to
   */
  private findMessageOrFail(identifier: string): string {
    const message = this.translations[identifier];

    if (!message) {
      throw new Error(`Cannot find message for "${identifier}"`);
    }

    if (isServer() && this.willHydrate) {
      this.i18nManager?.requireTranslationForHydration(identifier);
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
          getNumberFormat: (...args: any[]) => new Intl.NumberFormat(...args),
          getDateTimeFormat: (...args: any[]) => new Intl.DateTimeFormat(...args),
          getPluralRules: (...args: any[]) => new Intl.PluralRules(...args),
        },
        ignoreTag: true,
      }
    ).format(data || {});
  }
}
