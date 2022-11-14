import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import GardenFactory from "Database/factories/GardenFactory";

export default class extends BaseSeeder {
  public async run() {
    await GardenFactory.createMany(20);
  }
}
