import type { HydrationRootProps } from '@ioc:Radonis';
// @ts-ignore No idea why this import fails in GitHub Actions
import { HydrationContextProvider, useHydration } from '@microeinhundert/radonis';
import type { FunctionComponent } from 'react';
import React, { useId } from 'react';

import { useManifestBuilder } from '../internal/hooks/useManifestBuilder';

export const HydrationRoot: FunctionComponent<HydrationRootProps> = ({
  children,
  componentName,
}) => {
  const manifestBuilder = useManifestBuilder();
  const parentHydration = useHydration();
  const hydrationRootId = useId();

  if (parentHydration.root) {
    throw new Error(
      `Found HydrationRoot "${hydrationRootId}" for component "${componentName}" nested inside HydrationRoot "${parentHydration.root}" for component "${parentHydration.componentName}".
      This is not allowed, as each HydrationRoot acts as root for a React app when hydrated on the client`
    );
  }

  const propsHash = manifestBuilder.registerComponentProps(React.Children.only(children));

  return (
    <HydrationContextProvider
      value={{ hydrated: false, root: hydrationRootId, componentName, propsHash }}
    >
      <div
        data-component={componentName}
        data-hydration-root={hydrationRootId}
        data-props={propsHash}
      >
        {children}
      </div>
    </HydrationContextProvider>
  );
};
