import { DEFAULT_LOCALE } from './constants';

export class I18nManager implements Radonis.I18nManagerContract {
  /**
   * The locale
   */
  private locale: string = DEFAULT_LOCALE;

  /**
   * The translations
   */
  private translations: Record<string, string> = {};

  /**
   * The translations required for hydration
   */
  private translationsRequiredForHydration: Set<string> = new Set();

  /**
   * Set the locale
   */
  public setLocale(locale: string): void {
    this.locale = locale;
  }

  /**
   * Get the locale
   */
  public getLocale(): string {
    return this.locale;
  }

  /**
   * Set the translations
   */
  public setTranslations(translations: Record<string, string>): void {
    this.translations = translations;
  }

  /**
   * Get the translations
   */
  public getTranslations(all?: boolean): Record<string, string> {
    if (all) {
      return this.translations;
    }

    const translations = {};

    for (const identifier of this.translationsRequiredForHydration) {
      if (this.translations[identifier]) {
        translations[identifier] = this.translations[identifier];
      }
    }

    return translations;
  }

  /**
   * Require a translation for hydration
   */
  public requireTranslationForHydration(identifier: string): void {
    if (!this.translations[identifier]) return;
    this.translationsRequiredForHydration.add(identifier);
  }

  /**
   * Get a fresh instance
   */
  public fresh(): this {
    this.translationsRequiredForHydration.clear();

    return this;
  }

  /**
   * Construct a new I18nManager
   */
  public static construct(): Radonis.I18nManagerContract {
    return (globalThis.rad_i18nManager = globalThis.rad_i18nManager?.fresh() ?? new I18nManager());
  }
}
