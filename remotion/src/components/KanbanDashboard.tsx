import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { TimelineSnapshot } from '../data/factoryTimeline';
import {
  AGENT_COLORS,
  calcCost,
  formatCost,
  formatNum,
  JobState,
  ReviewMap,
  STAGES,
  THEME,
  Verdict,
} from '../theme';

const REVIEWER_KEYS: [keyof ReviewMap, string][] = [
  ['security', 'sec'],
  ['ux', 'ux'],
  ['ui', 'ui'],
  ['code', 'code'],
];

const RoundRow: React.FC<{ roundNum: number; reviews: ReviewMap; waiting: boolean }> = ({
  roundNum,
  reviews,
  waiting,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
      <span
        style={{
          fontFamily: THEME.fontMono,
          fontSize: 10.5,
          color: THEME.faint,
          width: 22,
          fontWeight: 600,
        }}
      >
        R{roundNum}
      </span>
      {REVIEWER_KEYS.map(([key, short]) => {
        const v: Verdict = reviews[key];
        let bg: string = 'transparent';
        let border: string = `1px dashed ${THEME.faint}`;
        let color: string = THEME.faint;

        if (v === 'PASS') {
          bg = 'rgba(80, 250, 123, 0.16)';
          border = '1px solid rgba(80, 250, 123, 0.45)';
          color = THEME.pass;
        } else if (v === 'CHANGES') {
          bg = 'rgba(255, 184, 108, 0.18)';
          border = '1px solid rgba(255, 184, 108, 0.55)';
          color = THEME.changes;
        } else if (waiting) {
          border = `1px dashed ${THEME.active}`;
          color = THEME.active;
        }

        return (
          <span
            key={key}
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: THEME.fontMono,
              fontSize: 10.5,
              fontWeight: v === 'pending' ? 500 : 700,
              padding: '2px 0',
              borderRadius: 4,
              background: bg,
              border,
              color,
            }}
          >
            {short}
          </span>
        );
      })}
    </div>
  );
};

