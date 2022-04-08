import type { HydrationRootProps } from '@ioc:Radonis';
// @ts-ignore
import { HydrationContextProvider } from '@microeinhundert/radonis';
import type { FunctionComponent } from 'react';
import React from 'react';

import { useManifestBuilder } from '../internal/hooks/useManifestBuilder';

export const HydrationRoot: FunctionComponent<HydrationRootProps> = ({
  children,
  componentName,
}) => {
  const manifestBuilder = useManifestBuilder();
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
