import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Act1CommandWorktree } from './components/Act1CommandWorktree';
import { KanbanDashboard } from './components/KanbanDashboard';
import { LiveConsoleDock } from './components/LiveConsoleDock';
import { ParallelReviewArena } from './components/ParallelReviewArena';
import { StageHudBanner } from './components/StageHudBanner';
import { TokenDrawerOverlay } from './components/TokenDrawerOverlay';
import { getFactoryStateAtFrame } from './data/factoryTimeline';
import { THEME } from './theme';

export const SoftwareFactoryVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const snapshot = getFactoryStateAtFrame(frame);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        color: THEME.text,
        fontFamily: THEME.fontSans,
        overflow: 'hidden',
      }}
    >
      {/* Top Pipeline & Chapter HUD Banner */}
      <StageHudBanner snapshot={snapshot} />

      {/* Main 6-Column Kanban Dashboard */}
      <KanbanDashboard snapshot={snapshot} />

      {/* 4x Parallel Review Arena Overlay (Act 3 & Act 4) + Rework Loop Banner */}
      <ParallelReviewArena snapshot={snapshot} />

      {/* Persistent Live Agent Console Dock */}
      <LiveConsoleDock snapshot={snapshot} />

      {/* Act 1 Command Prompt & Git Worktree Intro Overlay */}
      <Act1CommandWorktree />

      {/* Act 5 Slide-over Job Drawer & Act 6 Final Summary Card */}
      <TokenDrawerOverlay snapshot={snapshot} />
    </AbsoluteFill>
  );
};

