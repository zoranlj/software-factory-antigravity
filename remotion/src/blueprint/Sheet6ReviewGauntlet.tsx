import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  BP,
  DimensionLine,
  ViewLabel,
  drawProgress,
  fadeIn,
  popScale,
} from './blueprintTheme';

/**
 * Sheet 6 (69.0s - 85.3s, 978 frames):
 * - 69.0s - 72.5s: "Next comes the multi-agent review gauntlet."
 * - 72.5s - 82.0s: "Four specialized agents inspect the changes concurrently: code quality, UX ergonomics, UI fidelity, and application security."
 * - 82.0s - 85.3s: "Each reviewer provides independent validation."
 */
export const Sheet6ReviewGauntlet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pCenter = drawProgress(frame, 0, 45);
  const pDims = fadeIn(frame, 80, 35);

  const reviewers = [
    {
      code: 'UNIT 01 // REVIEWER-CODE',
      title: 'CODE QUALITY',
      x: 130,
      y: 175,
      appearFrame: 195,
      passFrame: 690,
      cx: 650,
      cy: 340,
      checks: [
        'Strict TypeScript types & zero any casts',
        'Clean React hook dependencies & memoization',
        '100% unit test assertion coverage',
      ],
    },
    {
      code: 'UNIT 02 // REVIEWER-UX',
      title: 'UX ERGONOMICS',
      x: 1210,
      y: 175,
      appearFrame: 295,
      passFrame: 725,
      cx: 1210,
      cy: 340,
      checks: [
        'Keyboard Tab / Enter accessibility verified',
        'Zero layout shift during theme switching',
        'prefers-reduced-motion media query respected',
      ],
    },
    {
      code: 'UNIT 03 // REVIEWER-UI',
      title: 'UI FIDELITY',
      x: 130,
      y: 500,
      appearFrame: 405,
      passFrame: 760,
      cx: 650,
      cy: 615,
      checks: [
        'WCAG AAA 7.4:1 contrast ratio verified',
        'Consistent spacing & typographic hierarchy',
        'Responsive viewport alignment (1080p / mobile)',
      ],
    },
    {
      code: 'UNIT 04 // REVIEWER-SECURITY',
      title: 'APPLICATION SECURITY',
      x: 1210,
      y: 500,
      appearFrame: 515,
      passFrame: 795,
      cx: 1210,
      cy: 615,
      checks: [
        'Zero XSS / unsanitized DOM injection vectors',
        'Safe localStorage serialization & key scoping',
        'Dependency audit & CSP compliance verified',
      ],
    },
  ];

  const allPassed = frame >= 810;
  const ringAngle = (frame * 0.8) % 360;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {/* ===================================================================== */}
      {/* CENTRAL ARTIFACT HUB UNDER CONCURRENT INSPECTION (x=960, y=475)       */}
      {/* ===================================================================== */}
      <g opacity={pCenter} filter="url(#bp-glow)">
        {/* Centerlines */}
        <line
          x1={960}
          y1={145}
          x2={960}
          y2={805}
          stroke={BP.lineMuted}
          strokeWidth={1.3}
          strokeDasharray="16 6 4 6"
        />
        <line
          x1={660}
          y1={475}
          x2={1260}
          y2={475}
          stroke={BP.lineMuted}
          strokeWidth={1.3}
          strokeDasharray="16 6 4 6"
        />

        {/* Outer Hatched Inspection Ring */}
        <circle
          cx={960}
          cy={475}
          r={178}
          fill="url(#bp-hatch-45)"
          stroke={allPassed ? BP.cyan : BP.line}
          strokeWidth={3}
        />
        <circle
          cx={960}
          cy={475}
          r={148}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.5}
        />

        {/* Rotating Radar Sweep Ring */}
        <g transform={`translate(960, 475) rotate(${ringAngle})`}>
          <circle
            cx={0}
            cy={0}
            r={126}
            fill="none"
            stroke={BP.cyan}
            strokeWidth={2}
            strokeDasharray="24 14"
          />
          <line x1={0} y1={-126} x2={0} y2={-86} stroke={BP.cyan} strokeWidth={2.5} />
          <line x1={0} y1={86} x2={0} y2={126} stroke={BP.cyan} strokeWidth={2.5} />
        </g>

        {/* Inner Build Artifact Core */}
        <circle
          cx={960}
          cy={475}
          r={88}
          fill={BP.fillDark}
          stroke={BP.cyan}
          strokeWidth={2.6}
        />
        <text
          x={960}
          y={452}
          fill={BP.cyan}
          fontSize={12.5}
          fontWeight={800}
          letterSpacing={1.6}
          textAnchor="middle"
        >
          ARTIFACT #042
        </text>
        <text
          x={960}
          y={478}
          fill={BP.line}
          fontSize={17}
          fontWeight={800}
          letterSpacing={1.4}
          textAnchor="middle"
        >
          {allPassed ? '4/4 VERIFIED' : 'GAUNTLET LIVE'}
        </text>
        <text
          x={960}
          y={502}
          fill={BP.lineSoft}
          fontSize={12}
          fontWeight={700}
          letterSpacing={1.2}
          textAnchor="middle"
        >
          CONCURRENT 4X
        </text>
      </g>

      {/* ===================================================================== */}
      {/* 4 SPECIALIZED REVIEWER QUADRANTS                                      */}
      {/* ===================================================================== */}
      {reviewers.map((rev, idx) => {
        const appear = fadeIn(frame, rev.appearFrame, 35);
        const passed = frame >= rev.passFrame;
        const stampScale = passed ? popScale(frame, fps, rev.passFrame) : 0;

        // Conduit line from quadrant to central hub
        const hubX = idx % 2 === 0 ? 800 : 1120;
        const hubY = idx < 2 ? 385 : 565;

        return (
          <g key={rev.code} opacity={appear} filter="url(#bp-glow)">
            {/* Conduit Beam to Central Artifact */}
            <polyline
              points={`${rev.cx},${rev.cy} ${(rev.cx + hubX) / 2},${rev.cy} ${hubX},${hubY}`}
              fill="none"
              stroke={passed ? BP.cyan : BP.lineSoft}
              strokeWidth={passed ? 3 : 2}
              strokeDasharray={passed ? undefined : '8 5'}
            />
            <circle cx={hubX} cy={hubY} r={6} fill={passed ? BP.cyan : BP.line} />

            {/* Quadrant Schematic Box (width=580, height=275) */}
            <g transform={`translate(${rev.x}, ${rev.y})`}>
              <rect
                x={0}
                y={0}
                width={580}
                height={275}
                rx={12}
                fill={BP.fillSolid}
                stroke={passed ? BP.cyan : BP.line}
                strokeWidth={passed ? 3 : 2.5}
              />
              {/* Header Bar */}
              <rect
                x={0}
                y={0}
                width={580}
                height={54}
                fill="url(#bp-hatch-45)"
                stroke={BP.line}
                strokeWidth={2}
              />
              <rect
                x={16}
                y={9}
                width={380}
                height={36}
                fill={BP.fillDark}
                stroke={BP.lineSoft}
                strokeWidth={1.5}
              />
              <text x={30} y={32} fill={BP.cyan} fontSize={13.5} fontWeight={800} letterSpacing={1.5}>
                {rev.code}
              </text>

              {/* Title & Independent Checklist */}
              <text x={24} y={88} fill={BP.line} fontSize={21} fontWeight={800} letterSpacing={1.8}>
                {rev.title}
              </text>
              <line x1={24} y1={100} x2={410} y2={100} stroke={BP.lineSoft} strokeWidth={1.5} />

              {rev.checks.map((chk, cIdx) => (
                <g key={chk} transform={`translate(24, ${132 + cIdx * 36})`}>
                  <rect
                    x={0}
                    y={-13}
                    width={16}
                    height={16}
                    fill={passed ? BP.cyan : 'none'}
                    stroke={BP.line}
                    strokeWidth={1.6}
                  />
                  {passed && (
                    <path d="M 3 -5 L 7 0 L 14 -9" fill="none" stroke={BP.bgDeep} strokeWidth={2.2} />
                  )}
                  <text x={26} y={0} fill={BP.lineSoft} fontSize={13.5} fontWeight={700}>
                    {chk}
                  </text>
                </g>
              ))}

              {/* Verdict Stamp Badge on Right of Quadrant */}
              <g
                transform={`translate(485, 165) scale(${passed ? stampScale : 1})`}
              >
                <rect
                  x={-72}
                  y={-42}
                  width={144}
                  height={84}
                  rx={8}
                  fill={passed ? 'rgba(125, 211, 252, 0.16)' : BP.fillDark}
                  stroke={passed ? BP.cyan : BP.lineMuted}
                  strokeWidth={passed ? 2.8 : 1.6}
                />
                <text
                  x={0}
                  y={-10}
                  fill={passed ? BP.cyan : BP.lineSoft}
                  fontSize={11.5}
                  fontWeight={800}
                  letterSpacing={1.4}
                  textAnchor="middle"
                >
                  VERDICT
                </text>
                <text
                  x={0}
                  y={18}
                  fill={passed ? BP.line : BP.lineMuted}
                  fontSize={22}
                  fontWeight={800}
                  letterSpacing={2}
                  textAnchor="middle"
                >
                  {passed ? '[PASS]' : 'SCAN'}
                </text>
              </g>
            </g>
          </g>
        );
      })}

      {/* Dimensions & View Label */}
      <DimensionLine x1={130} y1={785} x2={710} y2={785} offset={28} label="580" progress={pDims} />
      <DimensionLine x1={1210} y1={785} x2={1790} y2={785} offset={28} label="580" progress={pDims} />
      <ViewLabel
        x={960}
        y={848}
        title="CONCURRENT 4-AGENT REVIEW GAUNTLET"
        scale="INDEPENDENT VALIDATION // SCALE 1:4"
        progress={pDims}
      />
    </svg>
  );
};

