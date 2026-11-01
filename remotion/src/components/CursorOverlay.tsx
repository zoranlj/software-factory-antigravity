import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';

export interface CursorWaypoint {
  frame: number;
  x: number;
  y: number;
  click?: boolean;
}

interface CursorOverlayProps {
  waypoints: CursorWaypoint[];
  caption?: {
    step: string;
    title: string;
    detail: string;
    accentColor?: string;
  } | null;
}

export const CursorOverlay: React.FC<CursorOverlayProps> = ({ waypoints, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compute smooth cursor position across waypoints
  let x = waypoints[0]?.x ?? 960;
  let y = waypoints[0]?.y ?? 540;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const curr = waypoints[i];
    const next = waypoints[i + 1];
    if (frame >= curr.frame && frame <= next.frame) {
      const duration = Math.max(1, next.frame - curr.frame);
      const progress = spring({
        frame: frame - curr.frame,
        fps,
        durationInFrames: duration,
        config: { damping: 22, stiffness: 120, mass: 0.8 },
      });
      x = interpolate(progress, [0, 1], [curr.x, next.x]);
      y = interpolate(progress, [0, 1], [curr.y, next.y]);
      break;
    } else if (frame > next.frame) {
      x = next.x;
      y = next.y;
    }
  }

  // Check if any click occurred recently
  const activeClick = waypoints.find(
    (wp) => wp.click && frame >= wp.frame && frame <= wp.frame + 24
  );
  const clickProgress = activeClick
    ? (frame - activeClick.frame) / 24
    : null;

  const cursorScale =
    activeClick && frame - activeClick.frame < 10
      ? interpolate(frame - activeClick.frame, [0, 4, 10], [1, 0.84, 1])
      : 1;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200 }}>
      {/* Founder Walkthrough Callout Pill (Top-Center Floating HUD) */}
      {caption && (
        <div
          style={{
            position: 'fixed',
            bottom: 278,
            right: 32,
            backgroundColor: 'rgba(20, 21, 27, 0.94)',
            border: `1px solid ${caption.accentColor || THEME.active}`,
            borderLeft: `4px solid ${caption.accentColor || THEME.active}`,
            borderRadius: 10,
            padding: '12px 18px',
            maxWidth: 520,
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: caption.accentColor || THEME.active,
            }}
          >
            {caption.step}
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 600, color: THEME.text }}>
            {caption.title}
          </div>
          <div style={{ fontSize: 13, color: THEME.muted, lineHeight: 1.4 }}>
            {caption.detail}
          </div>
        </div>
      )}

      {/* Click Ripple */}
      {clickProgress !== null && (
        <div
          style={{
            position: 'fixed',
            left: x - 24,
            top: y - 24,
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: `2px solid ${THEME.active}`,
            transform: `scale(${interpolate(clickProgress, [0, 1], [0.3, 1.65])})`,
            opacity: interpolate(clickProgress, [0, 1], [0.95, 0]),
          }}
        />
      )}

      {/* macOS / Precision Pointer SVG */}
      <div
        style={{
          position: 'fixed',
          left: x,
          top: y,
          transform: `scale(${cursorScale})`,
          transformOrigin: 'top left',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.65))',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 2L20 11.5L12.5 13.5L9 21L4 2Z"
            fill="#FFFFFF"
            stroke="#14151b"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

