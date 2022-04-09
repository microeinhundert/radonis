import type { HydrationRootProps } from '@ioc:Radonis';
// @ts-ignore
import { HydrationContextProvider, useHydration } from '@microeinhundert/radonis';
import type { FunctionComponent } from 'react';
import React from 'react';

import { useManifestBuilder } from '../internal/hooks/useManifestBuilder';

export const HydrationRoot: FunctionComponent<HydrationRootProps> = ({
  children,
  componentName,
}) => {
  const hydration = useHydration();
  const manifestBuilder = useManifestBuilder();

  if (hydration.isInsideHydrationRoot) {
    throw new Error(
      `Found HydrationRoot for component "${componentName}" nested inside HydrationRoot for component "${hydration.componentName}".
      This is not allowed, as each HydrationRoot acts as root for a React app when hydrated on the client`
    );
  }

  const propsHash = manifestBuilder.registerComponentProps(React.Children.only(children));

  return (
    <HydrationContextProvider value={{ isInsideHydrationRoot: true, componentName, propsHash }}>
      <div
        className="contents"
        data-hydration-root
        data-component={componentName}
        data-props={propsHash}
      >
        {children}
      </div>
    </HydrationContextProvider>
  );
};
