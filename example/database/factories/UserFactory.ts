import Factory from "@ioc:Adonis/Lucid/Factory";
import User from "App/Models/User";

export default Factory.define(User, ({ faker }) => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}).build();
