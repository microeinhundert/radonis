/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Core/Application' {
  interface ContainerBindings {
    'Adonis/Addons/Radonis/Manager/FlashMessages': Radonis.FlashMessagesManagerContract
    'Adonis/Addons/Radonis/Manager/I18n': Radonis.I18nManagerContract
    'Adonis/Addons/Radonis/Manager/Routes': Radonis.RoutesManagerContract
  }
}
