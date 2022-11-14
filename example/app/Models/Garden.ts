import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";
import CamelCaseNamingStrategy from "App/Strategies/CamelCaseNamingStrategy";
import { DateTime } from "luxon";

export default class Garden extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy();

  /*
   * Columns
   */
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public zip: string;

  @column()
  public city: string;

  @column()
  public userId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  /*
   * Relationships
   */
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;
}
