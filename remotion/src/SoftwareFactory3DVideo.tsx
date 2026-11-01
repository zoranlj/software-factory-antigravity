import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BigKineticIntro, BigKineticOutro } from './components/BigKineticType';
import { KanbanDashboard } from './components/KanbanDashboard';
import { LiveConsoleDock } from './components/LiveConsoleDock';
import { ParallelReviewArena } from './components/ParallelReviewArena';
import { ParticleField3D } from './components/ParticleField3D';
import { StageHudBanner } from './components/StageHudBanner';
import { TokenDrawerOverlay } from './components/TokenDrawerOverlay';
import { getFactoryStateAtFrame } from './data/factoryTimeline';
import { THEME } from './theme';

export const SoftwareFactory3DVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const snapshot = getFactoryStateAtFrame(frame);

  // Dynamic 3D Camera Angles across the 1800-frame timeline
  const baseOrbitY = Math.sin(frame * 0.018) * 5.5;
  const baseOrbitX = 6 + Math.cos(frame * 0.015) * 3.5;

  // Stage-specific 3D camera sweeps
  let stageYaw = 0;
  let stagePitch = 0;
  let stageZ = 0;

  if (frame < 170) {
    // Intro fly-in
    stageZ = interpolate(frame, [120, 175], [-380, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    stagePitch = interpolate(frame, [120, 175], [22, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (frame >= 540 && frame < 990) {
    // 4x Parallel Review Round 1: dramatic 3D angle
    const p = interpolate(frame, [540, 580, 950, 990], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    stageYaw = interpolate(p, [0, 1], [0, -6.5]);
    stagePitch = interpolate(p, [0, 1], [0, 4]);
    stageZ = interpolate(p, [0, 1], [0, 35]);
  } else if (frame >= 990 && frame < 1160) {
    // Rework loop tilt
    const p = interpolate(frame, [990, 1020, 1130, 1160], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    stageYaw = interpolate(p, [0, 1], [0, 7]);
    stagePitch = interpolate(p, [0, 1], [0, 5]);
    stageZ = interpolate(p, [0, 1], [0, 40]);
  } else if (frame >= 1580) {
    // Outro pull-back into 3D particle cosmos
    stageZ = interpolate(frame, [1580, 1640], [0, -520], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    stagePitch = interpolate(frame, [1580, 1640], [0, 24], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  const cameraYaw = baseOrbitY + stageYaw;
  const cameraPitch = baseOrbitX + stagePitch;
  const warpBoost = frame < 170 || frame >= 1580 ? 2.6 : 1;

  const boardOpacity = interpolate(
    frame,
    [130, 170, 1580, 1615],
    [0.18, 1, 1, 0.15],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0b0c12',
        color: THEME.text,
        fontFamily: THEME.fontSans,
        overflow: 'hidden',
      }}
    >
      {/* 1. 3D Particle, Constellation Mesh & Energy Beam Background */}
      <ParticleField3D
        snapshot={snapshot}
        cameraYaw={cameraYaw}
        cameraPitch={cameraPitch}
        warpBoost={warpBoost}
      />

      {/* 2. Top Pipeline & Chapter HUD Banner */}
      <StageHudBanner snapshot={snapshot} />

      {/* 3. 3D Perspective Stage for Kanban Dashboard & Floating Parallel Review HUD */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: 1500,
          zIndex: 20,
          opacity: boardOpacity,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            transform: `translateZ(${stageZ}px) rotateX(${cameraPitch * 0.55}deg) rotateY(${
              cameraYaw * 0.65
            }deg)`,
          }}
        >
          {/* Base Layer: 6-Column Kanban Board */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: 'translateZ(0px)',
            }}
          >
            <KanbanDashboard snapshot={snapshot} />
          </div>

          {/* Elevated 3D Layer: 4x Parallel Review Arena & Rework Loop HUD */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: 'translateZ(65px)',
            }}
          >
            <ParallelReviewArena snapshot={snapshot} />
          </div>
        </div>
      </div>

      {/* 4. Persistent Live Agent Console Dock */}
      <LiveConsoleDock snapshot={snapshot} />

      {/* 5. Act 5 Slide-over Token Breakdown & Decision Drawer */}
      {frame < 1580 && <TokenDrawerOverlay snapshot={snapshot} />}

      {/* 6. Big 3D Kinetic Typography Intro & Outro */}
      <BigKineticIntro />
      <BigKineticOutro />
    </AbsoluteFill>
  );
};

