/**
 * @file bgmEngine.ts
 * @description 全域背景音樂 (BGM) 與標題語音智慧混音引擎
 * 專為《民國教育委員會》設計，負責 The_Final_Question.mp3 之無縫循環播放、
 * 首頁「念標題.mp3」領銜播放與專業音訊避讓 (Audio Ducking) 漸強混音。
 */

import { reactive } from 'vue';

export interface BgmState {
  /** 是否正在播放中 */
  isPlaying: boolean;
  /** 是否為靜音狀態 */
  isMuted: boolean;
  /** 當前音量大小 (0.0 ~ 1.0) */
  volume: number;
  /** 是否處於音訊避讓狀態 (降低襯底) */
  isDucking: boolean;
}

class BgmEngine {
  private audio: HTMLAudioElement | null = null;
  private titleVoiceAudio: HTMLAudioElement | null = null;

  public state: BgmState = reactive<BgmState>({
    isPlaying: false,
    isMuted: false,
    volume: 0.35, // 預設 35% 混音平衡
    isDucking: false,
  });

  private isInitialized = false;
  private candidateIndex = 0;
  private candidateSources: string[] = [];
  private titleVoiceSources: string[] = [];
  private duckingTimer: number | null = null;

  constructor() {
    // 從 LocalStorage 載入玩家靜音偏好
    if (typeof localStorage !== 'undefined') {
      const savedMute = localStorage.getItem('REPUBLIC_BGM_MUTED');
      if (savedMute !== null) {
        this.state.isMuted = savedMute === 'true';
      }
    }

    const baseUrl = ((import.meta as any).env?.BASE_URL as string) || '/';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    this.candidateSources = [
      `${cleanBase}media/the_final_question.mp3`,
      `${cleanBase}the_final_question.mp3`,
      './media/the_final_question.mp3',
      './the_final_question.mp3',
    ];

    this.titleVoiceSources = [
      `${cleanBase}media/title_voice.mp3`,
      `${cleanBase}title_voice.mp3`,
      './media/title_voice.mp3',
      './title_voice.mp3',
    ];
  }

