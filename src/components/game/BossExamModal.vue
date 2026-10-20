<template>
  <!-- 日系新潮街機風 升學檢定大考 (BOSS 戰) 彈窗 (Neo-Arcade Boss Exam) -->
  <div 
    v-if="gameStore.activeModal === 'BOSS_EXAM' && gameStore.bossExam.currentQuestion" 
    class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-4 font-mono select-none"
  >
    <!-- 主彈窗容器 (粗黑 4px 邊框、8px 實心紅陰影、日系戰術切角 · 寬屏放寬) -->
    <div class="w-full max-w-4xl 2xl:max-w-5xl bg-[#090b10] border-[4px] border-black shadow-[8px_8px_0px_#ff0055] p-5 sm:p-8 flex flex-col gap-4 relative overflow-hidden neo-cut">
      
      <!-- 頂部黑紅警戒條 -->
      <div class="w-full h-2 neo-hazard-red border-b border-black -mt-2 mb-1"></div>

      <!-- 頂部 Boss 戰警報標頭 -->
      <div class="flex items-center justify-between border-b-2 border-black pb-3">
        <div class="flex items-center gap-3">
          <span class="w-4 h-4 bg-[#ff0055] animate-ping inline-block"></span>
          <div>
            <h2 class="text-xl sm:text-2xl md:text-3xl font-black text-[#ff0055] tracking-wider neo-skew-title neo-text-stroke">
              【{{ gameStore.currentStageConfig.title }}】升學檢定大考 (BOSS 戰)
            </h2>
            <p class="text-xs sm:text-sm text-gray-300 font-bold mt-0.5">
              {{ gameStore.bossExam.isConsecutiveMode ? '// 頂級考驗：必須連續答對方可晉級！答錯進度倒扣！ //' : `// 及格標準：需累計答對 ${gameStore.bossExam.targetCount} 題，剩餘容錯 ${gameStore.bossExam.maxAllowedMistakes - gameStore.bossExam.mistakesCount} 次 //` }}
            </p>
          </div>
        </div>

        <span class="text-xs sm:text-sm bg-[#ff0055] text-white font-mono font-black px-3 py-1 border border-black transform rotate-1 shadow-[2px_2px_0px_#000]">
          BOSS EXAM
        </span>
      </div>

      <!-- 及格合格進度條 (高對比方塊 · 字級加大) -->
      <div class="bg-[#121620] p-3.5 sm:p-4 border-2 border-black neo-cut-sm shadow-[3px_3px_0px_#000] flex flex-col gap-2">
        <div class="flex items-center justify-between text-xs sm:text-sm font-mono font-bold">
          <span class="text-gray-200">升學合格進度:</span>
          <span class="text-yellow-400 text-base sm:text-lg font-black">
            {{ gameStore.bossExam.passedCount }} / {{ gameStore.bossExam.targetCount }} 題
          </span>
        </div>
        <div class="w-full h-4 bg-black border border-gray-700 overflow-hidden p-0.5">
          <div 
            class="h-full transition-all duration-300 bg-yellow-400"
            :style="{ width: `${(gameStore.bossExam.passedCount / gameStore.bossExam.targetCount) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- 倒數計時條 -->
      <div class="flex flex-col gap-1.5">
        <div class="flex justify-between text-xs sm:text-sm font-mono">
          <span class="text-gray-300 font-bold">限時作答:</span>
          <span 
            class="font-black text-sm sm:text-base px-2 py-0.5 border border-black"
            :class="gameStore.timeRemaining <= 3 ? 'bg-[#ff0055] text-white animate-pulse' : 'bg-yellow-400 text-black'"
          >
            {{ gameStore.timeRemaining }} 秒
          </span>
        </div>
        <div class="w-full h-3 bg-black border border-gray-700 overflow-hidden">
          <div 
            class="h-full transition-all duration-150"
            :class="gameStore.timeRemaining <= 3 ? 'bg-[#ff0055]' : 'bg-yellow-400'"
            :style="{ width: `${(gameStore.timeRemaining / gameStore.maxTimeLimit) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- 題目內容 (大字題幹) -->
      <div class="py-2">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs sm:text-sm font-black px-2.5 py-0.5 bg-yellow-400 text-black border border-black">
            {{ gameStore.bossExam.currentQuestion.subject }}
          </span>
        </div>
        <h3 class="text-xl sm:text-2xl md:text-3xl font-black text-yellow-300 leading-snug tracking-wide min-h-[55px]">
          {{ gameStore.bossExam.currentQuestion.question }}
        </h3>
      </div>

      <!-- 四個作答選項 (Neo-Arcade 按鈕 · 16px~19px 大字) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-1">
        <button 
          v-for="(option, idx) in gameStore.bossExam.currentQuestion.options" 
          :key="idx"
          @click="selectBossAnswer(idx)"
          :disabled="gameStore.isAnswered || isOptionDisabled(idx)"
          class="neo-btn p-3.5 sm:p-4 text-left flex items-center justify-between text-base sm:text-lg md:text-xl font-bold neo-cut-sm"
          :class="getBossOptionClass(idx)"
        >
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 bg-black border-2 border-yellow-400 flex items-center justify-center font-black font-mono text-yellow-400 text-sm sm:text-base flex-shrink-0 shadow-[2px_2px_0px_#000]">
              {{ ['A', 'B', 'C', 'D'][idx] }}
            </span>
            <span :class="{ 'line-through text-gray-500': isOptionDisabled(idx) }" class="font-sans font-black tracking-wide leading-tight">
              {{ option }}
            </span>
          </div>

          <div v-if="gameStore.isAnswered">
            <span v-if="idx === gameStore.bossExam.currentQuestion.correctIndex" class="px-2 py-0.5 bg-yellow-400 text-black text-xs font-black border border-black">
              ⭕ 正解
            </span>
            <span v-else-if="idx === gameStore.lastSelectedChoice" class="px-2 py-0.5 bg-[#ff0055] text-white text-xs font-black border border-black">
              ❌ 錯誤
            </span>
          </div>
        </button>
      </div>

      <!-- 道具輔助列 -->
      <div class="flex items-center justify-between pt-2 border-t-2 border-black">
        <div class="flex items-center gap-2 text-xs">
          <button 
            @click="gameStore.useItem('MAGNIFIER')"
            :disabled="(gameStore.inventory.MAGNIFIER || 0) <= 0 || gameStore.disabledOptionIndices.length >= 2 || gameStore.isAnswered"
            class="neo-btn bg-[#121620] hover:bg-[#1a2130] text-gray-200 px-2 py-1 text-xs disabled:opacity-40"
          >
            [放大鏡: {{ gameStore.inventory.MAGNIFIER || 0 }}]
          </button>
          <button 
            @click="gameStore.useItem('CLOCK')"
            :disabled="(gameStore.inventory.CLOCK || 0) <= 0 || gameStore.isAnswered"
            class="neo-btn bg-[#121620] hover:bg-[#1a2130] text-gray-200 px-2 py-1 text-xs disabled:opacity-40"
          >
            [加時: {{ gameStore.inventory.CLOCK || 0 }}]
          </button>
        </div>

        <span class="text-xs text-gray-400 font-mono font-bold">
          容錯機會：{{ gameStore.bossExam.maxAllowedMistakes - gameStore.bossExam.mistakesCount }} 次
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file BossExamModal.vue
 * @description 日系新潮街機風 升學檢定大考 (BOSS 戰) 彈窗組件 (Neo-Arcade Boss Exam)
 * 具備黑紅警戒條紋、戰術粗黑邊框、實心陰影按鈕、倒數計時與嚴苛連對扣血考驗。
 */
import { useGameStore } from '../../stores/gameStore';

const gameStore = useGameStore();

function isOptionDisabled(index: number): boolean {
  return gameStore.disabledOptionIndices.includes(index);
}

function selectBossAnswer(index: number): void {
  if (isOptionDisabled(index) || gameStore.isAnswered) return;
  gameStore.handleBossAnswer(index);
}

function getBossOptionClass(index: number): string {
  if (isOptionDisabled(index)) {
    return 'opacity-30 cursor-not-allowed bg-black text-gray-600 border-gray-800';
  }

  if (gameStore.isAnswered) {
    if (index === gameStore.bossExam.currentQuestion?.correctIndex) {
      return 'bg-yellow-400 text-black border-black shadow-[4px_4px_0px_#000] scale-[1.02]';
    }
    if (index === gameStore.lastSelectedChoice) {
      return 'bg-[#ff0055] text-white border-black shadow-[4px_4px_0px_#000]';
    }
    return 'opacity-40 bg-[#090b10] text-gray-400 border-black';
  }

  return 'bg-[#121620] hover:bg-[#1a2130] text-white border-black hover:border-yellow-400';
}
</script>
