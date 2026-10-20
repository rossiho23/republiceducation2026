<template>
  <!-- 現代極簡 SaaS 沉浸式工作台主框架 (Linear / Vercel Minimalist Container) -->
  <div class="relative min-h-screen flex flex-col items-center justify-start py-4 sm:py-6 px-3 sm:px-6 2xl:px-12 selection:bg-indigo-500 selection:text-white">
    <!-- 頂部工作台導航欄 (Linear Minimalist Header) -->
    <header class="w-full max-w-[1536px] 2xl:max-w-[1680px] bg-zinc-900/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3 sm:p-4 mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-wrap items-center justify-between gap-4 transition-all duration-200">
      <!-- 品牌與 LOGO -->
      <div class="flex items-center gap-3">
        <!-- 幾何極簡 LOGO 徽章 (深黑底 + 電光紫藍光暈) -->
        <div class="w-10 h-10 rounded-xl bg-zinc-950 border border-white/[0.1] flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>

        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-zinc-100">
              民國教育委員會
            </h1>
            <span class="saas-pill saas-pill-indigo text-[11px]">
              Modern Remake
            </span>
          </div>
          <p class="text-xs text-zinc-400 font-mono tracking-wider">
            Spec-Driven Education Suite · 2026
          </p>
        </div>
      </div>

      <!-- 控制列：全螢幕切換、音效切換、題庫後台 -->
      <div class="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
        <!-- 原生全螢幕切換按鍵 -->
        <button 
          @click="toggleFullscreen"
          class="saas-btn saas-btn-secondary py-1.5 px-3 flex items-center gap-2 text-xs font-medium"
          :title="isFullscreen ? '退出全螢幕 (ESC)' : '進入沉浸全螢幕'"
        >
          <span class="text-zinc-400">
            <svg v-if="!isFullscreen" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
            <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </svg>
          </span>
          <span :class="isFullscreen ? 'text-indigo-400 font-medium' : 'text-zinc-300'">
            {{ isFullscreen ? '視窗模式' : '全螢幕' }}
          </span>
        </button>

        <!-- 靜音開關 -->
        <button 
          @click="toggleMute"
          class="saas-btn saas-btn-secondary py-1.5 px-3 flex items-center gap-2 text-xs font-medium"
          :title="isMuted ? '取消靜音' : '開啟靜音'"
        >
          <span class="text-zinc-400">
            <svg v-if="!isMuted" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <svg v-else class="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          </span>
          <span :class="!isMuted ? 'text-zinc-300' : 'text-zinc-500'">
            {{ !isMuted ? '音效開啟' : '靜音' }}
          </span>
        </button>

        <!-- 題庫後台按鈕 (唯一的 Accent 主色調按鍵) -->
        <button 
          @click="$emit('open-cms')"
          class="saas-btn saas-btn-primary py-1.5 px-3.5 flex items-center gap-1.5 text-xs font-medium"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          <span>題庫管理</span>
        </button>
      </div>
    </header>

    <!-- 主要內容插槽 (寬屏現代大畫布) -->
    <main class="w-full max-w-[1536px] 2xl:max-w-[1680px] flex-1 flex flex-col relative z-10">
      <slot />
    </main>

    <!-- 底部資訊與狀態列 -->
    <footer class="w-full max-w-[1536px] 2xl:max-w-[1680px] mt-8 py-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between text-xs text-zinc-500 font-mono">
      <div class="flex items-center gap-3">
        <span class="saas-pill text-[11px] bg-zinc-900 border-zinc-800 text-zinc-400">v2.1 SaaS</span>
        <span>© 1993-2026 Republic Education Committee · All Rights Reserved</span>
      </div>
      <div class="flex items-center gap-2 text-zinc-400">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>系統運作正常 · 隨時準備作答</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ArcadeFrame.vue
 * @description 現代極簡 SaaS 沉浸式工作台主外框組件 (Linear / Vercel Minimalist Container)
 * 具備寬屏自適應大畫布、微光邊框、Zinc 冷調層次、原生全螢幕切換與音效全域控制。
 */
import { ref, onMounted, onUnmounted } from 'vue';
import { soundEngine } from '../../utils/audioEngine';

defineEmits<{
  (e: 'open-cms'): void;
}>();

const isCrtActive = ref<boolean>(false);
const isMuted = ref<boolean>(false);
const isFullscreen = ref<boolean>(false);

/**
 * 監聽瀏覽器全螢幕變化事件以同步按鈕狀態
 */
function updateFullscreenState(): void {
  isFullscreen.value = !!document.fullscreenElement;
}

/**
 * 切換瀏覽器原生沉浸全螢幕模式 (HTML5 Fullscreen API)
 * @returns {Promise<void>}
 */
async function toggleFullscreen(): Promise<void> {
  soundEngine.playCoin();
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      isFullscreen.value = true;
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        isFullscreen.value = false;
      }
    }
  } catch (err) {
    console.warn('全螢幕切換受瀏覽器安全限制或被拒絕:', err);
  }
}

/**
 * 切換 CRT 掃描線
 */
function toggleCrt(): void {
  isCrtActive.value = !isCrtActive.value;
  if (isCrtActive.value) {
    document.body.classList.add('crt-overlay');
  } else {
    document.body.classList.remove('crt-overlay');
  }
}

/**
 * 切換聲音靜音
 */
function toggleMute(): void {
  isMuted.value = !isMuted.value;
  soundEngine.toggleMute();
}

onMounted(() => {
  document.addEventListener('fullscreenchange', updateFullscreenState);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', updateFullscreenState);
});
</script>
