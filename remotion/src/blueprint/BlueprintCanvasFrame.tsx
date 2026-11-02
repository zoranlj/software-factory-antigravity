import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { BP, TRANSCRIPT_CUES } from './blueprintTheme';

const SHEET_TITLES: Record<number, { title: string; subtitle: string; dwg: string; scale: string }> = {
  1: {
    title: 'SOFTWARE FACTORY MK-II',
    subtitle: 'GENERAL ARRANGEMENT',
    dwg: 'SF-2042',
    scale: '1:10',
  },
  2: {
    title: 'ORCHESTRATOR INTAKE',
    subtitle: 'BACKLOG & /FACTORY NEXT',
    dwg: 'SF-2043',
    scale: '1:5',
  },
  3: {
    title: 'WORKTREE & SPEC WRITER',
    subtitle: 'ISOLATION CHAMBER // SEC B-B',
    dwg: 'SF-2044',
    scale: '1:5',
  },
  4: {
    title: 'KANBAN TELEMETRY MATRIX',
    subtitle: 'REAL-TIME DASHBOARD SCHEMATIC',
    dwg: 'SF-2045',
    scale: '1:2',
  },
  5: {
    title: 'AUTONOMOUS BUILDER UNIT',
    subtitle: 'AST + VITEST + BROWSER VERIFY',
    dwg: 'SF-2046',
    scale: '1:4',
  },
  6: {
    title: 'REVIEW GAUNTLET 4X',
    subtitle: 'CONCURRENT INSPECTION ARRAY',
    dwg: 'SF-2047',
    scale: '1:4',
  },
  7: {
    title: 'APPROVAL & AUTO-MERGE',
    subtitle: 'AUDIT DOSSIER & MAIN VALVE',
    dwg: 'SF-2048',
    scale: '1:5',
  },
  8: {
    title: 'PRODUCTION VELOCITY',
    subtitle: 'MERGED MAIN // CERTIFICATION',
    dwg: 'SF-2049',
    scale: '1:1',
  },
};

