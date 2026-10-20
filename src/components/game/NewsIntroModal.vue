<template>
  <!-- 現代極簡 SaaS 風格 新聞問題特別過場彈窗 (Linear Modern News Broadcast Modal) -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none"
  >
    <div class="relative w-full max-w-2xl 2xl:max-w-3xl bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
      <!-- 頂部飾條 -->
      <div class="border-b border-white/[0.08] px-5 py-3 flex items-center justify-between text-zinc-300">
        <div class="flex items-center gap-2.5 text-xs font-mono">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block"></span>
          <span class="text-rose-400 font-semibold">LIVE</span>
          <span class="text-zinc-400">特別時事新聞快報</span>
        </div>
        <div class="saas-pill text-[11px] font-mono text-zinc-400">
          CH-08 SPECIAL
        </div>
      </div>

      <!-- 主體舞台：深調經緯微網格背景 -->
      <div class="relative min-h-[300px] flex flex-col items-center justify-between p-6 sm:p-8 bg-zinc-950/70 overflow-hidden">
        <!-- 背景經緯圓弧線 (SVG) -->
        <svg class="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50%" cy="40%" rx="38%" ry="32%" fill="none" stroke="#6366f1" stroke-width="1" stroke-dasharray="6,4" />
          <ellipse cx="50%" cy="40%" rx="20%" ry="32%" fill="none" stroke="#6366f1" stroke-width="1" stroke-dasharray="4,4" />
          <line x1="10%" y1="40%" x2="90%" y2="40%" stroke="#6366f1" stroke-width="1" />
        </svg>

        <!-- 中央「新聞問題」標題看板 -->
        <div class="relative z-10 flex flex-col items-center my-2">
          <div class="px-8 py-2 rounded-xl bg-zinc-900/90 border border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.2)]">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide text-zinc-100">
              新 聞 時 事 考 驗
            </h1>
          </div>
          <div class="mt-2 text-xs font-mono text-indigo-400">
            特別時事常識與流行焦點
          </div>
        </div>

        <!-- 下半部：主播台與雙主播立繪 -->
        <div class="relative z-10 w-full mt-4 flex flex-col items-center">
          <div class="w-full flex items-end justify-around px-4 md:px-16 relative z-0">
            <!-- 左主播 -->
            <div class="flex flex-col items-center group transition-transform">
              <div class="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl border border-white/[0.1] bg-zinc-900 p-1 shadow-md overflow-hidden">
                <img 
                  :src="anchorPair.leftAnchorAvatar" 
                  :alt="anchorPair.leftAnchorName"
                  class="w-full h-full object-cover rounded-xl select-none"
                  @error="onLeftImgError"
                />
              </div>
              <div class="mt-2 saas-pill text-[11px] font-medium text-zinc-300">
                {{ anchorPair.leftAnchorName }}
              </div>
            </div>

            <!-- 主播台中央標記 -->
            <div class="hidden sm:flex flex-col items-center justify-end pb-2 text-zinc-500">
              <span class="text-xs font-mono text-indigo-400">NEWS DESK</span>
            </div>

            <!-- 右主播 -->
            <div class="flex flex-col items-center group transition-transform">
              <div class="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl border border-white/[0.1] bg-zinc-900 p-1 shadow-md overflow-hidden">
                <img 
                  :src="anchorPair.rightAnchorAvatar" 
                  :alt="anchorPair.rightAnchorName"
                  class="w-full h-full object-cover rounded-xl select-none"
                  @error="onRightImgError"
                />
              </div>
              <div class="mt-2 saas-pill text-[11px] font-medium text-zinc-300">
                {{ anchorPair.rightAnchorName }}
              </div>
            </div>
          </div>
        </div>

        <!-- 主播字幕 -->
        <div class="relative z-10 w-full mt-4 p-3.5 bg-zinc-900/80 border border-white/[0.08] rounded-xl flex flex-col gap-1">
          <div class="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <span class="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px]">即時</span>
            <span>【主播台即時播音】：</span>
          </div>
          <p class="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed pl-2 border-l-2 border-indigo-500/50">
            "各位觀眾朋友晚安！校園升學考試現場出現了熱門時事考題！請考生做好準備，即刻作答！"
          </p>
        </div>
      </div>

      <!-- 底部控制按鈕列 -->
      <div class="p-4 bg-zinc-950/90 border-t border-white/[0.08] flex items-center justify-between gap-4">
        <div class="text-xs text-zinc-400 flex items-center gap-2 font-mono">
          <span>即將自動進入題目...</span>
          <span class="text-indigo-400 font-semibold">{{ countdownSeconds }}s</span>
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="isPreviewMode"
            @click="handleClosePreview"
            class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
          >
            關閉預覽
          </button>

          <button
            @click="handleStartQuestion"
            class="saas-btn saas-btn-primary py-2 px-5 text-xs sm:text-sm font-medium"
          >
            <span>立即連線作答 ➔</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file NewsIntroModal.vue
 * @description 現代極簡 SaaS 風格 新聞問題特別過場彈窗組件 (Linear Modern News Broadcast Modal)
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

function handleStartQuestion(): void {
  clearInterval(timerId);
  if (isPreviewMode.value) {
    emit('close-preview');
    return;
  }
  gameStore.activeModal = 'QUIZ';
  const limit = gameStore.rank >= 7 ? 8 : gameStore.rank >= 4 ? 10 : 12;
  gameStore.startQuestionTimer(limit);
}

function handleClosePreview(): void {
  clearInterval(timerId);
  emit('close-preview');
}

function onLeftImgError(e: Event): void {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=LeftAnchor';
  }
}

function onRightImgError(e: Event): void {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=RightAnchor';
  }
}
</script>