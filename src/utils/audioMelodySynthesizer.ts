/**
 * @file audioMelodySynthesizer.ts
 * @description 8-bit 懷舊旋律程序化合成器 (Retro 8-bit Melody Synthesizer)
 * 基於 Web Audio API 即時合成經典台灣懷舊動漫與廣告曲音階，供聽力猜歌與多媒體題型使用。
 */

import { AudioMelodyItem } from '../types/quiz';

/** 音階頻率常數對照表 (Hz) */
const NOTE = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  REST: 0
};

/** 經典懷舊旋律資料庫 */
export const RETRO_MELODIES: AudioMelodyItem[] = [
  {
    id: 'melody-tatung',
    title: '大同寶寶國貨神曲',
    hint: '「大同大同國貨好，大同產品最可靠～」',
    notes: [
      { freq: NOTE.G4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.3 },
      { freq: NOTE.E4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.4 },
      { freq: NOTE.A4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.5 },
      { freq: NOTE.E4, duration: 0.3 },
      { freq: NOTE.D4, duration: 0.3 },
      { freq: NOTE.C4, duration: 0.6 }
    ]
  },
  {
    id: 'melody-susu',
    title: '斯斯感冒膠囊經典台詞廣告',
    hint: '「感冒用斯斯，咳嗽用斯斯，鼻塞鼻炎用斯斯～」',
    notes: [
      { freq: NOTE.C4, duration: 0.25 },
      { freq: NOTE.E4, duration: 0.25 },
      { freq: NOTE.G4, duration: 0.35 },
      { freq: NOTE.REST, duration: 0.1 },
      { freq: NOTE.C4, duration: 0.25 },
      { freq: NOTE.E4, duration: 0.25 },
      { freq: NOTE.G4, duration: 0.35 },
      { freq: NOTE.REST, duration: 0.1 },
      { freq: NOTE.A4, duration: 0.25 },
      { freq: NOTE.G4, duration: 0.25 },
      { freq: NOTE.E4, duration: 0.3 },
      { freq: NOTE.D4, duration: 0.4 }
    ]
  },
  {
    id: 'melody-mazinger',
    title: '無敵鐵金剛熱血主題曲',
    hint: '「無敵鐵金剛！無敵鐵金剛！無敵鐵金～剛！」',
    notes: [
      { freq: NOTE.C4, duration: 0.2 },
      { freq: NOTE.D4, duration: 0.2 },
      { freq: NOTE.E4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.4 },
      { freq: NOTE.REST, duration: 0.1 },
      { freq: NOTE.C5, duration: 0.3 },
      { freq: NOTE.B4, duration: 0.2 },
      { freq: NOTE.A4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.5 },
      { freq: NOTE.E4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.6 }
    ]
  },
  {
    id: 'melody-slam-dunk',
    title: '灌籃高手經典熱血名曲',
    hint: '「直到世界的盡頭～也不願與你分離～」',
    notes: [
      { freq: NOTE.E4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.3 },
      { freq: NOTE.A4, duration: 0.4 },
      { freq: NOTE.C5, duration: 0.4 },
      { freq: NOTE.B4, duration: 0.3 },
      { freq: NOTE.A4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.5 },
      { freq: NOTE.E4, duration: 0.3 },
      { freq: NOTE.D4, duration: 0.6 }
    ]
  },
  {
    id: 'melody-green-apple',
    title: '小虎隊 青蘋果樂園',
    hint: '「週末午夜潮水～跟著音樂跳動～」',
    notes: [
      { freq: NOTE.A4, duration: 0.25 },
      { freq: NOTE.C5, duration: 0.25 },
      { freq: NOTE.D5, duration: 0.3 },
      { freq: NOTE.C5, duration: 0.25 },
      { freq: NOTE.A4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.25 },
      { freq: NOTE.A4, duration: 0.5 },
      { freq: NOTE.E4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.4 }
    ]
  },
  {
    id: 'melody-doraemon',
    title: '哆啦A夢小叮噹經典主題歌',
    hint: '「真奇妙，真奇妙，如果我有小叮噹～」',
    notes: [
      { freq: NOTE.C4, duration: 0.3 },
      { freq: NOTE.E4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.3 },
      { freq: NOTE.C5, duration: 0.4 },
      { freq: NOTE.B4, duration: 0.2 },
      { freq: NOTE.A4, duration: 0.3 },
      { freq: NOTE.G4, duration: 0.4 },
      { freq: NOTE.F4, duration: 0.3 },
      { freq: NOTE.E4, duration: 0.3 },
      { freq: NOTE.D4, duration: 0.5 }
    ]
  }
];

class MelodySynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTimeout: any = null;

  /**
   * 初始化 AudioContext
   */
  private initContext(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * 播放指定的懷舊 8-bit 旋律
   * @param {string} melodyId 旋律 ID
   * @param {() => void} onFinish 播放完畢之回呼函式
   */
  public play(melodyId: string, onFinish?: () => void): void {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    const item = RETRO_MELODIES.find(m => m.id === melodyId) || RETRO_MELODIES[0];
    this.isPlaying = true;

    let totalDuration = 0;
    let scheduledTime = this.ctx.currentTime + 0.05;

    item.notes.forEach((note) => {
      if (note.freq > 0 && this.ctx) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // 8-bit 方波晶片感
        osc.type = 'square';
        osc.frequency.setValueAtTime(note.freq, scheduledTime);

        // 音量包絡線 (防爆音)
        gain.gain.setValueAtTime(0.001, scheduledTime);
        gain.gain.exponentialRampToValueAtTime(0.18, scheduledTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, scheduledTime + note.duration - 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(scheduledTime);
        osc.stop(scheduledTime + note.duration);
      }

      scheduledTime += note.duration;
      totalDuration += note.duration;
    });

    this.currentTimeout = setTimeout(() => {
      this.isPlaying = false;
      if (onFinish) onFinish();
    }, (totalDuration + 0.1) * 1000);
  }

  /**
   * 停止當前旋律播放
   */
  public stop(): void {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.isPlaying = false;
  }

  /**
   * 是否正在播放
   */
  public get playing(): boolean {
    return this.isPlaying;
  }

  /**
   * 依據 ID 獲取旋律項目
   * @param {string} id 旋律 ID
   */
  public getMelodyItem(id: string): AudioMelodyItem | undefined {
    return RETRO_MELODIES.find(m => m.id === id);
  }
}

export const melodySynthesizer = new MelodySynthesizer();
