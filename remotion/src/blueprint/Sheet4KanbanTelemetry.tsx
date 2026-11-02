import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import {
  BP,
  DimensionLine,
  ViewLabel,
  drawProgress,
  fadeIn,
} from './blueprintTheme';

/**
 * Sheet 4 (41.3s - 54.5s, 792 frames):
 * - 41.3s - 46.6s: "You can watch everything unfold in real time on the live Kanban dashboard."
 * - 46.6s - 54.5s: "As the job moves into the build phase, you see real-time token counts, execution timing, and streaming agent activity."
 */
export const Sheet4KanbanTelemetry: React.FC = () => {
  const frame = useCurrentFrame();

  const pBoard = drawProgress(frame, 0, 45);
  const pGauges = drawProgress(frame, 220, 50);
  const pDims = fadeIn(frame, 70, 35);

  // Card slides from Column 0 (SPEC) to Column 1 (BUILD) around frame 240-330
  const moveProgress = interpolate(frame, [230, 330], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Live incrementing token counter & execution timer
  const liveTokens = Math.floor(
    interpolate(frame, [0, 230, 790], [14200, 18400, 64850], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const liveSeconds = interpolate(frame, [0, 790], [12.4, 48.9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const liveCost = ((liveTokens * 2.15) / 1_000_000).toFixed(3);

  const columns = [
    { key: 'SPEC', sub: 'spec-writer · opus', w: 315 },
    { key: 'BUILD', sub: 'builder · opus', w: 315 },
    { key: 'REVIEW ×4', sub: 'sec · ux · ui · code', w: 315 },
    { key: 'APPROVE', sub: 'approver · opus', w: 315 },
    { key: 'MERGED', sub: 'main branch', w: 315 },
  ];

  const colWidth = 315;
  const colGap = 21;
  const boardX = 130;
  const boardY = 175;

  const cardX = boardX + 14 + moveProgress * (colWidth + colGap);
  const cardY = boardY + 76;

  const streamLines = [
    '[14:21:04] spec-writer -> Completed factory/jobs/042/spec.md (6 AC locked)',
    '[14:21:05] orchestrator -> Transitioning job #042: SPEC ===> BUILD',
    '[14:21:06] builder -> Claimed worktree factory/worktrees/20261102-dark-mode',
    '[14:21:09] builder -> Editing src/components/ThemeToggle.tsx (+68 -4)',
    '[14:21:13] builder -> Streaming token telemetry: 64.8k tok ($0.139 USD)',
  ];

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {/* ===================================================================== */}
      {/* TOP SCHEMATIC: 5-COLUMN LIVE KANBAN MATRIX (x=130..1790, y=175..520)  */}
      {/* ===================================================================== */}
      <g opacity={pBoard} filter="url(#bp-glow)">
        {columns.map((col, idx) => {
          const cx = boardX + idx * (colWidth + colGap);
          const isBuildActive = idx === 1 && moveProgress > 0.5;
          const isSpecActive = idx === 0 && moveProgress <= 0.5;
          const isHighlighted = isBuildActive || isSpecActive;

          return (
            <g key={col.key} transform={`translate(${cx}, ${boardY})`}>
              <rect
                x={0}
                y={0}
                width={colWidth}
                height={335}
                rx={10}
                fill={BP.fillSolid}
                stroke={isHighlighted ? BP.cyan : BP.line}
                strokeWidth={isHighlighted ? 3 : 2.2}
              />
              {/* Column Header */}
              <rect
                x={0}
                y={0}
                width={colWidth}
                height={56}
                fill={isHighlighted ? 'url(#bp-hatch-45)' : BP.fillDark}
                stroke={BP.line}
                strokeWidth={2}
              />
              <rect
                x={12}
                y={10}
                width={colWidth - 24}
                height={36}
                fill={BP.fillDark}
                stroke={BP.lineSoft}
                strokeWidth={1.4}
              />
              <text x={24} y={32} fill={BP.line} fontSize={15} fontWeight={800} letterSpacing={1.6}>
                {col.key}
              </text>
              <text
                x={colWidth - 22}
                y={32}
                fill={BP.cyan}
                fontSize={11.5}
                fontWeight={700}
                textAnchor="end"
              >
                {col.sub}
              </text>

              {/* Static Completed Card in MERGED column */}
              {idx === 4 && (
                <g transform="translate(14, 76)" opacity={0.75}>
                  <rect
                    x={0}
                    y={0}
                    width={colWidth - 28}
                    height={120}
                    rx={8}
                    fill={BP.fillDark}
                    stroke={BP.lineSoft}
                    strokeWidth={1.8}
                  />
                  <text x={16} y={28} fill={BP.cyan} fontSize={12} fontWeight={800}>
                    JOB-041 // MERGED MAIN
                  </text>
                  <text x={16} y={54} fill={BP.line} fontSize={14} fontWeight={700}>
                    USD Cost Indicator
                  </text>
                  <text x={16} y={80} fill={BP.lineSoft} fontSize={12} fontWeight={600}>
                    TOK: 112.4k // $0.24
                  </text>
                  <text x={16} y={102} fill={BP.cyan} fontSize={12} fontWeight={800}>
                    PASS: 4/4 REVIEWERS
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Animated Active Job Card #042 moving from SPEC -> BUILD */}
        <g transform={`translate(${cardX}, ${cardY})`}>
          <rect
            x={0}
            y={0}
            width={colWidth - 28}
            height={235}
            rx={8}
            fill={BP.fillDark}
            stroke={BP.cyan}
            strokeWidth={3}
          />
          <rect x={0} y={0} width={colWidth - 28} height={8} fill={BP.cyan} />
          <text x={18} y={34} fill={BP.cyan} fontSize={13} fontWeight={800} letterSpacing={1.4}>
            {moveProgress > 0.5 ? 'JOB-042 // STAGE: BUILD' : 'JOB-042 // STAGE: SPEC'}
          </text>
          <text x={18} y={62} fill={BP.line} fontSize={16} fontWeight={800}>
            Dark Mode Toggle &
          </text>
          <text x={18} y={84} fill={BP.line} fontSize={16} fontWeight={800}>
            Theme Persistence
          </text>

          <line x1={18} y1={102} x2={colWidth - 46} y2={102} stroke={BP.lineMuted} strokeWidth={1.5} />

          <text x={18} y={128} fill={BP.lineSoft} fontSize={12.5} fontWeight={700}>
            {`ACTIVE: ${moveProgress > 0.5 ? 'builder (opus)' : 'spec-writer'}`}
          </text>
          <text x={18} y={154} fill={BP.cyan} fontSize={14} fontWeight={800}>
            {`TOKENS: ${(liveTokens / 1000).toFixed(1)}k ($${liveCost})`}
          </text>
          <text x={18} y={180} fill={BP.lineSoft} fontSize={12.5} fontWeight={700}>
            {`ELAPSED: ${liveSeconds.toFixed(1)}s`}
          </text>

          {/* Pulsing Live Activity Indicator */}
          <circle
            cx={26}
            cy={208}
            r={6}
            fill={BP.cyan}
            opacity={0.4 + 0.6 * Math.sin(frame * 0.2)}
          />
          <text x={40} y={212} fill={BP.line} fontSize={12} fontWeight={800} letterSpacing={1.2}>
            STREAMING TELEMETRY
          </text>
        </g>
      </g>

      {/* ===================================================================== */}
      {/* BOTTOM ROW: 3 ENGINEERING TELEMETRY DIALS & STREAMING LOG CONSOLE     */}
      {/* ===================================================================== */}
      <g opacity={pGauges} filter="url(#bp-glow)">
        {/* Gauge 1: Real-Time Token Counter (x=130..530) */}
        <g transform="translate(130, 548)">
          <rect
            x={0}
            y={0}
            width={390}
            height={220}
            rx={12}
            fill={BP.fillSolid}
            stroke={BP.line}
            strokeWidth={2.6}
          />
          <text x={22} y={34} fill={BP.cyan} fontSize={13.5} fontWeight={800} letterSpacing={1.6}>
            GAUGE 01 // REAL-TIME TOKEN METER
          </text>
          <line x1={22} y1={46} x2={368} y2={46} stroke={BP.lineSoft} strokeWidth={1.4} />

          {/* Circular Dial */}
          <circle cx={92} cy={132} r={54} fill={BP.fillDark} stroke={BP.line} strokeWidth={2.4} />
          <circle
            cx={92}
            cy={132}
            r={44}
            fill="none"
            stroke={BP.cyan}
            strokeWidth={4}
            strokeDasharray={`${(liveTokens / 80000) * 276} 276`}
            transform="rotate(-90 92 132)"
          />
          <text x={92} y={136} fill={BP.line} fontSize={15} fontWeight={800} textAnchor="middle">
            {`${(liveTokens / 1000).toFixed(1)}k`}
          </text>

          <text x={170} y={96} fill={BP.line} fontSize={26} fontWeight={800}>
            {liveTokens.toLocaleString()}
          </text>
          <text x={170} y={122} fill={BP.lineSoft} fontSize={13} fontWeight={700}>
            PROMPT + COMPLETION TOKENS
          </text>
          <text x={170} y={154} fill={BP.cyan} fontSize={16} fontWeight={800}>
            {`EST COST: $${liveCost} USD`}
          </text>
          <text x={170} y={182} fill={BP.lineSoft} fontSize={12} fontWeight={700}>
            RATE: 1,420 TOK/SEC
          </text>
        </g>

        {/* Gauge 2: Execution Timing Chronometer (x=545..945) */}
        <g transform="translate(545, 548)">
          <rect
            x={0}
            y={0}
            width={390}
            height={220}
            rx={12}
            fill={BP.fillSolid}
            stroke={BP.line}
            strokeWidth={2.6}
          />
          <text x={22} y={34} fill={BP.cyan} fontSize={13.5} fontWeight={800} letterSpacing={1.6}>
            GAUGE 02 // EXECUTION CHRONOMETER
          </text>
          <line x1={22} y1={46} x2={368} y2={46} stroke={BP.lineSoft} strokeWidth={1.4} />

          {/* Chronometer Crosshair Dial */}
          <circle cx={92} cy={132} r={54} fill={BP.fillDark} stroke={BP.line} strokeWidth={2.4} />
          <line
            x1={92}
            y1={132}
            x2={92 + 42 * Math.cos((frame * 0.06) - Math.PI / 2)}
            y2={132 + 42 * Math.sin((frame * 0.06) - Math.PI / 2)}
            stroke={BP.cyan}
            strokeWidth={3}
          />
          <circle cx={92} cy={132} r={5} fill={BP.line} />

          <text x={170} y={96} fill={BP.line} fontSize={26} fontWeight={800}>
            {`00:${liveSeconds.toFixed(1).padStart(4, '0')}s`}
          </text>
          <text x={170} y={122} fill={BP.lineSoft} fontSize={13} fontWeight={700}>
            STAGE WALL-CLOCK ELAPSED
          </text>
          <text x={170} y={154} fill={BP.cyan} fontSize={15} fontWeight={800}>
            SPEC: 12.4s // BUILD: LIVE
          </text>
          <text x={170} y={182} fill={BP.lineSoft} fontSize={12} fontWeight={700}>
            POLL INTERVAL: 1000 MS
          </text>
        </g>

        {/* Gauge 3: Streaming Agent Activity Bus (x=960..1790) */}
        <g transform="translate(960, 548)">
          <rect
            x={0}
            y={0}
            width={830}
            height={220}
            rx={12}
            fill={BP.fillSolid}
            stroke={BP.line}
            strokeWidth={2.6}
          />
          <text x={24} y={34} fill={BP.cyan} fontSize={13.5} fontWeight={800} letterSpacing={1.6}>
            GAUGE 03 // STREAMING AGENT TELEMETRY BUS (SSE / JSONL)
          </text>
          <line x1={24} y1={46} x2={806} y2={46} stroke={BP.lineSoft} strokeWidth={1.4} />

          {streamLines.map((line, idx) => {
            const appear = fadeIn(frame, 240 + idx * 95, 25);
            return (
              <text
                key={line}
                x={24}
                y={78 + idx * 29}
                fill={idx === streamLines.length - 1 ? BP.cyan : BP.line}
                fontSize={13.5}
                fontWeight={700}
                opacity={appear}
              >
                {line}
              </text>
            );
          })}
        </g>
      </g>

      {/* Dimensions & Labels */}
      <DimensionLine x1={130} y1={768} x2={1790} y2={768} offset={34} label="1660" progress={pDims} />
      <ViewLabel x={960} y={848} title="LIVE KANBAN DASHBOARD SCHEMATIC" scale="SCALE 1:2" progress={pDims} />
    </svg>
  );
};

