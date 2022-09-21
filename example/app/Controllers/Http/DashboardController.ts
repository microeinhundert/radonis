import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Dashboard } from 'Views/Dashboard';

export default class DashboardController {
  /*
   * index action
   */
  public index({ radonis, i18n }: HttpContextContract) {
    return radonis.withTitle(i18n.formatMessage('dashboard.index.title')).render(Dashboard);
  }
}