  /**
   * 初始化音訊元素與事件監聽
   */
  private initAudio(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    const audioSrc = this.candidateSources[this.candidateIndex];
    this.audio = new Audio(audioSrc);
    this.audio.loop = true; // 無限循環播放
    this.audio.volume = this.state.isMuted ? 0 : this.state.volume;

    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
    });

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
    });

    this.audio.addEventListener('error', () => {
      console.warn(`BGM 來源載入失敗 [${this.candidateIndex}]: ${this.candidateSources[this.candidateIndex]}`);
      if (this.candidateIndex < this.candidateSources.length - 1) {
        this.candidateIndex += 1;
        if (this.audio) {
          this.audio.src = this.candidateSources[this.candidateIndex];
          this.audio.load();
          this.audio.play().catch(e => console.warn('BGM 備援路徑播放重試:', e));
        }
      }
    });

    this.isInitialized = true;
  }

  /**
   * 啟動背景音樂循環播放
   */
  public async play(): Promise<void> {
    this.initAudio();
    if (!this.audio) return;

    try {
      this.audio.volume = this.state.isMuted ? 0 : (this.state.isDucking ? 0.12 : this.state.volume);
      await this.audio.play();
      this.state.isPlaying = true;
    } catch (err) {
      console.warn('BGM 自動播放遭瀏覽器攔截，等待玩家手勢互動後解鎖:', err);
      this.state.isPlaying = false;
      this.setupUnlockOnInteraction();
    }
  }

  /**
   * 播放標題語音「念標題.mp3」，並同時執行 BGM 音訊避讓 (Audio Ducking)
   * 在念標題期間將 BGM 壓低至 12% 襯底，語音結束後平滑回復至 35%
   */
  public async playTitleVoiceWithDucking(): Promise<void> {
    this.initAudio();

    // 啟動 BGM 避讓狀態
    this.state.isDucking = true;
    if (this.audio && !this.state.isMuted) {
      this.audio.volume = 0.12; // 降為 12% 襯底
    }

    // 確保 BGM 正在播放
    this.play().catch(() => {});

    // 準備標題語音
    if (!this.titleVoiceAudio && typeof window !== 'undefined') {
      this.titleVoiceAudio = new Audio(this.titleVoiceSources[0]);
    }

    if (this.titleVoiceAudio) {
      try {
        this.titleVoiceAudio.volume = this.state.isMuted ? 0 : 1.0; // 標題大聲清晰
        this.titleVoiceAudio.currentTime = 0;

        // 監聽播畢事件以回復 BGM 音量
        const onVoiceEnded = () => {
          this.fadeRestoreBgmVolume();
          this.titleVoiceAudio?.removeEventListener('ended', onVoiceEnded);
        };
        this.titleVoiceAudio.addEventListener('ended', onVoiceEnded, { once: true });

        await this.titleVoiceAudio.play();
      } catch (err) {
        console.warn('標題語音播放被攔截或失敗，直接回復 BGM 音量:', err);
        this.fadeRestoreBgmVolume();
      }
    }

    // 安全計時器：即使 ended 事件未觸發，2 秒後也強行漸強回復
    if (this.duckingTimer) clearTimeout(this.duckingTimer);
    this.duckingTimer = window.setTimeout(() => {
      this.fadeRestoreBgmVolume();
    }, 2000);
  }

  /**
   * 平滑漸強回復 BGM 音量至標準設定值
   */
  private fadeRestoreBgmVolume(): void {
    if (!this.state.isDucking) return;
    this.state.isDucking = false;

    if (!this.audio || this.state.isMuted) return;

    const targetVolume = this.state.volume;
    let currentVol = this.audio.volume;
    const step = 0.03;

    const interval = window.setInterval(() => {
      if (!this.audio || this.state.isMuted || this.state.isDucking) {
        clearInterval(interval);
        return;
      }

      currentVol = Math.min(targetVolume, currentVol + step);
      this.audio.volume = currentVol;

      if (currentVol >= targetVolume) {
        this.audio.volume = targetVolume;
        clearInterval(interval);
      }
    }, 40);
  }

  /**
   * 暫停背景音樂
   */
  public pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.state.isPlaying = false;
    }
  }

  /**
   * 切換播放 / 暫停狀態
   */
  public togglePlay(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * 切換靜音狀態
   */
  public toggleMute(): void {
    this.state.isMuted = !this.state.isMuted;
    if (this.audio) {
      this.audio.volume = this.state.isMuted ? 0 : this.state.volume;
    }
    if (this.titleVoiceAudio) {
      this.titleVoiceAudio.volume = this.state.isMuted ? 0 : 1.0;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('REPUBLIC_BGM_MUTED', String(this.state.isMuted));
    }
  }

  /**
   * 設定背景音樂音量大小 (0.0 ~ 1.0)
   * @param {number} vol 目標音量數值
   */
  public setVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol));
    this.state.volume = clamped;
    if (this.audio && !this.state.isMuted && !this.state.isDucking) {
      this.audio.volume = clamped;
    }
  }

  /**
   * 註冊玩家任意點擊或按鍵之手勢互動以解鎖播放
   */
  private setupUnlockOnInteraction(): void {
    const unlockHandler = async () => {
      if (this.audio && !this.state.isPlaying) {
        try {
          this.audio.volume = this.state.isMuted ? 0 : this.state.volume;
          await this.audio.play();
          this.state.isPlaying = true;
        } catch (e) {
          // 忽略二次攔截
        }
      }
      window.removeEventListener('click', unlockHandler, true);
      window.removeEventListener('keydown', unlockHandler, true);
      window.removeEventListener('touchstart', unlockHandler, true);
    };

    window.addEventListener('click', unlockHandler, { once: true, capture: true });
    window.addEventListener('keydown', unlockHandler, { once: true, capture: true });
    window.addEventListener('touchstart', unlockHandler, { once: true, capture: true });
  }
}

/** 全域單例背景音樂引擎實例 */
export const bgmEngine = new BgmEngine();
