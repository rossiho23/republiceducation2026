<template>
  <!-- 現代極簡 SaaS 風格 答題主舞台組件 (Modern Minimalist Quiz Stage) -->
  <div 
    v-if="gameStore.activeModal === 'QUIZ' && gameStore.currentQuestion" 
    class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none overflow-y-auto"
  >
    <!-- 主視窗容器 (Linear / Vercel 幾何圓角、微光邊框、寬屏放寬) -->
    <div class="w-full max-w-5xl 2xl:max-w-6xl bg-zinc-900/90 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 sm:p-8 flex flex-col gap-6 relative overflow-hidden my-auto transition-all duration-200">
      
      <!-- 頂部情報欄 (Bento 現代標籤與狀態流) -->
      <div class="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <!-- 左側：學科與題級微膠囊標籤 -->
        <div class="flex items-center gap-2.5">
          <span class="saas-pill saas-pill-indigo text-xs font-medium">
            {{ gameStore.currentQuestion.stage }} · {{ gameStore.currentQuestion.subject }}
          </span>
          <span class="text-xs text-zinc-400 font-mono">
            SCORE: <strong class="text-zinc-100 font-semibold">{{ gameStore.score }}</strong>
          </span>
        </div>

        <!-- 右側狀態標籤群 (下注、天才、三選一) -->
        <div class="flex items-center gap-2 text-xs font-mono">
          <!-- 信心下注標籤 -->
          <span 
            v-if="gameStore.currentWagerAmount > 0" 
            class="saas-pill bg-amber-500/10 border-amber-500/30 text-amber-300"
          >
            下注: {{ gameStore.currentWagerAmount }}
          </span>
          <!-- 三選一送分標籤 -->
          <span 
            v-if="gameStore.isThreeChoiceMode" 
            class="saas-pill bg-sky-500/10 border-sky-500/30 text-sky-300"
          >
            三選一送分
          </span>
          <!-- 天才挑戰標籤 -->
          <span 
            v-if="gameStore.isTalentMode" 
            class="saas-pill saas-pill-rose font-medium animate-pulse"
          >
            天才挑戰 (雙倍)
          </span>
        </div>
      </div>

      <!-- 反向陷阱題警報橫幅 (低飽和玫瑰微框) -->
      <div 
        v-if="gameStore.currentQuestion.isTrapReverse"
        class="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-center text-xs sm:text-sm font-medium text-rose-300 tracking-wide"
      >
        提示：本題為【選出錯誤／不符合選項】之反向題，請仔細審題。
      </div>

      <!-- 題幹文字看板 (大字報清晰排版 · 22px~30px) -->
      <div class="px-2 sm:px-6 py-2 text-center flex flex-col gap-4">
        <h3 class="text-2xl sm:text-3xl font-semibold text-zinc-100 leading-snug tracking-tight">
          {{ gameStore.currentQuestion.question }}
        </h3>

        <!-- 多媒體區 A：聽力猜歌旋律播放控制器 (Audio Quiz) -->
        <div 
          v-if="gameStore.currentQuestion.questionType === 'AUDIO_GUESS'"
          class="flex items-center justify-center gap-4 p-3 bg-zinc-950/60 border border-white/[0.08] rounded-xl max-w-md mx-auto"
        >
          <div class="flex items-center gap-2 text-xs sm:text-sm font-medium text-indigo-300">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping inline-block"></span>
            <span>8-Bit 音訊播放中...</span>
          </div>
          <button
            @click="replayAudioMelody"
            class="saas-btn saas-btn-secondary py-1 px-3 text-xs"
          >
            重播旋律
          </button>
        </div>

        <!-- 多媒體區 B：視覺局部放大照片 (Visual Zoom Quiz) -->
        <div 
          v-if="gameStore.currentQuestion.questionType === 'VISUAL_ZOOM' && gameStore.currentQuestion.visualImageUrl"
          class="flex flex-col items-center gap-2 p-3 bg-zinc-950/60 border border-white/[0.08] rounded-xl max-w-sm mx-auto"
        >
          <div class="relative w-56 sm:w-64 h-36 sm:h-44 overflow-hidden rounded-lg border border-white/[0.1] shadow-md">
            <img 
              :src="gameStore.currentQuestion.visualImageUrl" 
              alt="視覺線索照片"
              class="w-full h-full object-cover transition-all duration-500"
              :style="{ filter: `blur(${visualBlurAmount}px)` }"
            />
            <span class="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-[11px] text-zinc-300 px-2 py-0.5 rounded font-mono border border-white/[0.1]">
              清晰度: {{ 100 - visualBlurAmount * 10 }}%
            </span>
          </div>
          <span class="text-xs text-zinc-500">隨著時間倒數，影像細節將自動浮現</span>
        </div>
      </div>

      <!-- 答題主舞台：左側學生 + 中央現代四選一選項 + 右側名師 (Bento 對齊) -->
      <div class="relative w-full flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-8">
        
        <!-- 左側：學生立繪卡片 (極簡微透卡片) -->
        <div class="hidden md:flex flex-col items-center w-32 flex-shrink-0 select-none">
          <div class="relative w-24 h-24 rounded-2xl bg-zinc-950/80 border border-white/[0.08] p-2 flex items-center justify-center shadow-inner">
            <img 
              :src="studentAvatar" 
              alt="作答學生"
              class="w-full h-full object-contain select-none pointer-events-none"
            />
            <!-- 答對/答錯微標籤 -->
            <div 
              v-if="gameStore.isAnswered" 
              class="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5 rounded-full border shadow-sm"
              :class="gameStore.isLastAnswerCorrect ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'"
            >
              {{ gameStore.isLastAnswerCorrect ? '正確' : '錯誤' }}
            </div>
          </div>
          <span class="text-xs text-zinc-500 mt-2 font-mono">
            考生狀態
          </span>
        </div>

        <!-- 中央：四個題目選項 (Modern SaaS Bento 互動卡片 · 16px~20px 大字) -->
        <div class="w-full flex-1 max-w-3xl flex flex-col gap-3">
          <!-- 盲答迷霧解鎖按鈕 -->
          <div 
            v-if="isBlackoutActive"
            class="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl flex items-center justify-between text-xs sm:text-sm text-zinc-300"
          >
            <span>考官啟動盲答迷霧 (遮蔽選項)</span>
            <button
              @click="gameStore.revealBlackoutOptions"
              class="saas-btn saas-btn-primary py-1 px-3 text-xs"
            >
              花費 15 學分揭開
            </button>
          </div>

          <!-- 四個作答選項卡片 -->
          <div class="flex flex-col gap-2.5">
            <button 
              v-for="(option, idx) in visibleOptions" 
              :key="idx"
              @click="selectAnswer(idx)"
              :disabled="gameStore.isAnswered || isOptionDisabled(idx)"
              class="w-full p-4 sm:p-5 rounded-xl border text-left flex items-center justify-between text-base sm:text-lg transition-all duration-200"
              :class="getModernOptionClass(idx)"
            >
              <div class="flex items-center gap-3.5">
                <!-- 數字序號標籤 (Modern Kbd) -->
                <span class="saas-kbd w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 text-xs sm:text-sm font-semibold">
                  {{ ['A', 'B', 'C', 'D'][idx] }}
                </span>
                
                <!-- 選項文字：若處於盲答迷霧中且未揭開，反黑隱藏 -->
                <span v-if="isBlackoutActive && !gameStore.isAnswered" class="italic text-zinc-500">
                  [選項已被迷霧遮蔽]
                </span>
                <span v-else class="font-normal text-zinc-100 tracking-wide leading-snug">
                  {{ option }}
                </span>
              </div>

              <!-- 答對/答錯圖示標記 -->
              <span v-if="gameStore.isAnswered && idx === gameStore.currentQuestion?.correctIndex" class="saas-pill saas-pill-emerald text-xs font-semibold whitespace-nowrap ml-2">
                ✓ 正解
              </span>
              <span v-else-if="gameStore.isAnswered && idx === gameStore.lastSelectedChoice && !gameStore.isLastAnswerCorrect" class="saas-pill saas-pill-rose text-xs font-semibold whitespace-nowrap ml-2">
                ✗ 錯誤
              </span>
            </button>
          </div>
        </div>

        <!-- 右側：可替換授課老師 (極簡圓角卡片) -->
        <div class="hidden md:flex flex-col items-center w-32 flex-shrink-0 select-none">
          <div class="relative w-24 h-24 rounded-2xl bg-zinc-950/80 border border-white/[0.08] p-1.5 flex items-center justify-center shadow-inner overflow-hidden">
            <img 
              :src="characterStore.activeTeacher.avatarUrl" 
              :alt="characterStore.activeTeacher.name"
              class="w-full h-full object-cover rounded-xl"
              @error="onTeacherImgError"
            />
          </div>
          <!-- 老師姓名標牌 -->
          <div class="mt-2 flex flex-col items-center text-center">
            <span class="text-xs font-medium text-zinc-200">
              {{ characterStore.activeTeacher.name }}
            </span>
            <span class="text-[11px] text-zinc-500 font-mono">
              {{ characterStore.activeTeacher.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- 名師解答小提示 (作答後才平滑淡入 · 柔和深灰底色) -->
      <div 
        v-if="gameStore.isAnswered && gameStore.currentQuestion.explanation" 
        class="p-4 bg-zinc-950/60 border border-white/[0.08] rounded-xl text-sm sm:text-base text-zinc-300 leading-relaxed font-sans"
      >
        <span class="text-indigo-400 font-medium">💡 解析說明：</span>
        {{ gameStore.currentQuestion.explanation }}
      </div>

      <!-- 底部計時條與輔助操作列 -->
      <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
        <!-- 倒數計時條 (極簡細線微動) -->
        <div class="flex-1 min-w-[200px] flex flex-col gap-1.5">
          <div class="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>倒數計時</span>
            <span 
              class="font-semibold text-xs" 
              :class="gameStore.timeRemaining <= 3 ? 'text-rose-400 animate-pulse' : 'text-zinc-200'"
            >
              {{ gameStore.timeRemaining }} 秒
            </span>
          </div>
          <div class="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
            <div 
              class="h-full transition-all duration-1000 rounded-full"
              :class="gameStore.timeRemaining <= 3 ? 'bg-rose-500' : 'bg-indigo-500'"
              :style="{ width: `${(gameStore.timeRemaining / gameStore.maxTimeLimit) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- 答題道具輔助列 -->
        <div v-if="!gameStore.isAnswered" class="flex flex-wrap items-center gap-2 text-xs">
          <button 
            @click="gameStore.useItem('MAGNIFIER')"
            :disabled="(gameStore.inventory.MAGNIFIER || 0) <= 0 || gameStore.disabledOptionIndices.length >= 2"
            class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
          >
            放大鏡: {{ gameStore.inventory.MAGNIFIER || 0 }}
          </button>
          <button 
            @click="gameStore.useItem('CLOCK')"
            :disabled="(gameStore.inventory.CLOCK || 0) <= 0"
            class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
          >
            加時: {{ gameStore.inventory.CLOCK || 0 }}
          </button>
          <button 
            @click="gameStore.useItem('PASS_TICKET')"
            :disabled="(gameStore.inventory.PASS_TICKET || 0) <= 0"
            class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
          >
            PASS券: {{ gameStore.inventory.PASS_TICKET || 0 }}
          </button>
        </div>
        <div v-else></div>

        <!-- 作答完成後繼續推進按鈕 (唯一 Accent 焦點) -->
        <button 
          v-if="gameStore.isAnswered"
          @click="handleCloseModal"
          class="saas-btn saas-btn-primary py-2.5 px-6 flex items-center gap-2 text-sm font-medium"
        >
          <span>繼續前進</span>
          <span class="saas-kbd text-[10px] bg-indigo-700/60 border-indigo-500/50 text-indigo-100">ENTER</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file QuizCard.vue
 * @description 現代極簡 SaaS 風格 答題主舞台組件 (Modern Minimalist Quiz Stage)
 * 具備 Bento Grid 排版、Zinc 冷調層次、大字報題幹、Indigo 焦點選項與細邊框質感。
 */
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { useCharacterStore } from '../../stores/characterStore';
import { melodySynthesizer } from '../../utils/audioMelodySynthesizer';
import {
  PIXEL_STUDENT_THINKING,
  PIXEL_STUDENT_CORRECT,
  PIXEL_STUDENT_WRONG
} from '../../assets/pixelArt';

const gameStore = useGameStore();
const characterStore = useCharacterStore();

/** 依據答題狀態動態切換 16-Bit 像素學生立繪 */
const studentAvatar = computed(() => {
  if (!gameStore.isAnswered) return PIXEL_STUDENT_THINKING;
  return gameStore.isLastAnswerCorrect ? PIXEL_STUDENT_CORRECT : PIXEL_STUDENT_WRONG;
});

const visibleOptions = computed(() => {
  return gameStore.currentQuestion?.options || [];
});

/** 盲答迷霧是否啟動中 (是盲答題且未解鎖) */
const isBlackoutActive = computed(() => {
  return !!gameStore.currentQuestion?.isBlackout && !gameStore.isBlackoutRevealed;
});

/** 視覺題模糊程度 (隨時間越短越清晰) */
const visualBlurAmount = computed(() => {
  if (gameStore.currentQuestion?.questionType !== 'VISUAL_ZOOM') return 0;
  const ratio = gameStore.timeRemaining / gameStore.maxTimeLimit;
  return Math.max(0, Math.round(ratio * 10)); // 10px -> 0px
});

/**
 * 監聽題目更換，若為聽力題則自動播放 8-bit 旋律
 */
watch(() => gameStore.currentQuestion, (newQ) => {
  if (newQ && newQ.questionType === 'AUDIO_GUESS' && newQ.audioMelodyId) {
    melodySynthesizer.play(newQ.audioMelodyId);
  } else {
    melodySynthesizer.stop();
  }
});

function replayAudioMelody(): void {
  if (gameStore.currentQuestion?.audioMelodyId) {
    melodySynthesizer.play(gameStore.currentQuestion.audioMelodyId);
  }
}

function isOptionDisabled(index: number): boolean {
  return gameStore.disabledOptionIndices.includes(index);
}

function selectAnswer(index: number): void {
  if (isOptionDisabled(index)) return;
  melodySynthesizer.stop();
  gameStore.answerCurrentQuestion(index);
}

function handleCloseModal(): void {
  melodySynthesizer.stop();
  gameStore.closeQuizModal();
}

/**
 * 依據作答狀態動態計算選項卡片樣式 (Linear 現代極簡微光)
 * @param {number} index 選項索引
 */
function getModernOptionClass(index: number): string {
  if (isOptionDisabled(index)) {
    return 'opacity-35 cursor-not-allowed bg-zinc-950/40 text-zinc-500 border-zinc-800/50';
  }

  if (gameStore.isAnswered) {
    if (index === gameStore.currentQuestion?.correctIndex) {
      return 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.18)] scale-[1.01]';
    }
    if (index === gameStore.lastSelectedChoice && !gameStore.isLastAnswerCorrect) {
      return 'bg-rose-500/15 border-rose-500/50 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.18)]';
    }
    return 'opacity-40 bg-zinc-950/40 text-zinc-500 border-zinc-800/40';
  }

  return 'bg-zinc-800/40 hover:bg-zinc-800/80 border-white/[0.08] hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] cursor-pointer';
}

function onTeacherImgError(e: Event): void {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=MasterTeacher';
  }
}

function handleQuizKeyDown(e: KeyboardEvent): void {
  if (gameStore.activeModal !== 'QUIZ') return;

  if (gameStore.isAnswered) {
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      handleCloseModal();
    }
    return;
  }

  const key = e.key.toUpperCase();
  if (key === 'A' || key === '1') selectAnswer(0);
  else if (key === 'B' || key === '2') selectAnswer(1);
  else if (key === 'C' || key === '3') selectAnswer(2);
  else if (key === 'D' || key === '4') selectAnswer(3);
}

onMounted(() => {
  window.addEventListener('keydown', handleQuizKeyDown);
});

onUnmounted(() => {
  melodySynthesizer.stop();
  window.removeEventListener('keydown', handleQuizKeyDown);
});
</script>
