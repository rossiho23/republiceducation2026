<template>
  <div class="relative min-h-screen flex flex-col items-center justify-start py-4 px-2 sm:px-6">
    <!-- 頂部復古街機燈箱 (Arcade Marquee) -->
    <header class="w-full max-w-5xl bg-gradient-to-r from-arcade-dark via-arcade-panel to-arcade-dark border-4 border-arcade-border rounded-xl p-3 mb-4 shadow-arcade-glow flex flex-wrap items-center justify-between gap-3">
      <!-- 標題與 LOGO -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-arcade-yellow flex items-center justify-center text-black font-black text-2xl shadow-pixel-sm animate-pulse-fast">
          🕹️
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-widest text-arcade-yellow drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            民國教育委員會
          </h1>
          <p class="text-xs text-arcade-cyan tracking-wider font-mono">
            REPUBLIC QUIZ ARCADE 1993 · 經典升學問答
          </p>
        </div>
      </div>

      <!-- 控制列：CRT 開關、音效切換、投幣按鈕 -->
      <div class="flex items-center gap-2 text-xs">
        <!-- CRT 掃描線開關 -->
        <button 
          @click="toggleCrt"
          class="btn-arcade bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 flex items-center gap-1 text-xs py-1.5 px-3 rounded"
          :title="isCrtActive ? '關閉 CRT 掃描線' : '開啟 CRT 掃描線'"
        >
          <span>📺 CRT:</span>
          <span :class="isCrtActive ? 'text-arcade-green font-bold' : 'text-gray-400'">
            {{ isCrtActive ? 'ON' : 'OFF' }}
          </span>
        </button>

        <!-- 靜音開關 -->
        <button 
          @click="toggleMute"
          class="btn-arcade bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 flex items-center gap-1 text-xs py-1.5 px-3 rounded"
        >
          <span>{{ isMuted ? '🔇 靜音' : '🔊 音效' }}</span>
        </button>

        <!-- 題庫後台切換按鈕 -->
        <button 
          @click="$emit('open-cms')"
          class="btn-arcade bg-arcade-purple hover:bg-purple-600 text-white font-bold py-1.5 px-3 rounded flex items-center gap-1"
        >
          <span>📚 題庫管理</span>
        </button>
      </div>
    </header>

    <!-- 主要內容插槽 -->
    <main class="w-full max-w-5xl flex-1 flex flex-col">
      <slot />
    </main>

    <!-- 底部機台資訊與街機投入孔裝飾 -->
    <footer class="w-full max-w-5xl mt-6 py-2 border-t border-gray-800 flex flex-wrap items-center justify-between text-[11px] text-gray-400 font-mono">
      <div>© 1993-2026 REPUBLIC EDUCATION COMMITTEE · 致敬台灣大型電玩街機經典</div>
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-arcade-green animate-ping"></span>
        <span class="text-arcade-yellow font-bold">INSERT COIN (1 COIN 1 PLAY)</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ArcadeFrame.vue
 * @description 街機外框組件，負責頂部霓虹燈箱、CRT 掃描線切換與全域音效控制
 */
import { ref } from 'vue';
import { soundEngine } from '../../utils/audioEngine';

defineEmits<{
  (e: 'open-cms'): void;
}>();

const isCrtActive = ref<boolean>(true);
const isMuted = ref<boolean>(false);

/**
 * 切換 CRT 掃描線特效
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
 * 切換全局靜音
 */
function toggleMute(): void {
  isMuted.value = soundEngine.toggleMute();
}
</script>
