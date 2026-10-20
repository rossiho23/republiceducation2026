<template>
  <!-- 日系新潮街機外框組件 (Neo-Arcade Stylized Frame - 寬屏沉浸滿版) -->
  <div class="relative min-h-screen flex flex-col items-center justify-start py-3 sm:py-5 px-2 sm:px-6 2xl:px-10 neo-halftone selection:bg-yellow-400 selection:text-black">
    <!-- 頂部黑黃斑馬紋警示帶 -->
    <div class="w-full max-w-[1536px] 2xl:max-w-[1680px] h-2.5 neo-hazard-yellow mb-2.5 neo-cut-sm border border-black shadow-[2px_2px_0px_#000]"></div>

    <!-- 頂部日系新潮街機燈箱 (Neo Arcade Marquee) -->
    <header class="w-full max-w-[1536px] 2xl:max-w-[1680px] bg-[#090b10] border-[3px] border-black p-3 sm:p-4 mb-4 shadow-[6px_6px_0px_#000000] flex flex-wrap items-center justify-between gap-3 neo-cut relative overflow-hidden">
      <!-- 裝飾性背景色塊 (Persona 風格斜條) -->
      <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-yellow-400/10 transform rotate-12 pointer-events-none"></div>

      <!-- 標題與 LOGO -->
      <div class="flex items-center gap-3 relative z-10">
        <!-- 街機搖桿幾何方形徽章 -->
        <div class="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center text-black font-black text-lg shadow-[3px_3px_0px_#000] transform -rotate-3">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="15" width="14" height="6" rx="1" fill="#000" />
            <rect x="11" y="9" width="2" height="6" fill="#000" />
            <circle cx="12" cy="7" r="4" fill="#ff0055" stroke="#000" stroke-width="1.5" />
          </svg>
        </div>

        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-yellow-400 neo-skew-title neo-text-stroke">
              民國教育委員會
            </h1>
            <span class="px-2 py-0.5 bg-[#ff0055] text-white text-[11px] font-black uppercase tracking-widest border border-black transform rotate-2">
              NEO ARCADE
            </span>
          </div>
          <p class="text-xs sm:text-sm text-cyan-400 tracking-widest font-mono font-bold">
            // SPEC-DRIVEN WEB REMAKE 1993 · 2026 //
          </p>
        </div>
      </div>

      <!-- 控制列：全螢幕切換、CRT 掃描線、音效切換、題庫後台 -->
      <div class="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm relative z-10">
        <!-- 原生全螢幕切換按鍵 -->
        <button 
          @click="toggleFullscreen"
          class="neo-btn bg-[#121620] hover:bg-[#1a2130] text-gray-200 py-1.5 px-3 flex items-center gap-1.5 text-xs sm:text-sm tracking-wider font-bold"
          :title="isFullscreen ? '退出全螢幕 (ESC)' : '進入沉浸全螢幕'"
        >
          <span class="text-yellow-400 font-mono">SCREEN:</span>
          <span :class="isFullscreen ? 'text-emerald-400 font-black' : 'text-gray-300'">
            {{ isFullscreen ? 'FULL ⛶' : 'WINDOW 🗖' }}
          </span>
        </button>

        <!-- CRT 掃描線切換按鍵 -->
        <button 
          @click="toggleCrt"
          class="neo-btn bg-[#121620] hover:bg-[#1a2130] text-gray-200 py-1.5 px-3 flex items-center gap-1.5 text-xs sm:text-sm tracking-wider font-bold"
          :title="isCrtActive ? '關閉 CRT 掃描線' : '開啟 CRT 掃描線'"
        >
          <span class="text-yellow-400 font-mono">CRT:</span>
          <span :class="isCrtActive ? 'text-emerald-400 font-black' : 'text-gray-500'">
            {{ isCrtActive ? 'ON' : 'OFF' }}
          </span>
        </button>

        <!-- 靜音開關 -->
        <button 
          @click="toggleMute"
          class="neo-btn bg-[#121620] hover:bg-[#1a2130] text-gray-200 py-1.5 px-3 flex items-center gap-1.5 text-xs sm:text-sm tracking-wider font-bold"
        >
          <span class="text-cyan-400 font-mono">AUDIO:</span>
          <span :class="!isMuted ? 'text-emerald-400 font-black' : 'text-red-500'">
            {{ !isMuted ? 'PLAY' : 'MUTE' }}
          </span>
        </button>

        <!-- 題庫後台按鈕 -->
        <button 
          @click="$emit('open-cms')"
          class="neo-btn neo-btn-yellow py-1.5 px-3.5 flex items-center gap-1 text-xs sm:text-sm tracking-wider font-black shadow-[2px_2px_0px_#000]"
        >
          <span>[題庫 CMS]</span>
        </button>
      </div>
    </header>

    <!-- 主要內容插槽 (寬屏大畫布) -->
    <main class="w-full max-w-[1536px] 2xl:max-w-[1680px] flex-1 flex flex-col relative z-10">
      <slot />
    </main>

    <!-- 底部機台資訊與投幣提示 -->
    <footer class="w-full max-w-[1536px] 2xl:max-w-[1680px] mt-6 py-3 border-t-2 border-black flex flex-wrap items-center justify-between text-xs sm:text-sm text-gray-400 font-mono bg-[#090b10] px-4 shadow-[4px_4px_0px_#000]">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 bg-yellow-400 text-black font-black text-xs">VER 2.0</span>
        <span>© 1993-2026 REPUBLIC EDUCATION COMMITTEE · 大型電玩街機經典重製</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-block w-3 h-3 bg-red-500 animate-pulse border border-black"></span>
        <span class="text-yellow-400 font-black tracking-widest">// INSERT COIN · 1 COIN 1 PLAY //</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ArcadeFrame.vue
 * @description 日系新潮街機外框組件 (Neo-Arcade Frame)
 * 具備寬屏沉浸自適應大畫布、黑黃警戒斑馬條紋、粗黑邊框、半色調波點網底、原生全螢幕切換、CRT 掃描線切換與全域音效控制。
 */
import { ref, onMounted, onUnmounted } from 'vue';
import { soundEngine } from '../../utils/audioEngine';

defineEmits<{
  (e: 'open-cms'): void;
}>();

const isCrtActive = ref<boolean>(true);
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
 * 切換 CRT 顯像管掃描線
 */
function toggleCrt(): void {
  isCrtActive.value = !isCrtActive.value;
  const body = document.body;
  if (isCrtActive.value) {
    body.classList.add('crt-overlay');
  } else {
    body.classList.remove('crt-overlay');
  }
}

/**
 * 切換全局音效靜音
 */
function toggleMute(): void {
  isMuted.value = soundEngine.toggleMute();
}

onMounted(() => {
  document.addEventListener('fullscreenchange', updateFullscreenState);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', updateFullscreenState);
});
</script>
