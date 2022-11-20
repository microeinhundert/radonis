import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

export default class SignInValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: false,
        gmailRemoveSubaddress: false,
      }),
    ]),
    password: schema.string({ trim: true }),
    rememberMe: schema.boolean.optional(),
  });

  public messages = {};
}
