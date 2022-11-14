import Hash from "@ioc:Adonis/Core/Hash";
import { BaseModel, beforeSave, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Garden from "App/Models/Garden";
import CamelCaseNamingStrategy from "App/Strategies/CamelCaseNamingStrategy";
import { DateTime } from "luxon";

export default class User extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy();

  /*
   * Columns
   */
  @column({ isPrimary: true })
  public id: number;

  @column()
  public firstName: string;

  @column()
  public lastName: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column({ serializeAs: null })
  public rememberMeToken?: string;

  @column.dateTime({ serializeAs: null, autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ serializeAs: null, autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  /*
   * Relationships
   */
  @hasMany(() => Garden)
  public gardens: HasMany<typeof Garden>;

  /*
   * Hooks
   */
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
