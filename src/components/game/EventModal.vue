<template>
  <div v-if="(gameStore.activeModal === 'EVENT' || gameStore.activeModal === 'FATE') && gameStore.currentEvent" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-arcade-dark border-4 border-arcade-orange rounded-2xl p-6 shadow-pixel flex flex-col items-center text-center gap-4">
      <div class="text-5xl animate-bounce-short">
        {{ gameStore.currentEvent.icon }}
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs bg-arcade-orange text-black font-black px-2 py-0.5 rounded">
          {{ gameStore.activeModal === 'EVENT' ? '校園突發事件' : '命運輪盤' }}
        </span>
      </div>

      <h3 class="text-lg font-black text-yellow-200">
        {{ gameStore.currentEvent.title }}
      </h3>

      <p class="text-xs sm:text-sm text-gray-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-700 w-full">
        {{ gameStore.currentEvent.description }}
      </p>

      <!-- 數值變更總結 -->
      <div class="flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold">
        <span v-if="gameStore.currentEvent.hpChange !== 0" :class="gameStore.currentEvent.hpChange > 0 ? 'text-arcade-green' : 'text-arcade-red'">
          ❤️ 體力 {{ gameStore.currentEvent.hpChange > 0 ? '+' : '' }}{{ gameStore.currentEvent.hpChange }}
        </span>
        <span v-if="gameStore.currentEvent.creditsChange !== 0" :class="gameStore.currentEvent.creditsChange > 0 ? 'text-arcade-yellow' : 'text-gray-400'">
          🪙 學分 {{ gameStore.currentEvent.creditsChange > 0 ? '+' : '' }}{{ gameStore.currentEvent.creditsChange }}
        </span>
        <span v-if="gameStore.currentEvent.scoreChange !== 0" class="text-arcade-cyan">
          ⭐ 得分 +{{ gameStore.currentEvent.scoreChange }}
        </span>
      </div>

      <button 
        @click="gameStore.activeModal = 'NONE'"
        class="btn-arcade bg-arcade-yellow text-black font-black text-xs sm:text-sm py-2 px-6 rounded-lg mt-2 w-full"
      >
        確定繼續 ➔
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file EventModal.vue
 * @description 校園隨機事件與命運輪盤彈窗組件
 */
import { useGameStore } from '../../stores/gameStore';

const gameStore = useGameStore();
</script>
