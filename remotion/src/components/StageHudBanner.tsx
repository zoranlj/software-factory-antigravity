import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { TimelineSnapshot } from '../data/factoryTimeline';
import { THEME } from '../theme';

const PIPELINE_STEPS: { id: TimelineSnapshot['pipelineStep'][]; label: string; color: string }[] = [
  { id: ['command'], label: '/factory', color: THEME.active },
  { id: ['spec'], label: 'spec-writer', color: '#bd93f9' },
  { id: ['build', 'rework'], label: 'builder', color: THEME.active },
  { id: ['review-r1', 'review-r2'], label: '4x parallel review', color: THEME.changes },
  { id: ['approve'], label: 'approver', color: '#bd93f9' },
  { id: ['merged', 'panorama'], label: 'merged → main', color: THEME.pass },
];

export const StageHudBanner: React.FC<{ snapshot: TimelineSnapshot }> = ({ snapshot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  // Progress bar across entire 60s (1800 frames)
  const overallProgress = interpolate(frame, [0, 1800], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isRework = snapshot.pipelineStep === 'rework';

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: 32,
        right: 32,
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(19, 21, 28, 0.92)',
        border: `1px solid ${ isRework ? THEME.changes : THEME.line }`,
        borderRadius: 12,
        padding: '10px 20px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
        transform: `translateY(${interpolate(enter, [0, 1], [-40, 0])}px)`,
        opacity: enter,
      }}
    >
      {/* Left: Act Title & Subtitle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 5,
              background: isRework
                ? 'rgba(255, 184, 108, 0.18)'
                : 'rgba(139, 233, 253, 0.16)',
              color: isRework ? THEME.changes : THEME.active,
              border: `1px solid ${isRework ? THEME.changes : 'rgba(139, 233, 253, 0.35)'}`,
              letterSpacing: '0.03em',
            }}
          >
            {isRework ? '↺ AUTO-REWORK LOOP' : `ACT ${snapshot.act} / 6`}
          </span>
          <span
            style={{
              fontFamily: THEME.fontSans,
              fontSize: 16,
              fontWeight: 700,
              color: THEME.text,
              letterSpacing: '-0.01em',
            }}
          >
            {snapshot.actTitle}
          </span>
        </div>
        <span
          style={{
            fontFamily: THEME.fontSans,
            fontSize: 12.5,
            color: THEME.muted,
          }}
        >
          {snapshot.actSubtitle}
        </span>
      </div>

      {/* Right: Mini Pipeline Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {PIPELINE_STEPS.map((step, idx) => {
          const isActive = step.id.includes(snapshot.pipelineStep);
          return (
            <React.Fragment key={step.label}>
              <div
                style={{
                  fontFamily: THEME.fontMono,
                  fontSize: 11.5,
                  fontWeight: isActive ? 700 : 500,
                  padding: '5px 10px',
                  borderRadius: 6,
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(26, 28, 36, 0.7)',
                  border: `1px solid ${isActive ? step.color : THEME.line}`,
                  color: isActive ? step.color : THEME.faint,
                  boxShadow: isActive ? `0 0 14px ${step.color}33` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {isActive && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: step.color,
                      boxShadow: `0 0 8px ${step.color}`,
                    }}
                  />
                )}
                {step.label}
              </div>
              {idx < PIPELINE_STEPS.length - 1 && (
                <span style={{ color: THEME.faint, fontFamily: THEME.fontMono, fontSize: 12 }}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom thin timeline progress bar */}
      <div
        style={{
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 0,
          height: 2,
          background: 'rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${overallProgress}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${THEME.active}, ${THEME.pass})`,
          }}
        />
      </div>
    </div>
  );
};

