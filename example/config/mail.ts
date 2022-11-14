/**
 * Config source: https://git.io/JvgAf
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import type { MailConfig } from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";

const mailConfig: MailConfig = {
  /*
  |--------------------------------------------------------------------------
  | Default mailer
  |--------------------------------------------------------------------------
  |
  | The following mailer will be used to send emails, when you don't specify
  | a mailer
  |
  */
  mailer: "ses",

  /*
  |--------------------------------------------------------------------------
  | Mailers
  |--------------------------------------------------------------------------
  |
  | You can define or more mailers to send emails from your application. A
  | single `driver` can be used to define multiple mailers with different
  | config.
  |
  | For example: Postmark driver can be used to have different mailers for
  | sending transactional and promotional emails
  |
  */
  mailers: {
    /*
    |--------------------------------------------------------------------------
    | SES
    |--------------------------------------------------------------------------
    |
    | Uses Amazon SES for sending emails. You will have to install the aws-sdk
    | when using this driver.
    |
    | ```
    | npm i aws-sdk
    | ```
    |
    */
    ses: {
      driver: "ses",
      apiVersion: "2010-12-01",
      key: Env.get("SES_ACCESS_KEY"),
      secret: Env.get("SES_ACCESS_SECRET"),
      region: Env.get("SES_REGION"),
      sslEnabled: true,
      sendingRate: 10,
      maxConnections: 5,
    },
  },
};

export default mailConfig;
