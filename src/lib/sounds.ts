// Web Audio API sound effects - no external dependencies needed
const audioCtx = () => {
  if (!(window as any).__audioCtx) {
    (window as any).__audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__audioCtx as AudioContext;
};

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  const ctx = audioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playCorrectSound() {
  playTone(523, 0.1, 'sine', 0.12);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.12), 80);
  setTimeout(() => playTone(784, 0.15, 'sine', 0.15), 160);
  setTimeout(() => playTone(1047, 0.3, 'sine', 0.1), 240);
}

export function playWrongSound() {
  playTone(300, 0.15, 'sawtooth', 0.1);
  setTimeout(() => playTone(250, 0.15, 'sawtooth', 0.1), 120);
  setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.08), 240);
}

export function playTrapSound() {
  playTone(150, 0.3, 'sawtooth', 0.12);
  setTimeout(() => playTone(100, 0.4, 'square', 0.08), 200);
  setTimeout(() => playTone(80, 0.5, 'sawtooth', 0.1), 400);
}

export function playSecretSound() {
  playTone(400, 0.08, 'sine', 0.1);
  setTimeout(() => playTone(600, 0.08, 'sine', 0.1), 60);
  setTimeout(() => playTone(800, 0.08, 'sine', 0.1), 120);
  setTimeout(() => playTone(1000, 0.08, 'sine', 0.12), 180);
  setTimeout(() => playTone(1200, 0.15, 'sine', 0.15), 240);
  setTimeout(() => playTone(1600, 0.3, 'triangle', 0.1), 320);
}

export function playNodeEnterSound() {
  playTone(440, 0.05, 'sine', 0.08);
  setTimeout(() => playTone(660, 0.1, 'sine', 0.06), 50);
}
