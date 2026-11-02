import React from 'react';
import { useCurrentFrame } from 'remotion';
import {
  BP,
  DimensionLine,
  LeaderCallout,
  ViewLabel,
  drawProgress,
  fadeIn,
} from './blueprintTheme';

/**
 * Sheet 1 (0.0s - 11.4s, 684 frames):
 * "Welcome to Software Factory for Google Antigravity. In this demo, you will see how
 * autonomous multi-agent engineering works in a real production codebase."
 *
 * Directly mirrors the uploaded reference blueprint composition:
 * - Left: FRONT VIEW (Autonomous Factory Robot / Chassis with LiDAR/Spec Array, Section A-A cut, treads)
 * - Middle: SIDE VIEW (Orthographic side profile with 4x Reviewer Servo Joints, Git Worktree drive)
 * - Right: SECTION A-A (Cross-hatched outer shell t=12, cross-hatched Orchestrator Power Core, 520x360 dims)
 */
export const Sheet1GeneralArrangement: React.FC = () => {
  const frame = useCurrentFrame();

  const pFront = drawProgress(frame, 0, 50);
  const pSide = drawProgress(frame, 35, 50);
  const pSection = drawProgress(frame, 75, 55);
  const pDims = fadeIn(frame, 120, 35);
  const pCallouts = fadeIn(frame, 160, 40);
  const pPipeline = fadeIn(frame, 230, 45);

  const pulse = 0.65 + 0.35 * Math.sin(frame * 0.08);
  const coreAngle = (frame * 0.6) % 360;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {/* Top Blueprint Banner */}
      <g opacity={fadeIn(frame, 5, 25)}>
        <text
          x={960}
          y={122}
          fill={BP.line}
          fontSize={22}
          fontFamily={BP.fontTech}
          fontWeight={800}
          letterSpacing={4}
          textAnchor="middle"
        >
          GOOGLE ANTIGRAVITY // AUTONOMOUS MULTI-AGENT SOFTWARE FACTORY
        </text>
        <line x1={490} y1={136} x2={1430} y2={136} stroke={BP.lineSoft} strokeWidth={1.5} />
      </g>

      {/* ===================================================================== */}
      {/* LEFT: FRONT VIEW (x center = 415)                                     */}
      {/* ===================================================================== */}
      <g opacity={pFront} filter="url(#bp-glow)">
        {/* Centerline vertical & horizontal */}
        <line
          x1={415}
          y1={170}
          x2={415}
          y2={775}
          stroke={BP.lineMuted}
          strokeWidth={1.3}
          strokeDasharray="16 6 4 6"
        />
        <line
          x1={210}
          y1={460}
          x2={620}
          y2={460}
          stroke={BP.lineMuted}
          strokeWidth={1.3}
          strokeDasharray="16 6 4 6"
        />

        {/* Section A-A Cutting Plane Line across Torso */}
        <polyline
          points="210,415 210,460 250,460"
          fill="none"
          stroke={BP.line}
          strokeWidth={2.2}
        />
        <polyline
          points="580,460 620,460 620,415"
          fill="none"
          stroke={BP.line}
          strokeWidth={2.2}
        />
        <text x={205} y={405} fill={BP.line} fontSize={18} fontWeight={800} textAnchor="middle">
          A
        </text>
        <text x={625} y={405} fill={BP.line} fontSize={18} fontWeight={800} textAnchor="middle">
          A
        </text>

        {/* Antenna Mast & Transceiver */}
        <line x1={415} y1={192} x2={415} y2={236} stroke={BP.line} strokeWidth={2.6} />
        <circle cx={415} cy={184} r={9} fill={BP.bgDeep} stroke={BP.line} strokeWidth={2.5} />
        <circle cx={415} cy={184} r={16} fill="none" stroke={BP.cyan} strokeWidth={1.2} opacity={pulse} />

        {/* Head Unit (Spec & Vision Array) */}
        <rect
          x={325}
          y={236}
          width={180}
          height={118}
          rx={22}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.8}
        />
        {/* Visor viewport */}
        <rect
          x={347}
          y={260}
          width={136}
          height={64}
          rx={12}
          fill={BP.fillDark}
          stroke={BP.lineSoft}
          strokeWidth={2}
        />
        {/* Dual Optical / Spec Sensors */}
        <circle cx={382} cy={292} r={15} fill="none" stroke={BP.line} strokeWidth={2.4} />
        <circle cx={382} cy={292} r={6} fill={BP.cyan} />
        <circle cx={448} cy={292} r={15} fill="none" stroke={BP.line} strokeWidth={2.4} />
        <circle cx={448} cy={292} r={6} fill={BP.cyan} />

        {/* Neck Collar */}
        <rect
          x={375}
          y={354}
          width={80}
          height={20}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.4}
        />

        {/* Main Torso (Orchestrator + Builder Core) */}
        <rect
          x={285}
          y={374}
          width={260}
          height={224}
          rx={20}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={3}
        />
        {/* Inner Hidden Chassis Dashed Outline */}
        <rect
          x={299}
          y={388}
          width={232}
          height={196}
          rx={12}
          fill="none"
          stroke={BP.lineSoft}
          strokeWidth={1.4}
          strokeDasharray="7 5"
        />

        {/* Central Power / Orchestrator Core */}
        <circle cx={415} cy={460} r={42} fill={BP.fillDark} stroke={BP.line} strokeWidth={2.5} />
        <circle cx={415} cy={460} r={26} fill="url(#bp-crosshatch)" stroke={BP.line} strokeWidth={2} />
        {/* Lower Internal Bus Bay (dashed) */}
        <rect
          x={345}
          y={522}
          width={140}
          height={52}
          fill="none"
          stroke={BP.lineSoft}
          strokeWidth={1.6}
          strokeDasharray="6 4"
        />

        {/* Left & Right Multi-Agent Manipulator Arms */}
        {[-1, 1].map((dir) => {
          const armX = dir === -1 ? 242 : 558;
          const shoulderCx = dir === -1 ? 257 : 573;
          return (
            <g key={`arm-${dir}`}>
              <circle
                cx={shoulderCx}
                cy={398}
                r={22}
                fill={BP.fillSolid}
                stroke={BP.line}
                strokeWidth={2.5}
              />
              <circle cx={shoulderCx} cy={398} r={9} fill="none" stroke={BP.lineSoft} strokeWidth={1.6} />
              <rect
                x={armX}
                y={422}
                width={30}
                height={58}
                rx={10}
                fill={BP.fillSolid}
                stroke={BP.line}
                strokeWidth={2.4}
              />
              <ellipse
                cx={shoulderCx}
                cy={490}
                rx={15}
                ry={9}
                fill={BP.fillSolid}
                stroke={BP.line}
                strokeWidth={2.2}
              />
              <rect
                x={armX + 2}
                y={500}
                width={26}
                height={58}
                rx={9}
                fill={BP.fillSolid}
                stroke={BP.line}
                strokeWidth={2.4}
              />
              {/* Claw pincer */}
              <path
                d={`M ${shoulderCx - 12} 558 L ${shoulderCx - 15} 588 L ${shoulderCx - 4} 596`}
                fill="none"
                stroke={BP.line}
                strokeWidth={2.4}
              />
              <path
                d={`M ${shoulderCx + 12} 558 L ${shoulderCx + 15} 588 L ${shoulderCx + 4} 596`}
                fill="none"
                stroke={BP.line}
                strokeWidth={2.4}
              />
            </g>
          );
        })}

        {/* Trapezoid Waist Skirt (Worktree Isolator) */}
        <polygon
          points="310,598 520,598 548,668 282,668"
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.8}
        />
        <line x1={350} y1={622} x2={480} y2={622} stroke={BP.lineSoft} strokeWidth={2} />
        <line x1={350} y1={642} x2={480} y2={642} stroke={BP.lineSoft} strokeWidth={2} />

        {/* Base Plinth */}
        <rect
          x={268}
          y={668}
          width={294}
          height={42}
          rx={6}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.8}
        />

        {/* Left & Right Heavy Treads */}
        {[254, 512].map((tx, i) => (
          <g key={`tread-${i}`}>
            <rect
              x={tx}
              y={694}
              width={64}
              height={66}
              rx={12}
              fill={BP.fillSolid}
              stroke={BP.line}
              strokeWidth={2.8}
            />
            {[708, 720, 732, 744].map((ty) => (
              <line
                key={ty}
                x1={tx + 6}
                y1={ty}
                x2={tx + 58}
                y2={ty}
                stroke={BP.lineSoft}
                strokeWidth={1.8}
              />
            ))}
          </g>
        ))}

        {/* Ground Datum Line & Hatch */}
        <line x1={190} y1={760} x2={640} y2={760} stroke={BP.line} strokeWidth={2.2} />
        <rect x={190} y={760} width={450} height={14} fill="url(#bp-ground-hatch)" />
      </g>

      {/* ===================================================================== */}
      {/* MIDDLE: SIDE VIEW (x center = 935)                                    */}
      {/* ===================================================================== */}
      <g opacity={pSide} filter="url(#bp-glow)">
        {/* Vertical centerline */}
        <line
          x1={935}
          y1={170}
          x2={935}
          y2={775}
          stroke={BP.lineMuted}
          strokeWidth={1.3}
          strokeDasharray="16 6 4 6"
        />

        {/* Antenna */}
        <line x1={925} y1={192} x2={925} y2={236} stroke={BP.line} strokeWidth={2.6} />
        <circle cx={925} cy={184} r={8} fill={BP.bgDeep} stroke={BP.line} strokeWidth={2.4} />

        {/* Side Head Profile */}
        <rect
          x={865}
          y={236}
          width={140}
          height={118}
          rx={22}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.8}
        />
        <line
          x1={965}
          y1={246}
          x2={965}
          y2={344}
          stroke={BP.lineSoft}
          strokeWidth={1.6}
          strokeDasharray="7 5"
        />
        {/* Visor protrusion on right */}
        <rect
          x={1005}
          y={264}
          width={18}
          height={60}
          rx={6}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.4}
        />

        {/* Neck */}
        <rect
          x={900}
          y={354}
          width={70}
          height={20}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.4}
        />

        {/* Side Torso */}
        <rect
          x={850}
          y={374}
          width={170}
          height={224}
          rx={20}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={3}
        />
        {/* Chest dome protrusion */}
        <path
          d="M 1020 422 A 42 42 0 0 1 1020 502"
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.6}
        />
        {/* Internal dashed bay */}
        <rect
          x={875}
          y={518}
          width={120}
          height={54}
          fill="none"
          stroke={BP.lineSoft}
          strokeWidth={1.5}
          strokeDasharray="6 5"
        />

        {/* Overlaid Side Arm Assembly */}
        <circle cx={935} cy={402} r={22} fill={BP.fillSolid} stroke={BP.line} strokeWidth={2.5} />
        <circle cx={935} cy={402} r={8} fill="none" stroke={BP.lineSoft} strokeWidth={1.6} />
        <rect
          x={920}
          y={424}
          width={30}
          height={62}
          rx={10}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.4}
        />
        <ellipse
          cx={935}
          cy={495}
          rx={16}
          ry={9}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.2}
        />
        <rect
          x={922}
          y={504}
          width={26}
          height={62}
          rx={9}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.4}
        />
        <path
          d="M 924 566 L 932 598 L 950 606 M 946 566 L 958 592"
          fill="none"
          stroke={BP.line}
          strokeWidth={2.4}
        />

        {/* Side Waist Skirt */}
        <polygon
          points="865,598 1005,598 1035,668 835,668"
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.8}
        />

        {/* Side Base Plinth */}
        <rect
          x={822}
          y={668}
          width={226}
          height={34}
          rx={6}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.8}
        />

        {/* Side Track Belt & 3 Road Wheels (Spec / Build / Review) */}
        <rect
          x={802}
          y={696}
          width={266}
          height={64}
          rx={32}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={3}
        />
        {[846, 935, 1024].map((wx, idx) => (
          <g key={`wheel-${idx}`}>
            <circle cx={wx} cy={728} r={24} fill={BP.fillDark} stroke={BP.line} strokeWidth={2.4} />
            <circle cx={wx} cy={728} r={9} fill="none" stroke={BP.lineSoft} strokeWidth={1.8} />
            <line x1={wx - 12} y1={728} x2={wx + 12} y2={728} stroke={BP.lineMuted} strokeWidth={1.2} />
            <line x1={wx} y1={716} x2={wx} y2={740} stroke={BP.lineMuted} strokeWidth={1.2} />
          </g>
        ))}

        {/* Ground Datum Line & Hatch */}
        <line x1={760} y1={760} x2={1110} y2={760} stroke={BP.line} strokeWidth={2.2} />
        <rect x={760} y={760} width={350} height={14} fill="url(#bp-ground-hatch)" />
      </g>

      {/* ===================================================================== */}
      {/* RIGHT: SECTION A-A (x center = 1520, y center = 430)                  */}
      {/* ===================================================================== */}
      <g opacity={pSection} filter="url(#bp-glow)">
        {/* Centerlines */}
        <line
          x1={1290}
          y1={430}
          x2={1750}
          y2={430}
          stroke={BP.lineMuted}
          strokeWidth={1.3}
          strokeDasharray="16 6 4 6"
        />
        <line
          x1={1520}
          y1={260}
          x2={1520}
          y2={600}
          stroke={BP.lineMuted}
          strokeWidth={1.3}
          strokeDasharray="16 6 4 6"
        />

        {/* Outer Cross-Section Shell with 45-deg Hatching (SHELL t=12) */}
        <rect
          x={1330}
          y={290}
          width={380}
          height={280}
          rx={32}
          fill="url(#bp-hatch-45)"
          stroke={BP.line}
          strokeWidth={3}
        />
        {/* Inner Cavity Cutout */}
        <rect
          x={1354}
          y={314}
          width={332}
          height={232}
          rx={18}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.6}
        />

        {/* 4 Corner Mounting Bolts (4x Review Agents) */}
        {[
          [1378, 338],
          [1662, 338],
          [1378, 522],
          [1662, 522],
        ].map(([bx, by], i) => (
          <g key={`bolt-${i}`}>
            <circle cx={bx} cy={by} r={10} fill="none" stroke={BP.line} strokeWidth={2} />
            <circle cx={bx} cy={by} r={4} fill={BP.cyan} />
          </g>
        ))}

        {/* Central Power / Orchestrator Core Cross-Section */}
        <circle
          cx={1520}
          cy={430}
          r={68}
          fill="url(#bp-crosshatch)"
          stroke={BP.line}
          strokeWidth={2.8}
        />
        <circle
          cx={1520}
          cy={430}
          r={30}
          fill={BP.fillDark}
          stroke={BP.line}
          strokeWidth={2.6}
        />
        {/* Rotating telemetry ticks inside core */}
        <g transform={`translate(1520, 430) rotate(${coreAngle})`}>
          <line x1={-22} y1={0} x2={22} y2={0} stroke={BP.cyan} strokeWidth={1.8} />
          <line x1={0} y1={-22} x2={0} y2={22} stroke={BP.cyan} strokeWidth={1.8} />
        </g>

        {/* Subagent Telemetry Conduit Cluster on Right */}
        {[
          [1618, 402],
          [1634, 418],
          [1614, 436],
          [1642, 444],
          [1624, 456],
        ].map(([cx, cy], idx) => (
          <circle
            key={`conduit-${idx}`}
            cx={cx}
            cy={cy}
            r={7}
            fill={BP.fillDark}
            stroke={BP.line}
            strokeWidth={2}
          />
        ))}
      </g>

      {/* ===================================================================== */}
      {/* DIMENSIONS & LEADER CALLOUTS                                          */}
      {/* ===================================================================== */}
      <DimensionLine
        x1={254}
        y1={236}
        x2={254}
        y2={760}
        offset={-58}
        vertical
        label="1450"
        progress={pDims}
      />
      <DimensionLine
        x1={505}
        y1={236}
        x2={505}
        y2={354}
        offset={42}
        vertical
        label="320"
        progress={pDims}
      />
      <DimensionLine
        x1={254}
        y1={760}
        x2={576}
        y2={760}
        offset={42}
        label="620"
        progress={pDims}
      />

      {/* Side View Dimensions */}
      <DimensionLine
        x1={850}
        y1={374}
        x2={850}
        y2={598}
        offset={-58}
        vertical
        label="410"
        progress={pDims}
      />
      <DimensionLine
        x1={802}
        y1={760}
        x2={1068}
        y2={760}
        offset={42}
        label="480"
        progress={pDims}
      />

      {/* Section A-A Dimensions */}
      <DimensionLine
        x1={1330}
        y1={570}
        x2={1710}
        y2={570}
        offset={44}
        label="520"
        progress={pDims}
      />
      <DimensionLine
        x1={1710}
        y1={290}
        x2={1710}
        y2={570}
        offset={46}
        vertical
        label="360"
        progress={pDims}
      />

      {/* Leader Callouts */}
      <LeaderCallout
        px={448}
        py={282}
        ex={540}
        ey={198}
        tx={585}
        label="SPEC & VISION ARRAY"
        sublabel="OPUS 4.6 // BROWSER SUBAGENT"
        progress={pCallouts}
      />
      <LeaderCallout
        px={1012}
        py={400}
        ex={1082}
        ey={334}
        tx={1135}
        label="REVIEW GAUNTLET ×4"
        sublabel="SEC · UX · UI · CODE"
        progress={pCallouts}
      />
      <LeaderCallout
        px={1485}
        py={385}
        ex={1415}
        ey={232}
        tx={1360}
        align="right"
        label="ORCHESTRATOR CORE"
        sublabel="/FACTORY NEXT ENGINE"
        progress={pCallouts}
      />
      <LeaderCallout
        px={1342}
        py={490}
        ex={1315}
        ey={592}
        tx={1270}
        align="right"
        label="WORKTREE SHELL t=12"
        sublabel="ISOLATED GIT BRANCH"
        progress={pCallouts}
      />

      {/* View Labels */}
      <ViewLabel x={415} y={848} title="FRONT VIEW" progress={pDims} />
      <ViewLabel x={935} y={848} title="SIDE VIEW" progress={pDims} />
      <ViewLabel x={1520} y={662} title="SECTION A-A" scale="SCALE 1:5" progress={pDims} />

      {/* ===================================================================== */}
      {/* MINI PIPELINE SCHEMATIC UNDER SECTION A-A (frames 230+)               */}
      {/* ===================================================================== */}
      <g opacity={pPipeline} transform="translate(1288, 725)">
        <rect
          x={0}
          y={0}
          width={584}
          height={118}
          fill="rgba(7, 26, 56, 0.85)"
          stroke={BP.lineSoft}
          strokeWidth={1.8}
        />
        <text
          x={18}
          y={24}
          fill={BP.cyan}
          fontSize={12}
          fontFamily={BP.fontTech}
          fontWeight={700}
          letterSpacing={1.8}
        >
          PRODUCTION PIPELINE SEQUENCE // 5-STAGE AUTONOMOUS LOOP
        </text>
        {['1.BACKLOG', '2.SPEC', '3.BUILD', '4.REVIEW×4', '5.MERGE'].map((st, idx) => {
          const bx = 18 + idx * 112;
          const active = frame > 250 + idx * 55;
          return (
            <g key={st} transform={`translate(${bx}, 42)`}>
              <rect
                x={0}
                y={0}
                width={98}
                height={54}
                fill={active ? 'rgba(125, 211, 252, 0.16)' : BP.fillDark}
                stroke={active ? BP.cyan : BP.lineSoft}
                strokeWidth={active ? 2.2 : 1.4}
              />
              <text
                x={49}
                y={27}
                fill={active ? BP.line : BP.lineSoft}
                fontSize={12}
                fontFamily={BP.fontTech}
                fontWeight={800}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {st}
              </text>
              {idx < 4 && (
                <line
                  x1={98}
                  y1={27}
                  x2={112}
                  y2={27}
                  stroke={BP.lineSoft}
                  strokeWidth={1.8}
                />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

