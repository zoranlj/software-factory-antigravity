import React from 'react';
import { interpolate, spring } from 'remotion';

export const BP = {
  bgDeep: '#092247',
  bgCenter: '#113a73',
  bgDark: '#061733',
  gridMinor: 'rgba(165, 210, 255, 0.08)',
  gridMajor: 'rgba(165, 210, 255, 0.19)',
  line: '#eef6ff',
  lineSoft: 'rgba(238, 246, 255, 0.72)',
  lineMuted: 'rgba(165, 210, 255, 0.42)',
  lineFaint: 'rgba(165, 210, 255, 0.22)',
  cyan: '#7dd3fc',
  accent: '#bae6fd',
  fillTint: 'rgba(125, 211, 252, 0.08)',
  fillSolid: '#0b2954',
  fillDark: '#071d3d',
  fontMono: '"Courier New", "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace',
  fontTech: 'ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace',
} as const;

export interface TranscriptCue {
  startSec: number;
  endSec: number;
  sheet: number;
  sectionCode: string;
  text: string;
}

export const TRANSCRIPT_CUES: TranscriptCue[] = [
  {
    startSec: 0.0,
    endSec: 3.8,
    sheet: 1,
    sectionCode: 'FIG 1.0 // GENERAL ARRANGEMENT',
    text: 'Welcome to Software Factory for Google Antigravity.',
  },
  {
    startSec: 3.8,
    endSec: 11.4,
    sheet: 1,
    sectionCode: 'FIG 1.1 // MULTI-AGENT ARCHITECTURE',
    text: 'In this demo, you will see how autonomous multi-agent engineering works in a real production codebase.',
  },
  {
    startSec: 11.4,
    endSec: 14.2,
    sheet: 2,
    sectionCode: 'FIG 2.0 // BACKLOG INTAKE',
    text: 'It all starts in your project backlog.',
  },
  {
    startSec: 14.2,
    endSec: 19.8,
    sheet: 2,
    sectionCode: 'FIG 2.1 // CLI COMMAND ACTUATION',
    text: 'When you type /factory next, the Factory Orchestrator springs to life.',
  },
  {
    startSec: 19.8,
    endSec: 26.2,
    sheet: 2,
    sectionCode: 'FIG 2.2 // ZERO-OVERHEAD CLAIM',
    text: 'It reads the top pending task from your backlog and claims it with zero manual overhead.',
  },
  {
    startSec: 26.2,
    endSec: 32.0,
    sheet: 3,
    sectionCode: 'FIG 3.0 // GIT WORKTREE ISOLATION',
    text: 'To keep your main branch safe and clean, the factory provisions an isolated Git worktree.',
  },
  {
    startSec: 32.0,
    endSec: 41.3,
    sheet: 3,
    sectionCode: 'FIG 3.1 // SPECIFICATION SYNTHESIS',
    text: 'Here, a dedicated specification writer analyzes the task and produces unambiguous acceptance criteria before any code is written.',
  },
  {
    startSec: 41.3,
    endSec: 46.6,
    sheet: 4,
    sectionCode: 'FIG 4.0 // KANBAN TELEMETRY MATRIX',
    text: 'You can watch everything unfold in real time on the live Kanban dashboard.',
  },
  {
    startSec: 46.6,
    endSec: 54.5,
    sheet: 4,
    sectionCode: 'FIG 4.1 // LIVE TOKEN & TIMING GAUGES',
    text: 'As the job moves into the build phase, you see real-time token counts, execution timing, and streaming agent activity.',
  },
  {
    startSec: 54.5,
    endSec: 58.0,
    sheet: 5,
    sectionCode: 'FIG 5.0 // AUTONOMOUS BUILDER UNIT',
    text: 'The builder agent does not just write code blindly.',
  },
  {
    startSec: 58.0,
    endSec: 69.0,
    sheet: 5,
    sectionCode: 'FIG 5.1 // AST EDIT + TEST + BROWSER VERIFY',
    text: 'It edits the React components, runs automated test suites, and even dispatches Antigravity browser subagents to interact with and visually verify the running application.',
  },
  {
    startSec: 69.0,
    endSec: 72.5,
    sheet: 6,
    sectionCode: 'FIG 6.0 // CONCURRENT REVIEW GAUNTLET',
    text: 'Next comes the multi-agent review gauntlet.',
  },
  {
    startSec: 72.5,
    endSec: 82.0,
    sheet: 6,
    sectionCode: 'FIG 6.1 // 4X ORTHOGONAL INSPECTORS',
    text: 'Four specialized agents inspect the changes concurrently: code quality, UX ergonomics, UI fidelity, and application security.',
  },
  {
    startSec: 82.0,
    endSec: 85.3,
    sheet: 6,
    sectionCode: 'FIG 6.2 // INDEPENDENT VALIDATION SIGN-OFF',
    text: 'Each reviewer provides independent validation.',
  },
  {
    startSec: 85.3,
    endSec: 90.8,
    sheet: 7,
    sectionCode: 'FIG 7.0 // APPROVE STAGE GATEWAY',
    text: 'When every reviewer signs off with a passing verdict, the job enters the approve stage.',
  },
  {
    startSec: 90.8,
    endSec: 95.8,
    sheet: 7,
    sectionCode: 'FIG 7.1 // AUDITABLE EVIDENCE DOSSIER',
    text: 'Full evidence logs and test results are summarized for complete auditability.',
  },
  {
    startSec: 95.8,
    endSec: 104.0,
    sheet: 7,
    sectionCode: 'FIG 7.2 // AUTOMATED MERGE & WORKTREE CLEANUP',
    text: 'Once validated, the factory automatically merges the feature branch into main, cleans up the worktree, and closes the backlog item.',
  },
  {
    startSec: 104.0,
    endSec: 113.8,
    sheet: 8,
    sectionCode: 'FIG 8.0 // MERGED MAIN TELEMETRY',
    text: 'Back on the dashboard, the job moves to merged main, giving you complete visibility into total tokens, execution time, and production velocity.',
  },
  {
    startSec: 113.8,
    endSec: 121.5,
    sheet: 8,
    sectionCode: 'FIG 8.1 // PRODUCTION CERTIFICATION STAMP',
    text: 'This is the Software Factory for Google Antigravity: autonomous, rigorous, and production-ready.',
  },
];

