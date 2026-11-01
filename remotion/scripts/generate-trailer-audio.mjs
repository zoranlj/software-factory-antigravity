#!/usr/bin/env node
/**
 * Synthesizes a 45-second (1350 frames @ 30fps) 48kHz 16-bit Stereo WAV
 * Hollywood Trailer score & frame-locked SFX track for SoftwareFactoryTrailer.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../public');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'trailer-score.wav');

const SAMPLE_RATE = 48000;
const DURATION_SEC = 45.0;
const FPS = 30;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION_SEC);

const left = new Float32Array(TOTAL_SAMPLES);
const right = new Float32Array(TOTAL_SAMPLES);

function frameToSample(frame) {
  return Math.floor((frame / FPS) * SAMPLE_RATE);
}

// Deterministic pseudo-random noise
let rngState = 1337;
function noise() {
  rngState = (rngState * 1664525 + 1013904223) >>> 0;
  return (rngState / 0xffffffff) * 2 - 1;
}

// Band-limited sawtooth approximation (sum of harmonics)
function richSaw(phase, harmonics = 9) {
  let sum = 0;
  for (let k = 1; k <= harmonics; k++) {
    sum += (Math.sin(2 * Math.PI * k * phase) / k) * (1 - k * 0.06);
  }
  return sum * 0.55;
}

/**
 * 1. Add Zimmer-style Low Brass BRAAAM at given frame
 */
function addBraaam(startFrame, durationSec = 2.4, baseFreq = 36.71, gain = 0.42) {
  const start = frameToSample(startFrame);
  const len = Math.floor(durationSec * SAMPLE_RATE);
  const detunes = [0.992, 0.997, 1.0, 1.004, 1.009, 2.0, 2.005, 3.002];

  const phases = new Float64Array(detunes.length);

  for (let i = 0; i < len && start + i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const norm = i / len;
    // Fast brass attack, heavy sustain, warm tail
    const attack = Math.min(1, t / 0.06);
    const decay = Math.pow(1 - norm, 1.35);
    const env = attack * decay;

    // Slight downward pitch bend for menace
    const bend = 1 + 0.015 * Math.exp(-t * 6);
    let sigL = 0;
    let sigR = 0;

    for (let d = 0; d < detunes.length; d++) {
      const f = baseFreq * detunes[d] * bend;
      phases[d] = (phases[d] + f / SAMPLE_RATE) % 1.0;
      const harmCount = d < 5 ? 10 : 6;
      const osc = richSaw(phases[d], harmCount);
      if (d % 2 === 0) sigL += osc;
      else sigR += osc;
    }

    // Add deep fundamental sub sine
    const sub = Math.sin(2 * Math.PI * baseFreq * t) * 0.9;
    const warmL = Math.tanh((sigL * 0.32 + sub) * 1.6) * gain * env;
    const warmR = Math.tanh((sigR * 0.32 + sub) * 1.6) * gain * env;

    left[start + i] += warmL;
    right[start + i] += warmR;
  }
}

/**
 * 2. Add Sub-Bass Taiko / Trailer Impact BOOM at exact frame
 */
function addImpactBoom(startFrame, durationSec = 0.85, gain = 0.52) {
  const start = frameToSample(startFrame);
  const len = Math.floor(durationSec * SAMPLE_RATE);
  let phase = 0;
  let lpNoise = 0;

  for (let i = 0; i < len && start + i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const norm = i / len;
    // Pitch drops rapidly from 135Hz down to 33Hz
    const freq = 33 + 105 * Math.exp(-t * 24);
    phase += freq / SAMPLE_RATE;

    const env = Math.pow(1 - norm, 2.1);
    const punchEnv = Math.exp(-t * 32);

    // Filtered noise transient thump
    const n = noise();
    lpNoise = lpNoise * 0.88 + n * 0.12;

    const body = Math.sin(2 * Math.PI * phase) + 0.35 * Math.sin(4 * Math.PI * phase);
    const sample = Math.tanh((body * env + lpNoise * punchEnv * 1.4) * 1.5) * gain;

    left[start + i] += sample;
    right[start + i] += sample;
  }
}

/**
 * 3. Add Cinematic Riser / Whoosh leading into a smash cut at endFrame
 */
function addRiserWhoosh(endFrame, durationSec = 0.75, gain = 0.26) {
  const len = Math.floor(durationSec * SAMPLE_RATE);
  const start = Math.max(0, frameToSample(endFrame) - len);
  let phase = 0;
  let bp1 = 0;
  let bp2 = 0;

  for (let i = 0; i < len && start + i < TOTAL_SAMPLES; i++) {
    const norm = i / len;
    const env = Math.pow(norm, 2.4) * Math.sin(Math.PI * Math.min(1, (1 - norm) * 8));

    // Rising synth pitch 140Hz -> 920Hz
    const freq = 140 * Math.pow(6.5, norm);
    phase += freq / SAMPLE_RATE;
    const tone = Math.sin(2 * Math.PI * phase) * 0.4;

    // Sweeping filtered stereo noise
    const cutoff = 0.03 + 0.32 * Math.pow(norm, 2);
    const rawL = noise();
    const rawR = noise();
    bp1 += cutoff * (rawL - bp1);
    bp2 += cutoff * (rawR - bp2);

    left[start + i] += (bp1 * 0.85 + tone) * env * gain;
    right[start + i] += (bp2 * 0.85 + tone) * env * gain;
  }
}

