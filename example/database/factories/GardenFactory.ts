import Factory from "@ioc:Adonis/Lucid/Factory";
import Garden from "App/Models/Garden";

import UserFactory from "./UserFactory";

export default Factory.define(Garden, async ({ faker }) => {
  const user = await UserFactory.create();

  return {
    name: faker.random.words(3),
    zip: faker.address.zipCode(),
    city: faker.address.cityName(),
    userId: user.id,
  };
}).build();
