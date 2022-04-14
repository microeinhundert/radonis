import type { ApplicationContract } from '@ioc:Adonis/Core/Application';
import type { AssetsManagerContract } from '@ioc:Adonis/Core/AssetsManager';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import type { RouterContract } from '@ioc:Adonis/Core/Route';

import { HydrationRoot } from './components/HydrationRoot';
import { useAdonis } from './hooks/useAdonis';
import { useApp } from './hooks/useApp';
import { useHttpContext } from './hooks/useHttpContext';
import { useRequest } from './hooks/useRequest';
import { useRouter } from './hooks/useRouter';
import { useSession } from './hooks/useSession';
import { ENTRY_NAME } from './internal/constants';
import { ManifestBuilder } from './internal/ManifestBuilder';
import { ReactRenderer } from './internal/ReactRenderer';
import { extractRoutesFromRouter } from './internal/utils/router';

/**
 * Initialize the ReactRenderer
 */
function initReactRenderer(
  ctx: HttpContextContract,
  app: ApplicationContract,
  Router: RouterContract,
  AssetsManager: AssetsManagerContract
): ReactRenderer {
  const jsFiles = AssetsManager.entryPointJsFiles?.(ENTRY_NAME) ?? [];
  const cssFiles = AssetsManager.entryPointCssFiles?.(ENTRY_NAME) ?? [];

  const routes = extractRoutesFromRouter(Router);
  const manifestBuilder = ManifestBuilder.construct();

  /**
   * Set routing related data on the ManifestBuilder
   */
  manifestBuilder.setRoutes(routes);
  manifestBuilder.setRoute({
    name: ctx.route?.name,
    pattern: ctx.route?.pattern,
  });

  if (ctx.session) {
    /**
     * Set flash messages on the ManifestBuilder
     */
    manifestBuilder.setFlashMessages(ctx.session.flashMessages?.all() ?? {});
  }

  const reactRenderer = ReactRenderer.construct(manifestBuilder, jsFiles, cssFiles);

  /**
   * Share context with the ReactRenderer
   */
  reactRenderer.shareContext({
    app,
    ctx,
    request: ctx.request,
    router: Router,
  });

  return reactRenderer;
}

export class RadonisProvider {
  public static needsApplication = true;

  /**
   * Constructor
   */
  constructor(private app: ApplicationContract) {}

  /**
   * Register
   */
  public register() {
    this.app.container.singleton('Radonis', () => {
      return {
        useAdonis,
        useApp,
        useHttpContext,
        useRequest,
        useRouter,
        useSession,
        HydrationRoot,
      };
    });
  }

  /**
   * Boot
   */
  public boot() {
    this.app.container.withBindings(
      [
        'Adonis/Core/HttpContext',
        'Adonis/Core/Application',
        'Adonis/Core/Route',
        'Adonis/Core/AssetsManager',
      ],
      (HttpContext, app, Route, AssetsManager) => {
        HttpContext.getter(
          'radonis',
          function () {
            return initReactRenderer(this, app, Route, AssetsManager);
          },
          true
        );
      }
    );
  }
}
