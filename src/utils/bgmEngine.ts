/**
 * @file bgmEngine.ts
 * @description 全域背景音樂 (BGM) 雙曲佇列播放電台與標題語音智慧混音引擎
 * 專為《民國教育委員會》設計，負責 The_Final_Question.mp3 與 Ten_Second_Countdown.mp3 雙曲無縫交替輪播、
 * 手勢同步預溫熱解鎖 (Warm-up Pre-unlock)、手動切歌、首頁「念標題.mp3」音訊避讓 (Audio Ducking) 漸強混音。
 */

import { reactive } from 'vue';

export interface BgmTrack {
  id: string;
  title: string;
  sources: string[];
}

export interface BgmState {
  /** 是否正在播放中 */
  isPlaying: boolean;
  /** 是否為靜音狀態 */
  isMuted: boolean;
  /** 當前音量大小 (0.0 ~ 1.0) */
  volume: number;
  /** 是否處於音訊避讓狀態 (降低襯底) */
  isDucking: boolean;
  /** 是否因 8-Bit 聽力題而處於專注暫停狀態 */
  isPausedByAudioQuiz: boolean;
  /** 當前播放曲目索引 */
  currentTrackIndex: number;
  /** 當前播放曲目名稱 */
  currentTrackTitle: string;
}

class BgmEngine {
  private audio: HTMLAudioElement | null = null;
  private titleVoiceAudio: HTMLAudioElement | null = null;
  private playlist: BgmTrack[] = [];
  private titleVoiceSources: string[] = [];
  private isInitialized = false;
  private currentSourceFallbackIndex = 0;
  private currentTitleVoiceFallbackIndex = 0;
  private duckingTimer: number | null = null;
  private wasPlayingBeforeAudioQuiz = false;

  public state: BgmState = reactive<BgmState>({
    isPlaying: false,
    isMuted: false,
    volume: 0.35, // 預設 35% 混音平衡
    isDucking: false,
    isPausedByAudioQuiz: false,
    currentTrackIndex: 0,
    currentTrackTitle: 'The Final Question',
  });

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

    // 雙曲播放佇列 (依序輪播：The Final Question ⇄ Ten Second Countdown)
    this.playlist = [
      {
        id: 'THE_FINAL_QUESTION',
        title: 'The Final Question',
        sources: [
          `${cleanBase}media/the_final_question.mp3`,
          `${cleanBase}the_final_question.mp3`,
          './media/the_final_question.mp3',
          './the_final_question.mp3',
        ],
      },
      {
        id: 'TEN_SECOND_COUNTDOWN',
        title: 'Ten Second Countdown',
        sources: [
          `${cleanBase}media/ten_second_countdown.mp3`,
          `${cleanBase}ten_second_countdown.mp3`,
          './media/ten_second_countdown.mp3',
          './ten_second_countdown.mp3',
        ],
      },
    ];

    this.titleVoiceSources = [
      `${cleanBase}media/title_voice.mp3`,
      `${cleanBase}title_voice.mp3`,
      './media/title_voice.mp3',
      './title_voice.mp3',
    ];

