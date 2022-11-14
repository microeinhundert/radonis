import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

export default class GardenValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params.id ?? 0,
    userId: this.ctx.auth.user?.id ?? 0,
  });

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.unique({
        table: "gardens",
        column: "name",
        whereNot: {
          id: this.refs.id,
        },
        where: {
          user_id: this.refs.userId,
        },
      }),
    ]),
    zip: schema.string({ trim: true }),
    city: schema.string({ trim: true }),
  });

  public messages = {};
}
