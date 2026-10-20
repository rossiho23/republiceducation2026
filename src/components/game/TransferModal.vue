<template>
  <div v-if="gameStore.activeModal === 'TRANSFER' && gameStore.transferMessage" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
    <div 
      class="w-full max-w-xl bg-arcade-dark border-4 rounded-2xl p-6 sm:p-8 shadow-pixel flex flex-col items-center text-center gap-5"
      :class="gameStore.transferMessage.isLucky ? 'border-arcade-purple shadow-arcade-glow' : 'border-arcade-red shadow-arcade-red'"
    >
      <div class="text-6xl animate-bounce-short">
        {{ gameStore.transferMessage.isLucky ? '🚀' : '👮‍♂️' }}
      </div>

      <h3 
        class="text-2xl sm:text-3xl font-black tracking-wider"
        :class="gameStore.transferMessage.isLucky ? 'text-arcade-cyan' : 'text-arcade-red'"
      >
        {{ gameStore.transferMessage.title }}
      </h3>

      <p class="text-base sm:text-lg text-gray-200 leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-700 w-full">
        {{ gameStore.transferMessage.desc }}
      </p>

      <button 
        @click="gameStore.activeModal = 'NONE'"
        class="btn-arcade bg-gradient-to-r from-arcade-yellow to-orange-500 text-black font-black text-base sm:text-lg py-3.5 px-8 rounded-xl mt-2 w-full shadow-arcade-yellow"
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
