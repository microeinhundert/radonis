declare module "@ioc:Adonis/Addons/Mail" {
  import type { MailDrivers } from "@ioc:Adonis/Addons/Mail";

  interface MailersList {
    ses: MailDrivers["ses"];
  }
}
