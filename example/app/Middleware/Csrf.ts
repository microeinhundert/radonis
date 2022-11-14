import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CsrfMiddleware {
  public async handle({ request, radonis }: HttpContextContract, next: () => Promise<void>) {
    radonis.withHeadMeta({ "csrf-token": request.csrfToken });
    radonis.withGlobals({ csrfToken: request.csrfToken });

    await next();
  }
}
