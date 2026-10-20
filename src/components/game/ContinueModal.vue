<template>
  <div v-if="gameStore.activeModal === 'CONTINUE'" class="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
    <div class="w-full max-w-lg bg-arcade-dark border-4 border-arcade-red rounded-3xl p-6 sm:p-10 shadow-arcade-red flex flex-col items-center text-center gap-6">
      <div class="text-5xl">⚠️</div>
      
      <div>
        <h2 class="text-2xl sm:text-3xl font-black text-arcade-red tracking-widest animate-pulse">
          退學留級通知！
        </h2>
        <p class="text-sm sm:text-base text-gray-300 mt-2 font-bold">體力學分耗盡！即將面臨休學處分！</p>
      </div>

      <!-- 經典街機 9 秒巨大倒數數字 -->
      <div class="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-red-950 to-black border-4 border-arcade-red flex items-center justify-center shadow-arcade-red">
        <span class="text-6xl sm:text-7xl font-black font-mono text-arcade-yellow animate-ping">
          {{ gameStore.continueCountdown }}
        </span>
      </div>

      <div class="text-sm sm:text-base text-gray-200 font-mono">
        持有街機代幣: <strong class="text-arcade-yellow text-lg sm:text-xl">{{ gameStore.coins }} 枚</strong>
      </div>

      <!-- 投幣續關按鈕 -->
      <div class="flex flex-col gap-3 w-full">
        <button 
          @click="gameStore.insertCoinToContinue()"
          :disabled="gameStore.coins <= 0"
          class="btn-arcade bg-gradient-to-r from-arcade-yellow via-amber-400 to-orange-500 text-black font-black text-base sm:text-lg py-3.5 px-8 rounded-xl flex items-center justify-center gap-3 shadow-arcade-yellow disabled:opacity-40"
        >
          <span>🪙 投幣續關 (滿血復活)</span>
          <span class="text-xs sm:text-sm bg-black/20 px-2.5 py-1 rounded font-mono">1 COIN</span>
        </button>

        <button 
          @click="gameStore.giveUpContinue()"
          class="text-sm text-gray-400 hover:text-gray-200 py-2 transition-colors"
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
 * @description 街機經典 9 秒投幣續關倒數畫面
 */
import { useGameStore } from '../../stores/gameStore';

const gameStore = useGameStore();
</script>
