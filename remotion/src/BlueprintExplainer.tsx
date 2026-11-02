import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BlueprintCanvasFrame } from './blueprint/BlueprintCanvasFrame';
import { Sheet1GeneralArrangement } from './blueprint/Sheet1GeneralArrangement';
import { Sheet2BacklogOrchestrator } from './blueprint/Sheet2BacklogOrchestrator';
import { Sheet3WorktreeAndSpec } from './blueprint/Sheet3WorktreeAndSpec';
import { Sheet4KanbanTelemetry } from './blueprint/Sheet4KanbanTelemetry';
import { Sheet5BuilderAndBrowser } from './blueprint/Sheet5BuilderAndBrowser';
import { Sheet6ReviewGauntlet } from './blueprint/Sheet6ReviewGauntlet';
import { Sheet7ApproveAndMerge } from './blueprint/Sheet7ApproveAndMerge';
import { Sheet8MergedMainAndStamp } from './blueprint/Sheet8MergedMainAndStamp';

/**
 * Blueprint Explainer Video (121.5s = 7290 frames @ 60fps)
 * Synchronized to the clean first voiceover take (remotion/public/voiceover.wav):
 *
 * - Sheet 1 (0.0s - 11.4s, frames 0 - 684): General Arrangement (Front, Side, Section A-A)
 * - Sheet 2 (11.4s - 26.2s, frames 684 - 1572): Backlog & /factory next Orchestrator Intake
 * - Sheet 3 (26.2s - 41.3s, frames 1572 - 2478): Isolated Git Worktree & Spec Writer
 * - Sheet 4 (41.3s - 54.5s, frames 2478 - 3270): Live Kanban Dashboard & Real-Time Telemetry
 * - Sheet 5 (54.5s - 69.0s, frames 3270 - 4140): Builder Agent (React AST, Tests, Browser Subagent)
 * - Sheet 6 (69.0s - 85.3s, frames 4140 - 5118): 4-Agent Concurrent Review Gauntlet
 * - Sheet 7 (85.3s - 104.0s, frames 5118 - 6240): Approve Stage, Audit Dossier & Auto-Merge
 * - Sheet 8 (104.0s - 121.5s, frames 6240 - 7290): Merged Main & Production Certification Stamp
 */
export const BlueprintExplainer: React.FC = () => {
  return (
    <BlueprintCanvasFrame>
      <Audio src={staticFile('voiceover.wav')} />

      <Sequence from={0} durationInFrames={684} name="Sheet 1: General Arrangement">
        <Sheet1GeneralArrangement />
      </Sequence>

      <Sequence from={684} durationInFrames={888} name="Sheet 2: Backlog & Orchestrator">
        <Sheet2BacklogOrchestrator />
      </Sequence>

      <Sequence from={1572} durationInFrames={906} name="Sheet 3: Worktree & Spec Writer">
        <Sheet3WorktreeAndSpec />
      </Sequence>

      <Sequence from={2478} durationInFrames={792} name="Sheet 4: Live Kanban Telemetry">
        <Sheet4KanbanTelemetry />
      </Sequence>

      <Sequence from={3270} durationInFrames={870} name="Sheet 5: Builder & Browser Subagent">
        <Sheet5BuilderAndBrowser />
      </Sequence>

      <Sequence from={4140} durationInFrames={978} name="Sheet 6: Multi-Agent Review Gauntlet">
        <Sheet6ReviewGauntlet />
      </Sequence>

      <Sequence from={5118} durationInFrames={1122} name="Sheet 7: Approve & Auto-Merge">
        <Sheet7ApproveAndMerge />
      </Sequence>

      <Sequence from={6240} durationInFrames={1050} name="Sheet 8: Merged Main & Stamp">
        <Sheet8MergedMainAndStamp />
      </Sequence>
    </BlueprintCanvasFrame>
  );
};

