<template>
  <!-- 新聞問題特別過場彈窗 (致敬 new1.jpg 世界地圖網格、金屬大字與雙主播立繪) -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
  >
    <div class="relative w-full max-w-3xl 2xl:max-w-4xl bg-slate-900 border-4 border-yellow-400 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.5)] overflow-hidden font-mono flex flex-col">
      <!-- 頂部街機風格飾條 -->
      <div class="bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 border-b-2 border-yellow-400/60 px-5 py-2.5 flex items-center justify-between text-yellow-300">
        <div class="flex items-center gap-2 text-sm font-bold tracking-wider">
          <span class="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping inline-block"></span>
          <span class="text-red-400 font-black">● LIVE</span>
          <span>全國大聯播 · 特別新聞快報</span>
        </div>
        <div class="text-xs sm:text-sm text-yellow-400/90 font-mono">
          CH-08 特別新聞台
        </div>
      </div>

      <!-- 主體舞台：致敬 new1.jpg 世界地圖經緯線背景 -->
      <div class="relative min-h-[340px] flex flex-col items-center justify-between p-6 sm:p-8 bg-[#0a1128] overflow-hidden">
        <!-- 世界地圖背景網格裝飾 (SVG) -->
        <svg class="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="world-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" stroke-width="0.8" stroke-dasharray="2,2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#world-grid)" />
          <!-- 象徵性經緯圓弧線 -->
          <ellipse cx="50%" cy="40%" rx="38%" ry="32%" fill="none" stroke="#60a5fa" stroke-width="1.2" stroke-dasharray="6,4" />
          <ellipse cx="50%" cy="40%" rx="20%" ry="32%" fill="none" stroke="#60a5fa" stroke-width="1.2" stroke-dasharray="4,4" />
          <line x1="10%" y1="40%" x2="90%" y2="40%" stroke="#60a5fa" stroke-width="1.5" />
        </svg>

        <!-- 中央立體「新聞問題」標題看板 (致敬 new1.jpg 核心特徵) -->
        <div class="relative z-10 flex flex-col items-center my-2 animate-bounce-short">
          <div class="px-10 py-3 bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 border-4 border-yellow-200 rounded-xl shadow-[0_8px_0_#92400e,0_0_30px_rgba(250,204,21,0.7)] transform -rotate-1">
            <h1 class="text-3xl md:text-5xl font-black tracking-widest text-slate-950 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
              新 聞 問 題
            </h1>
          </div>
          <div class="mt-2.5 text-xs sm:text-sm font-bold text-yellow-300 tracking-widest bg-blue-950/90 px-4 py-1 rounded-full border border-yellow-400/50 shadow">
            ★ 時事常識與流行焦點特別考驗 ★
          </div>
        </div>

        <!-- 下半部：新聞主播台與雙主播立繪 (致敬 new1.jpg 下半段格局) -->
        <div class="relative z-10 w-full mt-4 flex flex-col items-center">
          <!-- 雙主播人物區 -->
          <div class="w-full flex items-end justify-around px-4 md:px-16 relative z-0">
            <!-- 左主播 (可替換名人相片) -->
            <div class="flex flex-col items-center group transition-transform hover:scale-105">
              <div class="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-yellow-400 bg-slate-800 p-1 shadow-[0_0_20px_rgba(250,204,21,0.6)] overflow-hidden">
                <img 
                  :src="anchorPair.leftAnchorAvatar" 
                  :alt="anchorPair.leftAnchorName"
                  class="w-full h-full object-cover rounded-full select-none"
                  @error="onLeftImgError"
                />
                <span class="absolute bottom-1 right-1 bg-blue-600 text-[11px] font-bold text-white px-2 py-0.5 rounded-full border border-white">
                  主線
                </span>
              </div>
              <div class="mt-2 px-3 py-1 bg-blue-900 border border-yellow-400 rounded text-xs sm:text-sm font-bold text-yellow-300 shadow">
                {{ anchorPair.leftAnchorName }}
              </div>
            </div>

            <!-- 主播台中央麥克風與特別新聞徽章 -->
            <div class="hidden sm:flex flex-col items-center justify-end pb-3 text-slate-400">
              <div class="w-10 h-14 flex flex-col items-center">
                <div class="w-6 h-8 bg-slate-600 rounded-full border-2 border-slate-300 flex items-center justify-center">
                  <div class="w-2.5 h-5 bg-slate-400 rounded-full"></div>
                </div>
                <div class="w-2 h-5 bg-slate-400"></div>
                <div class="w-8 h-2 bg-slate-300 rounded"></div>
              </div>
              <span class="text-xs text-yellow-400 font-bold mt-1">NEWS DESK</span>
            </div>

            <!-- 右主播 (可替換名人相片) -->
            <div class="flex flex-col items-center group transition-transform hover:scale-105">
              <div class="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-yellow-400 bg-slate-800 p-1 shadow-[0_0_20px_rgba(250,204,21,0.6)] overflow-hidden">
                <img 
                  :src="anchorPair.rightAnchorAvatar" 
                  :alt="anchorPair.rightAnchorName"
                  class="w-full h-full object-cover rounded-full select-none"
                  @error="onRightImgError"
                />
                <span class="absolute bottom-1 right-1 bg-amber-600 text-[11px] font-bold text-white px-2 py-0.5 rounded-full border border-white">
                  特派
                </span>
              </div>
              <div class="mt-2 px-3 py-1 bg-blue-900 border border-yellow-400 rounded text-xs sm:text-sm font-bold text-yellow-300 shadow">
                {{ anchorPair.rightAnchorName }}
              </div>
            </div>
          </div>

          <!-- 實體灰色主播台案板 (立體斜切面) -->
          <div class="w-full h-12 -mt-3 bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 border-t-4 border-slate-400 rounded-t-xl shadow-inner flex items-center justify-center text-slate-300 text-xs sm:text-sm font-bold tracking-widest relative z-10">
            <span class="tracking-[0.3em] text-yellow-300 font-serif">● 現場特別報導 LIVE BROADCAST ●</span>
          </div>
        </div>

        <!-- 主播現場播報字幕 (電視滾動 Ticker) -->
        <div class="relative z-10 w-full mt-4 p-4 bg-slate-950/95 border-2 border-yellow-400/90 rounded-xl shadow flex flex-col gap-1.5">
          <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-yellow-400">
            <span class="px-2 py-0.5 bg-red-600 text-white rounded text-xs font-black">快訊</span>
            <span>【主播台即時播音】：</span>
          </div>
          <p class="text-sm md:text-lg text-yellow-100 font-sans tracking-wide leading-relaxed pl-3 border-l-2 border-yellow-400">
            "各位觀眾朋友晚安！我們接獲最新快訊，校園升學考試現場出現了極具話題的時事考題！請考生做好準備，即刻作答！"
          </p>
        </div>
      </div>

      <!-- 底部控制按鈕列 -->
      <div class="p-4 sm:p-5 bg-slate-950 border-t-2 border-yellow-400 flex items-center justify-between gap-4">
        <div class="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
          <span>即將自動進入題目...</span>
          <span class="text-yellow-400 font-bold text-base sm:text-lg">{{ countdownSeconds }}s</span>
        </div>

        <div class="flex items-center gap-3">
          <!-- 若為純後台預覽模式，提供關閉按鈕 -->
          <button
            v-if="isPreviewMode"
            @click="handleClosePreview"
            class="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm font-bold rounded-lg border border-slate-500 transition-colors"
          >
            關閉預覽
          </button>

          <!-- 立即作答進入按鈕 -->
          <button
            @click="handleStartQuestion"
            class="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-[0_4px_0_#92400e] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
          >
            <span>📺 立即連線作答！</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file NewsIntroModal.vue
 * @description 新聞問題特別過場彈窗組件 (致敬 new1.jpg 新聞主播台)
 * 呈現場中央立體「新聞問題」大字看板、雙主播名人圖片與世界地圖網格背景。
 */

