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
      <div class="py-1">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs sm:text-sm font-black px-2.5 py-0.5 bg-yellow-400 text-black border border-black">
            {{ gameStore.bossExam.currentQuestion.subject }}
          </span>
        </div>
        <h3 class="text-xl sm:text-2xl md:text-3xl font-black text-yellow-300 leading-snug tracking-wide min-h-[55px]">
          {{ gameStore.bossExam.currentQuestion.question }}
        </h3>
      </div>

      <!-- 多媒體區 A：聽力猜歌旋律播放控制器 (Audio Quiz) -->
      <div 
        v-if="gameStore.bossExam.currentQuestion.questionType === 'AUDIO_GUESS'"
        class="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-[#001d33] border-2 border-cyan-400 neo-cut-sm"
      >
        <div class="flex items-center gap-2 text-sm sm:text-base font-black text-cyan-400">
          <span class="w-3 h-3 bg-emerald-400 animate-ping inline-block"></span>
          <span>// 8-BIT 懷舊旋律播放中... //</span>
          <span class="text-xs bg-red-600 text-white font-mono px-2 py-0.5 border border-black shadow ml-1">
            🔇 BGM 自動暫停中
          </span>
        </div>
        <button
          type="button"
          @click="replayBossAudioMelody"
          class="neo-btn neo-btn-yellow py-1.5 px-4 text-xs sm:text-sm tracking-wider font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
        >
          <span>▶ 重新播放</span>
        </button>
      </div>

      <!-- 多媒體區 B：視覺局部放大照片 (Visual Zoom Quiz) -->
      <div 
        v-if="gameStore.bossExam.currentQuestion.questionType === 'VISUAL_ZOOM' && gameStore.bossExam.currentQuestion.visualImageUrl"
        class="flex flex-col items-center gap-2 p-3 bg-black border-2 border-yellow-400 neo-cut-sm"
      >
        <div class="relative w-56 sm:w-64 h-36 sm:h-44 overflow-hidden border-2 border-black shadow-[3px_3px_0px_#000]">
          <img 
            :src="gameStore.bossExam.currentQuestion.visualImageUrl" 
            alt="視覺線索照片"
            class="w-full h-full object-cover transition-all duration-500"
            :style="{ filter: `blur(${visualBlurAmount}px)` }"
          />
          <span class="absolute bottom-1 right-1 bg-black text-xs text-yellow-400 px-1.5 py-0.5 font-black border border-yellow-400">
            清晰度: {{ 100 - visualBlurAmount * 10 }}%
          </span>
        </div>
        <span class="text-xs sm:text-sm text-gray-300 font-bold">// 隨著作答時間流逝，影像將自動逐步清晰 //</span>
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

      <!-- 作答完成後手動推進按鈕 (雙保險防死鎖) -->
      <div 
        v-if="gameStore.isAnswered && !gameStore.bossExam.isCleared && !gameStore.bossExam.isFailed" 
        class="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-[#121620] border-2 border-yellow-400 neo-cut-sm animate-pulse"
      >
        <div class="flex items-center gap-2 text-xs sm:text-sm text-yellow-300 font-bold">
          <span>⌛ 系統將於 1.2 秒後自動前進，或立即點擊按鈕：</span>
        </div>
        <button 
          type="button"
          @click="handleManualAdvance"
          class="neo-btn neo-btn-yellow text-black font-black text-xs sm:text-sm py-1.5 px-5 flex items-center gap-1.5 shadow-[3px_3px_0px_#000]"
        >
          <span>下一題 ➔</span>
          <span class="text-[10px] bg-black text-yellow-400 px-1.5 py-0.5 font-mono">ENTER</span>
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
 * 具備黑紅警戒條紋、戰術粗黑邊框、實心陰影按鈕、倒數計時、8-Bit 懷舊旋律播放器與雙保險防死鎖換題機制。
 */
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { melodySynthesizer } from '../../utils/audioMelodySynthesizer';
import { bgmEngine } from '../../utils/bgmEngine';

const gameStore = useGameStore();

/** 視覺題模糊程度 (隨時間越短越清晰) */
const visualBlurAmount = computed(() => {
  if (gameStore.bossExam.currentQuestion?.questionType !== 'VISUAL_ZOOM') return 0;
  const ratio = gameStore.timeRemaining / gameStore.maxTimeLimit;
  return Math.max(0, Math.round(ratio * 10)); // 10px -> 0px
});

/**
 * 監聽 Boss 題目更換：若為聽力題則自動暫停背景音樂並播放 8-Bit 方波旋律
 */
watch(() => gameStore.bossExam.currentQuestion, (newQ) => {
  if (newQ && newQ.questionType === 'AUDIO_GUESS' && newQ.audioMelodyId) {
    bgmEngine.pauseForAudioQuiz();
    melodySynthesizer.play(newQ.audioMelodyId);
  } else {
    melodySynthesizer.stop();
    bgmEngine.resumeFromAudioQuiz();
  }
}, { immediate: true });

/**
 * 重新播放當前 Boss 題目的 8-bit 旋律
 */
function replayBossAudioMelody(): void {
  if (gameStore.bossExam.currentQuestion?.audioMelodyId) {
    bgmEngine.pauseForAudioQuiz();
    melodySynthesizer.play(gameStore.bossExam.currentQuestion.audioMelodyId);
  }
}

function isOptionDisabled(index: number): boolean {
  return gameStore.disabledOptionIndices.includes(index);
}

/**
 * 玩家選擇答案
 * @param {number} index 選項索引 (0~3)
 */
function selectBossAnswer(index: number): void {
  if (isOptionDisabled(index) || gameStore.isAnswered) return;
  melodySynthesizer.stop();
  bgmEngine.resumeFromAudioQuiz();
  gameStore.handleBossAnswer(index);
}

/**
 * 玩家手動點擊「下一題 ➔」按鈕 (雙保險防卡死)
 */
function handleManualAdvance(): void {
  melodySynthesizer.stop();
  bgmEngine.resumeFromAudioQuiz();
  gameStore.advanceBossQuestionManually();
}

/**
 * 依據作答狀態動態計算選項按鈕樣式
 * @param {number} index 選項索引
 */
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

/**
 * 鍵盤快速鍵監聽 (A/B/C/D、1/2/3/4、ENTER、SPACE)
 */
function handleBossKeyDown(e: KeyboardEvent): void {
  if (gameStore.activeModal !== 'BOSS_EXAM') return;

  if (gameStore.isAnswered) {
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      handleManualAdvance();
    }
    return;
  }

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
  melodySynthesizer.stop();
  bgmEngine.resumeFromAudioQuiz();
  window.removeEventListener('keydown', handleBossKeyDown);
});
</script>
