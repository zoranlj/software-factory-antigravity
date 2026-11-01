import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { DashboardView } from './components/DashboardView';
import { IntroScene } from './scenes/IntroScene';
import { OutroScene } from './scenes/OutroScene';
import { THEME } from './theme';

export const SoftwareFactoryWalkthrough: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
      {/* Scene 1: Intro (0s - 4.5s, frames 0 - 270) */}
      <Sequence from={0} durationInFrames={270} name="1. Intro Title & Pipeline">
        <IntroScene />
      </Sequence>

      {/* Scene 2-4: Live Founder Walkthrough of Dashboard, Review Loop, Console & Drawer (frames 255 - 2200) */}
      <Sequence from={255} durationInFrames={1945} name="2. Software Factory Live Walkthrough">
        <DashboardView />
      </Sequence>

      {/* Scene 5: Outro Call-to-Action (36.4s - 42.0s, frames 2185 - 2520) */}
      <Sequence from={2185} durationInFrames={335} name="3. Outro Install & CLI">
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};

