import React from 'react';

export const LoadingOverlayContainer: React.FunctionComponent = ({
  children,
}) => {
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
};
