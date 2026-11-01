import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { THEME } from '../theme';

interface Node2D {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

const COLORS = [
  THEME.active,
  THEME.pass,
  THEME.merged,
  THEME.changes,
  THEME.human,
  THEME.tok,
];

function seeded(seed: number): number {
  const s = Math.sin(seed * 91.3458 + 47.123) * 43758.5453;
  return s - Math.floor(s);
}

export const FlatParticleLines: React.FC<{ accentColor?: string }> = ({
  accentColor = THEME.active,
}) => {
  const frame = useCurrentFrame();

  const nodes = useMemo<Node2D[]>(() => {
    const arr: Node2D[] = [];
    for (let i = 0; i < 68; i++) {
      arr.push({
        id: i,
        x: seeded(i * 3 + 1) * 1920,
        y: seeded(i * 3 + 2) * 1080,
        vx: (seeded(i * 5 + 3) - 0.5) * 3.4,
        vy: (seeded(i * 7 + 4) - 0.5) * 2.8,
        r: 2.2 + seeded(i * 11) * 3.5,
        color: COLORS[i % COLORS.length],
      });
    }
    return arr;
  }, []);

  const currentNodes = nodes.map((n) => {
    let x = (n.x + frame * n.vx) % 1920;
    let y = (n.y + frame * n.vy) % 1080;
    if (x < 0) x += 1920;
    if (y < 0) y += 1080;
    return { ...n, x, y };
  });

  const lines: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    opacity: number;
    color: string;
  }[] = [];

  for (let i = 0; i < currentNodes.length; i++) {
    const a = currentNodes[i];
    for (let j = i + 1; j < currentNodes.length; j++) {
      const b = currentNodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 220) {
        lines.push({
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          opacity: (1 - dist / 220) * 0.32,
          color: a.color,
        });
      }
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1,
        background: `radial-gradient(circle at 50% 50%, ${accentColor}16 0%, #0d0f17 72%)`,
      }}
    >
      {/* Subtle 2D Blueprint Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: `${-(frame * 1.5) % 80}px ${-(frame * 1.0) % 80}px`,
        }}
      />

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        {lines.map((l, idx) => (
          <line
            key={idx}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={l.color}
            strokeWidth={1.4}
            strokeOpacity={l.opacity}
          />
        ))}
        {currentNodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={n.r * 2.5} fill={n.color} opacity={0.14} />
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={0.75} />
          </g>
        ))}
      </svg>
    </div>
  );
};

