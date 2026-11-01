import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';

export const BigKineticIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame >= 175) return null;

  // Fly-through Z-space exit between frames 135..175
  const exitProgress = interpolate(frame, [135, 175], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const containerScale = interpolate(exitProgress, [0, 1], [1, 2.8]);
  const containerOpacity = interpolate(exitProgress, [0, 0.85, 1], [1, 0.3, 0]);

  const line1Spring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, stiffness: 130 },
  });

  const line2Spring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const line3Spring = spring({
    frame: frame - 36,
    fps,
    config: { damping: 14, stiffness: 115 },
  });

  const pillsSpring = spring({
    frame: frame - 56,
    fps,
    config: { damping: 15, stiffness: 110 },
  });

  const tiltX = interpolate(frame, [0, 140], [18, -6]);
  const tiltY = interpolate(frame, [0, 140], [-14, 8]);

  const beamWidth = interpolate(frame, [15, 90], [0, 1180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 95,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at 50% 50%, rgba(18, 20, 29, 0.78), rgba(10, 11, 16, 0.94))`,
        perspective: 1200,
        opacity: containerOpacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${containerScale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Eyebrow Pill */}
        <div
          style={{
            fontFamily: THEME.fontMono,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.28em',
            color: THEME.active,
            background: 'rgba(139, 233, 253, 0.12)',
            border: `1.5px solid ${THEME.active}`,
            padding: '8px 24px',
            borderRadius: 999,
            marginBottom: 24,
            boxShadow: `0 0 32px rgba(139, 233, 253, 0.35)`,
            transform: `translateZ(60px) scale(${line1Spring})`,
            opacity: line1Spring,
          }}
        >
          GOOGLE ANTIGRAVITY · MULTI-AGENT ORCHESTRATION
        </div>

        {/* Giant Line 1: AUTONOMOUS */}
        <div
          style={{
            fontSize: 112,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.94,
            color: THEME.text,
            textShadow: '0 18px 48px rgba(0, 0, 0, 0.85), 0 0 40px rgba(139, 233, 253, 0.28)',
            transform: `translateZ(${interpolate(line1Spring, [0, 1], [-400, 90])}px) rotateX(${interpolate(
              line1Spring,
              [0, 1],
              [65, 0]
            )}deg)`,
            opacity: line1Spring,
          }}
        >
          AUTONOMOUS
        </div>

        {/* Giant Line 2: SOFTWARE FACTORY */}
        <div
          style={{
            fontSize: 124,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.98,
            background: `linear-gradient(90deg, ${THEME.active} 0%, ${THEME.merged} 50%, ${THEME.pass} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 16px 36px rgba(189, 147, 249, 0.38))',
            transform: `translateZ(${interpolate(line2Spring, [0, 1], [-500, 130])}px) scale(${interpolate(
              line2Spring,
              [0, 1],
              [0.6, 1]
            )})`,
            opacity: line2Spring,
            marginTop: 4,
          }}
        >
          SOFTWARE FACTORY
        </div>

        {/* Glowing Laser Divider Line */}
        <div
          style={{
            width: beamWidth,
            height: 4,
            borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${THEME.active}, ${THEME.pass}, ${THEME.merged}, transparent)`,
            boxShadow: `0 0 28px ${THEME.active}`,
            margin: '26px 0 24px',
            transform: 'translateZ(110px)',
          }}
        />

        {/* Line 3 Subtitle */}
        <div
          style={{
            fontFamily: THEME.fontMono,
            fontSize: 28,
            fontWeight: 700,
            color: THEME.tok,
            letterSpacing: '0.04em',
            transform: `translateZ(80px) translateY(${interpolate(line3Spring, [0, 1], [40, 0])}px)`,
            opacity: line3Spring,
          }}
        >
          SPEC → BUILD → 4× PARALLEL REVIEW → AUTO-REWORK → MERGE
        </div>

        {/* 3D Floating Persona Pills */}
        <div
          style={{
            display: 'flex',
            gap: 14,
            marginTop: 32,
            transform: `translateZ(150px) translateY(${interpolate(pillsSpring, [0, 1], [35, 0])}px)`,
            opacity: pillsSpring,
          }}
        >
          {[
            ['spec-writer', '#bd93f9'],
            ['builder', '#8be9fd'],
            ['reviewer-security', '#ff79c6'],
            ['reviewer-ux', '#f1fa8c'],
            ['reviewer-ui', '#ffb86c'],
            ['reviewer-code', '#50fa7b'],
            ['approver', '#bd93f9'],
          ].map(([name, col]) => (
            <span
              key={name}
              style={{
                fontFamily: THEME.fontMono,
                fontSize: 15,
                fontWeight: 700,
                padding: '8px 16px',
                borderRadius: 8,
                background: `${col}22`,
                border: `1.5px solid ${col}`,
                color: col,
                boxShadow: `0 8px 24px ${col}33`,
              }}
            >
              ● {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BigKineticOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < 1580) return null;

  const localFrame = frame - 1580;

  const enterBg = interpolate(localFrame, [0, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const word1 = spring({
    frame: localFrame - 8,
    fps,
    config: { damping: 12, stiffness: 125 },
  });

  const word2 = spring({
    frame: localFrame - 24,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const statsSpring = spring({
    frame: localFrame - 44,
    fps,
    config: { damping: 14, stiffness: 115 },
  });

  const cmdSpring = spring({
    frame: localFrame - 64,
    fps,
    config: { damping: 15, stiffness: 110 },
  });

  const rotY = interpolate(localFrame, [0, 220], [16, -10]);
  const rotX = interpolate(localFrame, [0, 220], [-10, 8]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 95,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at 50% 50%, rgba(16, 18, 27, ${0.84 * enterBg}), rgba(10, 11, 16, ${
          0.96 * enterBg
        }))`,
        perspective: 1300,
      }}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Top Badge */}
        <div
          style={{
            fontFamily: THEME.fontMono,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: THEME.pass,
            background: 'rgba(80, 250, 123, 0.14)',
            border: `1.5px solid ${THEME.pass}`,
            padding: '8px 24px',
            borderRadius: 999,
            marginBottom: 22,
            transform: `translateZ(80px) scale(${word1})`,
            opacity: word1,
          }}
        >
          ✓ ISSUE #27 VERIFIED & MERGED TO MAIN
        </div>

        {/* Big Headline 1 */}
        <div
          style={{
            fontSize: 104,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.96,
            color: THEME.text,
            textShadow: '0 20px 50px rgba(0,0,0,0.85)',
            transform: `translateZ(${interpolate(word1, [0, 1], [-350, 95])}px)`,
            opacity: word1,
          }}
        >
          ISSUE TO MERGED PR
        </div>

        {/* Big Headline 2 */}
        <div
          style={{
            fontSize: 116,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            background: `linear-gradient(90deg, ${THEME.pass} 0%, ${THEME.active} 50%, ${THEME.merged} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 16px 40px rgba(80, 250, 123, 0.35))',
            transform: `translateZ(${interpolate(word2, [0, 1], [-450, 140])}px) scale(${interpolate(
              word2,
              [0, 1],
              [0.7, 1]
            )})`,
            opacity: word2,
          }}
        >
          FULLY AUTONOMOUS
        </div>

        {/* 3D Metric Cards Row */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 36,
            transform: `translateZ(120px) translateY(${interpolate(statsSpring, [0, 1], [35, 0])}px)`,
            opacity: statsSpring,
          }}
        >
          {[
            { val: '7 Personas', sub: 'Isolated Git Worktrees', col: THEME.active },
            { val: '4× Parallel', sub: 'Sec · UX · UI · Code Lenses', col: THEME.changes },
            { val: 'Auto-Rework', sub: 'Self-Healing Build Loop', col: THEME.pass },
            { val: 'Live Telemetry', sub: 'Streaming Logs & Token Cost', col: THEME.tok },
          ].map((item) => (
            <div
              key={item.val}
              style={{
                background: 'rgba(26, 28, 36, 0.92)',
                border: `1.5px solid ${item.col}`,
                borderRadius: 14,
                padding: '18px 26px',
                minWidth: 240,
                boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 24px ${item.col}26`,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: item.col,
                  marginBottom: 4,
                }}
              >
                {item.val}
              </div>
              <div
                style={{
                  fontFamily: THEME.fontMono,
                  fontSize: 12.5,
                  color: THEME.muted,
                }}
              >
                {item.sub}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Terminal Pill */}
        <div
          style={{
            marginTop: 36,
            background: THEME.terminalBg,
            border: `1.5px solid ${THEME.merged}`,
            borderRadius: 12,
            padding: '14px 32px',
            fontFamily: THEME.fontMono,
            fontSize: 22,
            color: THEME.text,
            boxShadow: '0 0 36px rgba(189, 147, 249, 0.3)',
            transform: `translateZ(160px) scale(${cmdSpring})`,
            opacity: cmdSpring,
          }}
        >
          <span style={{ color: THEME.pass }}>❯</span>{' '}
          <span style={{ color: THEME.active, fontWeight: 700 }}>/factory</span>{' '}
          <span style={{ color: THEME.muted }}>&lt;your-next-feature&gt;</span>
        </div>
      </div>
    </div>
  );
};

