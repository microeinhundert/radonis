import type { HydrationRootProps } from '@ioc:Radonis';
import type { FunctionComponent } from 'react';
import React, { useId } from 'react';

import { HydrationContextProvider, useHydration } from '../../../../radonis';
import { useManifestBuilder } from '../internal/hooks/useManifestBuilder';

export const HydrationRoot: FunctionComponent<HydrationRootProps> = ({
  children,
  componentName,
}) => {
  const manifestBuilder = useManifestBuilder();
  const parentHydration = useHydration();
  const hydrationRootId = useId();

  if (typeof parentHydration !== 'boolean') {
    throw new Error(
      `Found HydrationRoot "${hydrationRootId}" for component "${componentName}" nested inside HydrationRoot "${parentHydration.root}" for component "${parentHydration.componentName}".
      This is not allowed, as each HydrationRoot acts as root for a React app when hydrated on the client`
    );
  }

  const propsHash = manifestBuilder.registerComponentProps(React.Children.only(children));

  return (
    <HydrationContextProvider value={{ root: hydrationRootId, componentName, propsHash }}>
      <div
        data-hydration-root={hydrationRootId}
        data-component={componentName}
        data-props={propsHash}
      >
        {children}
      </div>
    </HydrationContextProvider>
  );
};
