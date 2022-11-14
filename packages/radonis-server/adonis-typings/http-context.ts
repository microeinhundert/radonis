/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module "@ioc:Adonis/Core/HttpContext" {
  import type { RendererContract } from "@microeinhundert/radonis-types";

  interface HttpContextContract {
    radonis: RendererContract;
  }
}
