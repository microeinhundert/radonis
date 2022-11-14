import I18n from "@ioc:Adonis/Addons/I18n";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class DetectUserLocaleMiddleware {
  protected getUserLanguage({ request }: HttpContextContract) {
    const availableLocales = I18n.supportedLocales();

    return request.language(availableLocales) || request.input("lang") || I18n.defaultLocale;
  }

  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const language = this.getUserLanguage(ctx);

    if (language) {
      ctx.i18n.switchLocale(language);
    }

    await next();
  }
}
