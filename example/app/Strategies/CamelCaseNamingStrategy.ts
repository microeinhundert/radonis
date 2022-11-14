import { string } from "@ioc:Adonis/Core/Helpers";
import type { BaseModel } from "@ioc:Adonis/Lucid/Orm";
import { SnakeCaseNamingStrategy } from "@ioc:Adonis/Lucid/Orm";

export default class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.camelCase(propertyName);
  }
}
