import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  BP,
  DimensionLine,
  ViewLabel,
  drawProgress,
  fadeIn,
  popScale,
} from './blueprintTheme';

/**
 * Sheet 8 (104.0s - 121.5s, 1050 frames):
 * - 104.0s - 113.8s: "Back on the dashboard, the job moves to merged main, giving you complete visibility into total tokens, execution time, and production velocity."
 * - 113.8s - 121.5s: "This is the Software Factory for Google Antigravity: autonomous, rigorous, and production-ready."
 */
export const Sheet8MergedMainAndStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pBoard = drawProgress(frame, 0, 45);
  const pMetrics = drawProgress(frame, 120, 45);
  const pDims = fadeIn(frame, 60, 35);

  // Move card from APPROVE (col 3) to MERGED MAIN (col 4) between frames 30 and 120
  const moveProgress = interpolate(frame, [30, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Final stamp appears at 113.8s -> frame 588 of Sheet 8
  const showFinalStamp = frame >= 560;
  const stampScale = showFinalStamp ? popScale(frame, fps, 560) : 0;

  const columns = [
    { key: 'SPEC', sub: 'spec-writer' },
    { key: 'BUILD', sub: 'builder' },
    { key: 'REVIEW ×4', sub: '4/4 PASS' },
    { key: 'APPROVE', sub: 'approver' },
    { key: 'MERGED MAIN', sub: 'production' },
  ];

  const colWidth = 315;
  const colGap = 21;
  const boardX = 130;
  const boardY = 170;

  const cardX = boardX + 14 + (3 + moveProgress) * (colWidth + colGap);
  const cardY = boardY + 72;

  const metrics = [
    {
      code: 'METRIC 01 // TOTAL TOKEN CONSUMPTION',
      value: '142.8k TOKENS',
      sub: 'PROMPT: 114.2k · COMPLETION: 28.6k · COST: $0.19 USD',
    },
    {
      code: 'METRIC 02 // END-TO-END EXECUTION TIME',
      value: '01m 48.4s',
      sub: 'SPEC: 12.4s · BUILD: 54.2s · REVIEW×4: 29.8s · MERGE: 12.0s',
    },
    {
      code: 'METRIC 03 // PRODUCTION VELOCITY',
      value: '100% AUTONOMOUS',
      sub: '6/6 ACCEPTANCE CRITERIA · 4/4 INDEPENDENT SIGN-OFFS · 0 REWORK',
    },
  ];

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {/* ===================================================================== */}
      {/* TOP KANBAN PIPELINE SHOWING CARD LANDING IN MERGED MAIN               */}
      {/* ===================================================================== */}
      <g opacity={pBoard} filter="url(#bp-glow)">
        {columns.map((col, idx) => {
          const cx = boardX + idx * (colWidth + colGap);
          const isMergedCol = idx === 4;
          return (
            <g key={col.key} transform={`translate(${cx}, ${boardY})`}>
              <rect
                x={0}
                y={0}
                width={colWidth}
                height={295}
                rx={10}
                fill={BP.fillSolid}
                stroke={isMergedCol ? BP.cyan : BP.line}
                strokeWidth={isMergedCol ? 3 : 2.2}
              />
              <rect
                x={0}
                y={0}
                width={colWidth}
                height={52}
                fill={isMergedCol ? 'url(#bp-hatch-45)' : BP.fillDark}
                stroke={BP.line}
                strokeWidth={2}
              />
              <rect
                x={12}
                y={8}
                width={colWidth - 24}
                height={36}
                fill={BP.fillDark}
                stroke={BP.lineSoft}
                strokeWidth={1.4}
              />
              <text x={22} y={31} fill={BP.line} fontSize={14.5} fontWeight={800} letterSpacing={1.5}>
                {col.key}
              </text>
              <text
                x={colWidth - 20}
                y={31}
                fill={BP.cyan}
                fontSize={11.5}
                fontWeight={700}
                textAnchor="end"
              >
                {col.sub}
              </text>

              {/* Completed stage checkmarks in first 4 columns */}
              {idx < 4 && (
                <g transform="translate(30, 120)" opacity={0.55}>
                  <circle cx={128} cy={40} r={34} fill="none" stroke={BP.lineSoft} strokeWidth={2} />
                  <path d="M 112 40 L 124 52 L 146 26" fill="none" stroke={BP.cyan} strokeWidth={3} />
                  <text
                    x={128}
                    y={98}
                    fill={BP.lineSoft}
                    fontSize={12.5}
                    fontWeight={800}
                    letterSpacing={1.5}
                    textAnchor="middle"
                  >
                    STAGE COMPLETE
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Active Job #042 Card arriving in MERGED MAIN */}
        <g transform={`translate(${cardX}, ${cardY})`}>
          <rect
            x={0}
            y={0}
            width={colWidth - 28}
            height={204}
            rx={8}
            fill={BP.fillDark}
            stroke={BP.cyan}
            strokeWidth={3}
          />
          <rect x={0} y={0} width={colWidth - 28} height={8} fill={BP.cyan} />
          <text x={18} y={32} fill={BP.cyan} fontSize={13} fontWeight={800} letterSpacing={1.4}>
            JOB-042 // MERGED MAIN ✓
          </text>
          <text x={18} y={58} fill={BP.line} fontSize={15.5} fontWeight={800}>
            Dark Mode Toggle &
          </text>
          <text x={18} y={80} fill={BP.line} fontSize={15.5} fontWeight={800}>
            Theme Persistence
          </text>
          <line x1={18} y1={96} x2={colWidth - 46} y2={96} stroke={BP.lineMuted} strokeWidth={1.5} />
          <text x={18} y={122} fill={BP.cyan} fontSize={13.5} fontWeight={800}>
            TOKENS: 142.8k ($0.19)
          </text>
          <text x={18} y={148} fill={BP.line} fontSize={13} fontWeight={700}>
            TIME: 01m 48.4s
          </text>
          <text x={18} y={174} fill={BP.lineSoft} fontSize={12.5} fontWeight={700}>
            COMMIT: 8f4e2a1 (main)
          </text>
        </g>
      </g>

      {/* ===================================================================== */}
      {/* MIDDLE ROW: 3 PRODUCTION TELEMETRY READOUT BLOCKS (y=495..680)        */}
      {/* ===================================================================== */}
      <g opacity={pMetrics} filter="url(#bp-glow)">
        {metrics.map((m, idx) => {
          const mx = 130 + idx * 560;
          return (
            <g key={m.code} transform={`translate(${mx}, 495)`}>
              <rect
                x={0}
                y={0}
                width={540}
                height={175}
                rx={12}
                fill={BP.fillSolid}
                stroke={BP.line}
                strokeWidth={2.6}
              />
              <rect
                x={0}
                y={0}
                width={540}
                height={42}
                fill="url(#bp-hatch-45)"
                stroke={BP.line}
                strokeWidth={1.8}
              />
              <rect x={14} y={6} width={390} height={30} fill={BP.fillDark} stroke={BP.lineSoft} strokeWidth={1.4} />
              <text x={26} y={26} fill={BP.cyan} fontSize={12.5} fontWeight={800} letterSpacing={1.5}>
                {m.code}
              </text>

              <text x={26} y={96} fill={BP.line} fontSize={32} fontWeight={800} letterSpacing={2}>
                {m.value}
              </text>
              <text x={26} y={136} fill={BP.lineSoft} fontSize={12.5} fontWeight={700} letterSpacing={1.2}>
                {m.sub}
              </text>
            </g>
          );
        })}
      </g>

      {/* ===================================================================== */}
      {/* FINAL BLUEPRINT CERTIFICATION STAMP (113.8s - 121.5s)                 */}
      {/* "This is the Software Factory for Google Antigravity:                 */}
      {/*  autonomous, rigorous, and production-ready."                         */}
      {/* ===================================================================== */}
      {showFinalStamp && (
        <g
          transform={`translate(960, 748) scale(${stampScale})`}
          filter="url(#bp-glow)"
        >
          <rect
            x={-830}
            y={-52}
            width={1660}
            height={104}
            rx={12}
            fill="rgba(7, 26, 56, 0.96)"
            stroke={BP.cyan}
            strokeWidth={3.5}
          />
          <rect
            x={-820}
            y={-42}
            width={1640}
            height={84}
            rx={8}
            fill="none"
            stroke={BP.line}
            strokeWidth={1.8}
            strokeDasharray="12 6"
          />
          <text
            x={0}
            y={-10}
            fill={BP.cyan}
            fontSize={15}
            fontWeight={800}
            letterSpacing={3.5}
            textAnchor="middle"
          >
            SOFTWARE FACTORY FOR GOOGLE ANTIGRAVITY // CERTIFIED ARCHITECTURE
          </text>
          <text
            x={0}
            y={24}
            fill={BP.line}
            fontSize={29}
            fontWeight={800}
            letterSpacing={6}
            textAnchor="middle"
          >
            AUTONOMOUS  ·  RIGOROUS  ·  PRODUCTION-READY
          </text>
        </g>
      )}

      {!showFinalStamp && (
        <>
          <DimensionLine x1={130} y1={700} x2={1790} y2={700} offset={32} label="1660" progress={pDims} />
          <ViewLabel
            x={960}
            y={848}
            title="MERGED MAIN // PRODUCTION VELOCITY TELEMETRY"
            scale="SCALE 1:1"
            progress={pDims}
          />
        </>
      )}
    </svg>
  );
};

