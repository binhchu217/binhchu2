/**
 * Web Audio helper for tactile feedback, key-in-lock SFX, door opening chime,
 * and automatic warm piano fallback if external MUSIC_LINK cannot play.
 */

let sharedAudioCtx: AudioContext | null = null;
let fallbackTimer: number | null = null;
let fallbackMasterGain: GainNode | null = null;
let currentFallbackVolume = 0.55;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as {webkitAudioContext?: typeof AudioContext})
      .webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function playKeyTap(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.055);
}

export function playRoundSuccessTone(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const startAt = now + i * 0.07;
    osc.frequency.setValueAtTime(freq, startAt);

    gain.gain.setValueAtTime(0.001, startAt);
    gain.gain.linearRampToValueAtTime(0.08, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + 0.38);
  });
}

export function playErrorTone(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [180, 145].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now + i * 0.11);

    gain.gain.setValueAtTime(0.045, now + i * 0.11);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.11);
    osc.stop(now + i * 0.11 + 0.1);
  });
}

export function playKeyInsertClick(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [920, 1380].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const t = now + idx * 0.09;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.07);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  });
}

export function playDoorOpenChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const chord = [392.0, 493.88, 587.33, 783.99];
  chord.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const startAt = now + i * 0.07;
    osc.frequency.setValueAtTime(freq, startAt);

    gain.gain.setValueAtTime(0.001, startAt);
    gain.gain.linearRampToValueAtTime(0.08, startAt + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0008, startAt + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + 1.45);
  });
}

const PROGRESSION = [
  [261.63, 329.63, 392.0, 493.88],
  [220.0, 261.63, 329.63, 392.0],
  [174.61, 220.0, 261.63, 329.63],
  [196.0, 246.94, 293.66, 392.0],
];

export function setFallbackVolume(volume: number): void {
  currentFallbackVolume = Math.max(0, Math.min(1, volume));
  if (fallbackMasterGain && sharedAudioCtx) {
    fallbackMasterGain.gain.setTargetAtTime(
      currentFallbackVolume * 0.35,
      sharedAudioCtx.currentTime,
      0.04,
    );
  }
}

export function startAmbientFallback(volume = currentFallbackVolume): void {
  currentFallbackVolume = Math.max(0, Math.min(1, volume));
  const ctx = getAudioContext();
  if (!ctx || fallbackTimer !== null) return;

  fallbackMasterGain = ctx.createGain();
  fallbackMasterGain.gain.setValueAtTime(
    currentFallbackVolume * 0.35,
    ctx.currentTime,
  );
  fallbackMasterGain.connect(ctx.destination);

  let step = 0;

  const playArpeggioBar = () => {
    if (!ctx || !fallbackMasterGain) return;
    const chord = PROGRESSION[step % PROGRESSION.length];
    step += 1;

    const now = ctx.currentTime;
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.45);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now + i * 0.45);

      const start = now + i * 0.45;
      noteGain.gain.setValueAtTime(0.0001, start);
      noteGain.gain.linearRampToValueAtTime(0.18, start + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, start + 2.8);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(fallbackMasterGain!);

      osc.start(start);
      osc.stop(start + 2.9);
    });
  };

  playArpeggioBar();
  fallbackTimer = window.setInterval(playArpeggioBar, 3200);
}

export function stopAmbientFallback(): void {
  if (fallbackTimer !== null) {
    window.clearInterval(fallbackTimer);
    fallbackTimer = null;
  }
  if (fallbackMasterGain && sharedAudioCtx) {
    try {
      fallbackMasterGain.gain.setValueAtTime(0, sharedAudioCtx.currentTime);
      fallbackMasterGain.disconnect();
    } catch {
      // ignore disconnect errors
    }
    fallbackMasterGain = null;
  }
}
