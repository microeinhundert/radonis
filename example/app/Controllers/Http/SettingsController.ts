import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Index } from 'Views/Settings';

export default class SettingsController {
  /*
   * index action
   */
  public index({ radonis, i18n }: HttpContextContract) {
    return radonis.withTitle(i18n.formatMessage('settings.index.title')).render(Index);
  }
}
