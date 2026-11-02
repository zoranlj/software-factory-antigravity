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
 * Sheet 7 (85.3s - 104.0s, 1122 frames):
 * - 85.3s - 90.8s: "When every reviewer signs off with a passing verdict, the job enters the approve stage."
 * - 90.8s - 95.8s: "Full evidence logs and test results are summarized for complete auditability."
 * - 95.8s - 104.0s: "Once validated, the factory automatically merges the feature branch into main, cleans up the worktree, and closes the backlog item."
 */
export const Sheet7ApproveAndMerge: React.FC = () => {
  const frame = useCurrentFrame();

  const pDossier = drawProgress(frame, 0, 50);
  const pMerge = drawProgress(frame, 560, 50);
  const pDims = fadeIn(frame, 80, 35);

  const mergeActive = frame >= 630;
  const cleanupDone = frame >= 790;
  const backlogClosed = frame >= 920;

  const valveRotation = interpolate(frame, [620, 720], [0, 90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const evidenceRows = [
    { label: 'REVIEWER-CODE', val: 'PASS (Round 1) // 0 lint, 0 type errors' },
    { label: 'REVIEWER-UX', val: 'PASS (Round 1) // Keyboard & focus verified' },
    { label: 'REVIEWER-UI', val: 'PASS (Round 1) // Contrast 7.4:1 AAA verified' },
    { label: 'REVIEWER-SEC', val: 'PASS (Round 1) // 0 XSS / storage vulnerabilities' },
    { label: 'TEST SUITE', val: '5/5 specs passed (88ms) // 100% branch coverage' },
    { label: 'BROWSER EVIDENCE', val: '6/6 acceptance criteria screenshots archived' },
  ];

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {/* ===================================================================== */}
      {/* LEFT VIEW: APPROVE STAGE & AUDIT DOSSIER (x=130..900)                 */}
      {/* ===================================================================== */}
      <g opacity={pDossier} filter="url(#bp-glow)">
        <rect
          x={130}
          y={180}
          width={770}
          height={585}
          rx={16}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={3}
        />
        {/* Header Bar */}
        <rect
          x={130}
          y={180}
          width={770}
          height={64}
          fill="url(#bp-hatch-45)"
          stroke={BP.line}
          strokeWidth={2.4}
        />
        <rect
          x={154}
          y={192}
          width={490}
          height={40}
          fill={BP.fillDark}
          stroke={BP.line}
          strokeWidth={1.8}
        />
        <text x={174} y={217} fill={BP.line} fontSize={16.5} fontWeight={800} letterSpacing={1.8}>
          APPROVE STAGE // AUDITABLE EVIDENCE DOSSIER
        </text>
        <text x={874} y={217} fill={BP.cyan} fontSize={13.5} fontWeight={800} textAnchor="end">
          4/4 SIGNED OFF
        </text>

        {/* Subheader metadata */}
        <text x={162} y={276} fill={BP.cyan} fontSize={13.5} fontWeight={800} letterSpacing={1.5}>
          ARCHIVE PATH: factory/jobs/20261102-dark-mode/approve-summary.md
        </text>
        <line x1={162} y1={290} x2={868} y2={290} stroke={BP.lineSoft} strokeWidth={1.5} />

        {/* 6 Evidence Rows */}
        {evidenceRows.map((row, idx) => {
          const appear = fadeIn(frame, 40 + idx * 55, 30);
          const ry = 312 + idx * 62;
          return (
            <g key={row.label} opacity={appear} transform={`translate(162, ${ry})`}>
              <rect
                x={0}
                y={0}
                width={706}
                height={50}
                rx={6}
                fill={BP.fillDark}
                stroke={BP.lineSoft}
                strokeWidth={1.8}
              />
              <rect
                x={14}
                y={11}
                width={175}
                height={28}
                rx={4}
                fill="rgba(125, 211, 252, 0.16)"
                stroke={BP.cyan}
                strokeWidth={1.6}
              />
              <text
                x={101}
                y={26}
                fill={BP.cyan}
                fontSize={12.5}
                fontWeight={800}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {row.label}
              </text>
              <text x={208} y={30} fill={BP.line} fontSize={14} fontWeight={700}>
                {row.val}
              </text>
            </g>
          );
        })}

        {/* Approver Sign-off Stamp at Bottom of Dossier */}
        <g opacity={fadeIn(frame, 360, 35)} transform="translate(162, 694)">
          <rect
            x={0}
            y={0}
            width={706}
            height={48}
            rx={6}
            fill="rgba(125, 211, 252, 0.15)"
            stroke={BP.cyan}
            strokeWidth={2.2}
          />
          <text x={353} y={29} fill={BP.line} fontSize={15} fontWeight={800} letterSpacing={2} textAnchor="middle">
            APPROVER VERDICT: 6/6 ACCEPTANCE CRITERIA VALIDATED — CLEAR TO MERGE
          </text>
        </g>
      </g>

      {/* ===================================================================== */}
      {/* RIGHT VIEW: AUTOMATED GIT MERGE, WORKTREE CLEANUP & BACKLOG CLOSE     */}
      {/* ===================================================================== */}
      <g opacity={pMerge} filter="url(#bp-glow)">
        <rect
          x={960}
          y={180}
          width={830}
          height={585}
          rx={16}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={3}
        />
        <rect
          x={960}
          y={180}
          width={830}
          height={64}
          fill="url(#bp-hatch-45)"
          stroke={BP.line}
          strokeWidth={2.4}
        />
        <rect
          x={984}
          y={192}
          width={530}
          height={40}
          fill={BP.fillDark}
          stroke={BP.line}
          strokeWidth={1.8}
        />
        <text x={1004} y={217} fill={BP.line} fontSize={16.5} fontWeight={800} letterSpacing={1.8}>
          AUTOMATED GIT MERGE & DECOMMISSIONING PIPELINE
        </text>

        {/* STEP 1: Feature Branch Merge Valve into Main (y=275..420) */}
        <g transform="translate(994, 274)">
          <rect
            x={0}
            y={0}
            width={762}
            height={145}
            rx={10}
            fill={BP.fillDark}
            stroke={mergeActive ? BP.cyan : BP.lineSoft}
            strokeWidth={2.2}
          />
          <text x={24} y={32} fill={BP.cyan} fontSize={13.5} fontWeight={800} letterSpacing={1.6}>
            01 // AUTOMATED GIT MERGE INTO MAIN
          </text>

          {/* Main Trunk Line */}
          <line x1={40} y1={75} x2={720} y2={75} stroke={BP.line} strokeWidth={4} />
          {/* Feature Branch merging up into Main */}
          <path
            d="M 140 120 L 340 120 L 430 75"
            fill="none"
            stroke={BP.cyan}
            strokeWidth={3.5}
          />

          {/* Rotary Merge Valve at (385, 97) */}
          <g transform={`translate(385, 97) rotate(${valveRotation})`}>
            <circle cx={0} cy={0} r={20} fill={BP.fillSolid} stroke={BP.cyan} strokeWidth={2.5} />
            <line x1={-14} y1={0} x2={14} y2={0} stroke={BP.line} strokeWidth={3} />
          </g>

          {/* Commit nodes */}
          <circle cx={140} cy={75} r={10} fill={BP.fillDark} stroke={BP.line} strokeWidth={2.4} />
          <circle cx={430} cy={75} r={13} fill={mergeActive ? BP.cyan : BP.fillDark} stroke={BP.line} strokeWidth={2.6} />
          <circle cx={680} cy={75} r={10} fill={BP.fillDark} stroke={BP.line} strokeWidth={2.4} />

          <text x={455} y={115} fill={BP.line} fontSize={14} fontWeight={800}>
            git merge --no-ff feat/dark-mode -&gt; main (commit 8f4e2a1)
          </text>
        </g>

        {/* STEP 2: Worktree Sandbox Decommissioning (y=440..575) */}
        <g transform="translate(994, 440)">
          <rect
            x={0}
            y={0}
            width={762}
            height={130}
            rx={10}
            fill={BP.fillDark}
            stroke={cleanupDone ? BP.cyan : BP.lineSoft}
            strokeWidth={2.2}
          />
          <text x={24} y={34} fill={BP.cyan} fontSize={13.5} fontWeight={800} letterSpacing={1.6}>
            02 // ISOLATED WORKTREE SANDBOX CLEANUP
          </text>
          <text x={24} y={68} fill={BP.line} fontSize={15.5} fontWeight={700}>
            $ git worktree remove factory/worktrees/20261102-dark-mode
          </text>
          <text x={24} y={98} fill={BP.lineSoft} fontSize={13.5} fontWeight={700}>
            {cleanupDone
              ? 'STATUS: WORKTREE DECOMMISSIONED // 0 ORPHAN PROCESSES OR TEMP FILES'
              : 'STATUS: RECLAIMING SANDBOX FILESYSTEM...'}
          </text>
          <rect
            x={600}
            y={42}
            width={136}
            height={52}
            rx={6}
            fill={cleanupDone ? 'rgba(125, 211, 252, 0.18)' : BP.fillSolid}
            stroke={BP.cyan}
            strokeWidth={2}
          />
          <text x={668} y={73} fill={BP.cyan} fontSize={15} fontWeight={800} textAnchor="middle">
            {cleanupDone ? 'CLEANED ✓' : 'PURGING'}
          </text>
        </g>

        {/* STEP 3: Close Project Backlog Item (y=590..725) */}
        <g transform="translate(994, 590)">
          <rect
            x={0}
            y={0}
            width={762}
            height={135}
            rx={10}
            fill={BP.fillDark}
            stroke={backlogClosed ? BP.cyan : BP.lineSoft}
            strokeWidth={2.2}
          />
          <text x={24} y={34} fill={BP.cyan} fontSize={13.5} fontWeight={800} letterSpacing={1.6}>
            03 // ATOMIC BACKLOG ITEM CLOSURE (FACTORY/BACKLOG.MD)
          </text>
          <text x={24} y={70} fill={BP.line} fontSize={16} fontWeight={800}>
            {backlogClosed
              ? '- [x] Add dark mode toggle & theme persistence (merged: 8f4e2a1)'
              : '- [~] Add dark mode toggle & theme persistence (merging...)'}
          </text>
          <text x={24} y={102} fill={BP.lineSoft} fontSize={13.5} fontWeight={700}>
            BACKLOG SYNCHRONIZED // READY FOR NEXT /FACTORY CYCLE
          </text>
          <rect
            x={600}
            y={44}
            width={136}
            height={52}
            rx={6}
            fill={backlogClosed ? 'rgba(125, 211, 252, 0.18)' : BP.fillSolid}
            stroke={BP.cyan}
            strokeWidth={2}
          />
          <text x={668} y={75} fill={BP.cyan} fontSize={15} fontWeight={800} textAnchor="middle">
            {backlogClosed ? 'CLOSED [X]' : 'UPDATING'}
          </text>
        </g>
      </g>

      {/* Dimensions & Callouts */}
      <DimensionLine x1={130} y1={765} x2={900} y2={765} offset={36} label="770" progress={pDims} />
      <DimensionLine x1={960} y1={765} x2={1790} y2={765} offset={36} label="830" progress={pDims} />

      <LeaderCallout
        px={1424}
        py={349}
        ex={1495}
        ey={150}
        tx={1560}
        label="AUTOMATED MERGE VALVE"
        sublabel="FAST-FORWARD / NO-FF GUARD"
        progress={pMerge}
      />

      <ViewLabel x={515} y={848} title="APPROVAL & EVIDENCE DOSSIER" scale="SECTION C-C" progress={pDims} />
      <ViewLabel x={1375} y={848} title="GIT MERGE & CLEANUP PIPELINE" scale="SCALE 1:5" progress={pDims} />
    </svg>
  );
};

