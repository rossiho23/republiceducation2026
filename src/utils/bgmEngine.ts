/**
 * @file bgmEngine.ts
 * @description 全域背景音樂 (BGM) 智慧循環播放引擎
 * 專為《民國教育委員會》設計，負責 The_Final_Question.mp3 之無縫循環播放、
 * 音量平衡、靜音控制以及瀏覽器 Autoplay 自動解鎖策略。
 */

import { reactive } from 'vue';

export interface BgmState {
  /** 是否正在播放中 */
  isPlaying: boolean;
  /** 是否為靜音狀態 */
  isMuted: boolean;
  /** 當前音量大小 (0.0 ~ 1.0) */
  volume: number;
}

class BgmEngine {
  private audio: HTMLAudioElement | null = null;
  public state: BgmState = reactive<BgmState>({
    isPlaying: false,
    isMuted: false,
    volume: 0.35, // 預設 35% 混音平衡，避免掩蓋作答音效與警報聲
  });

  private isInitialized = false;

  constructor() {
    // 從 LocalStorage 載入玩家靜音偏好
    if (typeof localStorage !== 'undefined') {
      const savedMute = localStorage.getItem('REPUBLIC_BGM_MUTED');
      if (savedMute !== null) {
        this.state.isMuted = savedMute === 'true';
      }
    }
  }

  /**
   * 初始化音訊元素與事件監聽
   */
  private initAudio(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    const baseUrl = ((import.meta as any).env?.BASE_URL as string) || '/';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const audioSrc = `${cleanBase}media/the_final_question.mp3`;

    this.audio = new Audio(audioSrc);
    this.audio.loop = true; // 無限循環播放
    this.audio.volume = this.state.isMuted ? 0 : this.state.volume;

    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
    });

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
    });

    this.isInitialized = true;
  }

  /**
   * 啟動背景音樂循環播放
   * 若遭瀏覽器自動播放策略阻擋，將註冊手勢監聽於首次點擊時自動解鎖
   */
  public async play(): Promise<void> {
    this.initAudio();
    if (!this.audio) return;

    try {
      this.audio.volume = this.state.isMuted ? 0 : this.state.volume;
      await this.audio.play();
      this.state.isPlaying = true;
    } catch (err) {
      console.warn('BGM 自動播放遭瀏覽器攔截，等待玩家首次手勢互動後解鎖:', err);
      this.state.isPlaying = false;
      this.setupUnlockOnInteraction();
    }
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
    if (this.audio && !this.state.isMuted) {
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
      window.removeEventListener('click', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
      window.removeEventListener('touchstart', unlockHandler);
    };

    window.addEventListener('click', unlockHandler, { once: true });
    window.addEventListener('keydown', unlockHandler, { once: true });
    window.addEventListener('touchstart', unlockHandler, { once: true });
  }
}

/** 全域單例背景音樂引擎實例 */
export const bgmEngine = new BgmEngine();
