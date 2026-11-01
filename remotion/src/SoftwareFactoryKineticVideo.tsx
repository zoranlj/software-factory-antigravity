import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
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
import { KanbanDashboard } from './components/KanbanDashboard';
import { LiveConsoleDock } from './components/LiveConsoleDock';
import { ParallelReviewArena } from './components/ParallelReviewArena';
import { StageHudBanner } from './components/StageHudBanner';
import { TokenDrawerOverlay } from './components/TokenDrawerOverlay';
import { getFactoryStateAtFrame } from './data/factoryTimeline';
import { THEME } from './theme';

/**
 * Fast-paced 45s (1350 frames @ 30fps) flat-2D Kinetic Explainer:
 * - ~68% of time spent on Giant Pop-Up Typography & Flow Diagrams
 * - ~32% of time spent on Fast-Forwarded 2D Kanban Dashboard Bursts with Giant Callouts
 */
export const SoftwareFactoryKineticVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine whether we are in a Full-Screen Big Text Explainer or a Fast Dashboard Burst
  const isBurst1 = frame >= 305 && frame < 390; // Spec -> Build rapid burst (2.8s)
  const isBurst2 = frame >= 570 && frame < 690; // 4x Parallel Review R1 burst (4.0s)
  const isBurst3 = frame >= 855 && frame < 960; // Auto-Rework -> R2 All Pass burst (3.5s)
  const isBurst4 = frame >= 1085 && frame < 1170; // Approve + Token Drawer + Merge burst (2.8s)
  const isDashboardBurst = isBurst1 || isBurst2 || isBurst3 || isBurst4;

  // Map the fast dashboard bursts to the rich timeline states at 2.5x speed
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

  let accentColor: string = THEME.active;
  if (frame >= 570 && frame < 855) accentColor = THEME.changes;
  else if (frame >= 855) accentColor = THEME.pass;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0d0f17',
        color: THEME.text,
        fontFamily: THEME.fontSans,
        overflow: 'hidden',
      }}
    >
      {/* Flat 2D Constellation Particle & Line Backdrop (Zero 3D Distortion) */}
      <FlatParticleLines accentColor={accentColor} />

      {/* =====================================================================
          FULL-SCREEN BIG POPPING TEXT EXPLAINER SCENES (~68% OF TOTAL VIDEO)
         ===================================================================== */}

      {/* Beat 1 (0..195): 1 Command, 7 AI Agents, Isolated Git Worktree */}
      <Sequence from={0} durationInFrames={195}>
        <Beat1IntroExplainer />
      </Sequence>

      {/* Beat 2 Explainer (195..305): Spec-Writer -> Builder */}
      <Sequence from={195} durationInFrames={110}>
        <Beat2SpecBuildExplainer />
      </Sequence>

      {/* Beat 3 Explainer (390..570): 4x Parallel Review Agents */}
      <Sequence from={390} durationInFrames={180}>
        <Beat3ParallelReviewExplainer />
      </Sequence>

      {/* Beat 4 Explainer (690..855): Autonomous Rework Loop */}
      <Sequence from={690} durationInFrames={165}>
        <Beat4ReworkExplainer />
      </Sequence>

      {/* Beat 5 Explainer (960..1085): Approver Gate & Safety Valve */}
      <Sequence from={960} durationInFrames={125}>
        <Beat5ApproveMergeExplainer />
      </Sequence>

      {/* Beat 6 Outro (1170..1350): Giant Pipeline Summary */}
      <Sequence from={1170} durationInFrames={180}>
        <Beat6KineticOutro />
      </Sequence>

      {/* =====================================================================
          FAST 2D KANBAN DASHBOARD BURSTS WITH GIANT POP-UP CALLOUTS (~32%)
         ===================================================================== */}
      {isDashboardBurst && (
        <AbsoluteFill style={{ zIndex: 30 }}>
          <StageHudBanner snapshot={snapshot} />
          <KanbanDashboard snapshot={snapshot} />
          <ParallelReviewArena snapshot={snapshot} />
          <LiveConsoleDock snapshot={snapshot} />
          <TokenDrawerOverlay snapshot={snapshot} />
        </AbsoluteFill>
      )}

      {/* Burst 1 Giant Callout */}
      <Sequence from={305} durationInFrames={85}>
        <GiantDashboardCallout
          badge="LIVE KANBAN · STEP 1 & 2"
          headline="Card 004 Moves Spec → Build!"
          sub="spec.md written (15.3k tok) → Builder codes & runs 50/50 tests on port 5140"
          color={THEME.active}
          position="top-right"
        />
      </Sequence>

      {/* Burst 2 Giant Callout */}
      <Sequence from={570} durationInFrames={120}>
        <GiantDashboardCallout
          badge="ROUND 1 · 4× PARALLEL AUDIT"
          headline="3 PASS · 1 CHANGES (UI)!"
          sub="Security, UX & Code pass — UI reviewer catches missing mobile focus ring"
          color={THEME.changes}
          position="bottom-left"
        />
      </Sequence>

      {/* Burst 3 Giant Callout */}
      <Sequence from={855} durationInFrames={105}>
        <GiantDashboardCallout
          badge="AUTO-REWORK → ROUND 2"
          headline="Builder Fixes UI → 4/4 PASS! ✓"
          sub="Card auto-cycles Build → Review R2 and all 4 chips light up green PASS"
          color={THEME.pass}
          position="bottom-left"
        />
      </Sequence>

      {/* Burst 4 Giant Callout */}
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
  );
};

