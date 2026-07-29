class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  // Mechanical OGG buffer — decoded into memory on first use
  private mechBuffer: AudioBuffer | null = null;
  private mechLoading = false;
  private mechLoadFailed = false;
  private peakTime = 0; // Timestamp of the highest peak in the audio recording

  // Local settings synced from the Redux store
  private soundEnabled = true;
  private soundType: "clack" | "mechanical" | "bubble" = "mechanical";
  private soundVolume = 0.5;

  public updateSettings(enabled: boolean, type: "clack" | "mechanical" | "bubble", volume: number) {
    this.soundEnabled = enabled;
    this.soundType = type;
    this.soundVolume = volume;
  }

  // Preload mechanical sound buffer on application startup
  public preload() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
          this.loadMechBuffer();
        } catch (e) {
          // Silent catch for environments without Web Audio API support
        }
      }
    }

    // Early-resume: on the very first user gesture, wake up the AudioContext
    const earlyResume = () => {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      window.removeEventListener("click", earlyResume);
      window.removeEventListener("keydown", earlyResume);
      window.removeEventListener("touchstart", earlyResume);
    };

    window.addEventListener("click", earlyResume);
    window.addEventListener("keydown", earlyResume);
    window.addEventListener("touchstart", earlyResume);
  }

  // ── AudioContext bootstrap ─────────────────────────────────────────────────
  private initCtx(): boolean {
    if (typeof window === "undefined") return false;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;
      try {
        this.ctx = new AudioCtx();
      } catch (err) {
        return false;
      }
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return true;
  }

  // ── OGG file loader ────────────────────────────────────────────────────────
  private async loadMechBuffer() {
    if (this.mechBuffer || this.mechLoading || this.mechLoadFailed) return;
    if (!this.ctx) return;

    this.mechLoading = true;
    const urls = ["/sounds/mechanical.ogg", "/my sound.ogg", "/my%20sound.ogg"];
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const ab = await res.arrayBuffer();
        this.mechBuffer = await this.ctx.decodeAudioData(ab);
        
        // Find peak amplitude index and time of loudest click
        const data = this.mechBuffer.getChannelData(0);
        let maxVal = 0;
        let maxValIdx = 0;
        for (let i = 0; i < data.length; i++) {
          const absVal = Math.abs(data[i]);
          if (absVal > maxVal) {
            maxVal = absVal;
            maxValIdx = i;
          }
        }
        this.peakTime = maxValIdx / this.mechBuffer.sampleRate;
        this.mechLoading = false;
        return;
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[Clackr] Failed to load mechanical audio from "${url}":`, err);
        }
      }
    }
    this.mechLoadFailed = true;
    this.mechLoading = false;
  }

  // ── Play OGG buffer (one click slice) ─────────────────────────────────────
  private playMechFromBuffer(volume: number, key: string, startAt: number): boolean {
    if (!this.ctx || !this.mechBuffer) return false;
    const ctx = this.ctx;
    const buf = this.mechBuffer;

    // Start playing 80ms before the peak to capture the click attack transient.
    const offset = Math.max(0, this.peakTime - 0.08);

    // Use natural duration of the sound starting from the sound offset
    const maxDur = key === " " ? 0.50 : key === "Backspace" ? 0.40 : 0.32;
    const playDuration = Math.min(buf.duration - offset, maxDur);

    if (playDuration <= 0) return false;

    let rate: number;
    if (key === " ")          rate = 0.80 + Math.random() * 0.06;
    else if (key === "Backspace") rate = 0.90 + Math.random() * 0.06;
    else                      rate = 0.95 + Math.random() * 0.12;

    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.loop = false;
    source.playbackRate.value = rate;

    const gain = ctx.createGain();
    // High volume amplification multiplied by user's volume setting
    const baseVolume = key === " " ? 3.00 : 2.50;
    const finalVolume = baseVolume * Math.max(0, Math.min(1, volume));

    gain.gain.setValueAtTime(finalVolume, startAt);
    
    // Smooth fade-out in the last 25% of the click duration
    const fadeStart = startAt + playDuration * 0.75;
    gain.gain.setValueAtTime(finalVolume, fadeStart);
    gain.gain.linearRampToValueAtTime(0, startAt + playDuration);

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(startAt, offset, playDuration);
    return true;
  }

  // ── Main entry point ───────────────────────────────────────────────────────
  public playSound(
    type?: "clack" | "mechanical" | "bubble" | "error",
    volume?: number,
    key: string = ""
  ) {
    try {
      if (!this.initCtx() || !this.ctx) return;
      const ctx = this.ctx;

      if (!this.soundEnabled) return;

      const activeType = type || this.soundType;
      const activeVolume = volume !== undefined ? volume : this.soundVolume;

      // Schedule almost immediately (3ms buffer for audio graph setup)
      const now = ctx.currentTime + 0.003;
      const rf = 0.92 + Math.random() * 0.16;

      // ── Mechanical ────────────────────────────────────────────────────────
      if (activeType === "mechanical") {
        if (this.playMechFromBuffer(activeVolume, key, now)) return;
        this.loadMechBuffer();
        return;
      }

      // ── Clack ─────────────────────────────────────────────────────────────
      if (activeType === "clack") {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine";
        if (key === " ") {
          osc.frequency.setValueAtTime(650 * rf, now);
          osc.frequency.exponentialRampToValueAtTime(800 * rf, now + 0.022);
          gain.gain.setValueAtTime(activeVolume * 3.00, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);
          osc.start(now); osc.stop(now + 0.025);
        } else if (key === "Backspace") {
          osc.frequency.setValueAtTime(950 * rf, now);
          osc.frequency.exponentialRampToValueAtTime(1250 * rf, now + 0.015);
          gain.gain.setValueAtTime(activeVolume * 2.50, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
          osc.start(now); osc.stop(now + 0.018);
        } else {
          osc.frequency.setValueAtTime(1200 * rf, now);
          osc.frequency.exponentialRampToValueAtTime(1600 * rf, now + 0.012);
          gain.gain.setValueAtTime(activeVolume * 2.00, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
          osc.start(now); osc.stop(now + 0.015);
        }
      }

      // ── Bubble ────────────────────────────────────────────────────────────
      else if (activeType === "bubble") {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine";
        if (key === " ") {
          osc.frequency.setValueAtTime(140 * rf, now);
          osc.frequency.exponentialRampToValueAtTime(400 * rf, now + 0.07);
          gain.gain.setValueAtTime(activeVolume * 3.20, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
          osc.start(now); osc.stop(now + 0.075);
        } else if (key === "Backspace") {
          osc.frequency.setValueAtTime(190 * rf, now);
          osc.frequency.exponentialRampToValueAtTime(550 * rf, now + 0.05);
          gain.gain.setValueAtTime(activeVolume * 2.70, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now); osc.stop(now + 0.055);
        } else {
          osc.frequency.setValueAtTime(260 * rf, now);
          osc.frequency.exponentialRampToValueAtTime(700 * rf, now + 0.045);
          gain.gain.setValueAtTime(activeVolume * 2.20, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
          osc.start(now); osc.stop(now + 0.05);
        }
      }

      // ── Error ─────────────────────────────────────────────────────────────
      else if (activeType === "error") {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(135, now);
        gain.gain.setValueAtTime(activeVolume * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now); osc.stop(now + 0.12);
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Clackr] Sound error:", e);
      }
    }
  }
}

export const soundManager = new SoundSynthesizer();
