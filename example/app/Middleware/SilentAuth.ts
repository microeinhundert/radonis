import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class SilentAuthMiddleware {
  public async handle({ auth, radonis }: HttpContextContract, next: () => Promise<void>) {
    await auth.check();

    radonis.withGlobals({ authenticatedUser: auth.user });

    await next();
  }
}