import { ref, computed, watch, onUnmounted } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { useCharacterStore } from '../../stores/characterStore';
import { soundEngine } from '../../utils/audioEngine';

interface Props {
  preview?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  preview: false
});

const emit = defineEmits<{
  (e: 'close-preview'): void;
}>();

const gameStore = useGameStore();
const characterStore = useCharacterStore();

const anchorPair = computed(() => characterStore.anchorPair);

const isPreviewMode = computed(() => props.preview);
const isOpen = computed(() => {
  return isPreviewMode.value || gameStore.activeModal === 'NEWS_INTRO';
});

const countdownSeconds = ref<number>(4);
let timerId: any = null;

/**
 * 監聽開啟狀態，啟動自動進入倒數
 */
watch(isOpen, (newVal) => {
  if (newVal) {
    soundEngine.playEvent();
    countdownSeconds.value = 4;
    clearInterval(timerId);
    timerId = setInterval(() => {
      if (countdownSeconds.value > 1) {
        countdownSeconds.value -= 1;
      } else {
        clearInterval(timerId);
        handleStartQuestion();
      }
    }, 1000);
  } else {
    clearInterval(timerId);
  }
});

onUnmounted(() => {
  clearInterval(timerId);
});

/**
 * 點擊立即連線作答
 */
function handleStartQuestion(): void {
  clearInterval(timerId);
  if (isPreviewMode.value) {
    emit('close-preview');
    return;
  }
  // 切換至答題模式
  gameStore.activeModal = 'QUIZ';
  const limit = gameStore.rank >= 7 ? 8 : gameStore.rank >= 4 ? 10 : 12;
  gameStore.startQuestionTimer(limit);
}

/**
 * 關閉預覽
 */
function handleClosePreview(): void {
  clearInterval(timerId);
  emit('close-preview');
}

/**
 * 左主播圖片載入失敗時降級保護
 */
function onLeftImgError(e: Event): void {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=LeftAnchor';
  }
}

/**
 * 右主播圖片載入失敗時降級保護
 */
function onRightImgError(e: Event): void {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=RightAnchor';
  }
}
</script>

<style scoped>
@keyframes bounceShort {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-bounce-short {
  animation: bounceShort 1.5s ease-in-out infinite;
}
</style>
