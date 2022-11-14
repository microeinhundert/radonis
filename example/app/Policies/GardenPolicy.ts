import { BasePolicy } from "@ioc:Adonis/Addons/Bouncer";
import type Garden from "App/Models/Garden";
import type User from "App/Models/User";

export default class GardenPolicy extends BasePolicy {
  public async list(user: User) {
    return !!user.id;
  }

  public async view(user: User, garden: Garden) {
    return garden.userId === user.id;
  }

  public async create(user: User) {
    return !!user.id;
  }

  public async edit(user: User, garden: Garden) {
    return garden.userId === user.id;
  }

  public async delete(user: User, garden: Garden) {
    return garden.userId === user.id;
  }
}
