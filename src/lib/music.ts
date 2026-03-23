// Ambient background music using Web Audio API
let musicCtx: AudioContext | null = null;
let currentOscillators: OscillatorNode[] = [];
let currentGains: GainNode[] = [];
let masterGain: GainNode | null = null;
let currentMood: string = '';
let isPlaying = false;

function getCtx() {
  if (!musicCtx) {
    musicCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = musicCtx.createGain();
    masterGain.gain.setValueAtTime(0.06, musicCtx.currentTime);
    masterGain.connect(musicCtx.destination);
  }
  return musicCtx;
}

function stopAll() {
  currentOscillators.forEach(o => { try { o.stop(); } catch {} });
  currentOscillators = [];
  currentGains = [];
}

function createDrone(ctx: AudioContext, freq: number, type: OscillatorType, vol: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  osc.connect(gain);
  gain.connect(masterGain!);
  osc.start();
  currentOscillators.push(osc);
  currentGains.push(gain);
  return { osc, gain };
}

function playNormalMood() {
  const ctx = getCtx();
  // Dreamy, magical ambient - C major pad
  createDrone(ctx, 130.81, 'sine', 0.4);    // C3
  createDrone(ctx, 164.81, 'sine', 0.25);   // E3
  createDrone(ctx, 196.00, 'sine', 0.2);    // G3
  createDrone(ctx, 261.63, 'triangle', 0.1); // C4 shimmer

  // Gentle LFO modulation
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(0.3, ctx.currentTime);
  lfoGain.gain.setValueAtTime(3, ctx.currentTime);
  lfo.connect(lfoGain);
  if (currentOscillators[0]) lfoGain.connect(currentOscillators[0].frequency);
  lfo.start();
  currentOscillators.push(lfo);
}

function playTrapMood() {
  const ctx = getCtx();
  // Dark, tense - minor dissonance
  createDrone(ctx, 110, 'sawtooth', 0.15);   // A2
  createDrone(ctx, 130.81, 'square', 0.08);  // C3
  createDrone(ctx, 155.56, 'sawtooth', 0.12); // Eb3
  createDrone(ctx, 82.41, 'sine', 0.3);      // E2 rumble

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(0.8, ctx.currentTime);
  lfoGain.gain.setValueAtTime(5, ctx.currentTime);
  lfo.connect(lfoGain);
  if (currentOscillators[0]) lfoGain.connect(currentOscillators[0].frequency);
  lfo.start();
  currentOscillators.push(lfo);
}

function playCutsceneMood() {
  const ctx = getCtx();
  // Ethereal, mysterious
  createDrone(ctx, 146.83, 'sine', 0.35);   // D3
  createDrone(ctx, 220, 'triangle', 0.15);   // A3
  createDrone(ctx, 293.66, 'sine', 0.12);   // D4
  createDrone(ctx, 440, 'sine', 0.06);      // A4 high shimmer

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
  lfoGain.gain.setValueAtTime(4, ctx.currentTime);
  lfo.connect(lfoGain);
  if (currentOscillators[1]) lfoGain.connect(currentOscillators[1].frequency);
  lfo.start();
  currentOscillators.push(lfo);
}

export function setMusicMood(mood: 'normal' | 'trap' | 'cutscene' | 'victory') {
  if (mood === currentMood) return;
  currentMood = mood;
  stopAll();
  if (!isPlaying) return;

  switch (mood) {
    case 'normal': playNormalMood(); break;
    case 'trap': playTrapMood(); break;
    case 'cutscene': playCutsceneMood(); break;
    case 'victory': playNormalMood(); break; // Use normal with higher pitch
  }
}

export function startMusic() {
  if (isPlaying) return;
  isPlaying = true;
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  setMusicMood((currentMood as any) || 'normal');
}

export function stopMusic() {
  isPlaying = false;
  stopAll();
  currentMood = '';
}

export function setMusicVolume(vol: number) {
  if (masterGain) {
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(0.15, vol)), getCtx().currentTime);
  }
}

export function isMusicPlaying() { return isPlaying; }
