import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { THEME } from '../theme';

// Exact frames where sub-bass BOOMs and BRAAAMs hit in trailer-score.wav
export const IMPACT_FRAMES = [
  2, 14, 32, 54, 82,
  195, 209, 231, 305,
  390, 414, 424, 434, 444, 485, 570,
  690, 706, 724, 746, 855,
  960, 978, 996, 1085,
  1170, 1184, 1198, 1214,
];

export const SMASH_CUT_FRAMES = [195, 305, 390, 570, 690, 855, 960, 1085, 1170];

export function getTrailerCameraShake(frame: number): {
  dx: number;
  dy: number;
  scale: number;
  flareIntensity: number;
} {
  let maxEnergy = 0;
  for (const imp of IMPACT_FRAMES) {
    const dt = frame - imp;
    if (dt >= 0 && dt <= 10) {
      const e = Math.exp(-dt * 0.42);
      if (e > maxEnergy) maxEnergy = e;
    }
  }

  const dx = Math.sin(frame * 2.9) * 14 * maxEnergy;
  const dy = Math.cos(frame * 3.7) * 10 * maxEnergy;
  const scale = 1 + 0.024 * maxEnergy;

  return {
    dx,
    dy,
    scale,
    flareIntensity: maxEnergy,
  };
}

export const AnamorphicCinemaChrome: React.FC<{
  flareIntensity: number;
  accentColor: string;
}> = ({ flareIntensity, accentColor }) => {
  const frame = useCurrentFrame();

  // Check if we're on a smash-cut frame for optical strobe flash
  let flashOpacity = 0;
  for (const sc of SMASH_CUT_FRAMES) {
    const dt = frame - sc;
    if (dt >= -1 && dt <= 3) {
      flashOpacity = Math.max(
        flashOpacity,
        interpolate(Math.abs(dt), [0, 3], [0.42, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      );
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 120,
      }}
    >
      {/* Cinematic Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 180px rgba(0, 0, 0, 0.85)',
        }}
      />

      {/* Horizontal Anamorphic Lens Flare Streak on Bass Impacts */}
      {flareIntensity > 0.05 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '5%',
            right: '5%',
            height: 6,
            transform: 'translateY(-50%)',
            background: `linear-gradient(90deg, transparent 0%, ${accentColor} 35%, #ffffff 50%, ${accentColor} 65%, transparent 100%)`,
            opacity: flareIntensity * 0.65,
            filter: 'blur(3px)',
            boxShadow: `0 0 45px 8px ${accentColor}`,
          }}
        />
      )}

      {/* Smash-Cut Optical Strobe Flash */}
      {flashOpacity > 0.01 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle, #ffffff, ${accentColor})`,
            opacity: flashOpacity,
          }}
        />
      )}

      {/* Top 2.39:1 Anamorphic Letterbox Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 62,
          background: '#040508',
          borderBottom: `1px solid ${accentColor}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          fontFamily: THEME.fontMono,
          fontSize: 11,
          letterSpacing: '0.24em',
          color: THEME.muted,
        }}
      >
        <span>GOOGLE ANTIGRAVITY STUDIOS · OFFICIAL TRAILER</span>
        <span style={{ color: accentColor }}>
          ● REC · 2.39:1 ANAMORPHIC · 140 BPM D-MINOR SCORE
        </span>
      </div>

      {/* Bottom 2.39:1 Anamorphic Letterbox Bar with Live Audio Spectrum Visualizer */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 62,
          background: '#040508',
          borderTop: `1px solid ${accentColor}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
        }}
      >
        <div
          style={{
            fontFamily: THEME.fontMono,
            fontSize: 11,
            letterSpacing: '0.2em',
            color: THEME.muted,
          }}
        >
          AUDIO: ZIMMER BRAAAM + SUB-BASS TAIKO + 4× REVIEW SONAR SFX
        </div>

        {/* 28-Bar Real-Time Trailer Audio Spectrum Visualizer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 28 }}>
          {Array.from({ length: 28 }).map((_, i) => {
            const wave =
              Math.abs(Math.sin(frame * 0.35 + i * 0.45)) * 0.55 +
              flareIntensity * 0.85;
            const h = Math.max(4, Math.min(26, Math.round(wave * 24)));
            return (
              <div
                key={i}
                style={{
                  width: 4,
                  height: h,
                  borderRadius: 2,
                  background: i % 3 === 0 ? accentColor : THEME.pass,
                  opacity: 0.85,
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            fontFamily: THEME.fontMono,
            fontSize: 11,
            letterSpacing: '0.18em',
            color: THEME.tok,
          }}
        >
          TC 00:00:{String(Math.floor(frame / 30)).padStart(2, '0')}:
          {String(frame % 30).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

