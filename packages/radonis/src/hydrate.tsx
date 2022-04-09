import type { LazyExoticComponent } from 'react';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';

import { HydrationContextProvider } from './contexts/hydrationContext';
import { getManifestOrFail, isServer } from './internal/utils/environment';

/**
 * Create the intersection observer that hydrates components only when in view
 */
const createIntersectionObserver = (
  components: Record<string, LazyExoticComponent<any>>
): IntersectionObserver => {
  return new IntersectionObserver((observedHydrationRoots, observer) => {
    observedHydrationRoots.forEach((observedHydrationRoot) => {
      if (!observedHydrationRoot.isIntersecting) return;

      const hydrationRoot = observedHydrationRoot.target as HTMLElement;
      const componentName = hydrationRoot.dataset.component ?? 'Unknown';
      const propsHash = hydrationRoot.dataset.props ?? '0';

      const Component = components[componentName];

      if (!Component) {
        observer.unobserve(hydrationRoot);
        console.warn(
          `Found the server-rendered component "${componentName}", but that component could not be hydrated`
        );
        return;
      }

      const manifest = getManifestOrFail();
      const props = manifest.props[propsHash] ?? {};

      hydrateRoot(
        hydrationRoot,
        <HydrationContextProvider
          value={{ isChildOfHydrationRoot: true, hydration: { componentName, propsHash } }}
        >
          <Component {...props} />
        </HydrationContextProvider>
      );
      observer.unobserve(hydrationRoot);
    });
  });
};

/**
 * Hydrate the server-rendered components on the client
 */
export const hydrate = (components: Record<string, LazyExoticComponent<any>>): void => {
  if (isServer()) {
    throw new Error(
      'Radonis hydration does not work on the server. Please make sure "hydrate" is only called on the client'
    );
  }

  const hydrationRoots = document.querySelectorAll('[data-hydration-root]');
  const intersectionObserver = createIntersectionObserver(components);

  hydrationRoots.forEach((hydrationRoot: HTMLElement) => {
    intersectionObserver.observe(hydrationRoot);
  });
};