/**
 * 4. Add Crisp Sonar / Verdict Stamp Ping (PASS = bright consonant, CHANGES = warning tritone)
 */
function addVerdictPing(startFrame, isWarning = false, gain = 0.25) {
  const start = frameToSample(startFrame);
  const durationSec = isWarning ? 0.65 : 0.38;
  const len = Math.floor(durationSec * SAMPLE_RATE);

  for (let i = 0; i < len && start + i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.min(1, t / 0.008) * Math.exp(-t * (isWarning ? 5.5 : 9.5));

    let sig = 0;
    if (isWarning) {
      // Urgent orange CHANGES alarm stinger (D4 + Ab4 tritone + pulse)
      const pulse = Math.sin(2 * Math.PI * 14 * t) > 0 ? 1 : 0.35;
      sig =
        (richSaw((t * 293.66) % 1, 6) + richSaw((t * 415.3) % 1, 6)) *
        0.5 *
        pulse;
    } else {
      // Bright green PASS chime (A5 + E6 + A6)
      sig =
        Math.sin(2 * Math.PI * 880 * t) * 0.55 +
        Math.sin(2 * Math.PI * 1318.5 * t) * 0.3 +
        Math.sin(2 * Math.PI * 1760 * t) * 0.15;
    }

    left[start + i] += sig * env * gain;
    right[start + i] += sig * env * gain;
  }
}

/**
 * 5. Driving 140 BPM D-Minor Trailer Ostinato Arpeggio & Finale Chord
 */
function addDrivingOstinato() {
  const bpm = 140;
  const sixteenthSec = 60 / bpm / 4; // ~0.1071s per 16th note
  // D minor ostinato pattern (frequencies in Hz): D3, F3, A3, D4, A3, F3, G3, A3
  const patternDm = [146.83, 174.61, 220.0, 293.66, 220.0, 174.61, 196.0, 220.0];
  // Bb major7 tension pattern: Bb2, F3, A3, D4, A3, F3, G3, A3
  const patternBb = [116.54, 174.61, 220.0, 293.66, 220.0, 174.61, 196.0, 220.0];
  // A7 dominant tension pattern: A2, E3, G3, C#4, G3, E3, F3, G3
  const patternA = [110.0, 164.81, 196.0, 277.18, 196.0, 164.81, 174.61, 196.0];

  const startSec = 2.0;
  const endSec = 39.0;
  const totalSixteenths = Math.floor((endSec - startSec) / sixteenthSec);

  for (let step = 0; step < totalSixteenths; step++) {
    const stepTime = startSec + step * sixteenthSec;
    const startSample = Math.floor(stepTime * SAMPLE_RATE);
    const stepSamples = Math.floor(sixteenthSec * SAMPLE_RATE);

    // Choose harmony bar by bar (16 steps per bar)
    const bar = Math.floor(step / 16) % 4;
    const pat = bar === 2 ? patternBb : bar === 3 ? patternA : patternDm;
    const freq = pat[step % 8];

    // Ostinato intensity ramps up across the trailer
    const intensity = Math.min(1, (stepTime - 2.0) / 14.0);
    const accent = step % 4 === 0 ? 1.35 : 0.85;
    const pan = ((step % 4) - 1.5) * 0.25; // Stereo bounce

    let phase = 0;
    for (let i = 0; i < stepSamples && startSample + i < TOTAL_SAMPLES; i++) {
      const t = i / SAMPLE_RATE;
      const env = Math.min(1, t / 0.005) * Math.exp(-t * 18);
      phase = (phase + freq / SAMPLE_RATE) % 1.0;

      const osc =
        richSaw(phase, 5) * 0.65 +
        Math.sin(2 * Math.PI * (freq * 0.5) * t) * 0.45;
      const val = osc * env * 0.14 * intensity * accent;

      left[startSample + i] += val * (1 - pan);
      right[startSample + i] += val * (1 + pan);
    }
  }
}

/**
 * 6. Grand Finale Triumphant Pad & Brass Resolution (39.0s -> 45.0s)
 */
function addFinaleResolution(startFrame = 1170) {
  const start = frameToSample(startFrame);
  const len = TOTAL_SAMPLES - start;
  // D5 power/sus2 triumphant voicing: D2, A2, D3, A3, E4, F#4, A4
  const chord = [73.42, 110.0, 146.83, 220.0, 329.63, 369.99, 440.0];
  const phases = new Float64Array(chord.length);

  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const norm = i / len;
    const attack = Math.min(1, t / 0.25);
    const release = norm > 0.75 ? Math.pow((1 - norm) / 0.25, 1.5) : 1.0;
    const env = attack * release;

    let sumL = 0;
    let sumR = 0;
    for (let c = 0; c < chord.length; c++) {
      const detune = 1 + (c - 3) * 0.0018;
      phases[c] = (phases[c] + (chord[c] * detune) / SAMPLE_RATE) % 1.0;
      const sig = richSaw(phases[c], 7);
      if (c % 2 === 0) sumL += sig;
      else sumR += sig;
    }

    const sub = Math.sin(2 * Math.PI * 36.71 * t) * 0.65;
    left[start + i] += Math.tanh((sumL * 0.18 + sub) * 1.2) * 0.34 * env;
    right[start + i] += Math.tanh((sumR * 0.18 + sub) * 1.2) * 0.34 * env;
  }
}

