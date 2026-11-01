import React from 'react';
import { Composition } from 'remotion';
import { SoftwareFactoryWalkthrough } from './SoftwareFactoryWalkthrough';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SoftwareFactoryDemo"
        component={SoftwareFactoryWalkthrough}
        durationInFrames={2520}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};

