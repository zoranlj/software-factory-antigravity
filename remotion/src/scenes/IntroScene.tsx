import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AGENT_COLORS, THEME } from '../theme';

const PIPELINE_STEPS = [
  { label: '/factory <feature>', sub: 'Prompt or Issue', color: THEME.text },
  { label: 'spec-writer', sub: 'Testable Spec', color: AGENT_COLORS['spec-writer'] },
  { label: 'builder', sub: 'Git Worktree', color: AGENT_COLORS.builder },
  { label: '4-Lens Review', sub: 'sec · ux · ui · code', color: THEME.changes },
  { label: 'approver', sub: 'Audit & Merge', color: THEME.pass },
];

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const titleSpring = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 110 } });
  const subSpring = spring({ frame: frame - 22, fps, config: { damping: 18, stiffness: 100 } });

  const exitOpacity = interpolate(frame, [240, 270], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        color: THEME.text,
        fontFamily: THEME.fontSans,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: exitOpacity,
      }}
    >
      {/* Subtle architectural grid lines matching dark terminal aesthetic */}
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
          maxWidth: 1360,
          width: '100%',
          padding: '0 64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Top platform badge */}
        <div
          style={{
            transform: `translateY(${interpolate(badgeSpring, [0, 1], [16, 0])}px)`,
            opacity: badgeSpring,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 18px',
            backgroundColor: THEME.panel,
            border: `1px solid ${THEME.line}`,
            borderRadius: 8,
            fontFamily: THEME.fontMono,
            fontSize: 15,
            color: THEME.active,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              backgroundColor: THEME.pass,
              boxShadow: `0 0 10px ${THEME.pass}`,
            }}
          />
          <span>GOOGLE ANTIGRAVITY · AUTONOMOUS MULTI-AGENT PIPELINE</span>
        </div>

        {/* Main Title */}
        <h1
          style={{
            margin: '0 0 20px',
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            transform: `translateY(${interpolate(titleSpring, [0, 1], [24, 0])}px)`,
            opacity: titleSpring,
          }}
        >
          Software Factory
        </h1>

        {/* Direct value proposition */}
        <p
          style={{
            margin: '0 0 56px',
            fontSize: 26,
            lineHeight: 1.45,
            color: THEME.muted,
            maxWidth: 940,
            transform: `translateY(${interpolate(subSpring, [0, 1], [20, 0])}px)`,
            opacity: subSpring,
          }}
        >
          Turn any feature prompt or GitHub issue into a verified pull request—isolated{' '}
          <span style={{ color: THEME.text, fontFamily: THEME.fontMono, fontSize: 23 }}>
            git worktrees
          </span>
          , 7 specialized agents, 4-lens parallel review, and live token observability.
        </p>

        {/* Animated Pipeline Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'nowrap',
          }}
        >
          {PIPELINE_STEPS.map((step, i) => {
            const stepProgress = spring({
              frame: frame - (38 + i * 12),
              fps,
              config: { damping: 15, stiffness: 130 },
            });
            return (
              <React.Fragment key={step.label}>
                <div
                  style={{
                    backgroundColor: THEME.card,
                    border: `1px solid ${THEME.line}`,
                    borderTop: `3px solid ${step.color}`,
                    borderRadius: 12,
                    padding: '18px 24px',
                    minWidth: 215,
                    textAlign: 'left',
                    transform: `translateY(${interpolate(stepProgress, [0, 1], [22, 0])}px) scale(${interpolate(stepProgress, [0, 1], [0.95, 1])})`,
                    opacity: stepProgress,
                  }}
                >
                  <div
                    style={{
                      fontFamily: THEME.fontMono,
                      fontSize: 16,
                      fontWeight: 600,
                      color: step.color,
                      marginBottom: 6,
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontFamily: THEME.fontMono,
                      fontSize: 13,
                      color: THEME.muted,
                    }}
                  >
                    {step.sub}
                  </div>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div
                    style={{
                      fontFamily: THEME.fontMono,
                      fontSize: 24,
                      color: THEME.faint,
                      opacity: stepProgress,
                    }}
                  >
                    ›
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

