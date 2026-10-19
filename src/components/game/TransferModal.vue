<template>
  <div v-if="gameStore.activeModal === 'TRANSFER' && gameStore.transferMessage" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
    <div 
      class="w-full max-w-md bg-arcade-dark border-4 rounded-2xl p-6 shadow-pixel flex flex-col items-center text-center gap-4"
      :class="gameStore.transferMessage.isLucky ? 'border-arcade-purple shadow-arcade-glow' : 'border-arcade-red shadow-arcade-red'"
    >
      <div class="text-5xl animate-bounce-short">
        {{ gameStore.transferMessage.isLucky ? '🚀' : '👮‍♂️' }}
      </div>

      <h3 
        class="text-lg sm:text-xl font-black"
        :class="gameStore.transferMessage.isLucky ? 'text-arcade-cyan' : 'text-arcade-red'"
      >
        {{ gameStore.transferMessage.title }}
      </h3>

      <p class="text-xs sm:text-sm text-gray-200 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-700 w-full">
        {{ gameStore.transferMessage.desc }}
      </p>

      <button 
        @click="gameStore.activeModal = 'NONE'"
        class="btn-arcade bg-gradient-to-r from-arcade-yellow to-orange-500 text-black font-black text-xs sm:text-sm py-2 px-6 rounded-lg mt-2 w-full"
      >
        遵照校務指示前進 ➔
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file TransferModal.vue
 * @description 轉學跳級／留級命運結果彈窗
 */
import { useGameStore } from '../../stores/gameStore';

const gameStore = useGameStore();
</script>
