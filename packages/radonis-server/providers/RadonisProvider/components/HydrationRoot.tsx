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
  const { root: parentHydrationRootId, componentName: parentComponentName } = useHydration();
  const hydrationRootId = useId();

  if (parentHydrationRootId) {
    /* eslint-disable prettier/prettier */
    throw new Error(
      `Found HydrationRoot "${hydrationRootId}" for component "${componentName}" nested
      inside HydrationRoot "${parentHydrationRootId}" for component "${parentComponentName ?? 'Unknown'}".
      This is not allowed, as each HydrationRoot acts as root for a React app when hydrated on the client`
    );
    /* eslint-enable prettier/prettier */
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
