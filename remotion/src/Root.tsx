import React from 'react';
import { Composition } from 'remotion';
import { SoftwareFactory3DVideo } from './SoftwareFactory3DVideo';
import { SoftwareFactoryKineticVideo } from './SoftwareFactoryKineticVideo';
import { SoftwareFactoryTrailerVideo } from './SoftwareFactoryTrailerVideo';
import { SoftwareFactoryVideo } from './SoftwareFactoryVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SoftwareFactoryTrailer"
        component={SoftwareFactoryTrailerVideo}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SoftwareFactoryKinetic"
        component={SoftwareFactoryKineticVideo}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SoftwareFactoryShowcase"
        component={SoftwareFactoryVideo}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SoftwareFactory3D"
        component={SoftwareFactory3DVideo}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