export const BlueprintCanvasFrame: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSec = frame / fps;

  const activeCue =
    TRANSCRIPT_CUES.find((c) => currentSec >= c.startSec && currentSec < c.endSec) ||
    TRANSCRIPT_CUES[TRANSCRIPT_CUES.length - 1];

  const sheetNum = activeCue.sheet;
  const meta = SHEET_TITLES[sheetNum] || SHEET_TITLES[1];

  // Top & bottom zone numbers: 6, 5, 4, 3, 2, 1 (matching standard CAD and reference image)
  const hZones = ['6', '5', '4', '3', '2', '1'];
  // Left & right zone letters: D, C, B, A (top to bottom, matching reference image)
  const vZones = ['D', 'C', 'B', 'A'];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BP.bgDeep,
        backgroundImage: `
          radial-gradient(ellipse at 50% 48%, ${BP.bgCenter} 0%, ${BP.bgDeep} 62%, ${BP.bgDark} 100%)
        `,
        overflow: 'hidden',
        fontFamily: BP.fontTech,
        color: BP.line,
      }}
    >
      {/* Blueprint SVG Grid, Fold Lines, Frame Borders, Title Block & Shared Defs */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <defs>
          {/* Minor 24px grid */}
          <pattern id="bp-grid-minor" width={24} height={24} patternUnits="userSpaceOnUse">
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke={BP.gridMinor}
              strokeWidth={1}
            />
          </pattern>

          {/* Major 120px grid */}
          <pattern id="bp-grid-major" width={120} height={120} patternUnits="userSpaceOnUse">
            <rect width={120} height={120} fill="url(#bp-grid-minor)" />
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke={BP.gridMajor}
              strokeWidth={1.2}
            />
          </pattern>

          {/* 45-degree section hatching (like SECTION A-A outer ring) */}
          <pattern
            id="bp-hatch-45"
            width={10}
            height={10}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1={0} y1={0} x2={0} y2={10} stroke={BP.lineSoft} strokeWidth={1.6} />
          </pattern>

          {/* Cross-hatch pattern (like SECTION A-A inner core) */}
          <pattern
            id="bp-crosshatch"
            width={9}
            height={9}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1={0} y1={0} x2={0} y2={9} stroke={BP.lineSoft} strokeWidth={1.3} />
            <line x1={0} y1={0} x2={9} y2={0} stroke={BP.lineSoft} strokeWidth={1.3} />
          </pattern>

          {/* Ground hatch pattern under robots/assemblies */}
          <pattern
            id="bp-ground-hatch"
            width={12}
            height={12}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-45)"
          >
            <line x1={0} y1={0} x2={0} y2={12} stroke={BP.lineMuted} strokeWidth={1.5} />
          </pattern>

          {/* Dimension Arrowheads */}
          <marker
            id="bp-arrow-end"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient="auto"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={BP.lineSoft} />
          </marker>
          <marker
            id="bp-arrow-start"
            viewBox="0 0 10 10"
            refX={1}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient="auto"
          >
            <path d="M 10 1.5 L 1 5 L 10 8.5 z" fill={BP.lineSoft} />
          </marker>

          {/* Subtle cyan glow filter for primary schematic lines */}
          <filter id="bp-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Full-bleed technical grid */}
        <rect x={0} y={0} width={1920} height={1080} fill="url(#bp-grid-major)" />

        {/* Subtle Blueprint Paper Creases (3 vertical panels, 2 horizontal panels like reference) */}
        <g opacity={0.45}>
          {/* Vertical fold 1 at x=640 */}
          <line x1={638} y1={0} x2={638} y2={1080} stroke="#030d1f" strokeWidth={3} />
          <line x1={641} y1={0} x2={641} y2={1080} stroke="#93c5fd" strokeWidth={1.5} opacity={0.45} />
          {/* Vertical fold 2 at x=1280 */}
          <line x1={1278} y1={0} x2={1278} y2={1080} stroke="#030d1f" strokeWidth={3} />
          <line x1={1281} y1={0} x2={1281} y2={1080} stroke="#93c5fd" strokeWidth={1.5} opacity={0.45} />
          {/* Horizontal center fold at y=540 */}
          <line x1={0} y1={538} x2={1920} y2={538} stroke="#030d1f" strokeWidth={3} />
          <line x1={0} y1={541} x2={1920} y2={541} stroke="#93c5fd" strokeWidth={1.5} opacity={0.45} />
          {/* Fold intersection wear highlights */}
          <circle cx={640} cy={540} r={28} fill="rgba(186, 230, 253, 0.06)" />
          <circle cx={1280} cy={540} r={28} fill="rgba(186, 230, 253, 0.06)" />
        </g>

        {/* Outer & Inner CAD Drafting Borders */}
        <rect
          x={28}
          y={24}
          width={1864}
          height={1032}
          fill="none"
          stroke={BP.lineSoft}
          strokeWidth={1.8}
        />
        <rect
          x={48}
          y={44}
          width={1824}
          height={992}
          fill="none"
          stroke={BP.line}
          strokeWidth={3}
        />

        {/* Horizontal Zone Dividers & Labels (6 .. 1) */}
        {hZones.map((zone, idx) => {
          const segW = 1824 / 6;
          const xStart = 48 + idx * segW;
          const xMid = xStart + segW / 2;
          return (
            <g key={`hz-${zone}`}>
              {idx > 0 && (
                <>
                  <line x1={xStart} y1={24} x2={xStart} y2={44} stroke={BP.lineSoft} strokeWidth={1.5} />
                  <line x1={xStart} y1={1036} x2={xStart} y2={1056} stroke={BP.lineSoft} strokeWidth={1.5} />
                </>
              )}
              <text
                x={xMid}
                y={35}
                fill={BP.lineSoft}
                fontSize={11}
                fontFamily={BP.fontTech}
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {zone}
              </text>
              <text
                x={xMid}
                y={1046}
                fill={BP.lineSoft}
                fontSize={11}
                fontFamily={BP.fontTech}
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {zone}
              </text>
            </g>
          );
        })}

        {/* Vertical Zone Dividers & Labels (D, C, B, A) */}
        {vZones.map((zone, idx) => {
          const segH = 992 / 4;
          const yStart = 44 + idx * segH;
          const yMid = yStart + segH / 2;
          return (
            <g key={`vz-${zone}`}>
              {idx > 0 && (
                <>
                  <line x1={28} y1={yStart} x2={48} y2={yStart} stroke={BP.lineSoft} strokeWidth={1.5} />
                  <line x1={1872} y1={yStart} x2={1892} y2={yStart} stroke={BP.lineSoft} strokeWidth={1.5} />
                </>
              )}
              <text
                x={38}
                y={yMid}
                fill={BP.lineSoft}
                fontSize={11}
                fontFamily={BP.fontTech}
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {zone}
              </text>
              <text
                x={1882}
                y={yMid}
                fill={BP.lineSoft}
                fontSize={11}
                fontFamily={BP.fontTech}
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {zone}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Main Dynamic Scene Viewport */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>{children}</AbsoluteFill>

      {/* Foreground HUD: Top Spec Strip, Bottom-Left Notes + Subtitle Bar, Bottom-Right CAD Title Block */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {/* Top-left CAD Sheet Header Callout */}
        <g transform="translate(68, 62)">
          <rect
            x={0}
            y={0}
            width={430}
            height={34}
            fill="rgba(7, 29, 61, 0.85)"
            stroke={BP.lineSoft}
            strokeWidth={1.5}
          />
          <circle cx={18} cy={17} r={4.5} fill={BP.cyan} />
          <text
            x={34}
            y={17}
            fill={BP.line}
            fontSize={13}
            fontFamily={BP.fontTech}
            fontWeight={700}
            letterSpacing={1.8}
            dominantBaseline="central"
          >
            {activeCue.sectionCode}
          </text>
        </g>

        {/* Top-right Elapsed Timecode & Frame Counter */}
        <g transform="translate(1610, 62)">
          <rect
            x={0}
            y={0}
            width={240}
            height={34}
            fill="rgba(7, 29, 61, 0.85)"
            stroke={BP.lineSoft}
            strokeWidth={1.5}
          />
          <text
            x={120}
            y={17}
            fill={BP.cyan}
            fontSize={13}
            fontFamily={BP.fontTech}
            fontWeight={700}
            letterSpacing={1.6}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {`T+${currentSec.toFixed(1).padStart(5, '0')}s // FR:${String(frame).padStart(4, '0')}`}
          </text>
        </g>

        {/* Bottom-Left Engineering Notes & Live Synchronized Transcript Caption Box */}
        <g transform="translate(68, 926)">
          {/* Live Voiceover Transcript Box */}
          <rect
            x={0}
            y={0}
            width={1180}
            height={58}
            fill="rgba(6, 23, 51, 0.9)"
            stroke={BP.lineSoft}
            strokeWidth={1.6}
          />
          <rect x={0} y={0} width={8} height={58} fill={BP.cyan} />
          <text
            x={22}
            y={18}
            fill={BP.cyan}
            fontSize={11}
            fontFamily={BP.fontTech}
            fontWeight={700}
            letterSpacing={1.8}
          >
            VOICEOVER TRANSCRIPT // AUDIO SYNC [24KHZ PCM]
          </text>
          <text
            x={22}
            y={41}
            fill={BP.line}
            fontSize={16.5}
            fontFamily={BP.fontTech}
            fontWeight={700}
            letterSpacing={0.5}
          >
            {`“${activeCue.text}”`}
          </text>

          {/* Engineering Notes Line (Directly matching "NOTES: 1. ALL DIMS IN MM 2. BREAK SHARP EDGES") */}
          <text
            x={2}
            y={82}
            fill={BP.lineSoft}
            fontSize={13.5}
            fontFamily={BP.fontTech}
            fontWeight={700}
            letterSpacing={1.6}
          >
            NOTES: 1. ALL METRICS IN TOKENS/MS   2. ISOLATED GIT WORKTREES   3. ZERO MANUAL OVERHEAD
          </text>
        </g>

        {/* Bottom-Right CAD Title Block (Exact structural match to "SERVICE ROBOT MK-II" title block) */}
        <g transform="translate(1288, 868)">
          <rect
            x={0}
            y={0}
            width={584}
            height={168}
            fill="rgba(7, 26, 56, 0.94)"
            stroke={BP.line}
            strokeWidth={2.8}
          />

          {/* Horizontal dividers */}
          <line x1={0} y1={68} x2={584} y2={68} stroke={BP.line} strokeWidth={2} />
          <line x1={0} y1={118} x2={584} y2={118} stroke={BP.line} strokeWidth={2} />

          {/* Vertical dividers for Row 2 & Row 3 */}
          <line x1={210} y1={68} x2={210} y2={168} stroke={BP.line} strokeWidth={2} />
          <line x1={398} y1={68} x2={398} y2={168} stroke={BP.line} strokeWidth={2} />

          {/* Row 1: Main Title & Subtitle */}
          <text
            x={18}
            y={33}
            fill={BP.line}
            fontSize={27}
            fontFamily={BP.fontTech}
            fontWeight={800}
            letterSpacing={2.2}
          >
            {meta.title}
          </text>
          <text
            x={18}
            y={55}
            fill={BP.lineSoft}
            fontSize={13.5}
            fontFamily={BP.fontTech}
            fontWeight={700}
            letterSpacing={2}
          >
            {meta.subtitle}
          </text>

          {/* Row 2, Col 1: DWG NO. */}
          <text x={16} y={84} fill={BP.lineSoft} fontSize={11} fontFamily={BP.fontTech} fontWeight={700} letterSpacing={1.2}>
            DWG NO.
          </text>
          <text x={16} y={108} fill={BP.line} fontSize={19} fontFamily={BP.fontTech} fontWeight={800} letterSpacing={1.5}>
            {meta.dwg}
          </text>

          {/* Row 2, Col 2: SCALE */}
          <text x={226} y={84} fill={BP.lineSoft} fontSize={11} fontFamily={BP.fontTech} fontWeight={700} letterSpacing={1.2}>
            SCALE
          </text>
          <text x={226} y={108} fill={BP.line} fontSize={19} fontFamily={BP.fontTech} fontWeight={800} letterSpacing={1.5}>
            {meta.scale}
          </text>

          {/* Row 2, Col 3: SHEET */}
          <text x={414} y={84} fill={BP.lineSoft} fontSize={11} fontFamily={BP.fontTech} fontWeight={700} letterSpacing={1.2}>
            SHEET
          </text>
          <text x={414} y={108} fill={BP.cyan} fontSize={19} fontFamily={BP.fontTech} fontWeight={800} letterSpacing={1.5}>
            {`${sheetNum} OF 8`}
          </text>

          {/* Row 3, Col 1: DRAWN */}
          <text x={16} y={134} fill={BP.lineSoft} fontSize={11} fontFamily={BP.fontTech} fontWeight={700} letterSpacing={1.2}>
            DRAWN
          </text>
          <text x={16} y={158} fill={BP.line} fontSize={18} fontFamily={BP.fontTech} fontWeight={800} letterSpacing={1.5}>
            AGY-CORE
          </text>

          {/* Row 3, Col 2: DATE */}
          <text x={226} y={134} fill={BP.lineSoft} fontSize={11} fontFamily={BP.fontTech} fontWeight={700} letterSpacing={1.2}>
            DATE
          </text>
          <text x={226} y={158} fill={BP.line} fontSize={18} fontFamily={BP.fontTech} fontWeight={800} letterSpacing={1.5}>
            02.11.26
          </text>

          {/* Row 3, Col 3: REV */}
          <text x={414} y={134} fill={BP.lineSoft} fontSize={11} fontFamily={BP.fontTech} fontWeight={700} letterSpacing={1.2}>
            REV
          </text>
          <text x={414} y={158} fill={BP.line} fontSize={18} fontFamily={BP.fontTech} fontWeight={800} letterSpacing={1.5}>
            MK-II
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

