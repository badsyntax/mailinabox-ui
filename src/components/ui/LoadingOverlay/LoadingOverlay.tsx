import { Overlay, ProgressIndicator } from '@fluentui/react';
import React from 'react';

interface LoadingOverlayProps {
  loadingLabel: string;
  hasLoaded: boolean;
}

export const LoadingOverlay: React.FunctionComponent<LoadingOverlayProps> = ({
  loadingLabel,
  hasLoaded,
}) => {
  return hasLoaded ? (
    <Overlay
      styles={{
        root: {
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <ProgressIndicator label={loadingLabel} />
    </Overlay>
  ) : (
    <ProgressIndicator label={loadingLabel} />
  );
};