// ============================================================================
// Compose the Full 45-Second Frame-Locked Trailer Timeline
// ============================================================================

addDrivingOstinato();

// Major Act Drops -> Zimmer BRAAAMs
addBraaam(2, 2.6, 36.71, 0.44);     // 0.0s: Cold Open BRAAAM (D1)
addBraaam(195, 2.2, 43.65, 0.40);   // 6.5s: Act 2 Spec & Build (F1)
addBraaam(390, 2.5, 36.71, 0.44);   // 13.0s: Act 3 4x Parallel Sentinels (D1)
addBraaam(690, 2.4, 46.25, 0.42);   // 23.0s: Act 4 Self-Healing Rework (F#1/Gb1 tension)
addBraaam(960, 2.2, 41.20, 0.40);   // 32.0s: Act 5 Approver Gate (E1)
addBraaam(1170, 3.2, 36.71, 0.46);  // 39.0s: Act 6 Grand Title Finale (D1)

// Frame-locked Sub-Bass Impact Slams on every Giant Typography Pop-Up & Smash Cut
const impactFrames = [
  2, 14, 32, 54, 82,              // Beat 1 slams
  195, 209, 231, 305,             // Beat 2 slams + Burst 1 smash cut
  390, 414, 424, 434, 444, 570,   // Beat 3 4x Reviewer slams + Burst 2 smash cut
  690, 706, 724, 746, 855,        // Beat 4 Rework slams + Burst 3 smash cut
  960, 978, 996, 1085,            // Beat 5 Approver slams + Burst 4 smash cut
  1170, 1184, 1198, 1214          // Beat 6 Finale slams
];
for (const f of impactFrames) {
  addImpactBoom(f, 0.78, 0.46);
}

// Risers & Whooshes before every major transition & smash cut
const transitionEndFrames = [195, 305, 390, 570, 690, 855, 960, 1085, 1170];
for (const ef of transitionEndFrames) {
  addRiserWhoosh(ef, 0.8, 0.28);
}

// Verdict Pings & Warning Klaxon Stingers
addVerdictPing(416, false, 0.24); // Security PASS
addVerdictPing(426, false, 0.24); // UX PASS
addVerdictPing(436, true, 0.34);  // UI CHANGES (Warning Stinger!)
addVerdictPing(446, false, 0.24); // Code PASS
addVerdictPing(485, true, 0.38);  // Giant Alert Banner Stinger!

// Round 2 All-Pass Rapid Chimes
addVerdictPing(865, false, 0.22);
addVerdictPing(880, false, 0.24);
addVerdictPing(895, false, 0.26);
addVerdictPing(910, false, 0.30);

// Grand Finale Chord Swell
addFinaleResolution(1170);

// Master Limiter & 16-bit Stereo WAV Encoder
const pcmBuffer = Buffer.alloc(44 + TOTAL_SAMPLES * 4);

// RIFF Header
pcmBuffer.write('RIFF', 0);
pcmBuffer.writeUInt32LE(36 + TOTAL_SAMPLES * 4, 4);
pcmBuffer.write('WAVE', 8);
pcmBuffer.write('fmt ', 12);
pcmBuffer.writeUInt32LE(16, 16);          // Subchunk1Size (16 for PCM)
pcmBuffer.writeUInt16LE(1, 20);           // AudioFormat (1 = PCM)
pcmBuffer.writeUInt16LE(2, 22);           // NumChannels (2 = Stereo)
pcmBuffer.writeUInt32LE(SAMPLE_RATE, 24); // SampleRate
pcmBuffer.writeUInt32LE(SAMPLE_RATE * 4, 28); // ByteRate
pcmBuffer.writeUInt16LE(4, 32);           // BlockAlign
pcmBuffer.writeUInt16LE(16, 34);          // BitsPerSample
pcmBuffer.write('data', 36);
pcmBuffer.writeUInt32LE(TOTAL_SAMPLES * 4, 40);

let offset = 44;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  // Soft-clip master limiter
  const l = Math.tanh(left[i] * 0.92);
  const r = Math.tanh(right[i] * 0.92);
  const sL = Math.max(-32767, Math.min(32767, Math.round(l * 32767)));
  const sR = Math.max(-32767, Math.min(32767, Math.round(r * 32767)));
  pcmBuffer.writeInt16LE(sL, offset);
  pcmBuffer.writeInt16LE(sR, offset + 2);
  offset += 4;
}

fs.writeFileSync(outFile, pcmBuffer);
console.log(`✅ Generated Hollywood Trailer audio: ${outFile} (${(pcmBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

