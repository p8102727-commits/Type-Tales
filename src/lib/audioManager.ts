/**
 * Cozy Typetales Ambient Procedural Music Synthesizer
 * Uses 100% Web Audio API - zero external files, fully responsive, zero bandwidth!
 */

export interface SoundscapePreset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  baseColor: string;
  chordsPurified: number[][]; // Frequencies in Hz for peaceful states
  chordsCorrupted: number[][]; // Frequencies in Hz for shadow states
}

export const SOUNDSCAPES: SoundscapePreset[] = [
  {
    id: 'lofi_study',
    name: 'Cozy Lo-Fi Study',
    emoji: '☕🎵',
    description: 'Chilled dusty lofi chords, cozy vinyl crackle, and a warm procedural hip-hop beat.',
    baseColor: 'text-amber-500',
    // Am9, Gmaj9, Cmaj9, Fmaj7
    chordsPurified: [
      [110.00, 164.81, 196.00, 246.94, 277.18], // Am9
      [98.00, 146.83, 185.00, 220.00, 293.66],  // Gmaj9
      [130.81, 164.81, 196.00, 246.94, 329.63], // Cmaj9
      [87.31, 130.81, 174.61, 220.00, 261.63],  // Fmaj7
    ],
    chordsCorrupted: [
      [110.00, 138.59, 164.81, 220.00, 261.63], // Am7b5
      [82.41, 123.47, 146.83, 196.00, 246.94],  // Em7b5
      [98.00, 138.59, 174.61, 220.00, 293.66],  // G7
      [87.31, 123.47, 155.56, 207.65, 261.63],  // Fm6
    ]
  },
  {
    id: 'whispering_pines',
    name: 'Whispering Pines',
    emoji: '🌲✨',
    description: 'Soft woodwind chords, wind sweeps, and stardust bell chimes.',
    baseColor: 'text-emerald-400',
    // Cmaj9, Fmaj9, G6, Am7
    chordsPurified: [
      [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9
      [174.61, 220.00, 261.63, 311.13, 349.23], // Fmaj9
      [146.83, 196.00, 246.94, 293.66, 392.00], // G6
      [110.00, 146.83, 174.61, 220.00, 261.63], // Am7
    ],
    // Am9, Dm7, Em7, Fmaj7
    chordsCorrupted: [
      [110.00, 138.59, 164.81, 220.00, 277.18], // Am9
      [146.83, 174.61, 220.00, 261.63, 293.66], // Dm7
      [164.81, 196.00, 246.94, 293.66, 329.63], // Em7
      [174.61, 220.00, 261.63, 311.13, 349.23], // Fmaj7
    ]
  },
  {
    id: 'summer_meadow',
    name: 'Summer Meadow',
    emoji: '🌻🍃',
    description: 'Warm solar strings and bright pentatonic chimes.',
    baseColor: 'text-amber-400',
    // Gmaj9, Cmaj9, D6, Em7
    chordsPurified: [
      [98.00, 146.83, 185.00, 220.00, 293.66],  // Gmaj9
      [130.81, 164.81, 196.00, 246.94, 329.63], // Cmaj9
      [146.83, 185.00, 220.00, 293.66, 369.99], // D6
      [164.81, 196.00, 246.94, 329.63, 392.00], // Em7
    ],
    // Em9, Am7, Bm7, Cmaj7
    chordsCorrupted: [
      [82.41, 130.81, 164.81, 196.00, 246.94],  // Em9
      [110.00, 146.83, 174.61, 220.00, 261.63], // Am7
      [123.47, 164.81, 196.00, 246.94, 293.66], // Bm7
      [130.81, 164.81, 196.00, 246.94, 329.63], // Cmaj7
    ]
  },
  {
    id: 'celestial_aurora',
    name: 'Celestial Aurora',
    emoji: '🌌🌌',
    description: 'Slow breathing cosmic sweeps and shining stellar sparkles.',
    baseColor: 'text-indigo-400',
    // Dmaj9, Gmaj9, A6, Bm7
    chordsPurified: [
      [146.83, 185.00, 220.00, 277.18, 369.99], // Dmaj9
      [98.00, 146.83, 185.00, 220.00, 293.66],  // Gmaj9
      [110.00, 164.81, 220.00, 277.18, 329.63], // A6
      [123.47, 146.83, 185.00, 220.00, 293.66], // Bm7
    ],
    // Bm9, Em7, F#m7, Gmaj7
    chordsCorrupted: [
      [123.47, 146.83, 185.00, 220.00, 277.18], // Bm9
      [82.41, 110.00, 146.83, 164.81, 196.00],  // Em7
      [92.50, 110.00, 138.59, 164.81, 220.00],  // F#m7
      [98.00, 146.83, 185.00, 220.00, 293.66],  // Gmaj7
    ]
  },
  {
    id: 'abyssal_deep',
    name: 'Coral Sea Sanctuary',
    emoji: '🌊🐙',
    description: 'Sub-aquatic bass drone, sonar bells, and bubbling filters.',
    baseColor: 'text-cyan-400',
    // Fmaj9, Bbmaj9, C6, Dm7
    chordsPurified: [
      [87.31, 130.81, 174.61, 220.00, 261.63],  // Fmaj9
      [116.54, 146.83, 174.61, 233.08, 293.66], // Bbmaj9
      [130.81, 164.81, 196.00, 261.63, 329.63], // C6
      [146.83, 174.61, 220.00, 293.66, 349.23], // Dm7
    ],
    // Dm9, Gm7, Am7, Bbmaj7
    chordsCorrupted: [
      [73.42, 110.00, 146.83, 174.61, 220.00],  // Dm9
      [98.00, 130.81, 146.83, 196.00, 233.08],  // Gm7
      [110.00, 146.83, 174.61, 220.00, 261.63], // Am7
      [116.54, 146.83, 174.61, 233.08, 293.66], // Bbmaj7
    ]
  },
  {
    id: 'ancient_parchment',
    name: 'Ancient Archive',
    emoji: '📚🕯️',
    description: 'Soft crackling vinyl dust, wooden library organ, and historic cello warmth.',
    baseColor: 'text-amber-600',
    // C, G, Am, F (Classic peaceful renaissance chords)
    chordsPurified: [
      [130.81, 164.81, 196.00, 261.63, 329.63], // C
      [98.00, 146.83, 196.00, 246.94, 293.66],  // G
      [110.00, 130.81, 164.81, 220.00, 261.63], // Am
      [87.31, 130.81, 174.61, 220.00, 261.63],  // F
    ],
    // Am, Em, G, Am (mystic dorian progression)
    chordsCorrupted: [
      [110.00, 130.81, 164.81, 220.00, 261.63], // Am
      [82.41, 123.47, 164.81, 196.00, 246.94],  // Em
      [98.00, 146.83, 196.00, 246.94, 293.66],  // G
      [110.00, 130.81, 164.81, 220.00, 261.63], // Am
    ]
  }
];

class AmbientSynthesizer {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private padGain: GainNode | null = null;
  private noiseGain: GainNode | null = null;
  private chimeGain: GainNode | null = null;

  private isPlaying: boolean = false;
  private volume: number = 0.25; // 0.0 to 1.0
  private presetId: string = 'whispering_pines';
  private isCorrupted: boolean = true;
  private activeOscillators: OscillatorNode[] = [];
  private activeGains: GainNode[] = [];
  private windSource: AudioBufferSourceNode | null = null;
  private windLFO: OscillatorNode | null = null;

  private chordTimer: any = null;
  private chimeTimer: any = null;
  private beatTimer: any = null;
  private beatStep: number = 0;
  private currentChordIndex: number = 0;

  constructor() {
    // Loaded lazily upon user interaction
  }

  private init() {
    if (this.audioCtx) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.audioCtx = new AudioContextClass();

      // Master volume
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      // Pad synth volume (softer background)
      this.padGain = this.audioCtx.createGain();
      this.padGain.gain.setValueAtTime(0.55, this.audioCtx.currentTime);
      this.padGain.connect(this.masterGain);

      // Noise (wind/water/dust) volume
      this.noiseGain = this.audioCtx.createGain();
      this.noiseGain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
      this.noiseGain.connect(this.masterGain);

      // Chimes volume
      this.chimeGain = this.audioCtx.createGain();
      this.chimeGain.gain.setValueAtTime(0.45, this.audioCtx.currentTime);
      this.chimeGain.connect(this.masterGain);

      // Start the wind background noise
      this.startAmbientNoise();
    } catch (e) {
      console.warn('Could not initialize AudioContext:', e);
    }
  }

  private startAmbientNoise() {
    if (!this.audioCtx || !this.noiseGain) return;

    try {
      const ctx = this.audioCtx;
      
      // Generate 2 seconds of white noise
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      // Wind source
      this.windSource = ctx.createBufferSource();
      this.windSource.buffer = noiseBuffer;
      this.windSource.loop = true;

      // Filter to shape the wind noise
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      // LFO to create beautiful wind sweeping rise/fall
      this.windLFO = ctx.createOscillator();
      this.windLFO.frequency.setValueAtTime(0.06, ctx.currentTime); // very slow sweep (16s)

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(160, ctx.currentTime); // sweep range +- 160Hz

      // Connect LFO -> filter frequency
      this.windLFO.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Connect noise source -> filter -> noise gain
      this.windSource.connect(filter);
      filter.connect(this.noiseGain);

      // Start sources
      this.windSource.start(0);
      this.windLFO.start(0);
    } catch (err) {
      console.warn('Failed to start ambient noise generator:', err);
    }
  }

  public start() {
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Start repeating chords loop (every 5 seconds)
    this.playNextChord();
    this.chordTimer = setInterval(() => {
      this.playNextChord();
    }, 5000);

    // Start random wind chime sparkling bells
    this.playRandomChime();
    this.scheduleNextRandomChime();

    if (this.presetId === 'lofi_study') {
      this.startLofiBeat();
    }
  }

  public stop() {
    this.isPlaying = false;
    
    if (this.chordTimer) {
      clearInterval(this.chordTimer);
      this.chordTimer = null;
    }
    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }

    // Stop active synth nodes
    this.stopActiveOscillators();
    this.stopLofiBeat();

    // Pause audio context to stop noise
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend();
    }
  }

  private stopActiveOscillators() {
    this.activeOscillators.forEach(osc => {
      try { osc.stop(); } catch(e){}
    });
    this.activeOscillators = [];
    this.activeGains = [];
  }

  public setVolume(volume: number) {
    this.volume = volume;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setPreset(id: string) {
    this.presetId = id;
    this.currentChordIndex = 0;
    
    // Smoothly update noise parameters to match preset character
    if (this.audioCtx && this.noiseGain) {
      let noiseVol = 0.08;
      if (id === 'abyssal_deep') noiseVol = 0.14; // oceanic deep
      if (id === 'ancient_parchment') noiseVol = 0.05; // dry paper/fire crackle
      if (id === 'celestial_aurora') noiseVol = 0.03; // quiet stellar space
      if (id === 'lofi_study') noiseVol = 0.14; // warm vinyl crackle
      
      this.noiseGain.gain.setTargetAtTime(noiseVol, this.audioCtx.currentTime, 1.0);
    }

    if (this.isPlaying) {
      if (id === 'lofi_study') {
        this.startLofiBeat();
      } else {
        this.stopLofiBeat();
      }
      this.playNextChord();
    }
  }

  public getPresetId(): string {
    return this.presetId;
  }

  public setCorrupted(corrupted: boolean) {
    if (this.isCorrupted === corrupted) return;
    this.isCorrupted = corrupted;
    
    // Play transition chord immediately to signal corruption change
    if (this.isPlaying) {
      this.playNextChord();
    }
  }

  public isSoundPlaying(): boolean {
    return this.isPlaying;
  }

  private playNextChord() {
    if (!this.audioCtx || !this.padGain || !this.isPlaying) return;

    const ctx = this.audioCtx;
    const preset = SOUNDSCAPES.find(p => p.id === this.presetId) || SOUNDSCAPES[0];
    const chordList = this.isCorrupted ? preset.chordsCorrupted : preset.chordsPurified;

    const frequencies = chordList[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % chordList.length;

    // Fade out old oscillators gently
    const fadeOutTime = 1.2;
    this.activeGains.forEach(gainNode => {
      try {
        gainNode.gain.cancelScheduledValues(ctx.currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + fadeOutTime);
      } catch (err) {}
    });

    // Keep old oscillators running until faded, then sweep clean
    const oldOscs = [...this.activeOscillators];
    setTimeout(() => {
      oldOscs.forEach(o => {
        try { o.stop(); } catch(e){}
      });
    }, fadeOutTime * 1000);

    this.activeOscillators = [];
    this.activeGains = [];

    // Play new chords
    frequencies.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const nodeGain = ctx.createGain();

        // Stagger wave type for rich analog/acoustic texture
        if (this.presetId === 'ancient_parchment') {
          osc.type = idx === 0 ? 'triangle' : 'sine'; // woody reed
        } else if (this.presetId === 'celestial_aurora') {
          osc.type = 'triangle'; // rich breathing wave
        } else {
          osc.type = 'sine'; // pure pure sound
        }

        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Slow attack envelope (ambient style)
        nodeGain.gain.setValueAtTime(0, ctx.currentTime);
        // Slightly stagger each note entry for gorgeous arpeggiated feeling!
        const delay = idx * 0.12;
        const noteMaxGain = 0.15 / frequencies.length; // distribute master pad gain safely
        
        nodeGain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay);
        nodeGain.gain.linearRampToValueAtTime(noteMaxGain, ctx.currentTime + delay + 1.8);
        
        // Hold for 4.2 seconds, then fade
        nodeGain.gain.setValueAtTime(noteMaxGain, ctx.currentTime + 3.8);
        nodeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.0);

        osc.connect(nodeGain);
        nodeGain.connect(this.padGain!);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + 5.2);

        this.activeOscillators.push(osc);
        this.activeGains.push(nodeGain);
      } catch (err) {}
    });
  }

  private scheduleNextRandomChime() {
    if (this.chimeTimer) clearTimeout(this.chimeTimer);
    
    // Sleep between 3 to 7 seconds before next stardust sparkle bell
    const nextMs = 3000 + Math.random() * 4000;
    this.chimeTimer = setTimeout(() => {
      this.playRandomChime();
      this.scheduleNextRandomChime();
    }, nextMs);
  }

  private playRandomChime() {
    if (!this.audioCtx || !this.chimeGain || !this.isPlaying) return;

    try {
      const ctx = this.audioCtx;
      const preset = SOUNDSCAPES.find(p => p.id === this.presetId) || SOUNDSCAPES[0];
      const chordList = this.isCorrupted ? preset.chordsCorrupted : preset.chordsPurified;
      
      // Select a beautiful random high frequency from current scales
      const activeChord = chordList[this.currentChordIndex];
      const randomFreq = activeChord[Math.floor(Math.random() * activeChord.length)] * (2 + Math.floor(Math.random() * 2)); // Up octave for sparkles

      const osc = ctx.createOscillator();
      const nodeGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomFreq, ctx.currentTime);

      // Bell envelope (Instant strike, long slow decay)
      nodeGain.gain.setValueAtTime(0, ctx.currentTime);
      nodeGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01);
      nodeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      // Simulating a delay/echo feedback loop!
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.35; // 350ms delay
      const feedback = ctx.createGain();
      feedback.gain.value = 0.45; // echo feedback strength

      osc.connect(nodeGain);
      nodeGain.connect(this.chimeGain);

      // Wire up delay feedback loop for professional echo!
      nodeGain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(this.chimeGain);

      osc.start();
      osc.stop(ctx.currentTime + 3.0);
    } catch (e) {}
  }

  private startLofiBeat() {
    if (this.beatTimer) clearInterval(this.beatTimer);
    this.beatStep = 0;
    
    // 140 BPM eighth notes = 60 / 140 / 2 = 0.214s per step (or 0.428s for 70 BPM quarter notes)
    const stepDuration = 0.428; 
    this.beatTimer = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx || this.presetId !== 'lofi_study') return;
      this.playBeatStep();
    }, stepDuration * 1000);
  }

  private stopLofiBeat() {
    if (this.beatTimer) {
      clearInterval(this.beatTimer);
      this.beatTimer = null;
    }
  }

  private playBeatStep() {
    if (!this.audioCtx || !this.masterGain || !this.isPlaying) return;
    const ctx = this.audioCtx;
    const step = this.beatStep;
    this.beatStep = (this.beatStep + 1) % 8; // 8-step pattern

    // Step 0: Kick
    // Step 2: Rim / Snare / Shaker
    // Step 4: Kick
    // Step 5: Kick (double tap!)
    // Step 6: Rim / Snare / Shaker
    
    if (step === 0 || step === 4 || step === 5) {
      // Soft Lofi Kick: low frequency sine sweeping down quickly
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.04 * (this.volume * 2), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } catch (e) {}
    }

    if (step === 2 || step === 6) {
      // Soft Lofi Snare/Rimshot: noise bandpassed with tight decay
      try {
        const bufferSize = 0.1 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.Q.setValueAtTime(3, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01 * (this.volume * 2), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();
        noise.stop(ctx.currentTime + 0.1);
      } catch (e) {}
    }

    // High hat / shakers on odd steps
    if (step % 2 === 1) {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(8000 + Math.random() * 2000, ctx.currentTime);

        gain.gain.setValueAtTime(0.002 * (this.volume * 2), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {}
    }
  }

  /**
   * Inject ambient-synchronized typewriter bell chime when user types correctly.
   * This aligns the physical user keys perfectly with the underlying chord root!
   */
  public playHarmonicTypewriter(isCorrect: boolean) {
    if (!this.audioCtx || !this.isPlaying || this.volume < 0.01) return;

    try {
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const preset = SOUNDSCAPES.find(p => p.id === this.presetId) || SOUNDSCAPES[0];
      const chordList = this.isCorrupted ? preset.chordsCorrupted : preset.chordsPurified;
      const activeChord = chordList[this.currentChordIndex];

      const osc = ctx.createOscillator();
      const nodeGain = ctx.createGain();

      if (isCorrect) {
        // Find a consonant key notes from chord
        const baseFreq = activeChord[Math.floor(Math.random() * activeChord.length)];
        const targetFreq = baseFreq * 2; // high chime

        osc.type = 'sine';
        osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);

        nodeGain.gain.setValueAtTime(0, ctx.currentTime);
        nodeGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.005);
        nodeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      } else {
        // Dark metallic minor chime on typing mistakes
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(125, ctx.currentTime);
        nodeGain.gain.setValueAtTime(0.18, ctx.currentTime);
        nodeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      }

      osc.connect(nodeGain);
      nodeGain.connect(this.chimeGain || ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }
}

export const ambientMusic = new AmbientSynthesizer();
