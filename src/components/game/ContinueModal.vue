<template>
  <!-- 現代極簡 SaaS 風格 投幣續關倒數畫面 -->
  <div v-if="gameStore.activeModal === 'CONTINUE'" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
    <div class="w-full max-w-md bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center gap-6">
      <div class="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-2xl text-rose-400">
        ⚠️
      </div>
      
      <div>
        <h2 class="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
          學業中斷通知
        </h2>
        <p class="text-xs sm:text-sm text-zinc-400 mt-1 font-mono">體力學分耗盡，即將結算成績</p>
      </div>

      <!-- 現代極簡 9 秒倒數圓環 -->
      <div class="w-28 h-28 rounded-full bg-zinc-950 border border-white/[0.1] flex items-center justify-center shadow-inner relative">
        <span class="text-5xl font-mono font-bold text-indigo-400">
          {{ gameStore.continueCountdown }}
        </span>
      </div>

      <div class="text-xs sm:text-sm text-zinc-400 font-mono">
        持有街機代幣: <strong class="text-zinc-100 font-semibold">{{ gameStore.coins }} 枚</strong>
      </div>

      <!-- 投幣續關按鈕 -->
      <div class="flex flex-col gap-3 w-full">
        <button 
          @click="gameStore.insertCoinToContinue()"
          :disabled="gameStore.coins <= 0"
          class="saas-btn saas-btn-primary py-3 px-6 text-sm font-medium w-full flex items-center justify-center gap-2"
        >
          <span>投幣續關 (完全復原)</span>
          <span class="saas-kbd text-[10px] bg-indigo-700/60 border-indigo-500/50 text-indigo-100">1 COIN</span>
        </button>

        <button 
          @click="gameStore.giveUpContinue()"
          class="saas-btn saas-btn-ghost text-xs text-zinc-500 hover:text-zinc-300 py-2"
        >
          放棄接關，結算學業成績單 ➔
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ContinueModal.vue
 * @description 現代極簡 SaaS 風格 投幣續關倒數畫面 (Linear Modern Continue Modal)
 */
import { useGameStore } from '../../stores/gameStore';

const gameStore = useGameStore();
</script>