export function fadeIn(frame: number, startFrame: number, duration = 20): number {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export function drawProgress(frame: number, startFrame: number, duration = 35): number {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export function popScale(frame: number, fps: number, startFrame: number): number {
  return spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.7 },
  });
}

/**
 * Technical dimension line with arrowheads, extension ticks, and centered label:
 * |<------ 620 ------>|
 */
export const DimensionLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  offset?: number;
  vertical?: boolean;
  progress?: number;
  color?: string;
}> = ({
  x1,
  y1,
  x2,
  y2,
  label,
  offset = 0,
  vertical = false,
  progress = 1,
  color = BP.lineSoft,
}) => {
  if (progress <= 0.01) return null;

  const dx = vertical ? offset : 0;
  const dy = vertical ? 0 : offset;
  const ax1 = x1 + dx;
  const ay1 = y1 + dy;
  const ax2 = x2 + dx;
  const ay2 = y2 + dy;
  const mx = (ax1 + ax2) / 2;
  const my = (ay1 + ay2) / 2;

  return (
    <g opacity={progress}>
      {/* Extension lines if offset is non-zero */}
      {offset !== 0 && (
        <>
          <line
            x1={x1}
            y1={y1}
            x2={ax1 + (vertical ? Math.sign(offset) * 6 : 0)}
            y2={ay1 + (!vertical ? Math.sign(offset) * 6 : 0)}
            stroke={BP.lineMuted}
            strokeWidth={1.2}
          />
          <line
            x1={x2}
            y1={y2}
            x2={ax2 + (vertical ? Math.sign(offset) * 6 : 0)}
            y2={ay2 + (!vertical ? Math.sign(offset) * 6 : 0)}
            stroke={BP.lineMuted}
            strokeWidth={1.2}
          />
        </>
      )}

      {/* End tick bars */}
      {vertical ? (
        <>
          <line x1={ax1 - 6} y1={ay1} x2={ax1 + 6} y2={ay1} stroke={color} strokeWidth={1.5} />
          <line x1={ax2 - 6} y1={ay2} x2={ax2 + 6} y2={ay2} stroke={color} strokeWidth={1.5} />
        </>
      ) : (
        <>
          <line x1={ax1} y1={ay1 - 6} x2={ax1} y2={ay1 + 6} stroke={color} strokeWidth={1.5} />
          <line x1={ax2} y1={ay2 - 6} x2={ax2} y2={ay2 + 6} stroke={color} strokeWidth={1.5} />
        </>
      )}

      {/* Main dimension line */}
      <line
        x1={ax1}
        y1={ay1}
        x2={ax2}
        y2={ay2}
        stroke={color}
        strokeWidth={1.5}
        markerStart="url(#bp-arrow-start)"
        markerEnd="url(#bp-arrow-end)"
      />

      {/* Label pill backing */}
      <rect
        x={mx - (vertical ? 16 : Math.max(28, label.length * 5.2))}
        y={my - (vertical ? Math.max(22, label.length * 4.8) : 11)}
        width={vertical ? 32 : Math.max(56, label.length * 10.4)}
        height={vertical ? Math.max(44, label.length * 9.6) : 22}
        fill={BP.bgDeep}
      />

      <text
        x={mx}
        y={my}
        fill={BP.line}
        fontSize={13}
        fontFamily={BP.fontTech}
        fontWeight={700}
        letterSpacing={1.2}
        textAnchor="middle"
        dominantBaseline="central"
        transform={vertical ? `rotate(-90 ${mx} ${my})` : undefined}
      >
        {label}
      </text>
    </g>
  );
};

