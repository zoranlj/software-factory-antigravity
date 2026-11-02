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
 * Sheet 2 (11.4s - 26.2s, 888 frames):
 * - 11.4s - 14.2s: "It all starts in your project backlog."
 * - 14.2s - 19.8s: "When you type /factory next, the Factory Orchestrator springs to life."
 * - 19.8s - 26.2s: "It reads the top pending task from your backlog and claims it with zero manual overhead."
 */
export const Sheet2BacklogOrchestrator: React.FC = () => {
  const frame = useCurrentFrame();

  const pBacklog = drawProgress(frame, 0, 45);
  const pTerminal = drawProgress(frame, 140, 40);
  const pOrchestrator = drawProgress(frame, 220, 50);
  const pDims = fadeIn(frame, 60, 35);

  // Typing "/factory next" between frames 165 and 230
  const cmdText = '/factory next';
  const typedChars = Math.floor(
    interpolate(frame, [165, 225], [0, cmdText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const cmdTriggered = frame >= 235;

  // Task #01 extraction & transfer from Backlog (x=370, y=315) to Orchestrator Intake (x=1395, y=455)
  const claimProgress = interpolate(frame, [500, 660], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Rotor angle inside Orchestrator turbine
  const rotorAngle = cmdTriggered ? (frame - 235) * 2.2 : 0;

  const backlogItems = [
    {
      id: 'ITEM #01',
      status: claimProgress > 0.4 ? '[CLAIMED -> JOB-042]' : '[PENDING // TOP]',
      title: 'Add dark mode toggle & theme persistence',
      priority: 'PRI: HIGH // EST: 42K TOK',
      isTop: true,
    },
    {
      id: 'ITEM #02',
      status: '[PENDING]',
      title: 'Implement OAuth2 PKCE session refresh',
      priority: 'PRI: MED // EST: 58K TOK',
      isTop: false,
    },
    {
      id: 'ITEM #03',
      status: '[PENDING]',
      title: 'Add CSV export to telemetry table',
      priority: 'PRI: LOW // EST: 31K TOK',
      isTop: false,
    },
    {
      id: 'ITEM #04',
      status: '[DONE // MERGED]',
      title: 'Add USD cost indicator for token usage',
      priority: 'COMMIT: e1c660b',
      isTop: false,
    },
  ];

  const cardOffsetX = interpolate(claimProgress, [0, 1], [0, 995]);
  const cardOffsetY = interpolate(claimProgress, [0, 0.5, 1], [0, -70, 125]);

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {/* ===================================================================== */}
      {/* LEFT VIEW: PROJECT BACKLOG MAGAZINE (x=130..610, center=370)          */}
      {/* ===================================================================== */}
      <g opacity={pBacklog} filter="url(#bp-glow)">
        {/* Outer Hopper Frame */}
        <rect
          x={130}
          y={190}
          width={480}
          height={570}
          rx={14}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={3}
        />
        {/* Header Bar */}
        <rect
          x={130}
          y={190}
          width={480}
          height={54}
          fill="url(#bp-hatch-45)"
          stroke={BP.line}
          strokeWidth={2.4}
        />
        <rect x={148} y={200} width={310} height={34} fill={BP.fillDark} stroke={BP.line} strokeWidth={1.6} />
        <text x={164} y={222} fill={BP.line} fontSize={16} fontWeight={800} letterSpacing={2}>
          FACTORY/BACKLOG.MD
        </text>
        <text x={590} y={222} fill={BP.cyan} fontSize={13} fontWeight={700} textAnchor="end">
          FIFO QUEUE
        </text>

        {/* Internal Guide Rails */}
        <line x1={154} y1={254} x2={154} y2={740} stroke={BP.lineMuted} strokeWidth={1.5} strokeDasharray="8 6" />
        <line x1={586} y1={254} x2={586} y2={740} stroke={BP.lineMuted} strokeWidth={1.5} strokeDasharray="8 6" />

        {/* Backlog Task Slots */}
        {backlogItems.map((item, idx) => {
          const slotY = 270 + idx * 116;
          return (
            <g key={item.id}>
              {/* Ghost slot outline */}
              <rect
                x={168}
                y={slotY}
                width={404}
                height={96}
                rx={8}
                fill={BP.fillDark}
                stroke={BP.lineMuted}
                strokeWidth={1.4}
                strokeDasharray="6 4"
              />
              {/* Render static card if not top item, or if top item hasn't moved yet */}
              {!item.isTop && (
                <g transform={`translate(168, ${slotY})`}>
                  <rect
                    x={0}
                    y={0}
                    width={404}
                    height={96}
                    rx={8}
                    fill={BP.fillSolid}
                    stroke={BP.lineSoft}
                    strokeWidth={2}
                  />
                  <text x={18} y={28} fill={BP.cyan} fontSize={13} fontWeight={800} letterSpacing={1.4}>
                    {`${item.id}  ${item.status}`}
                  </text>
                  <text x={18} y={54} fill={BP.line} fontSize={15} fontWeight={700}>
                    {item.title}
                  </text>
                  <text x={18} y={78} fill={BP.lineSoft} fontSize={12} fontWeight={600} letterSpacing={1.2}>
                    {item.priority}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* ===================================================================== */}
      {/* CENTER VIEW: CLI COMMAND CONSOLE & ACTUATION CONDUIT (x=680..1180)    */}
      {/* ===================================================================== */}
      <g opacity={pTerminal} filter="url(#bp-glow)">
        {/* Centerline */}
        <line
          x1={930}
          y1={160}
          x2={930}
          y2={780}
          stroke={BP.lineMuted}
          strokeWidth={1.2}
          strokeDasharray="14 6 4 6"
        />

        {/* Command Input Unit Box */}
        <rect
          x={680}
          y={220}
          width={500}
          height={170}
          rx={12}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.8}
        />
        <line x1={680} y1={262} x2={1180} y2={262} stroke={BP.line} strokeWidth={2} />
        <text x={702} y={247} fill={BP.lineSoft} fontSize={13} fontWeight={700} letterSpacing={1.8}>
          AGY TERMINAL // COMMAND TRIGGER UNIT
        </text>

        {/* Prompt line */}
        <rect
          x={704}
          y={284}
          width={452}
          height={54}
          rx={6}
          fill={BP.fillDark}
          stroke={cmdTriggered ? BP.cyan : BP.lineSoft}
          strokeWidth={2.2}
        />
        <text x={724} y={318} fill={BP.cyan} fontSize={22} fontWeight={800} letterSpacing={1.5}>
          {`$ ${cmdText.slice(0, typedChars)}${frame % 30 < 15 ? '█' : ''}`}
        </text>

        {/* Status Pill under prompt */}
        <text x={706} y={368} fill={cmdTriggered ? BP.cyan : BP.lineSoft} fontSize={13} fontWeight={700} letterSpacing={1.5}>
          {cmdTriggered
            ? 'STATUS: SIGNAL DISPATCHED -> ORCHESTRATOR ACTIVE'
            : 'STATUS: AWAITING OPERATOR /FACTORY TRIGGER'}
        </text>

        {/* Pneumatic / Electrical Signal Conduit from Backlog -> Orchestrator */}
        <path
          d="M 610 318 L 680 318 M 1180 318 L 1255 318"
          fill="none"
          stroke={cmdTriggered ? BP.cyan : BP.lineSoft}
          strokeWidth={3}
        />

        {/* Lower Telemetry Bridge: Zero Manual Overhead Verification */}
        <rect
          x={680}
          y={450}
          width={500}
          height={230}
          rx={12}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.6}
        />
        <text x={704} y={486} fill={BP.cyan} fontSize={14} fontWeight={800} letterSpacing={1.8}>
          CLAIM SEQUENCE SPECIFICATION // ZERO OVERHEAD
        </text>
        <line x1={704} y1={500} x2={1156} y2={500} stroke={BP.lineSoft} strokeWidth={1.5} />

        {[
          { step: '01. PARSE', desc: 'Scan factory/backlog.md for top [ ] task', active: frame >= 260 },
          { step: '02. LOCK', desc: 'Mark item [~] in-progress atomically', active: frame >= 420 },
          { step: '03. ASSIGN', desc: 'Allocate Job ID #JOB-042 & route to Spec', active: frame >= 530 },
          { step: '04. OVERHEAD', desc: 'Manual copy-paste / ticket triage = 0.0s', active: frame >= 600 },
        ].map((row, i) => (
          <g key={row.step} transform={`translate(704, ${526 + i * 36})`}>
            <rect
              x={0}
              y={-14}
              width={18}
              height={18}
              fill={row.active ? BP.cyan : 'none'}
              stroke={BP.line}
              strokeWidth={1.8}
            />
            {row.active && (
              <path d="M 3 -5 L 8 0 L 15 -10" fill="none" stroke={BP.bgDeep} strokeWidth={2.5} />
            )}
            <text x={30} y={0} fill={BP.line} fontSize={13.5} fontWeight={800} letterSpacing={1}>
              {row.step}
            </text>
            <text x={155} y={0} fill={BP.lineSoft} fontSize={13.5} fontWeight={600}>
              {row.desc}
            </text>
          </g>
        ))}
      </g>

      {/* ===================================================================== */}
      {/* RIGHT VIEW: FACTORY ORCHESTRATOR TURBINE & INTAKE (x=1255..1790)      */}
      {/* ===================================================================== */}
      <g opacity={pOrchestrator} filter="url(#bp-glow)">
        {/* Outer Sectioned Housing */}
        <rect
          x={1255}
          y={190}
          width={535}
          height={570}
          rx={24}
          fill="url(#bp-hatch-45)"
          stroke={BP.line}
          strokeWidth={3}
        />
        <rect
          x={1279}
          y={214}
          width={487}
          height={522}
          rx={14}
          fill={BP.fillSolid}
          stroke={BP.line}
          strokeWidth={2.4}
        />

        {/* Rotating Orchestrator Turbine at Top Right */}
        <g transform="translate(1522, 330)">
          <circle cx={0} cy={0} r={82} fill={BP.fillDark} stroke={BP.line} strokeWidth={2.8} />
          <circle cx={0} cy={0} r={62} fill="none" stroke={BP.lineSoft} strokeWidth={1.6} strokeDasharray="8 6" />
          <g transform={`rotate(${rotorAngle})`}>
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line
                key={deg}
                x1={0}
                y1={-60}
                x2={0}
                y2={60}
                stroke={cmdTriggered ? BP.cyan : BP.lineSoft}
                strokeWidth={2.2}
                transform={`rotate(${deg})`}
              />
            ))}
            <circle cx={0} cy={0} r={24} fill="url(#bp-crosshatch)" stroke={BP.line} strokeWidth={2.4} />
          </g>
          <circle cx={0} cy={0} r={9} fill={cmdTriggered ? BP.cyan : BP.line} />
        </g>

        {/* Active Job Claim Bay (Receives the moving Task #01 card) */}
        <rect
          x={1320}
          y={442}
          width={404}
          height={108}
          rx={10}
          fill={BP.fillDark}
          stroke={BP.cyan}
          strokeWidth={2.2}
          strokeDasharray="10 6"
        />
        <text
          x={1522}
          y={502}
          fill={BP.lineMuted}
          fontSize={14}
          fontWeight={700}
          letterSpacing={2}
          textAnchor="middle"
        >
          ACTIVE JOB CHAMBER // SLOT #01
        </text>

        {/* Zero Manual Overhead Telemetry Readout */}
        <g transform="translate(1320, 582)">
          <rect
            x={0}
            y={0}
            width={404}
            height={120}
            rx={8}
            fill={BP.fillDark}
            stroke={BP.lineSoft}
            strokeWidth={2}
          />
          <text x={20} y={32} fill={BP.lineSoft} fontSize={12.5} fontWeight={700} letterSpacing={1.6}>
            ORCHESTRATOR DISPATCH TELEMETRY
          </text>
          <text x={20} y={66} fill={BP.line} fontSize={22} fontWeight={800} letterSpacing={1.5}>
            MANUAL OVERHEAD: 0.00 MS
          </text>
          <text x={20} y={96} fill={BP.cyan} fontSize={14} fontWeight={700} letterSpacing={1.4}>
            {claimProgress > 0.8
              ? 'STATE: TASK CLAIMED -> SPAWNING WORKTREE'
              : 'STATE: LOCKING TOP BACKLOG ENTRY'}
          </text>
        </g>
      </g>

      {/* ===================================================================== */}
      {/* ANIMATED TOP TASK CARD #01 TRAVELING FROM BACKLOG TO ORCHESTRATOR     */}
      {/* ===================================================================== */}
      <g
        opacity={pBacklog}
        transform={`translate(${168 + cardOffsetX}, ${270 + cardOffsetY})`}
        filter="url(#bp-glow)"
      >
        <rect
          x={0}
          y={0}
          width={404}
          height={96}
          rx={8}
          fill={BP.fillSolid}
          stroke={BP.cyan}
          strokeWidth={3}
        />
        <rect x={0} y={0} width={10} height={96} fill={BP.cyan} />
        <text x={22} y={28} fill={BP.cyan} fontSize={13} fontWeight={800} letterSpacing={1.5}>
          {claimProgress > 0.5 ? 'ITEM #01 // CLAIMED BY ORCHESTRATOR' : 'ITEM #01 // TOP PENDING TASK'}
        </text>
        <text x={22} y={54} fill={BP.line} fontSize={15.5} fontWeight={800}>
          Add dark mode toggle & theme persistence
        </text>
        <text x={22} y={78} fill={BP.lineSoft} fontSize={12.5} fontWeight={700} letterSpacing={1.2}>
          JOB-ID: 20261102-DARK-MODE // ZERO OVERHEAD
        </text>
      </g>

      {/* Trajectory Arch Dashed Line when claiming */}
      {claimProgress > 0.05 && (
        <path
          d="M 370 270 Q 930 140 1522 442"
          fill="none"
          stroke={BP.cyan}
          strokeWidth={2}
          strokeDasharray="8 6"
        />
      )}

      {/* Dimensions & Callouts */}
      <DimensionLine x1={130} y1={760} x2={610} y2={760} offset={36} label="480" progress={pDims} />
      <DimensionLine x1={680} y1={680} x2={1180} y2={680} offset={36} label="500" progress={pDims} />
      <DimensionLine x1={1255} y1={760} x2={1790} y2={760} offset={36} label="535" progress={pDims} />

      <LeaderCallout
        px={1585}
        py={280}
        ex={1645}
        ey={150}
        tx={1700}
        label="FACTORY ORCHESTRATOR"
        sublabel="AUTONOMOUS DISPATCH ENGINE"
        progress={pOrchestrator}
      />

      <ViewLabel x={370} y={848} title="PROJECT BACKLOG" scale="SCALE 1:5" progress={pDims} />
      <ViewLabel x={930} y={848} title="CLI TRIGGER CONDUIT" scale="SCALE 1:2" progress={pDims} />
      <ViewLabel x={1522} y={848} title="ORCHESTRATOR INTAKE" scale="SECTION A-B" progress={pDims} />
    </svg>
  );
};

