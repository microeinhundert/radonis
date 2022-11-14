import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Gardens extends BaseSchema {
  protected tableName = "gardens";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name", 255).notNullable();
      table.string("zip", 255).notNullable();
      table.string("city", 255).notNullable();
      table.integer("user_id").unsigned().references("users.id").onDelete("CASCADE"); // delete garden when user is deleted
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
