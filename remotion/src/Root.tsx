import React from 'react';
import { Composition } from 'remotion';
import { BlueprintExplainer } from './BlueprintExplainer';
import { SoftwareFactoryWalkthrough } from './SoftwareFactoryWalkthrough';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BlueprintExplainer"
        component={BlueprintExplainer}
        durationInFrames={7290}
        fps={60}
        width={1920}
        height={1080}
      />
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