    this.state.currentTrackTitle = this.playlist[0].title;
  }

  /**
   * 初始化當前曲目的音訊實例與事件監聽
   */
  private initAudio(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.audio = new Audio();
    this.loadTrackByIndex(this.state.currentTrackIndex);

    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
    });

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
    });

    // 當前曲目播畢時，自動交替輪播下一首！
    this.audio.addEventListener('ended', () => {
      console.log(`曲目 [${this.state.currentTrackTitle}] 播畢，自動輪播下一首曲目！`);
      this.nextTrack(true);
    });

    // 錯誤時自動切換備援路徑
    this.audio.addEventListener('error', () => {
      const currentTrack = this.playlist[this.state.currentTrackIndex];
      console.warn(`BGM 來源載入失敗 [${this.currentSourceFallbackIndex}]: ${currentTrack.sources[this.currentSourceFallbackIndex]}`);
      if (this.currentSourceFallbackIndex < currentTrack.sources.length - 1) {
        this.currentSourceFallbackIndex += 1;
        if (this.audio) {
          this.audio.src = currentTrack.sources[this.currentSourceFallbackIndex];
          this.audio.load();
          this.audio.play().catch(e => console.warn('BGM 備援路徑播放重試中:', e));
        }
      }
    });

    this.isInitialized = true;
  }

  /**
   * 載入指定索引的曲目
   * @param {number} index 曲目索引
   */
  private loadTrackByIndex(index: number): void {
    if (!this.audio) return;
    this.state.currentTrackIndex = index;
    const track = this.playlist[index];
    this.state.currentTrackTitle = track.title;
    this.currentSourceFallbackIndex = 0;
    this.audio.src = track.sources[0];
    this.audio.loop = false; // 由 ended 事件自動輪播下一首，而非單曲重複
    this.audio.volume = this.state.isMuted ? 0 : (this.state.isDucking ? 0.12 : this.state.volume);
  }

  /**
   * 在玩家投幣手勢當下執行音軌預溫熱 (Pre-unlock)
   * 建立並靜音預載 titleVoiceAudio 與 audio，取得永久播放特權
   */
  public warmUpAudioContext(): void {
    this.initAudio();

    if (!this.titleVoiceAudio && typeof window !== 'undefined') {
      this.titleVoiceAudio = new Audio(this.titleVoiceSources[0]);
      this.titleVoiceAudio.preload = 'auto';
      this.titleVoiceAudio.load();

      // 在手勢中瞬間進行零音量觸發，讓瀏覽器標記為已授權
      const originalVolume = this.state.isMuted ? 0 : 1.0;
      this.titleVoiceAudio.volume = 0;
      this.titleVoiceAudio.play().then(() => {
        this.titleVoiceAudio?.pause();
        if (this.titleVoiceAudio) {
          this.titleVoiceAudio.currentTime = 0;
          this.titleVoiceAudio.volume = originalVolume;
        }
      }).catch(err => {
        console.warn('標題語音手勢預溫熱已捕捉:', err);
      });
    }

    if (this.audio) {
      this.audio.preload = 'auto';
      this.audio.load();
    }
  }

  /**
   * 啟動背景音樂播放
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
        this.titleVoiceAudio.volume = this.state.isMuted ? 0 : 1.0;
        this.titleVoiceAudio.currentTime = 0;

        const onVoiceEnded = () => {
          this.fadeRestoreBgmVolume();
          this.titleVoiceAudio?.removeEventListener('ended', onVoiceEnded);
        };
        this.titleVoiceAudio.addEventListener('ended', onVoiceEnded, { once: true });

        await this.titleVoiceAudio.play();
      } catch (err) {
        console.warn('標題語音主路徑播放失敗，切換備援重試:', err);
        if (this.currentTitleVoiceFallbackIndex < this.titleVoiceSources.length - 1) {
          this.currentTitleVoiceFallbackIndex += 1;
          this.titleVoiceAudio.src = this.titleVoiceSources[this.currentTitleVoiceFallbackIndex];
          this.titleVoiceAudio.load();
          this.titleVoiceAudio.play().catch(e => console.error('標題語音備援播放失敗:', e));
        } else {
          this.fadeRestoreBgmVolume();
        }
      }
    }

    if (this.duckingTimer) clearTimeout(this.duckingTimer);
    this.duckingTimer = window.setTimeout(() => {
      this.fadeRestoreBgmVolume();
    }, 2000);
  }

  /**
   * 切換至下一首曲目 (支援雙曲無限輪流切換)
   * @param {boolean} autoPlay 是否在切換後立即自動播放
   */
  public nextTrack(autoPlay = true): void {
    this.initAudio();
    if (!this.audio) return;

    // 雙曲索引切換 (0 -> 1 -> 0 -> 1 ...)
    const nextIndex = (this.state.currentTrackIndex + 1) % this.playlist.length;
    this.loadTrackByIndex(nextIndex);

    if (autoPlay && !this.state.isMuted) {
      this.audio.play().then(() => {
        this.state.isPlaying = true;
      }).catch(err => {
        console.warn('切換下一首播放失敗:', err);
      });
    }
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
   * 遇到 8-Bit 聽力音樂題時自動暫停背景音樂 (專注聆聽模式)
   * 記錄暫停前之播放狀態，以便作答結束後精確原位恢復
   */
  public pauseForAudioQuiz(): void {
    if (this.state.isPausedByAudioQuiz) return;
    this.wasPlayingBeforeAudioQuiz = this.state.isPlaying;
    this.state.isPausedByAudioQuiz = true;

    if (this.audio) {
      this.audio.pause();
      this.state.isPlaying = false;
    }
  }

  /**
   * 音樂題作答結束、換題或關閉題卡時恢復背景音樂
   * 防呆保護：若玩家本來就設定靜音，或進入音樂題前原本就處於暫停狀態，則不擅自播放
   */
  public resumeFromAudioQuiz(): void {
    if (!this.state.isPausedByAudioQuiz) return;
    this.state.isPausedByAudioQuiz = false;

    if (this.wasPlayingBeforeAudioQuiz && !this.state.isMuted && this.audio) {
      this.play().catch(err => {
        console.warn('恢復 BGM 播放重試中:', err);
      });
    }
    this.wasPlayingBeforeAudioQuiz = false;
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
