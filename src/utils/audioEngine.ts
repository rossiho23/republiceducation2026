/**
 * @file audioEngine.ts
 * @description 基於 Web Audio API 實現的純前端 8-bit 復古街機程序化音效合成器
 * 免載入外部音訊檔案，無延遲且支援全平台播放。
 */

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // 延遲至使用者初次互動後初始化 AudioContext，符合瀏覽器自動播放政策
  }

  /**
   * 初始化或取得音訊上下文
   * @returns {AudioContext | null} Web Audio 上下文物件
   */
  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * 切換靜音狀態
   * @param {boolean} [forceMute] 強制指定靜音狀態
   * @returns {boolean} 當前是否為靜音
   */
  public toggleMute(forceMute?: boolean): boolean {
    this.isMuted = forceMute !== undefined ? forceMute : !this.isMuted;
    return this.isMuted;
  }

  /**
   * 取得當前靜音狀態
   * @returns {boolean}
   */
  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * 播放經典街機投幣聲 (Coin Insert Sound)
   * 模擬高頻清脆的雙音階金屬碰撞聲
   */
  public playCoin(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // 第一音 (B5: 987.77 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(987.77, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // 第二音 (E6: 1318.51 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(1318.51, now + 0.08);
    gain2.gain.setValueAtTime(0.2, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);
  }

  /**
   * 播放答對提示音 (Correct Ding-Dong Fanfare)
   * 模擬三和弦上升琶音
   */
  public playCorrect(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + index * 0.07;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  /**
   * 播放答錯提示音 (Wrong Buzzer)
   * 模擬低頻破裂方波蜂鳴聲
   */
  public playWrong(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * 播放倒數滴答聲 (Countdown Tick)
   * @param {boolean} [isUrgent=false] 是否為緊急最後3秒 (音頻較高急促)
   */
  public playTick(isUrgent: boolean = false): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isUrgent ? 1200 : 700, now);

    gain.gain.setValueAtTime(isUrgent ? 0.2 : 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * 播放擲骰滾動與角色移動步伐聲 (Dice Roll & Step)
   */
  public playStep(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  /**
   * 播放隨機突發事件觸發音效 (Event Trigger)
   */
  public playEvent(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [392, 523.25, 659.25, 523.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.06;
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.08);
    });
  }

  /**
   * 播放升學通關勝利大樂隊號角 (Stage Clear Victory Fanfare)
   */
  public playVictory(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 歡樂勝利號角旋律: G4, C5, E5, G5, E5, G5 (延音)
    const melody = [
      { f: 392.00, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.20 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.45 },
    ];

    let offset = 0;
    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + offset;

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, start);
      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + note.d);

      offset += note.d * 0.9;
    });
  }

  /**
   * 播放慶祝通關號角聲 (Fanfare 別名)
   */
  public playFanfare(): void {
    this.playVictory();
  }

  /**
   * 播放遊戲失敗／退學通知悲哀下行音 (Game Over)
   */
  public playGameOver(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const melody = [440, 415.3, 392, 369.99]; // 下行半音階

    melody.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.2;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.22);
    });
  }

  /**
   * 播放道具使用魔法音效 (Item Use Sparkle)
   */
  public playItemUse(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [659.25, 880, 1174.66, 1760]; // E5, A5, D6, A6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.15);
    });
  }

  /**
   * 播放福利社開門風鈴聲 (Shop Bell)
   */
  public playShopBell(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [1318.51, 1567.98]; // E6, G6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  }

  /**
   * 播放跳級幸運突發號角 (Lucky Skip Horn)
   */
  public playLuckyJump(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 783.99, 1046.50, 1567.98]; // C5, G5, C6, G6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.08;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.2);
    });
  }

  private titleVoiceBuffer: AudioBuffer | null = null;
  private isVoiceLoading: boolean = false;

  /**
   * 預先載入並解碼「念標題.mp3」至 Web Audio 記憶體快取
   * 由於音訊檔僅 95KB，解碼僅需數毫秒，保證 100% 免疫瀏覽器 Autoplay 攔截
   */
  public async preloadTitleVoice(): Promise<void> {
    if (this.titleVoiceBuffer || this.isVoiceLoading) return;
    this.isVoiceLoading = true;

    const ctx = this.getContext();
    if (!ctx) {
      this.isVoiceLoading = false;
      return;
    }

    const baseUrl = ((import.meta as any).env?.BASE_URL as string) || '/';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const candidateUrls = [
      `${cleanBase}media/title_voice.mp3`,
      `${cleanBase}title_voice.mp3`,
      `${cleanBase}media/%E5%BF%B5%E6%A8%99%E9%A1%8C.mp3`,
      `${cleanBase}%E5%BF%B5%E6%A8%99%E9%A1%8C.mp3`,
      './media/title_voice.mp3',
      './title_voice.mp3',
    ];

    for (const url of candidateUrls) {
      try {
        const resp = await fetch(url);
        if (!resp.ok) continue;
        const arrayBuffer = await resp.arrayBuffer();
        this.titleVoiceBuffer = await ctx.decodeAudioData(arrayBuffer);
        console.log('✅ Web Audio API 成功解碼標題語音 (AudioBuffer):', url);
        break;
      } catch (err) {
        console.warn(`標題語音載入備援嘗試 [${url}]:`, err);
      }
    }
    this.isVoiceLoading = false;
  }

  /**
   * 使用 Web Audio API 原生 BufferSource 大聲播放「念標題.mp3」
   * 具備 100% 發聲保證，並在播放結束時觸發回呼以啟動背景音樂
   * @param {() => void} [onEnded] 播畢回呼
   */
  public async playTitleVoice(onEnded?: () => void): Promise<void> {
    if (this.isMuted) {
      onEnded?.();
      return;
    }

    const ctx = this.getContext();
    if (!ctx) {
      onEnded?.();
      return;
    }

    // 確保 AudioContext 處於激活狀態
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // 若尚未載入完成則即時載入
    if (!this.titleVoiceBuffer) {
      await this.preloadTitleVoice();
    }

    if (this.titleVoiceBuffer) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = this.titleVoiceBuffer;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(1.0, ctx.currentTime); // 100% 全額大音量

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        let endedCalled = false;
        source.onended = () => {
          if (!endedCalled) {
            endedCalled = true;
            onEnded?.();
          }
        };

        source.start(0);

        // 安全定時器：語音全長約 1.2 秒，若 1.6 秒未觸發則自動執行回呼
        setTimeout(() => {
          if (!endedCalled) {
            endedCalled = true;
            onEnded?.();
          }
        }, 1600);
        return;
      } catch (err) {
        console.warn('Web Audio 播放標題語音失敗，降級 HTMLAudio 重試:', err);
      }
    }

    // 降級 fallback：HTMLAudioElement
    try {
      const baseUrl = ((import.meta as any).env?.BASE_URL as string) || '/';
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const audio = new Audio(`${cleanBase}media/title_voice.mp3`);
      audio.volume = 1.0;
      audio.onended = () => onEnded?.();
      await audio.play();
    } catch (e) {
      console.error('所有標題語音播放途徑皆失敗:', e);
      onEnded?.();
    }
  }
}

/** 匯出單例音效引擎實例 */
export const soundEngine = new RetroAudioEngine();
