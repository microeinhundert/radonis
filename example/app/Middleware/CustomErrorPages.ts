import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { InternalServerError } from 'Views/Errors/InternalServerError';

export default class CustomErrorPagesMiddleware {
  public async handle(
    { radonis }: HttpContextContract,
    next: () => Promise<void>
  ) {
    radonis.withCustomErrorPages({
      500: InternalServerError
    })

    await next();
  }
}
