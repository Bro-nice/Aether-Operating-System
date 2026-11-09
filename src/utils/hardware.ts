// Deep Hardware Synchronization & Real Web Audio Synthesis Engine

let audioCtx: AudioContext | null = null;
let ambientMusicOsc1: OscillatorNode | null = null;
let ambientMusicOsc2: OscillatorNode | null = null;
let ambientMusicGain: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// DTMF Frequencies for Telephone Keypad
const DTMF_FREQS: Record<string, [number, number]> = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477],
};

export function playDtmfTone(key: string, durationMs: number = 140) {
  try {
    const ctx = getAudioContext();
    const freqs = DTMF_FREQS[key] || [440, 880];

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = freqs[0];
    osc2.frequency.value = freqs[1];

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + durationMs / 1000);
    osc2.stop(ctx.currentTime + durationMs / 1000);

    triggerHaptic(15);
  } catch (err) {}
}

export function playShutterSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(850, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.12);

    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);

    triggerHaptic([20, 30, 20]);
  } catch (err) {}
}

export function playLockChime(isLocking: boolean) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startFreq = isLocking ? 620 : 340;
    const endFreq = isLocking ? 220 : 680;

    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);

    triggerHaptic(20);
  } catch (err) {}
}

// Real Audio Synthesizer for Music Player (Plays real 432Hz binaural harmonic drone)
export function startAmbientAudioStream(frequencyHz: number = 432) {
  try {
    const ctx = getAudioContext();
    if (ambientMusicGain) {
      stopAmbientAudioStream();
    }

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.value = frequencyHz;
    osc2.frequency.value = frequencyHz * 1.5; // Perfect fifth

    filter.type = 'lowpass';
    filter.frequency.value = 850;

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 1.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    ambientMusicOsc1 = osc1;
    ambientMusicOsc2 = osc2;
    ambientMusicGain = gain;
  } catch (e) {}
}

export function stopAmbientAudioStream() {
  try {
    if (ambientMusicGain && audioCtx) {
      ambientMusicGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        try {
          ambientMusicOsc1?.stop();
          ambientMusicOsc2?.stop();
          ambientMusicOsc1?.disconnect();
          ambientMusicOsc2?.disconnect();
          ambientMusicGain?.disconnect();
        } catch (e) {}
        ambientMusicOsc1 = null;
        ambientMusicOsc2 = null;
        ambientMusicGain = null;
      }, 550);
    }
  } catch (e) {}
}

export function triggerHaptic(pattern: number | number[] = 15) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
}

// Detect Host WebGL GPU
function getGpuRenderer(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const dbg = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        return (gl as any).getParameter(dbg.UNMASKED_RENDERER_WEBGL) || 'Integrated GPU Accelerator';
      }
    }
  } catch (e) {}
  return 'Neural Hardware Accelerator (GPU)';
}

// Detect Host OS
function getHostPlatform(): string {
  if (typeof navigator === 'undefined') return 'Aether Linux Embedded';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'Apple iOS Host';
  if (/Android/i.test(ua)) return 'Android Linux Host';
  if (/Mac/i.test(ua)) return 'Apple macOS Host';
  if (/Win/i.test(ua)) return 'Microsoft Windows Host';
  if (/Linux/i.test(ua)) return 'GNU/Linux Native Host';
  return 'Host Hardware Platform';
}

// Detect Host Browser
function getHostBrowser(): string {
  if (typeof navigator === 'undefined') return 'Aura Web Engine';
  const ua = navigator.userAgent;
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'Chromium Core';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'WebKit Native';
  if (/Firefox/i.test(ua)) return 'Gecko Engine';
  if (/Edg/i.test(ua)) return 'Edge Chromium';
  return 'Aether WebKit';
}

export async function detectRealHardware() {
  const result = {
    cpuCores: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8,
    memoryGb: typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory : 12,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    batteryLevel: 94,
    isCharging: false,
    networkType: '6G / Wi-Fi 7' as '6G / Wi-Fi 7' | '5G Ultra' | 'Offline',
    networkSpeedMbps: 850,
    gpuRenderer: getGpuRenderer(),
    hostPlatform: getHostPlatform(),
    hostBrowser: getHostBrowser(),
    screenWidth: typeof window !== 'undefined' ? window.screen.width : 1440,
    screenHeight: typeof window !== 'undefined' ? window.screen.height : 900,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 2 : 2,
    geolocationCity: 'San Francisco, CA',
    geolocationCoords: '37.7749° N, 122.4194° W',
  };

  // Real Battery API
  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    try {
      const battery: any = await (navigator as any).getBattery();
      result.batteryLevel = Math.round(battery.level * 100);
      result.isCharging = battery.charging;
    } catch (e) {}
  }

  // Real Network Connection API
  if (typeof navigator !== 'undefined' && (navigator as any).connection) {
    try {
      const conn = (navigator as any).connection;
      if (conn.downlink) {
        result.networkSpeedMbps = Math.round(conn.downlink * 80);
      }
      if (conn.effectiveType === '4g') {
        result.networkType = '5G Ultra';
      }
    } catch (e) {}
  }

  // Real Geolocation (if granted)
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(2);
          const lon = pos.coords.longitude.toFixed(2);
          result.geolocationCoords = `${lat}°, ${lon}°`;
        },
        () => {},
        { timeout: 3000 }
      );
    } catch (e) {}
  }

  return result;
}
