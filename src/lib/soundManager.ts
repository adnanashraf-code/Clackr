

class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  // Mechanical OGG buffer — decoded into memory on first use
  private mechBuffer: AudioBuffer | null = null;
  private mechLoading = false;
  private mechLoadFailed = false;
  private peakTime = 0; // Timestamp of the highest peak in the audio recording

  // Local settings synced from the Redux store to prevent circular dependencies
  private soundEnabled = true;
  private soundType: "clack" | "mechanical" | "bubble" = "mechanical";
  private soundVolume = 0.5;

  public updateSettings(enabled: boolean, type: "clack" | "mechanical" | "bubble", volume: number) {
    this.soundEnabled = enabled;
    this.soundType = type;
    this.soundVolume = volume;
  }

  // ── AudioContext bootstrap ─────────────────────────────────────────────────
  // Must be called synchronously inside a user-gesture handler (keydown/click).
  // Calls resume() fire-and-forget — browsers honour it because we're in
  // the user-gesture call stack. We then schedule audio 50 ms in the future
  // so the context has time to reach "running" state.
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

    // Fire-and-forget resume — still inside the keydown/click call stack,
    // so the browser grants permission.
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return true;
  }

  // ── OGG file loader ────────────────────────────────────────────────────────
  // Decodes embedded Base64 data URL directly. Once decoded, the AudioBuffer
  // lives in RAM, so the original public/my sound.ogg file can be safely deleted.
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
        if (process.env.NODE_ENV === "development") {
          console.log(`[Clackr] ✅ Mechanical OGG loaded from "${url}" — duration: ${this.mechBuffer.duration.toFixed(2)}s, peak at ${this.peakTime.toFixed(4)}s`);
        }
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

    // Use natural duration of the sound starting from the sound offset, otherwise cap it to prevent overlapping issues
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
    // Force extreme high volume amplification (3.0 for spacebar, 2.5 for other keys)
    const finalVolume = key === " " ? 3.00 : 2.50;
    gain.gain.setValueAtTime(finalVolume, startAt);
    
    // Smooth fade-out in the last 25% of the click duration to avoid any popping/clicking artifacts
    const fadeStart = startAt + playDuration * 0.75;
    gain.gain.setValueAtTime(finalVolume, fadeStart);
    gain.gain.linearRampToValueAtTime(0, startAt + playDuration);

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(startAt, offset, playDuration);  // start at the click transient, play for playDuration
    return true;
  }

  // ── Synthesis fallback — 4-layer mechanical click ─────────────────────────
  private playMechSynth(volume: number, key: string, now: number) {
    const ctx = this.ctx!;
    const pm = 0.94 + Math.random() * 0.12;

    let thudS: number, thudE: number, thudD: number, thudV: number;
    let snapS: number, snapE: number, snapD: number, snapV: number;
    let noiseD: number, noiseV: number;
    let bodyF: number, bodyD: number, bodyV: number;

    if (key === " ") {
      thudS = 95;  thudE = 38;  thudD = 0.07;  thudV = 0.9;
      snapS = 420; snapE = 900; snapD = 0.018; snapV = 0.35;
      noiseD = 0.025; noiseV = 0.15;
      bodyF = 160; bodyD = 0.06; bodyV = 0.25;
    } else if (key === "Backspace") {
      thudS = 130; thudE = 55;  thudD = 0.045; thudV = 0.75;
      snapS = 680; snapE = 1400; snapD = 0.012; snapV = 0.28;
      noiseD = 0.018; noiseV = 0.12;
      bodyF = 220; bodyD = 0.04; bodyV = 0.20;
    } else {
      thudS = 170; thudE = 68;  thudD = 0.032; thudV = 0.60;
      snapS = 900; snapE = 1800; snapD = 0.009; snapV = 0.22;
      noiseD = 0.012; noiseV = 0.10;
      bodyF = 280; bodyD = 0.028; bodyV = 0.15;
    }

    // Layer 1 — low thud
    const oT = ctx.createOscillator(), gT = ctx.createGain();
    oT.type = "triangle";
    oT.frequency.setValueAtTime(thudS * pm, now);
    oT.frequency.exponentialRampToValueAtTime(thudE * pm, now + thudD);
    gT.gain.setValueAtTime(volume * thudV, now);
    gT.gain.exponentialRampToValueAtTime(0.0001, now + thudD);
    oT.connect(gT); gT.connect(ctx.destination);
    oT.start(now); oT.stop(now + thudD + 0.005);

    // Layer 2 — high snap
    const oS = ctx.createOscillator(), gS = ctx.createGain();
    oS.type = "sine";
    oS.frequency.setValueAtTime(snapS * pm, now);
    oS.frequency.exponentialRampToValueAtTime(snapE * pm, now + snapD);
    gS.gain.setValueAtTime(volume * snapV, now);
    gS.gain.exponentialRampToValueAtTime(0.0001, now + snapD);
    oS.connect(gS); gS.connect(ctx.destination);
    oS.start(now); oS.stop(now + snapD + 0.003);

    // Layer 3 — white noise burst (physical contact)
    const sr = ctx.sampleRate;
    const nLen = Math.ceil(sr * (noiseD + 0.005));
    const nBuf = ctx.createBuffer(1, nLen, sr);
    const nData = nBuf.getChannelData(0);
    for (let i = 0; i < nLen; i++) nData[i] = Math.random() * 2 - 1;
    const nSrc = ctx.createBufferSource();
    nSrc.buffer = nBuf; nSrc.loop = false;
    const bpf = ctx.createBiquadFilter();
    bpf.type = "bandpass"; bpf.frequency.value = 3500 * pm; bpf.Q.value = 1.2;
    const gN = ctx.createGain();
    gN.gain.setValueAtTime(volume * noiseV, now);
    gN.gain.exponentialRampToValueAtTime(0.0001, now + noiseD);
    nSrc.connect(bpf); bpf.connect(gN); gN.connect(ctx.destination);
    nSrc.start(now); nSrc.stop(now + noiseD + 0.005);

    // Layer 4 — body resonance
    const oB = ctx.createOscillator(), gB = ctx.createGain();
    oB.type = "sine";
    oB.frequency.setValueAtTime(bodyF * pm, now);
    gB.gain.setValueAtTime(0, now);
    gB.gain.setValueAtTime(volume * bodyV, now + 0.003);
    gB.gain.exponentialRampToValueAtTime(0.0001, now + bodyD);
    oB.connect(gB); gB.connect(ctx.destination);
    oB.start(now); oB.stop(now + bodyD + 0.005);
  }

  // ── Main entry point (SYNCHRONOUS — must stay sync for user-gesture chain) ──
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

      // Schedule slightly in future — gives the AudioContext 50 ms to resume
      // from suspended state before nodes need to fire.
      const now = ctx.currentTime + 0.05;
      const rf = 0.92 + Math.random() * 0.16;

      // ── Mechanical ────────────────────────────────────────────────────────
      if (activeType === "mechanical") {
        if (this.playMechFromBuffer(activeVolume, key, now)) return;
        // Kick off OGG load (async, doesn't block)
        this.loadMechBuffer();
        // Synthesis while loading
        this.playMechSynth(activeVolume, key, now);
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
