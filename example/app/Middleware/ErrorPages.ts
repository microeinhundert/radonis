import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { InternalServerError } from "Views/Errors/InternalServerError";

export default class ErrorPagesMiddleware {
  public async handle({ radonis }: HttpContextContract, next: () => Promise<void>) {
    radonis.withErrorPages({
      500: InternalServerError,
    });

    await next();
  }
}