/**
 * Technical leader line with elbow and label:
 * (px, py) *-----\ (ex, ey) ------ (tx, ey) LABEL
 */
export const LeaderCallout: React.FC<{
  px: number;
  py: number;
  ex: number;
  ey: number;
  tx: number;
  label: string;
  sublabel?: string;
  progress?: number;
  align?: 'left' | 'right';
}> = ({ px, py, ex, ey, tx, label, sublabel, progress = 1, align }) => {
  if (progress <= 0.01) return null;
  const isRight = align ? align === 'left' : tx >= ex;
  const textX = isRight ? tx + 8 : tx - 8;
  const anchor = isRight ? 'start' : 'end';

  return (
    <g opacity={progress}>
      <circle cx={px} cy={py} r={3.5} fill={BP.line} />
      <circle cx={px} cy={py} r={7} fill="none" stroke={BP.cyan} strokeWidth={1} opacity={0.6} />
      <polyline
        points={`${px},${py} ${ex},${ey} ${tx},${ey}`}
        fill="none"
        stroke={BP.lineSoft}
        strokeWidth={1.6}
      />
      <text
        x={textX}
        y={ey - (sublabel ? 4 : 0)}
        fill={BP.line}
        fontSize={14}
        fontFamily={BP.fontTech}
        fontWeight={700}
        letterSpacing={1.4}
        textAnchor={anchor}
        dominantBaseline="central"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={textX}
          y={ey + 14}
          fill={BP.cyan}
          fontSize={11.5}
          fontFamily={BP.fontTech}
          fontWeight={600}
          letterSpacing={1.1}
          textAnchor={anchor}
          dominantBaseline="central"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
};

/**
 * View title block underneath an orthographic view (like "FRONT VIEW", "SIDE VIEW", "SECTION A-A")
 */
export const ViewLabel: React.FC<{
  x: number;
  y: number;
  title: string;
  scale?: string;
  progress?: number;
}> = ({ x, y, title, scale, progress = 1 }) => {
  if (progress <= 0.01) return null;
  const lineW = Math.max(130, title.length * 12);
  return (
    <g opacity={progress}>
      <text
        x={x}
        y={y}
        fill={BP.line}
        fontSize={18}
        fontFamily={BP.fontTech}
        fontWeight={700}
        letterSpacing={2.4}
        textAnchor="middle"
      >
        {title}
      </text>
      <line
        x1={x - lineW / 2}
        y1={y + 7}
        x2={x + lineW / 2}
        y2={y + 7}
        stroke={BP.lineSoft}
        strokeWidth={1.6}
      />
      {scale && (
        <text
          x={x}
          y={y + 24}
          fill={BP.lineSoft}
          fontSize={13}
          fontFamily={BP.fontTech}
          fontWeight={600}
          letterSpacing={1.6}
          textAnchor="middle"
        >
          {scale}
        </text>
      )}
    </g>
  );
};

