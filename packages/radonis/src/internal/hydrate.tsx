import type { LazyExoticComponent } from 'react';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';

import { HydrationContextProvider } from '../contexts/hydrationContext';
import { getManifestOrFail, isServer } from './utils/environment';

/**
 * Create the intersection observer that hydrates components only when in view
 */
const createIntersectionObserver = (
  components: Record<string, LazyExoticComponent<any>>
): IntersectionObserver => {
  return new IntersectionObserver((observedHydrationRoots, observer) => {
    observedHydrationRoots.forEach((observedHydrationRoot) => {
      if (!observedHydrationRoot.isIntersecting) return;

      const hydrationRootTarget = observedHydrationRoot.target as HTMLElement;

      const hydrationRoot = hydrationRootTarget.dataset.hydrationRoot;
      const componentName = hydrationRootTarget.dataset.component;

      if (!hydrationRoot || !componentName) {
        observer.unobserve(hydrationRootTarget);
        console.warn(
          `Found a HydrationRoot that is missing important hydration data.
          Please make sure you passed all the required props to all of your HydrationRoots.
          If everything looks fine to you, this is most likely a bug of Radonis`
        );
        return;
      }

      const Component = components[componentName];

      if (!Component) {
        observer.unobserve(hydrationRootTarget);
        console.warn(
          `Found the server-rendered component "${componentName}" inside of HydrationRoot "${hydrationRoot}", but that component could not be hydrated.
          Please make sure the name under which the component was passed to "hydrate" matches the "componentName" prop passed to the HydrationRoot`
        );
        return;
      }

      const manifest = getManifestOrFail();

      const propsHash = hydrationRootTarget.dataset.props ?? '0';
      const props = manifest.props[propsHash] ?? {};

      hydrateRoot(
        hydrationRootTarget,
        <HydrationContextProvider value={{ root: hydrationRoot, componentName, propsHash }}>
          <Component {...props} />
        </HydrationContextProvider>
      );
      observer.unobserve(hydrationRootTarget);
    });
  });
};

/**
 * Hydrate the server-rendered components on the client
 */
export const hydrate = (components: Record<string, LazyExoticComponent<any>>): void => {
  if (isServer()) {
    throw new Error(
      `Radonis hydration does not work on the server.
      Please make sure "hydrate" is only called on the client`
    );
  }

  const hydrationRoots = document.querySelectorAll('[data-hydration-root]');
  const intersectionObserver = createIntersectionObserver(components);

  hydrationRoots.forEach((hydrationRoot: HTMLElement) => {
    intersectionObserver.observe(hydrationRoot);
  });
};
