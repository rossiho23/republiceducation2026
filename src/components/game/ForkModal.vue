<template>
  <div v-if="gameStore.activeModal === 'FORK_SELECT'" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
    <div class="w-full max-w-lg bg-arcade-dark border-4 border-arcade-yellow rounded-2xl p-5 sm:p-7 shadow-arcade-yellow flex flex-col items-center text-center gap-4">
      <!-- 標頭 -->
      <div class="flex items-center gap-2">
        <span class="text-3xl animate-bounce-short">🔀</span>
        <h2 class="text-xl sm:text-2xl font-black text-arcade-yellow tracking-wider">
          路線分叉抉擇！
        </h2>
      </div>

      <p class="text-xs sm:text-sm text-gray-300">
        前方出現學業分歧道路！請選擇接下來要踏入的修煉路線：
      </p>

      <!-- 兩條分叉選項卡片 (上路 vs 下路) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full my-2">
        <!-- 上路線選項 -->
        <button 
          @click="choose('UPPER')"
          class="btn-arcade bg-gradient-to-b from-blue-900 to-slate-900 hover:from-blue-800 hover:to-slate-800 border-2 border-sky-400 p-4 rounded-xl text-left flex flex-col justify-between gap-3 group"
        >
          <div>
            <div class="flex items-center justify-between text-arcade-cyan font-black text-sm mb-1">
              <span>⬆️ 上路線</span>
              <span class="text-xs bg-sky-950 px-2 py-0.5 rounded border border-sky-600">理科·幸運</span>
            </div>
            <p class="text-xs text-gray-300 leading-snug">
              包含：自然理化、流行音樂、<strong class="text-arcade-yellow">三選一送分格</strong>、<strong class="text-amber-300">LUCKY 福利社</strong>（但小心 TROUBLE 骷髏災難！）
            </p>
          </div>
          <span class="text-xs text-arcade-cyan font-bold pt-2 border-t border-slate-700/60 group-hover:translate-x-1 transition-transform">
            選擇走上路 [按 1 或 ↑] ➔
          </span>
        </button>

        <!-- 下路線選項 -->
        <button 
          @click="choose('LOWER')"
          class="btn-arcade bg-gradient-to-b from-rose-950 to-slate-900 hover:from-rose-900 hover:to-slate-800 border-2 border-rose-500 p-4 rounded-xl text-left flex flex-col justify-between gap-3 group"
        >
          <div>
            <div class="flex items-center justify-between text-rose-300 font-black text-sm mb-1">
              <span>⬇️ 下路線</span>
              <span class="text-xs bg-rose-950 px-2 py-0.5 rounded border border-rose-600">文藝·挑戰</span>
            </div>
            <p class="text-xs text-gray-300 leading-snug">
              包含：<strong class="text-emerald-300">健康教育 (+25 HP)</strong>、美術、<strong class="text-arcade-red">天才問題 (雙倍學分)</strong>、校園突發事件與課外常識！
            </p>
          </div>
          <span class="text-xs text-rose-300 font-bold pt-2 border-t border-slate-700/60 group-hover:translate-x-1 transition-transform">
            選擇走下路 [按 2 或 ↓] ➔
          </span>
        </button>
      </div>

      <div class="text-[11px] text-gray-400 font-mono">
        提示：走完所選路線之關卡後，皆會匯流至該階段的「升學檢定大考 (Boss 戰)」！
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ForkModal.vue
 * @description 分叉路線選擇彈窗，支援上路線 (理組/幸運) 與下路線 (文藝/天才) 選擇
 */
import { onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { BranchType } from '../../types/quiz';

const gameStore = useGameStore();

function choose(branch: BranchType): void {
  gameStore.chooseBranch(branch);
}

function handleForkKeyDown(e: KeyboardEvent): void {
  if (gameStore.activeModal !== 'FORK_SELECT') return;

  if (e.key === 'ArrowUp' || e.key === '1') {
    choose('UPPER');
  } else if (e.key === 'ArrowDown' || e.key === '2') {
    choose('LOWER');
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleForkKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleForkKeyDown);
});
</script>
