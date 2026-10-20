<template>
  <!-- 街機電影級開頭映畫組件 (Teleport 置頂滿版，方案 A：投幣式啟動門) -->
  <Teleport to="body">
    <div 
      class="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center select-none font-mono transition-opacity duration-500 overflow-hidden"
      :class="isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'"
    >
      <!-- 頂部街機映畫狀態飾條 -->
      <div class="absolute top-4 left-6 z-30 flex items-center gap-3 pointer-events-none">
        <span class="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
        <span class="text-xs sm:text-sm font-black tracking-widest text-yellow-400 neo-skew-title">
          // REPUBLIC ARCADE CINEMA SYSTEM 2026 //
        </span>
      </div>

      <!-- ================= 階段一：投幣啟動門 (INSERT COIN / PRESS START) ================= -->
      <div 
        v-if="!hasStarted" 
        class="absolute inset-0 bg-[#080a0f] flex flex-col items-center justify-center p-6 text-center cursor-pointer z-40 group"
        @click="startWithUserGesture"
      >
        <!-- 背景日系網點與大字幾何斜切 -->
        <div class="absolute inset-0 neo-halftone opacity-30 pointer-events-none"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"></div>

        <!-- 經典街機投幣巨型幾何徽章 -->
        <div class="relative mb-6 transform group-hover:scale-105 transition-transform duration-300">
          <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-yellow-400 border-4 border-black flex flex-col items-center justify-center shadow-[6px_6px_0px_#ffe600] animate-bounce-short">
            <span class="text-4xl sm:text-5xl">🪙</span>
            <span class="text-[10px] font-black tracking-widest text-black mt-1 uppercase">COIN 1P</span>
          </div>
        </div>

        <!-- 主標題大字報 -->
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-black text-yellow-400 neo-skew-title neo-text-stroke tracking-wider mb-3 leading-tight">
          PRESS ANY KEY TO START
        </h1>
        <div class="inline-block bg-[#ff0055] text-white px-4 py-1.5 font-black text-xs sm:text-sm uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#000] mb-6 transform -rotate-1">
          ▶ 點擊螢幕 或 按任意鍵 投幣啟動開場映畫 ◀
        </div>

        <!-- 提示細節條 -->
        <div class="flex items-center gap-4 text-xs sm:text-sm font-bold text-gray-400 bg-black/80 px-4 py-2 border border-gray-800 rounded">
          <span>[SPACE / ENTER / 點擊] 投幣</span>
          <span>•</span>
          <span>原聲高畫質播放</span>
        </div>
      </div>

      <!-- ================= 階段二：影片播放視窗 (Video Window) ================= -->
      <div 
        class="relative w-full h-full max-w-7xl max-h-screen flex items-center justify-center p-2 sm:p-4 z-20"
        :class="hasStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      >
        <video
          ref="videoRef"
          :src="currentVideoSrc"
          playsinline
          preload="auto"
          class="w-full h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          @ended="handleComplete"
          @error="handleVideoFallback"
        ></video>
      </div>

      <!-- 右下角跳過按鍵區 (已啟動後可見) -->
      <div v-if="hasStarted" class="absolute bottom-6 right-6 z-30 flex items-center gap-3">
        <button
          type="button"
          @click="handleComplete"
          class="neo-btn bg-black/80 hover:bg-yellow-400 hover:text-black text-yellow-400 border-2 border-yellow-400 py-2 px-5 neo-cut-sm font-black text-xs sm:text-sm tracking-wider shadow-[3px_3px_0px_#ffe600] flex items-center gap-2 cursor-pointer transition-all"
          title="跳過片頭動畫直接進入首頁"
        >
          <span>⏩ 跳過片頭</span>
          <span class="text-[10px] bg-yellow-400/20 text-yellow-300 group-hover:text-black px-1.5 py-0.5 rounded font-mono">
            SPACE
          </span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * @file IntroCinema.vue
 * @description 街機電影級開頭映畫組件 (方案 A：投幣式啟動門 Coin Start)
 * 負責透過「INSERT COIN / PRESS START」手勢解鎖瀏覽器最高等級 User Gesture，
 * 確保 pic/開頭.mp4 視訊與後續背景音樂 100% 原聲無縫播放。
 */
import { ref, onMounted, onUnmounted } from 'vue';
import { soundEngine } from '../../utils/audioEngine';

const emit = defineEmits<{
  /** 影片播放完畢或玩家跳過時觸發 */
  (e: 'complete'): void;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);
const hasStarted = ref<boolean>(false);
const isFadingOut = ref<boolean>(false);

// 備援路徑序列：確保在本地伺服器、二級目錄與各部署路徑均能精確載入
const baseUrl = ((import.meta as any).env?.BASE_URL as string) || '/';
const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
const candidateSources = [
  `${cleanBase}media/intro.mp4`,
  `${cleanBase}intro.mp4`,
  './media/intro.mp4',
  './intro.mp4',
];
const currentSourceIndex = ref<number>(0);
const currentVideoSrc = ref<string>(candidateSources[0]);

/**
 * 視訊路徑備援切換，避免單一路徑 404
 */
function handleVideoFallback(): void {
  if (currentSourceIndex.value < candidateSources.length - 1) {
    currentSourceIndex.value += 1;
    currentVideoSrc.value = candidateSources[currentSourceIndex.value];
    console.warn(`開頭影片切換備援路徑 [${currentSourceIndex.value}]: ${currentVideoSrc.value}`);
    if (hasStarted.value && videoRef.value) {
      videoRef.value.load();
      videoRef.value.play().catch(e => console.warn('備援路徑播放重試中:', e));
    }
  } else {
    console.error('所有開頭影片備援路徑均無法載入，跳過進入首頁。');
    handleComplete();
  }
}

/**
 * 玩家手勢點擊或按鍵觸發「投幣啟動映畫」
 * 此時瀏覽器具備完整 User Gesture，視訊音訊均能以原聲 100% 播放
 */
async function startWithUserGesture(): Promise<void> {
  if (hasStarted.value) return;
  hasStarted.value = true;

  // 播放經典大型街機投幣音效
  soundEngine.playCoin();

  if (!videoRef.value) return;

  try {
    videoRef.value.currentTime = 0;
    videoRef.value.muted = false; // 100% 解除靜音，保證原聲播放
    await videoRef.value.play();
  } catch (err) {
    console.warn('原聲播放重試，降級靜音以確保畫面動態:', err);
    if (videoRef.value) {
      videoRef.value.muted = true;
      await videoRef.value.play().catch(e => console.error('影片播放徹底失敗:', e));
    }
  }
}

/**
 * 處理影片播放完畢或跳過事件 (帶 400ms 黑屏平滑淡出)
 */
function handleComplete(): void {
  if (isFadingOut.value) return;
  isFadingOut.value = true;

  if (videoRef.value) {
    videoRef.value.pause();
  }

  setTimeout(() => {
    emit('complete');
  }, 400);
}

/**
 * 全域按鍵監聽：
 * - 未啟動前：任意鍵 (SPACE, ENTER, 1, 5) 投幣啟動
 * - 已啟動後：SPACE 或 ESCAPE 跳過片頭
 */
function handleKeyDown(e: KeyboardEvent): void {
  if (!hasStarted.value) {
    e.preventDefault();
    startWithUserGesture();
  } else {
    if (e.code === 'Space' || e.code === 'Escape') {
      e.preventDefault();
      handleComplete();
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
