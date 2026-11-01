import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  Beat1IntroExplainer,
  Beat2SpecBuildExplainer,
  Beat3ParallelReviewExplainer,
  Beat4ReworkExplainer,
  Beat5ApproveMergeExplainer,
  Beat6KineticOutro,
  GiantDashboardCallout,
} from './components/BigFlowExplainerScenes';
import { FlatParticleLines } from './components/FlatParticleLines';
import {
  AnamorphicCinemaChrome,
  getTrailerCameraShake,
} from './components/HollywoodTrailerScenes';
import { KanbanDashboard } from './components/KanbanDashboard';
import { LiveConsoleDock } from './components/LiveConsoleDock';
import { ParallelReviewArena } from './components/ParallelReviewArena';
import { StageHudBanner } from './components/StageHudBanner';
import { TokenDrawerOverlay } from './components/TokenDrawerOverlay';
import { getFactoryStateAtFrame } from './data/factoryTimeline';
import { THEME } from './theme';

export const SoftwareFactoryTrailerVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Dashboard Smash-Cut Windows
  const isBurst1 = frame >= 305 && frame < 390;
  const isBurst2 = frame >= 570 && frame < 690;
  const isBurst3 = frame >= 855 && frame < 960;
  const isBurst4 = frame >= 1085 && frame < 1170;
  const isDashboardBurst = isBurst1 || isBurst2 || isBurst3 || isBurst4;

  let mappedTimelineFrame = 250;
  if (isBurst1) {
    mappedTimelineFrame = Math.round(
      interpolate(frame, [305, 390], [220, 520], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    );
  } else if (isBurst2) {
    mappedTimelineFrame = Math.round(
      interpolate(frame, [570, 690], [580, 950], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    );
  } else if (isBurst3) {
    mappedTimelineFrame = Math.round(
      interpolate(frame, [855, 960], [1010, 1310], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    );
  } else if (isBurst4) {
    mappedTimelineFrame = Math.round(
      interpolate(frame, [1085, 1170], [1360, 1570], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    );
  }

  const snapshot = getFactoryStateAtFrame(mappedTimelineFrame);
  const { dx, dy, scale, flareIntensity } = getTrailerCameraShake(frame);

  let accentColor: string = THEME.active;
  if (frame >= 430 && frame < 855) accentColor = THEME.changes;
  else if (frame >= 855 && frame < 1170) accentColor = THEME.pass;
  else if (frame >= 1170) accentColor = THEME.merged;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07080d',
        color: THEME.text,
        fontFamily: THEME.fontSans,
        overflow: 'hidden',
      }}
    >
      {/* Frame-Locked 48kHz Stereo Hollywood Trailer Soundtrack & SFX */}
      <Audio src={staticFile('trailer-score.wav')} volume={1} />

      {/* Camera Shake Wrapper Synchronized to Sub-Bass Booms & Slams */}
      <AbsoluteFill
        style={{
          transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Flat 2D Constellation Particle & Line Network */}
        <FlatParticleLines accentColor={accentColor} />

        {/* Big Pop-Up Trailer Typography Scenes */}
        <Sequence from={0} durationInFrames={195}>
          <Beat1IntroExplainer />
        </Sequence>

        <Sequence from={195} durationInFrames={110}>
          <Beat2SpecBuildExplainer />
        </Sequence>

        <Sequence from={390} durationInFrames={180}>
          <Beat3ParallelReviewExplainer />
        </Sequence>

        <Sequence from={690} durationInFrames={165}>
          <Beat4ReworkExplainer />
        </Sequence>

        <Sequence from={960} durationInFrames={125}>
          <Beat5ApproveMergeExplainer />
        </Sequence>

        <Sequence from={1170} durationInFrames={180}>
          <Beat6KineticOutro />
        </Sequence>

        {/* Smash-Cut High-Speed Kanban Dashboard Action Shots */}
        {isDashboardBurst && (
          <AbsoluteFill
            style={{
              zIndex: 30,
              top: 52,
              bottom: 52,
            }}
          >
            <StageHudBanner snapshot={snapshot} />
            <KanbanDashboard snapshot={snapshot} />
            <ParallelReviewArena snapshot={snapshot} />
            <LiveConsoleDock snapshot={snapshot} />
            <TokenDrawerOverlay snapshot={snapshot} />
          </AbsoluteFill>
        )}

        <Sequence from={305} durationInFrames={85}>
          <GiantDashboardCallout
            badge="LIVE KANBAN · STEP 1 & 2"
            headline="Card 004 Moves Spec → Build!"
            sub="spec.md written (15.3k tok) → Builder codes & runs 50/50 tests on port 5140"
            color={THEME.active}
            position="top-right"
          />
        </Sequence>

        <Sequence from={570} durationInFrames={120}>
          <GiantDashboardCallout
            badge="ROUND 1 · 4× PARALLEL AUDIT"
            headline="3 PASS · 1 CHANGES (UI)!"
            sub="Security, UX & Code pass — UI reviewer catches missing mobile focus ring"
            color={THEME.changes}
            position="bottom-left"
          />
        </Sequence>

        <Sequence from={855} durationInFrames={105}>
          <GiantDashboardCallout
            badge="AUTO-REWORK → ROUND 2"
            headline="Builder Fixes UI → 4/4 PASS! ✓"
            sub="Card auto-cycles Build → Review R2 and all 4 chips light up green PASS"
            color={THEME.pass}
            position="bottom-left"
          />
        </Sequence>

        <Sequence from={1085} durationInFrames={85}>
          <GiantDashboardCallout
            badge="APPROVED & MERGED TO MAIN"
            headline="98.4k Tokens · Only $0.12 Cost!"
            sub="Full per-agent token breakdown & decision.md logged in the dashboard drawer"
            color={THEME.tok}
            position="bottom-left"
          />
        </Sequence>
      </AbsoluteFill>

      {/* 2.39:1 Anamorphic Widescreen Letterbox Bars, Lens Flares, Strobe Cuts & Live Audio Spectrum */}
      <AnamorphicCinemaChrome
        flareIntensity={flareIntensity}
        accentColor={accentColor}
      />
    </AbsoluteFill>
  );
};

