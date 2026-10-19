<template>
  <div v-if="gameStore.activeModal === 'BOSS_EXAM' && gameStore.bossExam.currentQuestion" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
    <div class="w-full max-w-2xl bg-arcade-dark border-4 border-arcade-red rounded-2xl p-5 sm:p-7 shadow-arcade-red flex flex-col gap-4 relative overflow-hidden">
      <!-- 頂部 Boss 戰警報霓虹標頭 -->
      <div class="flex items-center justify-between border-b border-red-950 pb-3">
        <div class="flex items-center gap-2">
          <span class="text-2xl animate-pulse">🚨</span>
          <div>
            <h2 class="text-base sm:text-lg font-black text-arcade-red tracking-wider">
              【{{ gameStore.currentStageConfig.title }}】升學檢定大考 (BOSS 戰)
            </h2>
            <p class="text-[11px] text-gray-400">
              {{ gameStore.bossExam.isConsecutiveMode ? '⚠️ 頂級考驗：必須連續答對方可晉級！答錯進度倒扣！' : `及格標準：需累計答對 ${gameStore.bossExam.targetCount} 題，剩餘容錯 ${gameStore.bossExam.maxAllowedMistakes - gameStore.bossExam.mistakesCount} 次` }}
            </p>
          </div>
        </div>

        <span class="text-xs bg-red-900/60 text-red-300 font-mono font-bold px-2.5 py-1 rounded border border-red-700">
          BOSS EXAM
        </span>
      </div>

      <!-- 及格進度條 -->
      <div class="bg-gray-950 p-3 rounded-xl border border-gray-800 flex flex-col gap-2">
        <div class="flex items-center justify-between text-xs font-mono font-bold">
          <span class="text-gray-300">🎓 升學合格進度:</span>
          <span class="text-arcade-yellow text-sm">
            {{ gameStore.bossExam.passedCount }} / {{ gameStore.bossExam.targetCount }} 題
          </span>
        </div>
        <div class="w-full h-4 bg-gray-900 rounded-full border border-gray-700 overflow-hidden p-0.5">
          <div 
            class="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-orange-500 via-arcade-yellow to-arcade-green"
            :style="{ width: `${(gameStore.bossExam.passedCount / gameStore.bossExam.targetCount) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- 倒數計時條 -->
      <div class="flex flex-col gap-1">
        <div class="flex justify-between text-xs font-mono">
          <span class="text-gray-400">⏱️ 限時作答:</span>
          <span 
            class="font-black"
            :class="gameStore.timeRemaining <= 3 ? 'text-arcade-red animate-pulse text-sm' : 'text-arcade-yellow'"
          >
            {{ gameStore.timeRemaining }} 秒
          </span>
        </div>
        <div class="w-full h-2.5 bg-gray-900 rounded-full border border-gray-700 overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-150"
            :class="gameStore.timeRemaining <= 3 ? 'bg-arcade-red animate-pulse' : 'bg-arcade-cyan'"
            :style="{ width: `${(gameStore.timeRemaining / gameStore.maxTimeLimit) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- 題目內容 -->
      <div class="py-1">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-200">
            {{ gameStore.bossExam.currentQuestion.subject }}
          </span>
        </div>
        <h3 class="text-base sm:text-lg font-bold text-yellow-100 leading-relaxed min-h-[45px]">
          {{ gameStore.bossExam.currentQuestion.question }}
        </h3>
      </div>

      <!-- 四個作答選項 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-1">
        <button 
          v-for="(option, idx) in gameStore.bossExam.currentQuestion.options" 
          :key="idx"
          @click="selectBossAnswer(idx)"
          :disabled="gameStore.isAnswered || isOptionDisabled(idx)"
          class="btn-arcade rounded-xl p-3 text-left flex items-center justify-between text-xs sm:text-sm border-2"
          :class="getBossOptionClass(idx)"
        >
          <div class="flex items-center gap-2.5">
            <span class="w-6 h-6 rounded bg-black/40 border border-white/20 flex items-center justify-center font-black font-mono">
              {{ ['A', 'B', 'C', 'D'][idx] }}
            </span>
            <span :class="{ 'line-through text-gray-500': isOptionDisabled(idx) }">
              {{ option }}
            </span>
          </div>

          <div v-if="gameStore.isAnswered">
            <span v-if="idx === gameStore.bossExam.currentQuestion.correctIndex" class="text-lg text-arcade-green font-black">
              ⭕
            </span>
            <span v-else-if="idx === gameStore.lastSelectedChoice" class="text-lg text-arcade-red font-black">
              ❌
            </span>
          </div>
        </button>
      </div>

      <!-- 底部道具輔助列 -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-800 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-gray-400 font-bold">道具支援:</span>
          <button 
            @click="gameStore.useItem('MAGNIFIER')"
            :disabled="(gameStore.inventory.MAGNIFIER || 0) <= 0 || gameStore.disabledOptionIndices.length >= 2 || gameStore.isAnswered"
            class="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2 py-1 rounded disabled:opacity-40"
          >
            🔍 放大鏡 ({{ gameStore.inventory.MAGNIFIER || 0 }})
          </button>
          <button 
            @click="gameStore.useItem('CLOCK')"
            :disabled="(gameStore.inventory.CLOCK || 0) <= 0 || gameStore.isAnswered"
            class="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2 py-1 rounded disabled:opacity-40"
          >
            ⏰ 加時 ({{ gameStore.inventory.CLOCK || 0 }})
          </button>
          <button 
            @click="gameStore.useItem('PASS_TICKET')"
            :disabled="(gameStore.inventory.PASS_TICKET || 0) <= 0 || gameStore.isAnswered"
            class="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2 py-1 rounded disabled:opacity-40"
          >
            🎫 換題 ({{ gameStore.inventory.PASS_TICKET || 0 }})
          </button>
        </div>

        <span class="text-gray-400 font-mono text-[11px]">按鍵 A/B/C/D 快捷作答</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file BossExamModal.vue
 * @description 升學大考 Boss 關卡彈窗，包含合格進度條、連續答對判定與倒扣機制
 */
import { onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../../stores/gameStore';

const gameStore = useGameStore();

function isOptionDisabled(index: number): boolean {
  return gameStore.disabledOptionIndices.includes(index);
}

function selectBossAnswer(index: number): void {
  if (isOptionDisabled(index)) return;
  gameStore.handleBossAnswer(index);
}

function getBossOptionClass(index: number): string {
  if (isOptionDisabled(index)) {
    return 'opacity-30 cursor-not-allowed bg-gray-900 border-gray-800';
  }

  if (gameStore.isAnswered) {
    if (index === gameStore.bossExam.currentQuestion?.correctIndex) {
      return 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-arcade-green ring-2 ring-emerald-400';
    }
    if (index === gameStore.lastSelectedChoice && !gameStore.isLastAnswerCorrect) {
      return 'bg-rose-950 border-rose-500 text-rose-200 shadow-arcade-red';
    }
    return 'opacity-50 bg-slate-900 border-slate-800';
  }

  return 'bg-slate-800 hover:bg-slate-700 border-slate-600 hover:border-arcade-yellow text-white';
}

function handleBossKeyDown(e: KeyboardEvent): void {
  if (gameStore.activeModal !== 'BOSS_EXAM' || gameStore.isAnswered) return;
  const key = e.key.toUpperCase();
  if (key === 'A' || key === '1') selectBossAnswer(0);
  else if (key === 'B' || key === '2') selectBossAnswer(1);
  else if (key === 'C' || key === '3') selectBossAnswer(2);
  else if (key === 'D' || key === '4') selectBossAnswer(3);
}

onMounted(() => {
  window.addEventListener('keydown', handleBossKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleBossKeyDown);
});
</script>
