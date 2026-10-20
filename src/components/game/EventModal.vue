<template>
  <!-- 現代極簡 SaaS 風格 校園隨機事件與命運彈窗 -->
  <div v-if="(gameStore.activeModal === 'EVENT' || gameStore.activeModal === 'FATE') && gameStore.currentEvent" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
    <div class="w-full max-w-lg bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center gap-5">
      <div class="w-14 h-14 rounded-2xl bg-zinc-850 border border-white/[0.08] flex items-center justify-center text-3xl">
        {{ gameStore.currentEvent.icon }}
      </div>

      <div class="flex items-center gap-2">
        <span class="saas-pill saas-pill-indigo text-xs">
          {{ gameStore.activeModal === 'EVENT' ? '校園事件' : '命運輪盤' }}
        </span>
      </div>

      <h3 class="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
        {{ gameStore.currentEvent.title }}
      </h3>

      <p class="text-sm sm:text-base text-zinc-300 leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-white/[0.08] w-full font-sans">
        {{ gameStore.currentEvent.description }}
      </p>

      <!-- 數值變更總結 -->
      <div class="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-mono bg-zinc-950/40 px-4 py-2 rounded-xl border border-white/[0.06]">
        <span v-if="gameStore.currentEvent.hpChange !== 0" :class="gameStore.currentEvent.hpChange > 0 ? 'text-emerald-400' : 'text-rose-400'">
          體力 {{ gameStore.currentEvent.hpChange > 0 ? '+' : '' }}{{ gameStore.currentEvent.hpChange }}
        </span>
        <span v-if="gameStore.currentEvent.creditsChange !== 0" :class="gameStore.currentEvent.creditsChange > 0 ? 'text-indigo-400' : 'text-zinc-500'">
          學分 {{ gameStore.currentEvent.creditsChange > 0 ? '+' : '' }}{{ gameStore.currentEvent.creditsChange }}
        </span>
        <span v-if="gameStore.currentEvent.scoreChange !== 0" class="text-zinc-300">
          得分 +{{ gameStore.currentEvent.scoreChange }}
        </span>
      </div>

      <button 
        @click="gameStore.activeModal = 'NONE'"
        class="saas-btn saas-btn-primary py-2.5 px-6 rounded-xl w-full text-sm font-medium mt-1"
      >
        確定繼續 ➔
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file EventModal.vue
 * @description 現代極簡 SaaS 風格 校園隨機事件與命運彈窗
 */
import { useGameStore } from '../../stores/gameStore';

const gameStore = useGameStore();
</script>