import I18n from '@ioc:Adonis/Addons/I18n'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * The middleware detects the user language using the "Accept-language" HTTP header
 * or the "lang" query string parameter.
 *
 * Feel free to change the middleware implementation to what suits your needs. Just
 * make sure
 *
 * - You always ensure the user selected language is supported by your app.
 * - Only call "switchLocale" when the detected language is valid string value and
 *   not "null" or "undefined"
 */
export default class DetectUserLocale {
  /**
   * Detect user language using "Accept-language" header or
   * the "lang" query string parameter.
   *
   * The user language must be part of the "supportedLocales", otherwise
   * this method should return null.
   */
  protected getUserLanguage(ctx: HttpContextContract) {
    const availableLocales = I18n.supportedLocales()
    return ctx.request.language(availableLocales) || ctx.request.input('lang')
  }

  /**
   * Handle method is called by AdonisJS automatically on every middleware
   * class.
   */
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const language = this.getUserLanguage(ctx)

    /**
     * Switch locale when we are able to detect the user language and it
     * is supported by the application
     */
    if (language) {
      ctx.i18n.switchLocale(language)
    }

    /**
     * Share i18n with view
     */
    if ('view' in ctx) {
      ctx.view.share({ i18n: ctx.i18n })
    }

    await next()
  }
}
