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
 * Sheet 3 (26.2s - 41.3s, 906 frames):
 * - 26.2s - 32.0s: "To keep your main branch safe and clean, the factory provisions an isolated Git worktree."
 * - 32.0s - 41.3s: "Here, a dedicated specification writer analyzes the task and produces unambiguous acceptance criteria before any code is written."
 */
export const Sheet3WorktreeAndSpec: React.FC = () => {
  const frame = useCurrentFrame();

  const pMainTrunk = drawProgress(frame, 0, 40);
  const pWorktree = drawProgress(frame, 60, 55);
  const pSpecSheet = drawProgress(frame, 330, 55);
  const pDims = fadeIn(frame, 110, 35);

  const branchFlow = interpolate(frame, [50, 220], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const criteriaList = [
    'AC-01: Header theme toggle switches between Dark & Blueprint palettes',
    'AC-02: Selected theme persists in localStorage under key "sf-theme"',
    'AC-03: Respect prefers-color-scheme media query on initial load',
    'AC-04: Contrast ratio >= 7.0:1 across all Kanban stage cards',
    'AC-05: Zero layout shift (CLS = 0.00) during palette transition',
    'AC-06: Unit & headless browser tests pass with 0 console errors',
  ];

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {/* ===================================================================== */}
      {/* TOP CONDUIT: PROTECTED MAIN BRANCH PIPELINE (x=130..980, y=195)       */}
      {/* ===================================================================== */}
      <g opacity={pMainTrunk} filter="url(#bp-glow)">
        {/* Outer Protected Conduit Pipe */}
        <rect
          x={130}
          y={180}
          width={850}
          height={68}
          rx={10}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={3}
        />
        {/* Internal Centerline */}
        <line
          x1={150}
          y1={214}
          x2={960}
          y2={214}
          stroke={BP.lineSoft}
          strokeWidth={2}
          strokeDasharray="16 6 4 6"
        />

        {/* Commit Nodes along main */}
        {[210, 390, 570, 750, 910].map((cx, i) => (
          <g key={`commit-${i}`}>
            <circle cx={cx} cy={214} r={14} fill={BP.fillDark} stroke={BP.line} strokeWidth={2.6} />
            <circle cx={cx} cy={214} r={5} fill={BP.cyan} />
            <text
              x={cx}
              y={164}
              fill={BP.lineSoft}
              fontSize={11.5}
              fontWeight={700}
              textAnchor="middle"
            >
              {`MAIN@${['95cdda0', 'e1c660b', 'acdf503', '07b7e0d', 'HEAD'][i]}`}
            </text>
          </g>
        ))}

        {/* Lock Shield Badge on Main Branch */}
        <rect
          x={145}
          y={192}
          width={185}
          height={44}
          rx={6}
          fill={BP.fillDark}
          stroke={BP.cyan}
          strokeWidth={2}
        />
        <text x={237} y={219} fill={BP.cyan} fontSize={13.5} fontWeight={800} textAnchor="middle" letterSpacing={1.4}>
          MAIN BRANCH [LOCKED]
        </text>
      </g>

      {/* ===================================================================== */}
      {/* LOWER LEFT: ISOLATED GIT WORKTREE CONTAINMENT CHAMBER (SECTION B-B)   */}
      {/* ===================================================================== */}
      <g opacity={pWorktree} filter="url(#bp-glow)">
        {/* Branching Pipe Elbow from MAIN@570 down into Worktree Chamber */}
        <path
          d="M 570 248 L 570 330 L 380 330 L 380 390"
          fill="none"
          stroke={BP.cyan}
          strokeWidth={4}
          strokeDasharray={branchFlow < 1 ? '10 6' : undefined}
        />
        {/* Isolation Check Valve Symbol at (570, 290) */}
        <g transform="translate(570, 290)">
          <circle cx={0} cy={0} r={20} fill={BP.fillDark} stroke={BP.line} strokeWidth={2.5} />
          <polygon points="-10,-8 10,8 10,-8 -10,8" fill={BP.cyan} />
        </g>

        {/* Cross-Hatched Containment Shell (Worktree Sandbox) */}
        <rect
          x={130}
          y={390}
          width={850}
          height={375}
          rx={24}
          fill="url(#bp-hatch-45)"
          stroke={BP.line}
          strokeWidth={3}
        />
        <rect
          x={156}
          y={416}
          width={798}
          height={323}
          rx={14}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.5}
        />

        {/* Worktree Header Banner */}
        <rect
          x={180}
          y={436}
          width={750}
          height={48}
          rx={6}
          fill={BP.fillDark}
          stroke={BP.lineSoft}
          strokeWidth={1.8}
        />
        <text x={200} y={466} fill={BP.cyan} fontSize={15} fontWeight={800} letterSpacing={1.6}>
          WORKTREE: factory/worktrees/20261102-dark-mode
        </text>
        <text x={910} y={466} fill={BP.line} fontSize={13} fontWeight={700} textAnchor="end" letterSpacing={1.4}>
          BRANCH: feat/dark-mode
        </text>

        {/* Left Inside Chamber: Spec-Writer Agent Unit Schematic */}
        <g transform="translate(195, 510)">
          <rect
            x={0}
            y={0}
            width={290}
            height={200}
            rx={12}
            fill={BP.fillDark}
            stroke={BP.line}
            strokeWidth={2.4}
          />
          {/* Drafting Compass / Scanner Icon */}
          <circle cx={72} cy={88} r={42} fill="none" stroke={BP.cyan} strokeWidth={2.2} />
          <circle cx={72} cy={88} r={26} fill="url(#bp-crosshatch)" stroke={BP.line} strokeWidth={1.8} />
          <line x1={72} y1={36} x2={72} y2={140} stroke={BP.lineSoft} strokeWidth={1.5} />
          <line x1={20} y1={88} x2={124} y2={88} stroke={BP.lineSoft} strokeWidth={1.5} />

          <text x={134} y={62} fill={BP.cyan} fontSize={13} fontWeight={800} letterSpacing={1.4}>
            AGENT PERSONA
          </text>
          <text x={134} y={88} fill={BP.line} fontSize={18} fontWeight={800} letterSpacing={1.2}>
            SPEC-WRITER
          </text>
          <text x={134} y={114} fill={BP.lineSoft} fontSize={12.5} fontWeight={700}>
            MODEL: OPUS 4.6
          </text>
          <text x={20} y={168} fill={BP.lineSoft} fontSize={12.5} fontWeight={700} letterSpacing={1.2}>
            CODE WRITTEN IN STAGE: 0 LOC
          </text>
        </g>

        {/* Right Inside Chamber: Worktree Isolation Guarantees */}
        <g transform="translate(515, 510)">
          <rect
            x={0}
            y={0}
            width={415}
            height={200}
            rx={12}
            fill={BP.fillDark}
            stroke={BP.lineSoft}
            strokeWidth={2}
          />
          <text x={22} y={36} fill={BP.line} fontSize={15} fontWeight={800} letterSpacing={1.6}>
            CONTAINMENT BARRIER SPECS
          </text>
          <line x1={22} y1={48} x2={393} y2={48} stroke={BP.lineMuted} strokeWidth={1.5} />
          <text x={22} y={80} fill={BP.lineSoft} fontSize={13.5} fontWeight={700}>
            • ZERO UNCOMMITTED POLLUTION ON MAIN
          </text>
          <text x={22} y={112} fill={BP.lineSoft} fontSize={13.5} fontWeight={700}>
            • DEDICATED WORKING TREE & INDEX
          </text>
          <text x={22} y={144} fill={BP.lineSoft} fontSize={13.5} fontWeight={700}>
            • SPEC ARTIFACT LOCKED BEFORE BUILDER RUNS
          </text>
          <text x={22} y={176} fill={BP.cyan} fontSize={13.5} fontWeight={800}>
            • OUTPUT: factory/jobs/042/spec.md
          </text>
        </g>
      </g>

      {/* ===================================================================== */}
      {/* RIGHT VIEW: UNAMBIGUOUS ACCEPTANCE CRITERIA BLUEPRINT (x=1050..1790)  */}
      {/* ===================================================================== */}
      <g opacity={pSpecSheet} filter="url(#bp-glow)">
        <rect
          x={1050}
          y={180}
          width={740}
          height={585}
          rx={16}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={3}
        />
        {/* Header Bar */}
        <rect
          x={1050}
          y={180}
          width={740}
          height={64}
          fill="url(#bp-hatch-45)"
          stroke={BP.line}
          strokeWidth={2.5}
        />
        <rect
          x={1074}
          y={192}
          width={490}
          height={40}
          fill={BP.fillDark}
          stroke={BP.line}
          strokeWidth={1.8}
        />
        <text x={1094} y={217} fill={BP.line} fontSize={17} fontWeight={800} letterSpacing={2}>
          SPEC.MD // UNAMBIGUOUS ACCEPTANCE CRITERIA
        </text>
        <text x={1764} y={217} fill={BP.cyan} fontSize={14} fontWeight={800} textAnchor="end">
          6 CRITERIA
        </text>

        {/* 6 Acceptance Criteria Rows */}
        {criteriaList.map((ac, idx) => {
          const rowAppear = fadeIn(frame, 370 + idx * 55, 30);
          const ry = 272 + idx * 74;
          return (
            <g key={ac} opacity={rowAppear} transform={`translate(1082, ${ry})`}>
              <rect
                x={0}
                y={0}
                width={676}
                height={58}
                rx={8}
                fill={BP.fillDark}
                stroke={BP.lineSoft}
                strokeWidth={1.8}
              />
              {/* Blueprint Stamp Checkbox */}
              <rect
                x={16}
                y={15}
                width={28}
                height={28}
                rx={4}
                fill="rgba(125, 211, 252, 0.15)"
                stroke={BP.cyan}
                strokeWidth={2}
              />
              <text
                x={30}
                y={30}
                fill={BP.cyan}
                fontSize={13}
                fontWeight={800}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {`0${idx + 1}`}
              </text>
              <text x={60} y={34} fill={BP.line} fontSize={15} fontWeight={700}>
                {ac}
              </text>
            </g>
          );
        })}

        {/* Footer Sign-off bar inside Spec sheet */}
        <g opacity={fadeIn(frame, 700, 35)} transform="translate(1082, 718)">
          <text x={0} y={20} fill={BP.cyan} fontSize={14} fontWeight={800} letterSpacing={1.8}>
            VERIFICATION CONTRACT LOCKED // READY FOR AUTONOMOUS BUILDER STAGE
          </text>
        </g>
      </g>

      {/* Dimensions & Callouts */}
      <DimensionLine x1={130} y1={765} x2={980} y2={765} offset={36} label="850" progress={pDims} />
      <DimensionLine x1={1050} y1={765} x2={1790} y2={765} offset={36} label="740" progress={pDims} />

      <LeaderCallout
        px={590}
        py={290}
        ex={660}
        ey={305}
        tx={720}
        label="ISOLATION VALVE"
        sublabel="ZERO MAIN BRANCH RISK"
        progress={pDims}
      />

      <ViewLabel x={555} y={848} title="SECTION B-B // GIT WORKTREE" scale="SCALE 1:5" progress={pDims} />
      <ViewLabel x={1420} y={848} title="SPECIFICATION CONTRACT" scale="DWG SPEC-042" progress={pDims} />
    </svg>
  );
};

