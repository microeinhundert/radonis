import type { I18nConfig } from "@ioc:Adonis/Addons/I18n";
import Application from "@ioc:Adonis/Core/Application";

const i18nConfig: I18nConfig = {
  /*
  |--------------------------------------------------------------------------
  | Translations format
  |--------------------------------------------------------------------------
  |
  | The format in which the translation are written. By default only the
  | ICU message syntax is supported. However, you can register custom
  | formatters too and please reference the documentation for that.
  |
  */
  translationsFormat: "icu",

  /*
  |--------------------------------------------------------------------------
  | Default locale
  |--------------------------------------------------------------------------
  |
  | The default locale represents the language for which all the translations
  | are always available.
  |
  | Having a default locale allows you to incrementally add translations for
  | other languages. If a specific language does not have a translation,
  | then the default locale translation will be used.
  |
  | Also, we switch to default locale for HTTP requests where the user language
  | is not supported by the your app
  |
  */
  defaultLocale: "en",

  /*
  |--------------------------------------------------------------------------
  | Supported locales
  |--------------------------------------------------------------------------
  |
  | Optionally define an array of locales that your application supports. If
  | not defined, we will derive this value from the translations stored
  | inside the `resources/lang` directory.
  |
  */
  // supportedLocales: [],

  /*
  |--------------------------------------------------------------------------
  | Fallback locales
  |--------------------------------------------------------------------------
  |
  | Here you can configure per language fallbacks. For example, you can set
  | "es" as the fallback locale for the Catalan language.
  |
  | If not configured, all languages will fallback to the defaultLocale
  |
  */
  // fallbackLocales: {},

  /*
  |--------------------------------------------------------------------------
  | Provide validator messages
  |--------------------------------------------------------------------------
  |
  | Set the following option to "true" if you want to use "i18n" for defining
  | the validation messages.
  |
  | The validation messages will be loaded from the "validator.shared" prefix.
  |
  */
  provideValidatorMessages: true,

  /*
  |--------------------------------------------------------------------------
  | Loaders
  |--------------------------------------------------------------------------
  |
  | Loaders from which to load the translations. You can configure multiple
  | loaders as well and AdonisJS will merge the translations from all the
  | loaders to have a unified collection of messages.
  |
  | By default, only the "fs" loader is supported. However, you can add custom
  | loaders too and please reference the documentation for that.
  |
  */
  loaders: {
    fs: {
      enabled: true,
      location: Application.resourcesPath("lang"),
    },
  },
};

export default i18nConfig;