const JobCardView: React.FC<{ job: JobState; frame: number; fps: number }> = ({ job, frame, fps }) => {
  const isLive = ['spec', 'build', 'review', 'approve'].includes(job.stage);
  const isHuman = job.stage === 'needs-human';
  const isMerged = job.stage === 'merged';
  const [num, ...slugParts] = job.id.split('-');
  const slug = slugParts.join('-');

  const tokCount = formatNum(job.tokens.total);
  const tokCost = formatCost(calcCost(job.tokens.prompt, job.tokens.completion));

  const cardPop = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  const pulseOpacity = interpolate(Math.sin(frame * 0.22), [-1, 1], [0.35, 1]);

  let borderColor: string = THEME.line;
  let boxShadow: string = 'none';
  if (job.reworkPulse) {
    borderColor = THEME.changes;
    boxShadow = `0 0 24px rgba(255, 184, 108, 0.35), 0 0 0 1px ${THEME.changes}`;
  } else if (job.highlight && isLive) {
    borderColor = THEME.active;
    boxShadow = `0 10px 28px rgba(139, 233, 253, 0.2), 0 0 0 1px rgba(139, 233, 253, 0.45)`;
  } else if (job.highlight && isMerged) {
    borderColor = THEME.merged;
    boxShadow = `0 10px 28px rgba(189, 147, 249, 0.25), 0 0 0 1px ${THEME.merged}`;
  } else if (isHuman) {
    borderColor = THEME.human;
    boxShadow = `0 8px 24px -10px rgba(255, 121, 198, 0.45)`;
  } else if (isLive) {
    borderColor = 'rgba(139, 233, 253, 0.35)';
  }

  return (
    <div
      style={{
        background: job.highlight ? '#252836' : THEME.card,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 10,
        padding: '12px 13px 11px',
        marginBottom: 12,
        opacity: isMerged && !job.highlight ? 0.8 : cardPop,
        boxShadow,
        position: 'relative',
      }}
    >
      {/* Top Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        {isLive && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: job.reworkPulse ? THEME.changes : THEME.active,
              boxShadow: `0 0 8px ${job.reworkPulse ? THEME.changes : THEME.active}`,
              opacity: pulseOpacity,
            }}
          />
        )}
        <span
          style={{
            fontFamily: THEME.fontMono,
            fontSize: 12,
            color: job.highlight ? THEME.text : THEME.muted,
            fontWeight: job.highlight ? 700 : 500,
          }}
        >
          {num} · {slug}
        </span>
        {job.highlight && (
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: THEME.fontMono,
              fontSize: 9.5,
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 4,
              background: job.reworkPulse
                ? 'rgba(255, 184, 108, 0.2)'
                : 'rgba(139, 233, 253, 0.16)',
              color: job.reworkPulse ? THEME.changes : THEME.active,
            }}
          >
            {job.reworkPulse ? 'REWORK R1→R2' : 'SPOTLIGHT'}
          </span>
        )}
        {isHuman && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: THEME.human,
            }}
          >
            YOUR CALL
          </span>
        )}
      </div>

      {/* Feature Title */}
      <div
        style={{
          fontSize: 13.5,
          fontWeight: job.highlight ? 600 : 500,
          lineHeight: 1.38,
          color: THEME.text,
          marginBottom: 8,
        }}
      >
        {job.feature}
      </div>

      {/* Branch & Token Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: THEME.fontMono,
            fontSize: 11,
            color: THEME.faint,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {job.branch}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: THEME.fontMono,
            fontSize: 10.5,
            color: THEME.tok,
            background: 'rgba(241, 250, 140, 0.12)',
            padding: '2px 6px',
            borderRadius: 4,
            flexShrink: 0,
          }}
        >
          🪙 {tokCount} ({tokCost})
        </span>
      </div>

      {/* Active Agent Pills */}
      {job.active_agents.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 9 }}>
          {job.active_agents.map((ag) => {
            const agColor = AGENT_COLORS[ag] || THEME.active;
            return (
              <span
                key={ag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontFamily: THEME.fontMono,
                  fontSize: 10,
                  fontWeight: 600,
                  color: agColor,
                  background: `${agColor}1f`,
                  border: `1px solid ${agColor}4d`,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: agColor,
                    opacity: pulseOpacity,
                  }}
                />
                {ag}
              </span>
            );
          })}
        </div>
      )}

      {/* Review Rounds Chips */}
      {job.round > 0 && (
        <div style={{ marginTop: 9 }}>
          {job.pastRounds.map((pr, idx) => (
            <RoundRow key={idx} roundNum={idx + 1} reviews={pr} waiting={false} />
          ))}
          <RoundRow
            roundNum={job.round}
            reviews={job.reviews}
            waiting={job.stage === 'review'}
          />
        </div>
      )}

      {/* Needs Human Hint */}
      {isHuman && (
        <div
          style={{
            marginTop: 10,
            paddingTop: 8,
            borderTop: `1px solid ${THEME.line}`,
            fontFamily: THEME.fontMono,
            fontSize: 10.5,
            color: THEME.muted,
            lineHeight: 1.55,
          }}
        >
          /factory approve {job.id}
          <br />
          /factory rework {job.id} …
        </div>
      )}
    </div>
  );
};

