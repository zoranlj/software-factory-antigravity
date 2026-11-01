import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';

const COMMAND_TEXT = '/factory Issue #27: OAuth 2.1 PKCE login + session vault';

export const Act1CommandWorktree: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame >= 185) return null;

  const fadeOut = interpolate(frame, [155, 182], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardEnter = spring({
    frame: frame - 5,
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  const typedChars = Math.floor(
    interpolate(frame, [12, 68], [0, COMMAND_TEXT.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const branchProgress = spring({
    frame: frame - 72,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const specBadgeProgress = spring({
    frame: frame - 115,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 80,
        background: 'rgba(13, 14, 20, 0.86)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
        padding: 48,
      }}
    >
      <div
        style={{
          width: 1120,
          background: THEME.panel,
          border: `1px solid ${THEME.line}`,
          borderRadius: 16,
          padding: '32px 36px',
          boxShadow: '0 28px 80px rgba(0, 0, 0, 0.65)',
          transform: `scale(${interpolate(cardEnter, [0, 1], [0.92, 1])})`,
          opacity: cardEnter,
        }}
      >
        {/* Top Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: THEME.active,
                boxShadow: `0 0 12px ${THEME.active}`,
              }}
            />
            <span
              style={{
                fontFamily: THEME.fontMono,
                fontSize: 13,
                color: THEME.active,
                fontWeight: 600,
              }}
            >
              GOOGLE ANTIGRAVITY · AUTONOMOUS SOFTWARE FACTORY
            </span>
          </div>
          <span
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 12,
              color: THEME.muted,
            }}
          >
            7 Specialized Agent Personas · Isolated Git Worktrees
          </span>
        </div>

        {/* Command Prompt Box */}
        <div
          style={{
            background: THEME.terminalBg,
            border: `1px solid ${frame > 68 ? THEME.active : THEME.line}`,
            borderRadius: 10,
            padding: '18px 22px',
            fontFamily: THEME.fontMono,
            fontSize: 20,
            color: THEME.text,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: frame > 68 ? `0 0 24px rgba(139, 233, 253, 0.14)` : 'none',
          }}
        >
          <span style={{ color: THEME.pass, fontWeight: 700 }}>❯</span>
          <span>
            <span style={{ color: THEME.active, fontWeight: 700 }}>
              {COMMAND_TEXT.slice(0, Math.min(typedChars, 8))}
            </span>
            <span>{COMMAND_TEXT.slice(Math.min(typedChars, 8), typedChars)}</span>
          </span>
          {frame < 90 && frame % 16 < 8 && (
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 22,
                background: THEME.active,
              }}
            />
          )}
          {frame >= 70 && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 6,
                background: 'rgba(80, 250, 123, 0.15)',
                color: THEME.pass,
                border: `1px solid ${THEME.pass}`,
              }}
            >
              ✓ Job 004-oauth-pkce-flow created
            </span>
          )}
        </div>

        {/* Animated Git Worktree Branching Diagram */}
        <div
          style={{
            marginTop: 28,
            padding: '24px 28px',
            background: THEME.card,
            border: `1px solid ${THEME.line}`,
            borderRadius: 12,
            opacity: branchProgress,
            transform: `translateY(${interpolate(branchProgress, [0, 1], [16, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 12,
              color: THEME.muted,
              marginBottom: 14,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>ISOLATED GIT WORKTREE PROVISIONING</span>
            <span style={{ color: THEME.tok }}>
              git worktree add -b factory/004-oauth-pkce-flow ./factory/worktrees/004-oauth-pkce-flow main
            </span>
          </div>

          <svg width="1000" height="120" viewBox="0 0 1000 120">
            {/* Main branch line */}
            <line x1="40" y1="35" x2="940" y2="35" stroke={THEME.merged} strokeWidth="3" strokeDasharray="6 4" />
            <circle cx="80" cy="35" r="8" fill={THEME.merged} />
            <circle cx="240" cy="35" r="8" fill={THEME.merged} />
            <text x="60" y="18" fill={THEME.merged} fontFamily="monospace" fontSize="13" fontWeight="bold">
              main (clean checkout)
            </text>

            {/* Worktree branch curve */}
            <path
              d="M 240 35 C 290 35, 300 90, 360 90 L 820 90"
              fill="none"
              stroke={THEME.active}
              strokeWidth="3.5"
              strokeDasharray="600"
              strokeDashoffset={interpolate(branchProgress, [0, 1], [600, 0])}
            />
            <circle cx="360" cy="90" r="8" fill={THEME.active} opacity={branchProgress} />
            <circle cx="580" cy="90" r="8" fill="#bd93f9" opacity={specBadgeProgress} />
            <circle cx="780" cy="90" r="8" fill={THEME.pass} opacity={specBadgeProgress} />

            <text x="345" y="114" fill={THEME.active} fontFamily="monospace" fontSize="12.5" fontWeight="bold">
              branch: factory/004-oauth-pkce-flow
            </text>
            <text x="545" y="72" fill="#bd93f9" fontFamily="monospace" fontSize="12" opacity={specBadgeProgress}>
              spec-writer → spec.md
            </text>
            <text x="740" y="72" fill={THEME.pass} fontFamily="monospace" fontSize="12" opacity={specBadgeProgress}>
              port: 5140 allocated
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

