<template>
  <div v-if="gameStore.activeModal === 'QUIZ' && gameStore.currentQuestion" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-mono">
    <div class="w-full max-w-3xl bg-[#0f172a] border-4 border-arcade-border rounded-2xl p-4 sm:p-6 shadow-arcade-glow flex flex-col gap-3 relative overflow-hidden">
      
      <!-- 頂部街機題看板 (致敬 quiz1.jpg 最上方：民國教育委員會 與 分數) -->
      <div class="w-full bg-[#1e293b] border-2 border-slate-600 rounded-lg py-1.5 px-4 flex items-center justify-between shadow-pixel-sm">
        <div class="flex items-center gap-2">
          <span class="text-xs sm:text-sm font-black font-retro text-arcade-yellow drop-shadow">
            {{ gameStore.score }}
          </span>
          <span class="text-xs sm:text-sm font-black tracking-widest text-white">
            民國教育委員會
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- 下注標記 -->
          <span v-if="gameStore.currentWagerAmount > 0" class="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[11px] font-black border border-white animate-pulse">
            🎲 下注: {{ gameStore.currentWagerAmount }} 學分
          </span>
          <!-- 三選一送分標記 -->
          <span v-if="gameStore.isThreeChoiceMode" class="px-2 py-0.5 rounded bg-blue-600 text-yellow-300 text-[11px] font-black border border-white animate-pulse">
            三選一送分
          </span>
          <!-- 天才挑戰標記 -->
          <span v-if="gameStore.isTalentMode" class="px-2 py-0.5 rounded bg-red-600 text-yellow-300 text-[11px] font-black border border-yellow-300 animate-pulse">
            🔥 天才挑戰 (雙倍學分)
          </span>
          <span class="text-xs text-arcade-cyan font-mono font-bold">
            【{{ gameStore.currentQuestion.stage }}】{{ gameStore.currentQuestion.subject }}
          </span>
        </div>
      </div>

      <!-- 反向陷阱題警報橫幅 -->
      <div 
        v-if="gameStore.currentQuestion.isTrapReverse"
        class="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 border border-red-300 rounded-lg py-1 px-3 text-center text-xs font-black text-white shadow-lg animate-pulse"
      >
        ⚠️ 警報！本題為【選出錯誤／不符合選項】之反向陷阱題！請睜大眼睛！
      </div>

      <!-- 題幹文字與多媒體提示 (致敬 quiz1.jpg 黑板上方清晰白字) -->
      <div class="bg-slate-900/90 border border-slate-700 rounded-lg p-3 text-center flex flex-col gap-2">
        <h3 class="text-sm sm:text-base font-bold text-yellow-100 leading-relaxed tracking-wide">
          {{ gameStore.currentQuestion.question }}
        </h3>

        <!-- 多媒體區 A：聽力猜歌旋律播放控制器 (Audio Quiz) -->
        <div 
          v-if="gameStore.currentQuestion.questionType === 'AUDIO_GUESS'"
          class="flex items-center justify-center gap-3 p-2 bg-blue-950/80 border border-blue-400 rounded-lg"
        >
          <div class="flex items-center gap-2 text-xs font-bold text-yellow-300">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>🎧 8-bit 懷舊旋律播放中...</span>
          </div>
          <button
            @click="replayAudioMelody"
            class="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-black rounded shadow active:translate-y-0.5 transition-transform flex items-center gap-1"
          >
            <span>▶ 重新聆聽旋律</span>
          </button>
        </div>

        <!-- 多媒體區 B：視覺局部放大照片 (Visual Zoom Quiz) -->
        <div 
          v-if="gameStore.currentQuestion.questionType === 'VISUAL_ZOOM' && gameStore.currentQuestion.visualImageUrl"
          class="flex flex-col items-center gap-1 p-2 bg-slate-950 rounded-lg border border-slate-700"
        >
          <div class="relative w-48 h-32 rounded overflow-hidden border-2 border-yellow-400 shadow">
            <img 
              :src="gameStore.currentQuestion.visualImageUrl" 
              alt="視覺線索照片"
              class="w-full h-full object-cover transition-all duration-500"
              :style="{ filter: `blur(${visualBlurAmount}px)` }"
            />
            <span class="absolute bottom-1 right-1 bg-black/70 text-[10px] text-yellow-300 px-1 rounded">
              清晰度: {{ 100 - visualBlurAmount * 10 }}%
            </span>
          </div>
          <span class="text-[11px] text-slate-400">隨著作答時間流逝，影像將自動逐步清晰！</span>
        </div>
      </div>

      <!-- 答題主舞台：藍色大黑板 + 左側固定學生 + 右側可替換老師 (致敬 quiz1.jpg) -->
      <div class="relative w-full bg-[#0369a1] border-4 border-[#0f172a] rounded-xl p-3 sm:p-5 shadow-inner overflow-hidden min-h-[220px] flex items-center justify-between">
        <!-- 教室木質邊框與黑板木紋效果 -->
        <div class="absolute inset-0 bg-[#0284c7] opacity-90 pointer-events-none"></div>

        <!-- ================= 1. 左側：固定學生角色 ================= -->
        <div class="relative z-20 flex flex-col items-center w-24 sm:w-32 flex-shrink-0 select-none">
          <!-- 學生頭部動態表情反應 (思考 / 答對開心 / 答錯大哭) -->
          <div class="relative w-20 h-20 sm:w-24 sm:h-24">
            <!-- 學生大頭立繪 (SVG 繪製) -->
            <svg viewBox="0 0 80 80" class="w-full h-full drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
              <!-- 頭髮 -->
              <path d="M16 36 C16 10 64 10 64 36 C64 26 50 16 36 18 C26 20 18 26 16 36 Z" fill="#0f172a" />
              <!-- 臉部 -->
              <rect x="20" y="24" width="40" height="38" rx="14" fill="#ffedd5" stroke="#0f172a" stroke-width="2.5" />
              <!-- 腮紅 -->
              <circle cx="28" cy="50" r="4" fill="#f87171" opacity="0.6" />
              <circle cx="52" cy="50" r="4" fill="#f87171" opacity="0.6" />

              <!-- 表情判定 -->
              <!-- 思考中 (預設) -->
              <g v-if="!gameStore.isAnswered">
                <circle cx="32" cy="40" r="4.5" fill="#0f172a" />
                <circle cx="48" cy="40" r="4.5" fill="#0f172a" />
                <circle cx="34" cy="38" r="1.5" fill="#ffffff" />
                <circle cx="50" cy="38" r="1.5" fill="#ffffff" />
                <path d="M36 56 Q40 54 44 56" stroke="#0f172a" stroke-width="2.5" fill="none" />
              </g>

              <!-- 答對 (開心瞇瞇眼笑開懷) -->
              <g v-else-if="gameStore.isLastAnswerCorrect">
                <path d="M28 40 Q32 34 36 40" stroke="#0f172a" stroke-width="3" fill="none" />
                <path d="M44 40 Q48 34 52 40" stroke="#0f172a" stroke-width="3" fill="none" />
                <path d="M34 52 Q40 62 46 52 Z" fill="#dc2626" stroke="#0f172a" stroke-width="1.5" />
              </g>

              <!-- 答錯 (流眼淚痛哭) -->
              <g v-else>
                <line x1="28" y1="36" x2="36" y2="42" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
                <line x1="28" y1="42" x2="36" y2="36" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
                <line x1="44" y1="36" x2="52" y2="42" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
                <line x1="44" y1="42" x2="52" y2="36" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
                <ellipse cx="40" cy="54" rx="4" ry="6" fill="#0f172a" />
                <!-- 淚水滴落 -->
                <path d="M26 46 C26 50 23 52 23 48 Z" fill="#38bdf8" />
                <path d="M54 46 C54 50 57 52 57 48 Z" fill="#38bdf8" />
              </g>

              <!-- 學生水手制服與衣領領巾 -->
              <path d="M20 62 L60 62 L64 80 L16 80 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2" />
              <polygon points="26,62 34,74 24,72" fill="#ef4444" />
              <polygon points="54,62 46,74 56,72" fill="#ef4444" />
            </svg>

            <!-- 答對/答錯浮動光環標記 -->
            <div 
              v-if="gameStore.isAnswered" 
              class="absolute -top-3 left-1/2 -translate-x-1/2 text-xl font-black animate-bounce-short whitespace-nowrap"
            >
              <span v-if="gameStore.isLastAnswerCorrect" class="text-arcade-green drop-shadow">⭕ 水啦！</span>
              <span v-else class="text-arcade-red drop-shadow">❌ 慘了！</span>
            </div>
          </div>
          <span class="text-[10px] sm:text-xs font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded-full mt-1 border border-slate-700">
            考生代表
          </span>
        </div>

        <!-- ================= 2. 中央：黑板選項題目區 ================= -->
        <div class="relative z-20 flex-1 max-w-md mx-2 bg-[#1e3a8a] border-4 border-[#172554] rounded-xl p-3 shadow-pixel flex flex-col gap-2">
          <!-- 盲答迷霧解鎖按鈕 -->
          <div 
            v-if="isBlackoutActive"
            class="p-2 bg-purple-950/90 border border-purple-400 rounded flex items-center justify-between text-xs text-purple-200"
          >
            <span>🌑 考官啟動盲答迷霧！</span>
            <button
              @click="gameStore.revealBlackoutOptions"
              class="px-2 py-0.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold shadow text-[11px]"
            >
              💡 花費 15 學分揭開
            </button>
          </div>

          <!-- 四個（或三選一）題目選項 -->
          <div class="flex flex-col gap-2">
            <button 
              v-for="(option, idx) in visibleOptions" 
              :key="idx"
              @click="selectAnswer(idx)"
              :disabled="gameStore.isAnswered || isOptionDisabled(idx)"
              class="btn-arcade rounded-lg px-3 py-2 text-left flex items-center justify-between text-xs sm:text-sm transition-all duration-150 border-2"
              :class="getOptionButtonClass(idx)"
            >
              <div class="flex items-center gap-2.5">
                <!-- 數字序號 1, 2, 3, 4 (致敬 quiz1.jpg) -->
                <span class="w-6 h-6 rounded bg-black/40 border border-white/20 flex items-center justify-center font-black font-mono text-arcade-yellow text-sm">
                  {{ idx + 1 }}
                </span>
                
                <!-- 選項文字：若處於盲答迷霧中且未揭開，反黑隱藏 -->
                <span v-if="isBlackoutActive && !gameStore.isAnswered" class="italic text-purple-300">
                  🌑 [選項被考官迷霧遮蔽]
                </span>
                <span v-else class="font-sans font-medium">
                  {{ option }}
                </span>
              </div>

              <!-- 答對/答錯圖示標記 -->
              <span v-if="gameStore.isAnswered && idx === gameStore.currentQuestion?.correctIndex" class="text-emerald-400 font-black">
                ✓ 正解
              </span>
              <span v-else-if="gameStore.isAnswered && idx === gameStore.lastSelectedChoice && !gameStore.isLastAnswerCorrect" class="text-rose-400 font-black">
                ✗ 錯誤
              </span>
            </button>
          </div>
        </div>

        <!-- ================= 3. 右側：可替換授課老師 (手持教鞭指黑板) ================= -->
        <div class="relative z-20 flex flex-col items-center w-24 sm:w-32 flex-shrink-0 select-none">
          <div class="relative w-20 h-20 sm:w-24 sm:h-24">
            <!-- 老師動態頭像 (支援即時更換) -->
            <div class="w-full h-full rounded-full border-4 border-yellow-400 p-1 bg-slate-900 shadow-[0_0_15px_rgba(250,204,21,0.5)] overflow-hidden">
              <img 
                :src="characterStore.activeTeacher.avatarUrl" 
                :alt="characterStore.activeTeacher.name"
                class="w-full h-full object-cover rounded-full"
                @error="onTeacherImgError"
              />
            </div>

            <!-- 教鞭圖標 (直指黑板選項) -->
            <div class="absolute -bottom-2 -left-3 pointer-events-none transform -rotate-12">
              <div class="w-16 h-2 bg-gradient-to-r from-amber-800 to-yellow-600 rounded-full border border-yellow-200 shadow-md"></div>
            </div>
          </div>

          <!-- 老師姓名標牌 -->
          <div class="mt-1 flex flex-col items-center">
            <span class="text-[10px] sm:text-xs font-bold text-yellow-300 bg-slate-900/90 px-2 py-0.5 rounded-full border border-yellow-400 shadow">
              {{ characterStore.activeTeacher.name }}
            </span>
            <span class="text-[9px] text-amber-400/80">
              {{ characterStore.activeTeacher.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- 解說與題目知識小彩蛋 -->
      <div v-if="gameStore.isAnswered && gameStore.currentQuestion.explanation" class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-yellow-200 font-sans leading-relaxed">
        💡 <strong>名師解答：</strong> {{ gameStore.currentQuestion.explanation }}
      </div>

      <!-- 底部計時條與道具操作列 -->
      <div class="flex items-center justify-between gap-3 pt-1 border-t border-slate-800">
        <!-- 倒數計時條 -->
        <div class="flex-1 flex flex-col gap-1">
          <div class="flex items-center justify-between text-xs text-gray-400">
            <span>作答倒數：</span>
            <span class="font-bold font-mono text-sm" :class="gameStore.timeRemaining <= 3 ? 'text-arcade-red animate-ping' : 'text-arcade-yellow'">
              {{ gameStore.timeRemaining }} 秒
            </span>
          </div>
          <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div 
              class="h-full transition-all duration-1000 rounded-full"
              :class="gameStore.timeRemaining <= 3 ? 'bg-arcade-red' : 'bg-gradient-to-r from-arcade-yellow to-orange-500'"
              :style="{ width: `${(gameStore.timeRemaining / gameStore.maxTimeLimit) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- 答題道具輔助列 -->
        <div v-if="!gameStore.isAnswered" class="flex items-center gap-1.5 text-xs">
          <button 
            @click="gameStore.useItem('MAGNIFIER')"
            :disabled="(gameStore.inventory.MAGNIFIER || 0) <= 0 || gameStore.disabledOptionIndices.length >= 2"
            class="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2 py-1 rounded disabled:opacity-40"
          >
            🔍 放大鏡 ({{ gameStore.inventory.MAGNIFIER || 0 }})
          </button>
          <button 
            @click="gameStore.useItem('CLOCK')"
            :disabled="(gameStore.inventory.CLOCK || 0) <= 0"
            class="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2 py-1 rounded disabled:opacity-40"
          >
            ⏰ 加時 ({{ gameStore.inventory.CLOCK || 0 }})
          </button>
          <button 
            @click="gameStore.useItem('PASS_TICKET')"
            :disabled="(gameStore.inventory.PASS_TICKET || 0) <= 0"
            class="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2 py-1 rounded disabled:opacity-40"
          >
            🎫 Pass券 ({{ gameStore.inventory.PASS_TICKET || 0 }})
          </button>
        </div>
        <div v-else></div>

        <!-- 作答完成後繼續推進按鈕 -->
        <button 
          v-if="gameStore.isAnswered"
          @click="handleCloseModal"
          class="btn-arcade bg-arcade-green text-black font-black text-xs sm:text-sm py-1.5 px-5 rounded-lg flex items-center gap-1 shadow-arcade-green"
        >
          <span>繼續前進 ➔</span>
          <span class="text-[10px] bg-black/20 px-1 rounded font-mono">ENTER</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file QuizCard.vue
 * @description 街機經典答題黑板舞台組件 (致敬 quiz1.jpg)
 * 整合左側固定大頭學生（動態表情）、中央黑板選項、右側手持教鞭名師、8-bit 聽力題播放器、視覺局部放大與盲答遮罩。
 */
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { useCharacterStore } from '../../stores/characterStore';
import { melodySynthesizer } from '../../utils/audioMelodySynthesizer';

const gameStore = useGameStore();
const characterStore = useCharacterStore();

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

function getOptionButtonClass(index: number): string {
  if (isOptionDisabled(index)) {
    return 'opacity-30 cursor-not-allowed bg-gray-900 border-gray-800';
  }

  if (gameStore.isAnswered) {
    if (index === gameStore.currentQuestion?.correctIndex) {
      return 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-arcade-green ring-2 ring-emerald-400';
    }
    if (index === gameStore.lastSelectedChoice && !gameStore.isLastAnswerCorrect) {
      return 'bg-rose-950 border-rose-500 text-rose-200 shadow-arcade-red';
    }
    return 'opacity-50 bg-slate-900 border-slate-800';
  }

  return 'bg-slate-800 hover:bg-slate-700 border-slate-600 hover:border-arcade-yellow text-white';
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

<style scoped>
@keyframes bounceShort {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-short {
  animation: bounceShort 1.2s ease-in-out infinite;
}
</style>
