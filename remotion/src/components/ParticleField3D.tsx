import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { TimelineSnapshot } from '../data/factoryTimeline';
import { THEME } from '../theme';

interface Particle3D {
  id: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  speedZ: number;
  phase: number;
  color: string;
  size: number;
}

const PALETTE = [
  THEME.active,
  THEME.pass,
  THEME.merged,
  THEME.changes,
  THEME.human,
  THEME.tok,
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const ParticleField3D: React.FC<{
  snapshot: TimelineSnapshot;
  cameraYaw: number;
  cameraPitch: number;
  warpBoost?: number;
}> = ({ snapshot, cameraYaw, cameraPitch, warpBoost = 1 }) => {
  const frame = useCurrentFrame();

  const particles = useMemo<Particle3D[]>(() => {
    const list: Particle3D[] = [];
    for (let i = 0; i < 95; i++) {
      list.push({
        id: i,
        baseX: (seededRandom(i * 3 + 1) - 0.5) * 2600,
        baseY: (seededRandom(i * 3 + 2) - 0.5) * 1500,
        baseZ: seededRandom(i * 3 + 3) * 1200,
        speedZ: 3.2 + seededRandom(i * 7) * 4.5,
        phase: seededRandom(i * 11) * Math.PI * 2,
        color: PALETTE[i % PALETTE.length],
        size: 1.8 + seededRandom(i * 13) * 3.2,
      });
    }
    return list;
  }, []);

  const focalLength = 750;
  const cx = 960;
  const cy = 540;

  // Project 3D particles into 2D screen space
  const projected = particles.map((p) => {
    const travel = frame * p.speedZ * warpBoost;
    let z = (p.baseZ - travel) % 1200;
    if (z < 40) z += 1200;

    // Orbit drift + camera rotation offset
    const waveX = Math.sin(frame * 0.025 + p.phase) * 35;
    const waveY = Math.cos(frame * 0.02 + p.phase) * 28;

    const x3d = p.baseX + waveX - cameraYaw * 9;
    const y3d = p.baseY + waveY - cameraPitch * 7;

    const scale = focalLength / (focalLength + z);
    const sx = cx + x3d * scale;
    const sy = cy + y3d * scale;
    const alpha = interpolate(z, [40, 250, 950, 1200], [0.95, 0.85, 0.35, 0.05], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return {
      ...p,
      z,
      sx,
      sy,
      r: Math.max(1.2, p.size * scale * 1.45),
      alpha,
    };
  });

  // Connect nearby projected particles into a 3D constellation mesh
  const edges: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    opacity: number;
    color: string;
  }[] = [];

  for (let i = 0; i < projected.length; i++) {
    const a = projected[i];
    if (a.sx < -100 || a.sx > 2020 || a.sy < -100 || a.sy > 1180) continue;
    for (let j = i + 1; j < projected.length; j++) {
      const b = projected[j];
      if (Math.abs(a.z - b.z) > 260) continue;
      const dx = a.sx - b.sx;
      const dy = a.sy - b.sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 185) {
        const edgeAlpha = (1 - dist / 185) * Math.min(a.alpha, b.alpha) * 0.55;
        if (edgeAlpha > 0.04) {
          edges.push({
            x1: a.sx,
            y1: a.sy,
            x2: b.sx,
            y2: b.sy,
            opacity: edgeAlpha,
            color: a.color,
          });
        }
      }
    }
  }

  // Determine active pipeline energy spline based on current stage
  const isRework = snapshot.pipelineStep === 'rework';
  const isReview =
    snapshot.pipelineStep === 'review-r1' || snapshot.pipelineStep === 'review-r2';

  const pulseOffset = -(frame * 8) % 1200;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Radial Deep Space Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isRework
            ? 'radial-gradient(circle at 50% 42%, rgba(255, 184, 108, 0.14), rgba(14, 16, 23, 0.96) 70%)'
            : isReview
            ? 'radial-gradient(circle at 60% 48%, rgba(139, 233, 253, 0.14), rgba(14, 16, 23, 0.96) 72%)'
            : 'radial-gradient(circle at 50% 45%, rgba(189, 147, 249, 0.12), rgba(14, 16, 23, 0.96) 72%)',
        }}
      />

      {/* 3D Perspective Horizon Floor Grid */}
      <div
        style={{
          position: 'absolute',
          left: '-20%',
          right: '-20%',
          bottom: -180,
          height: 520,
          transform: `perspective(650px) rotateX(72deg) rotateZ(${cameraYaw * 0.18}deg)`,
          transformOrigin: 'center bottom',
          backgroundImage: `
            linear-gradient(to right, rgba(139, 233, 253, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(189, 147, 249, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          backgroundPosition: `0px ${(frame * 3) % 64}px`,
          opacity: 0.55,
        }}
      />

      {/* SVG Constellation Lines, Particles & Energy Beams */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="beamCyanPurple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={THEME.active} stopOpacity="0.85" />
            <stop offset="50%" stopColor={THEME.merged} stopOpacity="0.9" />
            <stop offset="100%" stopColor={THEME.pass} stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="beamRework" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={THEME.changes} stopOpacity="0.95" />
            <stop offset="100%" stopColor={THEME.active} stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Constellation Edges */}
        {edges.map((e, idx) => (
          <line
            key={idx}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={e.color}
            strokeWidth={1.15}
            strokeOpacity={e.opacity}
          />
        ))}

        {/* 3D Particles */}
        {projected.map((p) => (
          <g key={p.id}>
            <circle
              cx={p.sx}
              cy={p.sy}
              r={p.r * 2.4}
              fill={p.color}
              opacity={p.alpha * 0.22}
            />
            <circle
              cx={p.sx}
              cy={p.sy}
              r={p.r}
              fill={p.color}
              opacity={p.alpha}
            />
          </g>
        ))}

        {/* High-Energy Pipeline Data Arcs across the 3D Stage */}
        {frame >= 145 && frame < 1600 && (
          <g>
            {/* Primary Forward Pipeline Stream */}
            <path
              d="M 160 280 C 480 180, 920 320, 1480 240"
              fill="none"
              stroke="url(#beamCyanPurple)"
              strokeWidth="2.5"
              strokeDasharray="14 18"
              strokeDashoffset={pulseOffset}
              opacity={0.55}
            />

            {/* 4 Parallel Review Split Beams during Review Stage */}
            {isReview && (
              <>
                <path
                  d="M 820 310 C 920 420, 980 520, 1080 540"
                  fill="none"
                  stroke="#ff79c6"
                  strokeWidth="2.5"
                  strokeDasharray="10 12"
                  strokeDashoffset={pulseOffset}
                  opacity={0.75}
                />
                <path
                  d="M 820 310 C 1050 400, 1280 480, 1520 540"
                  fill="none"
                  stroke="#f1fa8c"
                  strokeWidth="2.5"
                  strokeDasharray="10 12"
                  strokeDashoffset={pulseOffset}
                  opacity={0.75}
                />
                <path
                  d="M 820 310 C 920 520, 980 650, 1080 710"
                  fill="none"
                  stroke="#ffb86c"
                  strokeWidth="2.5"
                  strokeDasharray="10 12"
                  strokeDashoffset={pulseOffset}
                  opacity={0.75}
                />
                <path
                  d="M 820 310 C 1060 520, 1300 660, 1520 710"
                  fill="none"
                  stroke="#50fa7b"
                  strokeWidth="2.5"
                  strokeDasharray="10 12"
                  strokeDashoffset={pulseOffset}
                  opacity={0.75}
                />
              </>
            )}

            {/* Orange Autonomous Rework Arc routing Review -> Build */}
            {isRework && (
              <path
                d="M 840 300 C 720 140, 560 140, 460 300"
                fill="none"
                stroke="url(#beamRework)"
                strokeWidth="4"
                strokeDasharray="16 10"
                strokeDashoffset={-pulseOffset * 1.4}
              />
            )}
          </g>
        )}
      </svg>
    </div>
  );
};