export const KanbanDashboard: React.FC<{ snapshot: TimelineSnapshot }> = ({ snapshot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compute global header metrics
  let totalTokens = 0;
  let promptTokens = 0;
  let completionTokens = 0;
  let activeAgentCount = 0;

  for (const job of snapshot.jobs) {
    totalTokens += job.tokens.total;
    promptTokens += job.tokens.prompt;
    completionTokens += job.tokens.completion;
    activeAgentCount += job.active_agents.length;
  }

  const totalCost = calcCost(promptTokens, completionTokens);

  // Subtle camera focus choreography per stage
  let camScale = 1;
  let camX = 0;
  let camY = 0;

  if (frame >= 185 && frame < 340) {
    // Focus slightly toward Spec & Build columns on left
    const p = interpolate(frame, [185, 220, 315, 340], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    camScale = interpolate(p, [0, 1], [1, 1.07]);
    camX = interpolate(p, [0, 1], [0, 110]);
    camY = interpolate(p, [0, 1], [0, 18]);
  } else if (frame >= 340 && frame < 540) {
    // Focus on Build column
    const p = interpolate(frame, [340, 375, 510, 540], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    camScale = interpolate(p, [0, 1], [1, 1.06]);
    camX = interpolate(p, [0, 1], [0, 60]);
    camY = interpolate(p, [0, 1], [0, 15]);
  } else if (frame >= 1320 && frame < 1465) {
    // Focus on Approve -> Merged columns
    const p = interpolate(frame, [1320, 1350, 1440, 1465], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    camScale = interpolate(p, [0, 1], [1, 1.06]);
    camX = interpolate(p, [0, 1], [0, -70]);
    camY = interpolate(p, [0, 1], [0, 15]);
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 84,
        left: 0,
        right: 0,
        bottom: 245,
        overflow: 'hidden',
        padding: '12px 32px 20px',
      }}
    >
      <div
        style={{
          transform: `translate(${camX}px, ${camY}px) scale(${camScale})`,
          transformOrigin: 'center top',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Dashboard Header Replica */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            paddingBottom: 14,
            borderBottom: `1px solid ${THEME.line}`,
            marginBottom: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 21,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: THEME.text,
                }}
              >
                Software factory
              </h1>

              {/* Token & Cost Metric Chip */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  fontFamily: THEME.fontMono,
                  fontSize: 12,
                  padding: '5px 12px',
                  background: THEME.panel,
                  border: '1px solid rgba(241, 250, 140, 0.35)',
                  borderRadius: 6,
                  color: THEME.text,
                }}
              >
                <span>🪙</span>
                <span>
                  Tokens: <strong style={{ color: THEME.tok }}>{formatNum(totalTokens)}</strong>
                </span>
                <span style={{ color: THEME.faint, fontSize: 11 }}>
                  (in: {formatNum(promptTokens)} · out: {formatNum(completionTokens)})
                </span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span style={{ fontSize: 11, color: THEME.muted }}>
                  Cost: <strong style={{ color: THEME.pass }}>{formatCost(totalCost)}</strong>
                </span>
              </div>

              {/* Active Agents Metric Chip */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  fontFamily: THEME.fontMono,
                  fontSize: 12,
                  padding: '5px 12px',
                  background: THEME.panel,
                  border: `1px solid ${activeAgentCount > 0 ? 'rgba(139, 233, 253, 0.4)' : THEME.line}`,
                  borderRadius: 6,
                  color: activeAgentCount > 0 ? THEME.active : THEME.muted,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: activeAgentCount > 0 ? THEME.active : THEME.faint,
                    boxShadow: activeAgentCount > 0 ? `0 0 8px ${THEME.active}` : 'none',
                  }}
                />
                <span>{activeAgentCount} agents active</span>
              </div>
            </div>

            <div
              style={{
                fontFamily: THEME.fontMono,
                fontSize: 12,
                color: THEME.muted,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: THEME.pass,
                }}
              />
              jobs/ · polling live (2000ms)
            </div>
          </div>

          {/* Slash Command Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: THEME.fontMono, fontSize: 11 }}>
            {[
              '/factory <feature>',
              '/factory next',
              '/factory sync-issues',
              '/factory approve <job-id>',
              '/factory rework <job-id> <note>',
            ].map((cmd) => (
              <span
                key={cmd}
                style={{
                  background: THEME.panel,
                  border: `1px solid ${THEME.line}`,
                  borderRadius: 6,
                  padding: '3px 9px',
                  color: THEME.muted,
                }}
              >
                {cmd}
              </span>
            ))}
          </div>
        </div>

        {/* 6-Column Kanban Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: 14,
            alignItems: 'start',
          }}
        >
          {STAGES.map((stage) => {
            const colJobs = snapshot.jobs
              .filter((j) => j.stage === stage.key)
              .slice()
              .reverse();
            const isHumanCol = stage.key === 'needs-human';
            const isMergedCol = stage.key === 'merged';

            return (
              <div key={stage.key} style={{ minWidth: 0 }}>
                {/* Column Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '0 2px 10px',
                    borderBottom: `1px solid ${
                      isHumanCol ? 'rgba(255, 121, 198, 0.55)' : THEME.line
                    }`,
                    marginBottom: 12,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: isHumanCol
                        ? THEME.human
                        : isMergedCol
                        ? THEME.merged
                        : THEME.text,
                    }}
                  >
                    {stage.label}
                  </h2>
                  <span
                    style={{
                      fontSize: 11,
                      color: THEME.faint,
                      fontFamily: THEME.fontMono,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {stage.who}
                  </span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontFamily: THEME.fontMono,
                      fontSize: 11.5,
                      color: THEME.muted,
                    }}
                  >
                    {colJobs.length || ''}
                  </span>
                </div>

                {/* Column Cards */}
                {colJobs.length === 0 ? (
                  <div style={{ color: THEME.faint, fontSize: 12, padding: '4px 2px' }}>—</div>
                ) : (
                  colJobs.map((j) => (
                    <JobCardView key={j.id} job={j} frame={frame} fps={fps} />
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
