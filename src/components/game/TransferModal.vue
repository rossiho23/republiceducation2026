<template>
  <!-- 現代極簡 SaaS 風格 轉學跳級／留級命運結果彈窗 -->
  <div v-if="gameStore.activeModal === 'TRANSFER' && gameStore.transferMessage" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
    <div class="w-full max-w-lg bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center gap-5">
      <div class="w-14 h-14 rounded-2xl bg-zinc-850 border border-white/[0.08] flex items-center justify-center text-3xl">
        {{ gameStore.transferMessage.isLucky ? '🚀' : '👮' }}
      </div>

      <h3 
        class="text-xl sm:text-2xl font-semibold tracking-tight"
        :class="gameStore.transferMessage.isLucky ? 'text-indigo-400' : 'text-rose-400'"
      >
        {{ gameStore.transferMessage.title }}
      </h3>

      <p class="text-sm sm:text-base text-zinc-300 leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-white/[0.08] w-full font-sans">
        {{ gameStore.transferMessage.desc }}
      </p>

      <button 
        @click="gameStore.activeModal = 'NONE'"
        class="saas-btn saas-btn-primary py-2.5 px-6 rounded-xl w-full text-sm font-medium mt-1"
      >
        遵照校務指示前進 ➔
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file TransferModal.vue
 * @description 現代極簡 SaaS 風格 轉學跳級／留級命運結果彈窗
 */
import { useGameStore } from '../../stores/gameStore';

const gameStore = useGameStore();
</script>