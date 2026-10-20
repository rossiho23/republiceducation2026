<template>
  <!-- 街機電影級開頭映畫組件 (Intro Cinema) -->
  <div 
    class="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none font-mono transition-opacity duration-500"
    :class="isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'"
  >
    <!-- 頂部街機映畫狀態飾條 -->
    <div class="absolute top-4 left-6 z-20 flex items-center gap-3">
      <span class="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
      <span class="text-xs sm:text-sm font-black tracking-widest text-yellow-400 neo-skew-title">
        // REPUBLIC ARCADE CINEMA SYSTEM 2026 //
      </span>
    </div>

    <!-- 影片主要播放窗口 (滿版等比縮放) -->
    <div class="relative w-full h-full max-w-7xl max-h-screen flex items-center justify-center p-2 sm:p-4">
      <video
        ref="videoRef"
        :src="videoSrc"
        playsinline
        class="w-full h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.9)]"
        @ended="handleComplete"
        @error="handleVideoError"
      ></video>

      <!-- 瀏覽器 Autoplay 阻擋時之點擊啟動互動層 -->
      <div 
        v-if="needUserGesture" 
        class="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 cursor-pointer p-6 text-center"
        @click="startPlaybackWithGesture"
      >
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-yellow-400 border-4 border-black flex items-center justify-center shadow-[0_0_30px_#facc15] hover:scale-110 active:scale-95 transition-transform mb-4">
          <span class="text-3xl sm:text-4xl text-black ml-1.5">▶</span>
        </div>
        <h2 class="text-xl sm:text-3xl font-black text-yellow-400 neo-skew-title tracking-wider animate-pulse mb-2">
          點擊啟動街機開場映畫
        </h2>
        <p class="text-xs sm:text-sm text-gray-300 font-bold max-w-md leading-relaxed">
          [TOUCH TO UNLOCK ARCADE SOUND & VIDEO]
        </p>
      </div>
    </div>

    <!-- 底部控制與跳過按鍵區 -->
    <div class="absolute bottom-6 right-6 z-20 flex items-center gap-3">
      <!-- 跳過片頭按鈕 -->
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
</template>

<script setup lang="ts">
/**
 * @file IntroCinema.vue
 * @description 街機電影級開頭映畫組件
 * 負責播放 pic/開頭.mp4 視訊，處理瀏覽器 Autoplay 自動播放限制，並提供跳過機制與淡出過渡。
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';

const emit = defineEmits<{
  /** 影片播放完畢或玩家跳過時觸發 */
  (e: 'complete'): void;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);
const needUserGesture = ref<boolean>(false);
const isFadingOut = ref<boolean>(false);

/**
 * 自動依據 Base URL 取得開頭影片路徑
 */
const videoSrc = computed(() => {
  const baseUrl = ((import.meta as any).env?.BASE_URL as string) || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}media/intro.mp4`;
});

/**
 * 啟動影片播放
 */
async function attemptPlay(): Promise<void> {
  if (!videoRef.value) return;

  try {
    videoRef.value.currentTime = 0;
    await videoRef.value.play();
    needUserGesture.value = false;
  } catch (err) {
    console.warn('開頭影片自動播放遭瀏覽器攔截，需要玩家點擊啟動:', err);
    needUserGesture.value = true;
  }
}

/**
 * 玩家手勢點擊啟動播放
 */
async function startPlaybackWithGesture(): Promise<void> {
  if (!videoRef.value) return;
  try {
    await videoRef.value.play();
    needUserGesture.value = false;
  } catch (err) {
    console.error('播放失敗:', err);
    handleComplete();
  }
}

/**
 * 影片載入錯誤時的安全降級跳過
 */
function handleVideoError(): void {
  console.warn('開頭影片載入失敗，自動跳過開場進入遊戲。');
  handleComplete();
}

/**
 * 處理影片播放完畢或跳過事件 (帶淡出動效)
 */
function handleComplete(): void {
  if (isFadingOut.value) return;
  isFadingOut.value = true;

  if (videoRef.value) {
    videoRef.value.pause();
  }

  // 延遲 400ms 淡出動畫後通知父組件卸載
  setTimeout(() => {
    emit('complete');
  }, 400);
}

/**
 * 鍵盤快捷鍵監聽 (Space / Escape 直接跳過片頭)
 */
function handleKeyDown(e: KeyboardEvent): void {
  if (e.code === 'Space' || e.code === 'Escape') {
    e.preventDefault();
    if (needUserGesture.value) {
      startPlaybackWithGesture();
    } else {
      handleComplete();
    }
  }
}

onMounted(() => {
  attemptPlay();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
