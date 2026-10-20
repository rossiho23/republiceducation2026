<template>
  <!-- 現代極簡 SaaS 風格 路線分歧選擇彈窗 -->
  <div v-if="gameStore.activeModal === 'FORK_SELECT'" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
    <div class="w-full max-w-2xl 2xl:max-w-3xl bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center gap-6">
      <!-- 標頭 -->
      <div class="flex flex-col items-center gap-2">
        <span class="saas-pill saas-pill-indigo text-xs font-mono">BRANCH SELECTION</span>
        <h2 class="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
          學業路線分歧抉擇
        </h2>
        <p class="text-xs sm:text-sm text-zinc-400 max-w-md">
          前方出現分支道路，請依擅長領域選擇欲踏入的修煉路線：
        </p>
      </div>

      <!-- 兩條分叉選項卡片 (上路 vs 下路) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <!-- 上路線選項 -->
        <button 
          @click="choose('UPPER')"
          class="saas-card saas-card-interactive p-6 text-left flex flex-col justify-between gap-5 group border border-white/[0.08]"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-base font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">⬆️ 上路線</span>
              <span class="saas-pill saas-pill-indigo text-[11px]">理科·幸運</span>
            </div>
            <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              涵蓋：自然理化、流行音樂、<strong class="text-indigo-300">三選一送分格</strong>、<strong class="text-amber-300">LUCKY 福利社</strong>（留意 TROUBLE 危機格）。
            </p>
          </div>
          <div class="flex items-center justify-between text-xs font-medium text-zinc-300 group-hover:text-indigo-400 pt-3 border-t border-white/[0.06] transition-colors">
            <span>選擇上路線</span>
            <span class="saas-kbd text-[10px]">按 1 或 ↑</span>
          </div>
        </button>

        <!-- 下路線選項 -->
        <button 
          @click="choose('LOWER')"
          class="saas-card saas-card-interactive p-6 text-left flex flex-col justify-between gap-5 group border border-white/[0.08]"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-base font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">⬇️ 下路線</span>
              <span class="saas-pill saas-pill-rose text-[11px]">文藝·挑戰</span>
            </div>
            <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              涵蓋：<strong class="text-emerald-300">健康教育 (+25 HP)</strong>、美術、<strong class="text-rose-300">天才問題 (雙倍學分)</strong>、校園突發事件與課外常識。
            </p>
          </div>
          <div class="flex items-center justify-between text-xs font-medium text-zinc-300 group-hover:text-indigo-400 pt-3 border-t border-white/[0.06] transition-colors">
            <span>選擇下路線</span>
            <span class="saas-kbd text-[10px]">按 2 或 ↓</span>
          </div>
        </button>
      </div>

      <div class="text-xs text-zinc-500 font-mono">
        提示：走完所選路線後，皆會匯流至該階段的期末升學檢定大考 (Boss 戰)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ForkModal.vue
 * @description 現代極簡 SaaS 風格 路線分歧選擇彈窗 (Linear Modern Fork Modal)
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