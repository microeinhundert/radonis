import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Index } from 'Views/Home';

export default class HomeController {
  /*
   * index action
   */
  public index({ radonis, i18n }: HttpContextContract) {
    return radonis.withTitle(i18n.formatMessage('home.index.title')).render(Index);
  }
}
