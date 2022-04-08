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
   * The referenced translations
   */
  private referencedTranslations: Set<string> = new Set();

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

    const referencedTranslations = {};

    for (const identifier of this.referencedTranslations) {
      if (this.translations[identifier]) {
        referencedTranslations[identifier] = this.translations[identifier];
      }
    }

    return referencedTranslations;
  }

  /**
   * Mark a translation as referenced
   */
  public markTranslationAsReferenced(identifier: string): void {
    if (!this.translations[identifier]) return;
    this.referencedTranslations.add(identifier);
  }

  /**
   * Clear the referenced translations
   */
  public clearReferencedTranslations(): this {
    this.referencedTranslations.clear();

    return this;
  }

  /**
   * Construct a new I18nManager
   */
  public static construct(): Radonis.I18nManagerContract {
    return (globalThis.ars_i18nManager =
      globalThis.ars_i18nManager?.clearReferencedTranslations() ?? new I18nManager());
  }
}
