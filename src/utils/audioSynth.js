// src/utils/audioSynth.js
class AudioSynth {
  constructor() {
    this.ctx = null;
    this.compressor = null;
    this.masterGain = null;
    
    // Always-on ambience components
    this.droneOsc = null;
    this.noiseSource = null;
    this.noiseFilter = null;
    this.ambienceFilter = null;
    this.ambienceVolumeGain = null;
    this.noiseVolumeGain = null;
    
    // Sequencer for Alto's Adventure style background music
    this.seqStep = 0;
    this.seqTimer = null;
    
    this.padStarted = false;
    this.muted = false;
  }

  init() {
    if (this.ctx) return;
    
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // 1. Create a dynamics compressor to prevent any clipping or loud distortion
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);
      
      // 2. Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.8, this.ctx.currentTime);
      this.masterGain.gain.value = this.muted ? 0 : 0.8;
      
      // Route Compressor -> MasterGain -> Destination
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      
      // 3. Ambience lowpass filter (modulated by connection level)
      this.ambienceFilter = this.ctx.createBiquadFilter();
      this.ambienceFilter.type = 'lowpass';
      this.ambienceFilter.frequency.setValueAtTime(700, this.ctx.currentTime); // clear
      this.ambienceFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);
      
      // 4. Ambience volume gain
      this.ambienceVolumeGain = this.ctx.createGain();
      this.ambienceVolumeGain.gain.setValueAtTime(0.35, this.ctx.currentTime); // gentle base level
      
      // Route Ambience Filter -> Ambience Volume -> Compressor
      this.ambienceFilter.connect(this.ambienceVolumeGain);
      this.ambienceVolumeGain.connect(this.compressor);
      
      this.initAmbienceNodes();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  initAmbienceNodes() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // A. Deep sine-wave drone (grounding tone around 110 Hz - A2)
    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = 'sine';
    this.droneOsc.frequency.setValueAtTime(110.00, now);
    
    // Drone gain (very quiet and sub-bass focused)
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.06, now);
    
    this.droneOsc.connect(this.droneGain);
    this.droneGain.connect(this.ambienceFilter);
    
    // B. Brown noise generation (rumble / masking texture)
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 0.04; // Extremely quiet, safe from clipping
    }
    
    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;
    
    // C. Soft wind/air texture filter (bandpass around 500Hz)
    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.setValueAtTime(500, now);
    this.noiseFilter.Q.setValueAtTime(0.7, now);
    
    this.noiseVolumeGain = this.ctx.createGain();
    this.noiseVolumeGain.gain.setValueAtTime(0.03, now); // subtle wind level
    
    this.noiseSource.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseVolumeGain);
    this.noiseVolumeGain.connect(this.ambienceFilter);
  }

  // --- Upright Ambient Piano Synth Node ---
  playPianoNote(freq, volume = 0.25, duration = 3.0) {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    const osc1 = this.ctx.createOscillator(); // Fundamental
    const osc2 = this.ctx.createOscillator(); // Tines/Overtones
    const osc3 = this.ctx.createOscillator(); // Higher ring
    
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();
    const gain3 = this.ctx.createGain();
    
    // Soft lowpass filter to round off digital edge and make notes woody/warm
    const noteFilter = this.ctx.createBiquadFilter();
    noteFilter.type = 'lowpass';
    noteFilter.frequency.setValueAtTime(800, now);
    noteFilter.Q.setValueAtTime(1.0, now);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);
    
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);

    // Warm envelope
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(volume * 0.75, now + 0.008);
    gain1.gain.exponentialRampToValueAtTime(volume * 0.15, now + 0.35);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    // Tines decay
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(volume * 0.25, now + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    // High overtone decay
    gain3.gain.setValueAtTime(0, now);
    gain3.gain.linearRampToValueAtTime(volume * 0.1, now + 0.002);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);
    
    gain1.connect(noteFilter);
    gain2.connect(noteFilter);
    gain3.connect(noteFilter);
    
    // Route to ambienceFilter so it is muffled/faded dynamically during combat/low connection
    noteFilter.connect(this.ambienceFilter);
    
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
    osc3.stop(now + duration + 0.1);
  }

  playPianoChord(chordNotes, volume = 0.22, duration = 4.0) {
    if (!this.ctx) return;
    // Play notes in an arpeggiated piano roll format
    chordNotes.forEach((freq, idx) => {
      const delay = idx * 0.08; // 80ms roll
      setTimeout(() => {
        if (this.padStarted) {
          this.playPianoNote(freq, volume, duration - delay);
        }
      }, delay * 1000);
    });
  }

  // --- Alto's Adventure Style Loop Sequencer ---
  startSequence() {
    this.stopSequence();
    this.seqStep = 0; // 32-beat loop at 60 bpm (8 beats per chord)

    const tick = () => {
      if (!this.padStarted) return;
      
      const beat = this.seqStep % 32;
      
      // Measure 1 (Em9): Beats 0-7
      if (beat === 0) {
        this.playPianoChord([82.41, 196.00, 246.94, 293.66, 369.99], 0.15, 6.0); // E2, G3, B3, D4, F#4
      } else if (beat === 3) {
        this.playPianoNote(493.88, 0.10, 3.0); // B4
      } else if (beat === 5) {
        this.playPianoNote(392.00, 0.08, 3.0); // G4
      }
      
      // Measure 2 (Cmaj9): Beats 8-15
      else if (beat === 8) {
        this.playPianoChord([65.41, 196.00, 246.94, 293.66, 329.63], 0.15, 6.0); // C2, G3, B3, D4, E4
      } else if (beat === 10) {
        this.playPianoNote(440.00, 0.08, 3.0); // A4
      } else if (beat === 11) {
        this.playPianoNote(392.00, 0.10, 3.0); // G4
      } else if (beat === 13) {
        this.playPianoNote(329.63, 0.06, 3.0); // E4
      }
      
      // Measure 3 (Gmaj9): Beats 16-23
      else if (beat === 16) {
        this.playPianoChord([98.00, 246.94, 293.66, 369.99, 440.00], 0.15, 6.0); // G2, B3, D4, F#4, A4
      } else if (beat === 19) {
        this.playPianoNote(587.33, 0.10, 3.0); // D5
      } else if (beat === 21) {
        this.playPianoNote(493.88, 0.08, 3.0); // B4
      }
      
      // Measure 4 (Bm7): Beats 24-31
      else if (beat === 24) {
        this.playPianoChord([123.47, 185.00, 220.00, 293.66, 369.99], 0.15, 6.0); // B2, F#3, A3, D4, F#4
      } else if (beat === 26) {
        this.playPianoNote(369.99, 0.08, 3.0); // F#4
      } else if (beat === 27) {
        this.playPianoNote(329.63, 0.06, 3.0); // E4
      } else if (beat === 29) {
        this.playPianoNote(293.66, 0.10, 3.0); // D4
      }
      
      this.seqStep++;
      this.seqTimer = setTimeout(tick, 1000); // 60 bpm (1 beat = 1s)
    };
    
    // Trigger first beat immediately
    tick();
  }

  stopSequence() {
    if (this.seqTimer) {
      clearTimeout(this.seqTimer);
      this.seqTimer = null;
    }
  }

  // --- Engine Controls ---
  startPad() {
    this.init();
    if (!this.ctx || this.padStarted) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
  
    this.padStarted = true;
    
    // Start looping piano sequencer (DISABLED)
    // this.startSequence();
  }

  stopPad() {
    if (!this.ctx || !this.padStarted) return;
    const now = this.ctx.currentTime;
    
    // Stop sequence
    this.stopSequence();
    
    // Fade out ambience smoothly
    try {
      this.ambienceVolumeGain.gain.cancelScheduledValues(now);
      this.ambienceVolumeGain.gain.setValueAtTime(this.ambienceVolumeGain.gain.value, now);
      this.ambienceVolumeGain.gain.linearRampToValueAtTime(0, now + 1.0);
    } catch {
      // ignore
    }
    
    this.padStarted = false;
    
    setTimeout(() => {
      try {
        if (this.droneOsc) { this.droneOsc.stop(); this.droneOsc.disconnect(); }
        if (this.noiseSource) { this.noiseSource.stop(); this.noiseSource.disconnect(); }
      } catch {
        // ignore
      }
      
      this.droneOsc = null;
      this.noiseSource = null;
      this.noiseFilter = null;
      this.noiseVolumeGain = null;
      
      // Reset filter and gain to defaults
      if (this.ambienceFilter) this.ambienceFilter.frequency.setValueAtTime(700, this.ctx.currentTime);
      if (this.ambienceVolumeGain) this.ambienceVolumeGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      
      this.initAmbienceNodes(); // Recreate nodes for next start
    }, 1200);
  }

  setMuted(muted) {
    this.muted = muted;
    console.log("AudioSynth.setMuted called with:", muted, "ctx:", !!this.ctx, "masterGain:", !!this.masterGain);
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    try {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.8, now);
      this.masterGain.gain.value = muted ? 0 : 0.8;
      console.log("AudioSynth masterGain.gain set to:", this.masterGain.gain.value);
    } catch (e) {
      console.error("AudioSynth error setting masterGain.gain:", e);
      try {
        this.masterGain.gain.value = muted ? 0 : 0.8;
      } catch {
        // ignore
      }
    }
  }

  updateConnection(level) {
    if (!this.ctx || !this.padStarted) return;
    
    const pct = level / 100; // 0.0 to 1.0
    
    // Dynamic Filter Mapping:
    // 100% level -> 700Hz cutoff (Clear ambience)
    // 75% level  -> 450Hz cutoff (Slightly darker filter)
    // 50% level  -> 250Hz cutoff (More fog/noise)
    // 25% level  -> 120Hz cutoff (Muffled ambience)
    // 10% level  -> 80Hz cutoff  (Almost silent)
    const targetCutoff = Math.max(80, Math.min(700, 80 + (pct * pct) * 620));
    
    // Gain mapping:
    // 100% level -> 0.35 (normal clear volume)
    // 10% level  -> 0.01 (almost silent)
    const targetGain = Math.max(0.01, Math.min(0.35, 0.01 + pct * 0.34));
    
    const now = this.ctx.currentTime;
    try {
      this.ambienceFilter.frequency.cancelScheduledValues(now);
      this.ambienceFilter.frequency.setValueAtTime(this.ambienceFilter.frequency.value, now);
      this.ambienceFilter.frequency.exponentialRampToValueAtTime(targetCutoff, now + 1.2);
      
      this.ambienceVolumeGain.gain.cancelScheduledValues(now);
      this.ambienceVolumeGain.gain.setValueAtTime(this.ambienceVolumeGain.gain.value, now);
      this.ambienceVolumeGain.gain.linearRampToValueAtTime(targetGain, now + 1.2);
    } catch (e) {
      // ignore
    }
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const now = this.ctx.currentTime;
    
    // Short ascending tone / bell chime. Duration: 100-200ms
    const playBell = (freq, delay) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.150); // 150ms duration
      
      osc.connect(gain);
      gain.connect(this.compressor); // Route to compressor to keep levels polished
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.180);
    };
    
    playBell(523.25, 0);       // C5
    playBell(659.25, 0.04);    // E5
  }

  playFailure() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const now = this.ctx.currentTime;
    
    // Low descending tone (200ms)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.200);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.20, now + 0.010);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.200);
    
    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(now);
    osc.stop(now + 0.220);
    
    // Soft muffled thump (80Hz -> 40Hz)
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    
    thump.type = 'sine';
    thump.frequency.setValueAtTime(80, now);
    thump.frequency.exponentialRampToValueAtTime(40, now + 0.120);
    
    thumpGain.gain.setValueAtTime(0, now);
    thumpGain.gain.linearRampToValueAtTime(0.30, now + 0.005);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.120);
    
    thump.connect(thumpGain);
    thumpGain.connect(this.compressor);
    thump.start(now);
    thump.stop(now + 0.150);
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    
    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  playVictory() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const now = this.ctx.currentTime;
    
    // Warm chime sequence, slow upward arpeggio, soft pad swell (relief, not celebration)
    const notes = [196.00, 261.63, 329.63, 392.00, 493.88, 587.33]; // G3, C4, E4, G4, B4, D5 (pure sines)
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.150); // slow upward roll
      
      gain.gain.setValueAtTime(0, now + idx * 0.150);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.150 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.150 + 2.0); // long release
      
      osc.connect(gain);
      gain.connect(this.compressor);
      osc.start(now + idx * 0.150);
      osc.stop(now + idx * 0.150 + 2.1);
    });
  }

  playDefeat() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const now = this.ctx.currentTime;
    
    // Deep fading drone, descending tone (isolation, not failure)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(40, now + 2.5); // long slide down
    
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0, now + 2.5); // slow fadeout
    
    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(now);
    osc.stop(now + 2.6);
  }
}

export const audioSynth = new AudioSynth();
