import { Breadcrumb, IBreadcrumbProps } from '@fluentui/react';
import React from 'react';

export const BodyBreadcrumb: React.FunctionComponent<IBreadcrumbProps> = (
  props
) => {
  return (
    <Breadcrumb
      onReduceData={(): undefined => undefined}
      styles={{
        root: {
          marginTop: 0,
          width: '100%',
        },
      }}
      {...props}
    />
  );
};
