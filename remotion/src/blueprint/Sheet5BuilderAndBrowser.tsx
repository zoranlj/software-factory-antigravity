import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import {
  BP,
  DimensionLine,
  LeaderCallout,
  ViewLabel,
  drawProgress,
  fadeIn,
} from './blueprintTheme';

/**
 * Sheet 5 (54.5s - 69.0s, 870 frames):
 * - 54.5s - 58.0s: "The builder agent does not just write code blindly."
 * - 58.0s - 69.0s: "It edits the React components, runs automated test suites, and even dispatches Antigravity browser subagents to interact with and visually verify the running application."
 */
export const Sheet5BuilderAndBrowser: React.FC = () => {
  const frame = useCurrentFrame();

  const pLeft = drawProgress(frame, 0, 45);
  const pMid = drawProgress(frame, 180, 45);
  const pRight = drawProgress(frame, 380, 50);
  const pDims = fadeIn(frame, 90, 35);

  // Scanline Y inside the Browser Viewport
  const scanY = interpolate(frame % 180, [0, 90, 180], [280, 680, 280]);

  // Simulated Browser Cursor Trajectory clicking the Dark Mode Toggle button
  const cursorX = interpolate(frame, [420, 560, 680], [1380, 1685, 1560], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(frame, [420, 560, 680], [560, 315, 480], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const clickedToggle = frame >= 565;

  const codeLines = [
    'export const ThemeToggle: React.FC = () => {',
    '  const [mode, setMode] = useThemeStore();',
    '  useEffect(() => {',
    '    localStorage.setItem("sf-theme", mode);',
    '    document.documentElement.dataset.theme = mode;',
    '  }, [mode]);',
    '  return (',
    '    <button aria-label="Toggle Blueprint Theme"',
    '            onClick={() => setMode(nextMode)}>',
    '      {mode === "blueprint" ? "CAD" : "DARK"}',
    '    </button>',
    '  );',
    '};',
  ];

  const testSuites = [
    { name: 'ThemeToggle.spec.tsx // renders default state', time: '14ms', start: 220 },
    { name: 'ThemeToggle.spec.tsx // toggles dataset.theme', time: '19ms', start: 265 },
    { name: 'ThemeToggle.spec.tsx // persists to localStorage', time: '11ms', start: 310 },
    { name: 'Dashboard.spec.tsx   // WCAG contrast >= 7.0:1', time: '28ms', start: 355 },
    { name: 'Dashboard.spec.tsx   // zero console warnings', time: '16ms', start: 400 },
  ];

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {/* ===================================================================== */}
      {/* MODULE 01 (LEFT): REACT COMPONENT AST EDITOR (x=120..640)             */}
      {/* ===================================================================== */}
      <g opacity={pLeft} filter="url(#bp-glow)">
        <rect
          x={120}
          y={185}
          width={520}
          height={575}
          rx={14}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={3}
        />
        <rect
          x={120}
          y={185}
          width={520}
          height={56}
          fill="url(#bp-hatch-45)"
          stroke={BP.line}
          strokeWidth={2.2}
        />
        <rect x={138} y={195} width={350} height={36} fill={BP.fillDark} stroke={BP.line} strokeWidth={1.6} />
        <text x={154} y={218} fill={BP.line} fontSize={14.5} fontWeight={800} letterSpacing={1.6}>
          UNIT 01 // REACT AST DIFF ENGINE
        </text>
        <text x={622} y={218} fill={BP.cyan} fontSize={12.5} fontWeight={800} textAnchor="end">
          TSX +68 / -4
        </text>

        {/* File Path Header */}
        <text x={148} y={272} fill={BP.cyan} fontSize={13} fontWeight={800} letterSpacing={1.4}>
          FILE: src/components/ThemeToggle.tsx
        </text>
        <line x1={144} y1={284} x2={616} y2={284} stroke={BP.lineSoft} strokeWidth={1.4} />

        {/* Code Lines */}
        {codeLines.map((ln, idx) => {
          const appear = fadeIn(frame, 35 + idx * 14, 18);
          const isHighlight = idx >= 2 && idx <= 5;
          return (
            <g key={`ln-${idx}`} opacity={appear} transform={`translate(144, ${312 + idx * 28})`}>
              {isHighlight && (
                <rect x={-4} y={-16} width={476} height={24} fill="rgba(125, 211, 252, 0.12)" />
              )}
              <text x={0} y={0} fill={BP.lineMuted} fontSize={12.5} fontWeight={700}>
                {String(idx + 1).padStart(2, '0')}
              </text>
              <text x={32} y={0} fill={isHighlight ? BP.cyan : BP.line} fontSize={13} fontWeight={700}>
                {ln}
              </text>
            </g>
          );
        })}

        {/* AST Verification Footer */}
        <rect
          x={144}
          y={684}
          width={472}
          height={52}
          rx={6}
          fill={BP.fillDark}
          stroke={BP.lineSoft}
          strokeWidth={1.8}
        />
        <text x={164} y={715} fill={BP.cyan} fontSize={13.5} fontWeight={800} letterSpacing={1.4}>
          TSC --NOEMIT: 0 ERRORS // AST VALIDATED
        </text>
      </g>

      {/* ===================================================================== */}
      {/* MODULE 02 (CENTER): AUTOMATED TEST SUITE RUNNER (x=680..1200)         */}
      {/* ===================================================================== */}
      <g opacity={pMid} filter="url(#bp-glow)">
        <rect
          x={680}
          y={185}
          width={520}
          height={575}
          rx={14}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={3}
        />
        <rect
          x={680}
          y={185}
          width={520}
          height={56}
          fill="url(#bp-hatch-45)"
          stroke={BP.line}
          strokeWidth={2.2}
        />
        <rect x={698} y={195} width={360} height={36} fill={BP.fillDark} stroke={BP.line} strokeWidth={1.6} />
        <text x={714} y={218} fill={BP.line} fontSize={14.5} fontWeight={800} letterSpacing={1.6}>
          UNIT 02 // AUTOMATED TEST HARNESS
        </text>
        <text x={1182} y={218} fill={BP.cyan} fontSize={12.5} fontWeight={800} textAnchor="end">
          VITEST 5/5
        </text>

        {/* Test Cases List */}
        {testSuites.map((t, idx) => {
          const passed = frame >= t.start;
          const ry = 266 + idx * 68;
          return (
            <g key={t.name} transform={`translate(704, ${ry})`}>
              <rect
                x={0}
                y={0}
                width={472}
                height={54}
                rx={6}
                fill={BP.fillDark}
                stroke={passed ? BP.cyan : BP.lineSoft}
                strokeWidth={passed ? 2.2 : 1.4}
              />
              <rect
                x={12}
                y={13}
                width={58}
                height={28}
                rx={4}
                fill={passed ? 'rgba(125, 211, 252, 0.2)' : 'none'}
                stroke={BP.cyan}
                strokeWidth={1.8}
              />
              <text
                x={41}
                y={28}
                fill={BP.cyan}
                fontSize={12}
                fontWeight={800}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {passed ? 'PASS' : 'RUN'}
              </text>
              <text x={82} y={26} fill={BP.line} fontSize={12.5} fontWeight={700}>
                {t.name}
              </text>
              <text x={82} y={44} fill={BP.lineSoft} fontSize={11.5} fontWeight={600}>
                {`ASSERTION OK // DURATION: ${t.time}`}
              </text>
            </g>
          );
        })}

        {/* Coverage Gauge Box */}
        <g transform="translate(704, 616)">
          <rect
            x={0}
            y={0}
            width={472}
            height={120}
            rx={8}
            fill={BP.fillDark}
            stroke={BP.lineSoft}
            strokeWidth={2}
          />
          <text x={20} y={32} fill={BP.lineSoft} fontSize={12.5} fontWeight={700} letterSpacing={1.5}>
            STATEMENT & BRANCH COVERAGE TELEMETRY
          </text>
          <rect x={20} y={48} width={432} height={22} fill={BP.fillSolid} stroke={BP.line} strokeWidth={1.6} />
          <rect
            x={22}
            y={50}
            width={interpolate(frame, [220, 440], [40, 428], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}
            height={18}
            fill="url(#bp-hatch-45)"
          />
          <text x={20} y={98} fill={BP.cyan} fontSize={16} fontWeight={800} letterSpacing={1.4}>
            SUITES: 5 PASSED (100%) // TIME: 88 MS
          </text>
        </g>
      </g>

      {/* ===================================================================== */}
      {/* MODULE 03 (RIGHT): ANTIGRAVITY BROWSER SUBAGENT (x=1240..1800)        */}
      {/* ===================================================================== */}
      <g opacity={pRight} filter="url(#bp-glow)">
        <rect
          x={1240}
          y={185}
          width={560}
          height={575}
          rx={14}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={3}
        />
        <rect
          x={1240}
          y={185}
          width={560}
          height={56}
          fill="url(#bp-hatch-45)"
          stroke={BP.line}
          strokeWidth={2.2}
        />
        <rect x={1258} y={195} width={385} height={36} fill={BP.fillDark} stroke={BP.line} strokeWidth={1.6} />
        <text x={1274} y={218} fill={BP.line} fontSize={14.5} fontWeight={800} letterSpacing={1.6}>
          UNIT 03 // BROWSER SUBAGENT VIEWPORT
        </text>
        <text x={1780} y={218} fill={BP.cyan} fontSize={12.5} fontWeight={800} textAnchor="end">
          DOM + VISUAL
        </text>

        {/* Simulated Browser URL Bar */}
        <rect
          x={1266}
          y={260}
          width={508}
          height={36}
          rx={6}
          fill={BP.fillDark}
          stroke={BP.lineSoft}
          strokeWidth={1.8}
        />
        <circle cx={1286} cy={278} r={5} fill={BP.lineSoft} />
        <circle cx={1302} cy={278} r={5} fill={BP.lineSoft} />
        <circle cx={1318} cy={278} r={5} fill={BP.lineSoft} />
        <text x={1342} y={283} fill={BP.cyan} fontSize={13} fontWeight={700}>
          http://localhost:5173/dashboard?theme=blueprint
        </text>

        {/* Simulated App UI Canvas inside Browser */}
        <rect
          x={1266}
          y={308}
          width={508}
          height={300}
          rx={8}
          fill={clickedToggle ? BP.bgDeep : BP.fillDark}
          stroke={BP.line}
          strokeWidth={2.2}
        />

        {/* Simulated App Header & Theme Toggle Button */}
        <rect
          x={1284}
          y={324}
          width={472}
          height={46}
          rx={6}
          fill={BP.fillSolid}
          stroke={BP.lineSoft}
          strokeWidth={1.6}
        />
        <text x={1302} y={352} fill={BP.line} fontSize={14} fontWeight={800}>
          SOFTWARE FACTORY // LIVE PREVIEW
        </text>

        {/* Interactive Theme Toggle Button Target */}
        <rect
          x={1612}
          y={332}
          width={130}
          height={30}
          rx={5}
          fill={clickedToggle ? BP.cyan : BP.fillDark}
          stroke={BP.cyan}
          strokeWidth={2}
        />
        <text
          x={1677}
          y={351}
          fill={clickedToggle ? BP.bgDeep : BP.cyan}
          fontSize={12}
          fontWeight={800}
          textAnchor="middle"
        >
          {clickedToggle ? 'MODE: CAD ✓' : 'TOGGLE MODE'}
        </text>

        {/* Simulated Component Wireframe Cards inside Browser */}
        {[0, 1, 2].map((col) => (
          <g key={`bcol-${col}`} transform={`translate(${1284 + col * 162}, 388)`}>
            <rect
              x={0}
              y={0}
              width={148}
              height={196}
              rx={6}
              fill={BP.fillSolid}
              stroke={clickedToggle ? BP.cyan : BP.lineSoft}
              strokeWidth={1.8}
            />
            <line x1={14} y1={32} x2={134} y2={32} stroke={BP.lineMuted} strokeWidth={1.5} />
            <rect
              x={14}
              y={48}
              width={120}
              height={64}
              rx={4}
              fill="url(#bp-crosshatch)"
              stroke={BP.lineSoft}
              strokeWidth={1.4}
            />
            <rect
              x={14}
              y={124}
              width={120}
              height={52}
              rx={4}
              fill={BP.fillDark}
              stroke={BP.lineSoft}
              strokeWidth={1.4}
            />
          </g>
        ))}

        {/* Optical Inspection Scanline */}
        <line
          x1={1266}
          y1={scanY}
          x2={1774}
          y2={scanY}
          stroke={BP.cyan}
          strokeWidth={2.4}
          strokeDasharray="10 4"
        />

        {/* Animated Subagent Reticle / Cursor */}
        <g transform={`translate(${cursorX}, ${cursorY})`}>
          <circle cx={0} cy={0} r={18} fill="none" stroke={BP.cyan} strokeWidth={2} />
          <line x1={-24} y1={0} x2={24} y2={0} stroke={BP.cyan} strokeWidth={1.6} />
          <line x1={0} y1={-24} x2={0} y2={24} stroke={BP.cyan} strokeWidth={1.6} />
          {clickedToggle && (
            <circle cx={0} cy={0} r={28} fill="none" stroke={BP.line} strokeWidth={1.5} strokeDasharray="4 4" />
          )}
        </g>

        {/* Visual Verification Readout Footer */}
        <rect
          x={1266}
          y={624}
          width={508}
          height={112}
          rx={8}
          fill={BP.fillDark}
          stroke={BP.lineSoft}
          strokeWidth={2}
        />
        <text x={1286} y={654} fill={BP.cyan} fontSize={13.5} fontWeight={800} letterSpacing={1.5}>
          SUBAGENT VISUAL ASSERTION LOG
        </text>
        <text x={1286} y={682} fill={BP.line} fontSize={13.5} fontWeight={700}>
          • CLICK(button[aria-label=&quot;Toggle Blueprint Theme&quot;]) -&gt; OK
        </text>
        <text x={1286} y={710} fill={BP.cyan} fontSize={13.5} fontWeight={800}>
          • SCREENSHOT CAPTURED: 6/6 VISUAL CRITERIA VERIFIED
        </text>
      </g>

      {/* Connecting Conduit Arrows between the 3 Units */}
      <line x1={640} y1={460} x2={680} y2={460} stroke={BP.cyan} strokeWidth={3} />
      <line x1={1200} y1={460} x2={1240} y2={460} stroke={BP.cyan} strokeWidth={3} />

      {/* Dimensions & Callouts */}
      <DimensionLine x1={120} y1={760} x2={640} y2={760} offset={36} label="520" progress={pDims} />
      <DimensionLine x1={680} y1={760} x2={1200} y2={760} offset={36} label="520" progress={pDims} />
      <DimensionLine x1={1240} y1={760} x2={1800} y2={760} offset={36} label="560" progress={pDims} />

      <LeaderCallout
        px={1680}
        py={335}
        ex={1720}
        ey={150}
        tx={1765}
        align="right"
        label="BROWSER SUBAGENT"
        sublabel="REAL DOM & SCREENSHOT CHECK"
        progress={pRight}
      />

      <ViewLabel x={380} y={848} title="REACT AST EDITOR" scale="LEFT VIEW" progress={pDims} />
      <ViewLabel x={940} y={848} title="AUTOMATED TEST RUNNER" scale="CENTER VIEW" progress={pDims} />
      <ViewLabel x={1520} y={848} title="BROWSER SUBAGENT VERIFY" scale="RIGHT VIEW" progress={pDims} />
    </svg>
  );
};

