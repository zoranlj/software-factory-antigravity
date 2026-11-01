import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ReviewerLaneState, TimelineSnapshot } from '../data/factoryTimeline';
import { THEME } from '../theme';

const LaneCard: React.FC<{ lane: ReviewerLaneState; index: number }> = ({ lane, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - index * 4,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  const isPass = lane.verdict === 'PASS';
  const isChanges = lane.verdict === 'CHANGES';
  const borderCol = isChanges
    ? THEME.changes
    : isPass
    ? THEME.pass
    : lane.color;

  return (
    <div
      style={{
        background: 'rgba(26, 28, 36, 0.96)',
        border: `1.5px solid ${borderCol}`,
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: isChanges
          ? '0 0 28px rgba(255, 184, 108, 0.28)'
          : isPass
          ? '0 0 20px rgba(80, 250, 123, 0.16)'
          : '0 12px 28px rgba(0,0,0,0.45)',
        transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
        opacity: enter,
      }}
    >
      {/* Lane Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: lane.color,
              boxShadow: `0 0 8px ${lane.color}`,
            }}
          />
          <span
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 13,
              fontWeight: 700,
              color: lane.color,
            }}
          >
            {lane.id}
          </span>
          {lane.port && (
            <span
              style={{
                fontFamily: THEME.fontMono,
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 4,
                background: 'rgba(139, 233, 253, 0.12)',
                color: THEME.active,
                border: '1px solid rgba(139, 233, 253, 0.3)',
              }}
            >
              browser :{lane.port}
            </span>
          )}
        </div>

        {/* Verdict Pill */}
        <span
          style={{
            fontFamily: THEME.fontMono,
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 5,
            background: isPass
              ? 'rgba(80, 250, 123, 0.16)'
              : isChanges
              ? 'rgba(255, 184, 108, 0.2)'
              : 'rgba(255, 255, 255, 0.06)',
            color: isPass ? THEME.pass : isChanges ? THEME.changes : THEME.muted,
            border: `1px solid ${
              isPass ? THEME.pass : isChanges ? THEME.changes : THEME.line
            }`,
          }}
        >
          {lane.verdict === 'pending'
            ? `AUDITING ${Math.round(lane.progress * 100)}%`
            : `VERDICT: ${lane.verdict}`}
        </span>
      </div>

      {/* Subtitle */}
      <div style={{ fontSize: 12, color: THEME.muted, fontFamily: THEME.fontSans }}>
        {lane.taskText}
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: 5,
          borderRadius: 3,
          background: THEME.line,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.round(lane.progress * 100)}%`,
            height: '100%',
            background: isChanges ? THEME.changes : isPass ? THEME.pass : lane.color,
          }}
        />
      </div>

      {/* Evidence Lines */}
      <div
        style={{
          background: THEME.terminalBg,
          border: `1px solid ${THEME.terminalLine}`,
          borderRadius: 8,
          padding: '8px 10px',
          fontFamily: THEME.fontMono,
          fontSize: 11,
          lineHeight: 1.55,
          color: THEME.text,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {lane.evidenceLines.map((line, i) => {
          const showThreshold = (i + 1) * 0.28;
          const visible = lane.progress >= showThreshold;
          const isErrLine = line.startsWith('✗') || line.startsWith('→');
          return (
            <div
              key={i}
              style={{
                opacity: visible ? 1 : 0.2,
                color: isErrLine ? THEME.changes : line.startsWith('✓') ? '#d6deeb' : THEME.muted,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ParallelReviewArena: React.FC<{ snapshot: TimelineSnapshot }> = ({ snapshot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Render either the 4-Lane Parallel Review Arena OR the Rework Loop Banner
  if (!snapshot.reviewArena.visible && !snapshot.reworkBanner.visible) {
    return null;
  }

  if (snapshot.reworkBanner.visible) {
    const enter = spring({
      frame: frame - 990,
      fps,
      config: { damping: 15, stiffness: 120 },
    });

    return (
      <div
        style={{
          position: 'absolute',
          right: 36,
          bottom: 265,
          width: 820,
          zIndex: 75,
          background: 'rgba(20, 21, 27, 0.96)',
          border: `2px solid ${THEME.changes}`,
          borderRadius: 14,
          padding: '18px 22px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7), 0 0 32px rgba(255, 184, 108, 0.22)',
          transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
          opacity: enter,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontFamily: THEME.fontMono,
                fontSize: 12,
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 5,
                background: 'rgba(255, 184, 108, 0.2)',
                color: THEME.changes,
                border: `1px solid ${THEME.changes}`,
              }}
            >
              ↺ AUTONOMOUS REWORK · RESUME 1 OF 2
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: THEME.text }}>
              Builder auto-resumed to resolve Round 1 UI finding
            </span>
          </div>
          <span style={{ fontFamily: THEME.fontMono, fontSize: 11.5, color: THEME.active }}>
            branch: factory/004-oauth-pkce-flow
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginTop: 8,
          }}
        >
          {/* Finding from reviewer-ui */}
          <div
            style={{
              background: THEME.terminalBg,
              border: `1px solid ${THEME.line}`,
              borderRadius: 8,
              padding: '10px 12px',
              fontFamily: THEME.fontMono,
              fontSize: 11.5,
            }}
          >
            <div style={{ color: THEME.changes, fontWeight: 700, marginBottom: 4 }}>
              round-1/review-ui.md (VERDICT: CHANGES)
            </div>
            <div style={{ color: THEME.muted, lineHeight: 1.5 }}>
              Mobile 375×812 audit via browser_subagent on port 5141:
              <br />
              <span style={{ color: THEME.text }}>
                .oauth-btn:focus-visible lacks visible 2px focus ring token.
              </span>
            </div>
          </div>

          {/* Live Git Diff Patch by builder */}
          <div
            style={{
              background: THEME.terminalBg,
              border: `1px solid ${THEME.pass}`,
              borderRadius: 8,
              padding: '10px 12px',
              fontFamily: THEME.fontMono,
              fontSize: 11.5,
            }}
          >
            <div style={{ color: THEME.active, fontWeight: 700, marginBottom: 4 }}>
              builder patch · src/styles/oauth.css
            </div>
            <div style={{ color: '#ff79c6' }}>- .oauth-btn:focus-visible {'{ outline: none; }'}</div>
            <div style={{ color: THEME.pass }}>
              + .oauth-btn:focus-visible {'{ outline: 2px solid var(--active); outline-offset: 2px; }'}
            </div>
            <div style={{ color: THEME.muted, marginTop: 4, fontSize: 10.5 }}>
              ✓ 52/52 tests pass · STATUS: READY → Triggering Review Round 2
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4-Lane Parallel Review Arena Overlay
  const arenaStartFrame = snapshot.reviewArena.round === 1 ? 555 : 1170;
  const arenaEnter = spring({
    frame: frame - arenaStartFrame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        right: 32,
        bottom: 256,
        width: 1140,
        zIndex: 75,
        background: 'rgba(16, 18, 24, 0.95)',
        border: `1.5px solid ${
          snapshot.reviewArena.round === 2 ? THEME.pass : THEME.active
        }`,
        borderRadius: 16,
        padding: '16px 20px',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.72)',
        transform: `translateY(${interpolate(arenaEnter, [0, 1], [28, 0])}px) scale(${interpolate(
          arenaEnter,
          [0, 1],
          [0.96, 1]
        )})`,
        opacity: arenaEnter,
      }}
    >
      {/* Arena Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 11.5,
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: 5,
              background:
                snapshot.reviewArena.round === 2
                  ? 'rgba(80, 250, 123, 0.16)'
                  : 'rgba(139, 233, 253, 0.16)',
              color: snapshot.reviewArena.round === 2 ? THEME.pass : THEME.active,
              border: `1px solid ${
                snapshot.reviewArena.round === 2 ? THEME.pass : THEME.active
              }`,
            }}
          >
            4× PARALLEL REVIEW AGENTS · ROUND {snapshot.reviewArena.round}
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: THEME.text }}>
            004-oauth-pkce-flow — Concurrent Multi-Lens Verification
          </span>
        </div>
        <span style={{ fontFamily: THEME.fontMono, fontSize: 11.5, color: THEME.muted }}>
          factory/jobs/004-oauth-pkce-flow/round-{snapshot.reviewArena.round}/review-*.md
        </span>
      </div>

      {/* 2x2 Grid of Parallel Reviewer Lanes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {snapshot.reviewArena.lanes.map((lane, idx) => (
          <LaneCard key={lane.id} lane={lane} index={idx} />
        ))}
      </div>
    </div>
  );
};

