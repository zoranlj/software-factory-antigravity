import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';

const PILLARS = [
  { title: '7 Agent Personas', detail: 'spec-writer, builder, 4 reviewers, approver', color: THEME.active },
  { title: 'Isolated Worktrees', detail: 'Zero pollution of your main branch checkout', color: THEME.pass },
  { title: 'Full Token & USD Audit', detail: 'Per-agent input/output tokens & model breakdown', color: THEME.tok },
  { title: '37/37 Contract Tests', detail: 'Verified by ./tests/factory-verify.sh', color: THEME.merged },
];

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const cmdSpring = spring({ frame: frame - 18, fps, config: { damping: 16, stiffness: 120 } });

  const typedChars = Math.floor(
    interpolate(frame, [28, 110], [0, 44], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const fullCmd = './install.sh --global && /factory next';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        color: THEME.text,
        fontFamily: THEME.fontSans,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(to right, ${THEME.line}33 1px, transparent 1px), linear-gradient(to bottom, ${THEME.line}33 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          opacity: 0.55,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1240,
          width: '100%',
          padding: '0 64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: THEME.fontMono,
            fontSize: 15,
            color: THEME.pass,
            backgroundColor: THEME.panel,
            border: `1px solid ${THEME.line}`,
            padding: '7px 16px',
            borderRadius: 6,
            marginBottom: 24,
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [16, 0])}px)`,
          }}
        >
          READY FOR YOUR REPOSITORY IN ONE COMMAND
        </div>

        <h2
          style={{
            margin: '0 0 16px',
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
          }}
        >
          Ship Autonomous PRs in Google Antigravity
        </h2>

        <p
          style={{
            margin: '0 0 40px',
            fontSize: 23,
            color: THEME.muted,
            maxWidth: 820,
            opacity: enter,
          }}
        >
          Install globally or into any target project. Zero external dependencies.
        </p>

        {/* Terminal Command Box */}
        <div
          style={{
            backgroundColor: THEME.terminalBg,
            border: `1px solid ${THEME.active}`,
            borderRadius: 12,
            padding: '22px 36px',
            fontFamily: THEME.fontMono,
            fontSize: 24,
            color: THEME.text,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 48,
            boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
            opacity: cmdSpring,
            transform: `scale(${interpolate(cmdSpring, [0, 1], [0.95, 1])})`,
          }}
        >
          <span style={{ color: THEME.pass }}>$</span>
          <span>{fullCmd.slice(0, typedChars)}</span>
          <span
            style={{
              width: 12,
              height: 26,
              backgroundColor: THEME.active,
              display: 'inline-block',
              opacity: Math.floor(frame / 18) % 2 === 0 ? 1 : 0.2,
            }}
          />
        </div>

        {/* 4 Feature Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 18,
            width: '100%',
          }}
        >
          {PILLARS.map((p, idx) => {
            const cardSpring = spring({
              frame: frame - (36 + idx * 10),
              fps,
              config: { damping: 16, stiffness: 120 },
            });
            return (
              <div
                key={p.title}
                style={{
                  backgroundColor: THEME.card,
                  border: `1px solid ${THEME.line}`,
                  borderRadius: 10,
                  padding: '20px 20px',
                  textAlign: 'left',
                  opacity: cardSpring,
                  transform: `translateY(${interpolate(cardSpring, [0, 1], [18, 0])}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: THEME.fontMono,
                    fontSize: 15,
                    fontWeight: 600,
                    color: p.color,
                    marginBottom: 8,
                  }}
                >
                  {p.title}
                </div>
                <div style={{ fontSize: 15, color: THEME.muted, lineHeight: 1.45 }}>
                  {p.detail}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 42,
            fontFamily: THEME.fontMono,
            fontSize: 15,
            color: THEME.faint,
            opacity: cmdSpring,
          }}
        >
          github.com/zoranlj/software-factory-antigravity · MIT License
        </div>
      </div>
    </AbsoluteFill>
  );
};

