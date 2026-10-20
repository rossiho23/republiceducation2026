<template>
  <!-- 現代極簡 SaaS 風格 升學檢定大考 (BOSS 戰) 彈窗 (Linear Modern Boss Exam) -->
  <div 
    v-if="gameStore.activeModal === 'BOSS_EXAM' && gameStore.bossExam.currentQuestion" 
    class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none"
  >
    <!-- 主彈窗容器 (Bento Grid 圓角卡片) -->
    <div class="w-full max-w-4xl 2xl:max-w-5xl bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 flex flex-col gap-5 relative overflow-hidden">
      
      <!-- 頂部 Boss 戰標頭 -->
      <div class="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
          <div>
            <h2 class="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
              <span>【{{ gameStore.currentStageConfig.title }}】升學檢定大考</span>
              <span class="saas-pill saas-pill-rose text-xs font-mono">BOSS EXAM</span>
            </h2>
            <p class="text-xs text-zinc-400 mt-1 font-mono">
              {{ gameStore.bossExam.isConsecutiveMode ? '頂級考驗：必須連續答對方可晉級，答錯進度重置' : `及格標準：需累計答對 ${gameStore.bossExam.targetCount} 題，剩餘容錯 ${gameStore.bossExam.maxAllowedMistakes - gameStore.bossExam.mistakesCount} 次` }}
            </p>
          </div>
        </div>

        <span class="saas-pill text-xs font-mono text-zinc-400">
          STAGE FINALE
        </span>
      </div>

      <!-- 及格進度條與限時作答條 (雙 Bento 進度列) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- 合格進度 -->
        <div class="bg-zinc-950/60 p-4 border border-white/[0.08] rounded-xl flex flex-col gap-2">
          <div class="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>合格進度</span>
            <span class="text-indigo-400 font-semibold text-sm">
              {{ gameStore.bossExam.passedCount }} / {{ gameStore.bossExam.targetCount }} 題
            </span>
          </div>
          <div class="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              class="h-full transition-all duration-300 rounded-full bg-indigo-500"
              :style="{ width: `${(gameStore.bossExam.passedCount / gameStore.bossExam.targetCount) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- 倒數計時 -->
        <div class="bg-zinc-950/60 p-4 border border-white/[0.08] rounded-xl flex flex-col gap-2">
          <div class="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>限時作答</span>
            <span 
              class="font-semibold text-sm font-mono"
              :class="gameStore.timeRemaining <= 3 ? 'text-rose-400 animate-pulse' : 'text-zinc-200'"
            >
              {{ gameStore.timeRemaining }} 秒
            </span>
          </div>
          <div class="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              class="h-full transition-all duration-150 rounded-full"
              :class="gameStore.timeRemaining <= 3 ? 'bg-rose-500' : 'bg-indigo-500'"
              :style="{ width: `${(gameStore.timeRemaining / gameStore.maxTimeLimit) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 題目內容 (大字題幹) -->
      <div class="py-2">
        <div class="flex items-center gap-2 mb-2">
          <span class="saas-pill saas-pill-indigo text-xs">
            {{ gameStore.bossExam.currentQuestion.subject }}
          </span>
        </div>
        <h3 class="text-xl sm:text-2xl font-semibold text-zinc-100 leading-snug tracking-tight">
          {{ gameStore.bossExam.currentQuestion.question }}
        </h3>
      </div>

      <!-- 四個作答選項 (Modern Bento 互動按鈕 · 16px~20px 大字) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-1">
        <button 
          v-for="(option, idx) in gameStore.bossExam.currentQuestion.options" 
          :key="idx"
          @click="selectBossAnswer(idx)"
          :disabled="gameStore.isAnswered || isOptionDisabled(idx)"
          class="p-4 sm:p-5 rounded-xl border text-left flex items-center justify-between text-base sm:text-lg transition-all duration-200"
          :class="getBossOptionClass(idx)"
        >
          <div class="flex items-center gap-3">
            <span class="saas-kbd w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 text-xs sm:text-sm font-semibold">
              {{ ['A', 'B', 'C', 'D'][idx] }}
            </span>
            <span :class="{ 'line-through text-zinc-600': isOptionDisabled(idx) }" class="font-normal text-zinc-100 tracking-wide leading-snug">
              {{ option }}
            </span>
          </div>

          <div v-if="gameStore.isAnswered">
            <span v-if="idx === gameStore.bossExam.currentQuestion.correctIndex" class="saas-pill saas-pill-emerald text-xs font-semibold whitespace-nowrap ml-2">
              ✓ 正解
            </span>
            <span v-else-if="idx === gameStore.lastSelectedChoice" class="saas-pill saas-pill-rose text-xs font-semibold whitespace-nowrap ml-2">
              ✗ 錯誤
            </span>
          </div>
        </button>
      </div>

      <!-- 道具輔助列 -->
      <div class="flex items-center justify-between pt-4 border-t border-white/[0.08]">
        <div class="flex items-center gap-2 text-xs">
          <button 
            @click="gameStore.useItem('MAGNIFIER')"
            :disabled="(gameStore.inventory.MAGNIFIER || 0) <= 0 || gameStore.disabledOptionIndices.length >= 2 || gameStore.isAnswered"
            class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
          >
            放大鏡: {{ gameStore.inventory.MAGNIFIER || 0 }}
          </button>
          <button 
            @click="gameStore.useItem('CLOCK')"
            :disabled="(gameStore.inventory.CLOCK || 0) <= 0 || gameStore.isAnswered"
            class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
          >
            加時: {{ gameStore.inventory.CLOCK || 0 }}
          </button>
        </div>

        <span class="text-xs text-zinc-400 font-mono">
          剩餘容錯：<strong class="text-zinc-200">{{ gameStore.bossExam.maxAllowedMistakes - gameStore.bossExam.mistakesCount }}</strong> 次
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file BossExamModal.vue
 * @description 現代極簡 SaaS 風格 升學檢定大考 (BOSS 戰) 彈窗組件 (Linear Modern Boss Exam)
 * 具備 Bento 雙進度條、微光邊框、平滑選項過渡與容錯次數指示。
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
    return 'opacity-35 cursor-not-allowed bg-zinc-950/40 text-zinc-500 border-zinc-800/50';
  }

  if (gameStore.isAnswered) {
    if (index === gameStore.bossExam.currentQuestion?.correctIndex) {
      return 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.18)] scale-[1.01]';
    }
    if (index === gameStore.lastSelectedChoice) {
      return 'bg-rose-500/15 border-rose-500/50 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.18)]';
    }
    return 'opacity-40 bg-zinc-950/40 text-zinc-500 border-zinc-800/40';
  }

  return 'bg-zinc-800/40 hover:bg-zinc-800/80 border-white/[0.08] hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] cursor-pointer';
}
</script>