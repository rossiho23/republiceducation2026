<template>
  <!-- 日系新潮街機風 答題主舞台組件 (Neo-Arcade Quiz Stage) -->
  <div 
    v-if="gameStore.activeModal === 'QUIZ' && gameStore.currentQuestion" 
    class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 sm:p-4 font-mono select-none"
  >
    <!-- 主視窗容器 (粗黑 4px 邊框、8px 實心黑陰影、日系戰術切角) -->
    <div class="w-full max-w-3xl bg-[#090b10] border-[4px] border-black shadow-[8px_8px_0px_#000000] p-4 sm:p-6 flex flex-col gap-3 relative overflow-hidden neo-cut">
      
      <!-- 頂部黑黃斑馬警戒條 -->
      <div class="w-full h-1.5 neo-hazard-yellow border-b border-black -mt-2 mb-1"></div>

      <!-- 頂部街機情報欄 (致敬 quiz1.jpg 最上方：民國教育委員會 與 分數) -->
      <div class="w-full bg-[#121620] border-2 border-black p-2 px-3 flex items-center justify-between shadow-[3px_3px_0px_#000]">
        <!-- 左側標題與分數 -->
        <div class="flex items-center gap-3">
          <span class="px-2 py-0.5 bg-yellow-400 text-black text-xs font-black uppercase tracking-wider transform -rotate-1">
            SCORE
          </span>
          <span class="text-sm sm:text-base font-black font-mono text-yellow-400 neo-text-stroke">
            {{ gameStore.score }}
          </span>
          <span class="hidden sm:inline-block text-xs font-black tracking-widest text-white neo-skew-title">
            民國教育委員會
          </span>
        </div>

        <!-- 右側狀態標籤群 (下注、天才、學科) -->
        <div class="flex items-center gap-2">
          <!-- 信心下注標籤 -->
          <span 
            v-if="gameStore.currentWagerAmount > 0" 
            class="px-2 py-0.5 bg-yellow-400 text-black text-[11px] font-black border border-black animate-pulse"
          >
            [下注: {{ gameStore.currentWagerAmount }}]
          </span>
          <!-- 三選一送分標籤 -->
          <span 
            v-if="gameStore.isThreeChoiceMode" 
            class="px-2 py-0.5 bg-cyan-400 text-black text-[11px] font-black border border-black"
          >
            [三選一送分]
          </span>
          <!-- 天才挑戰標籤 -->
          <span 
            v-if="gameStore.isTalentMode" 
            class="px-2 py-0.5 bg-[#ff0055] text-white text-[11px] font-black border border-black animate-pulse"
          >
            [天才雙倍]
          </span>
          <!-- 學科階級標牌 -->
          <span class="px-2.5 py-0.5 bg-white text-black text-xs font-black border border-black">
            {{ gameStore.currentQuestion.stage }} · {{ gameStore.currentQuestion.subject }}
          </span>
        </div>
      </div>

      <!-- 反向陷阱題警報橫幅 -->
      <div 
        v-if="gameStore.currentQuestion.isTrapReverse"
        class="neo-hazard-red p-1.5 border-2 border-black text-center text-xs font-black text-white shadow-[3px_3px_0px_#000] tracking-widest animate-pulse"
      >
        // 警報！本題為【選出錯誤／不符合選項】之反向陷阱題！請睜大眼睛！ //
      </div>

      <!-- 題幹文字與多媒體提示看板 (致敬 quiz1.jpg 黑板上方清晰大字) -->
      <div class="bg-[#121620] border-2 border-black p-3.5 text-center flex flex-col gap-2.5 shadow-[4px_4px_0px_#000] relative">
        <h3 class="text-sm sm:text-base font-black text-yellow-300 leading-relaxed tracking-wide">
          {{ gameStore.currentQuestion.question }}
        </h3>

        <!-- 多媒體區 A：聽力猜歌旋律播放控制器 (Audio Quiz) -->
        <div 
          v-if="gameStore.currentQuestion.questionType === 'AUDIO_GUESS'"
          class="flex items-center justify-center gap-3 p-2 bg-[#090b10] border-2 border-cyan-400 neo-cut-sm"
        >
          <div class="flex items-center gap-2 text-xs font-black text-cyan-400">
            <span class="w-2.5 h-2.5 bg-emerald-400 animate-ping inline-block"></span>
            <span>// 8-BIT 懷舊旋律播放中... //</span>
          </div>
          <button
            @click="replayAudioMelody"
            class="neo-btn neo-btn-yellow py-1 px-3 text-xs tracking-wider"
          >
            ▶ 重新播放
          </button>
        </div>

        <!-- 多媒體區 B：視覺局部放大照片 (Visual Zoom Quiz) -->
        <div 
          v-if="gameStore.currentQuestion.questionType === 'VISUAL_ZOOM' && gameStore.currentQuestion.visualImageUrl"
          class="flex flex-col items-center gap-1.5 p-2 bg-black border-2 border-yellow-400 neo-cut-sm"
        >
          <div class="relative w-48 h-32 overflow-hidden border-2 border-black shadow-[3px_3px_0px_#000]">
            <img 
              :src="gameStore.currentQuestion.visualImageUrl" 
              alt="視覺線索照片"
              class="w-full h-full object-cover transition-all duration-500"
              :style="{ filter: `blur(${visualBlurAmount}px)` }"
            />
            <span class="absolute bottom-1 right-1 bg-black text-[10px] text-yellow-400 px-1 font-black border border-yellow-400">
              清晰度: {{ 100 - visualBlurAmount * 10 }}%
            </span>
          </div>
          <span class="text-[11px] text-gray-400 font-bold">// 隨著作答時間流逝，影像將自動逐步清晰 //</span>
        </div>
      </div>

      <!-- 答題主舞台：實木外框深海軍藍黑板 + 左側學生 + 右側名師 (致敬 quiz1.jpg) -->
      <div class="relative w-full bg-[#002b49] border-[6px] border-[#854d0e] p-3 sm:p-5 shadow-inner overflow-hidden min-h-[220px] flex items-center justify-between">
        <!-- 黑板粉筆槽實木裝飾底條 -->
        <div class="absolute bottom-0 inset-x-0 h-2 bg-[#713f12] border-t border-[#a16207]"></div>

        <!-- ================= 1. 左側：固定學生角色 ================= -->
        <div class="relative z-20 flex flex-col items-center w-24 sm:w-32 flex-shrink-0 select-none">
          <div class="relative w-20 h-20 sm:w-24 sm:h-24">
            <!-- 學生大頭立繪 (SVG 繪製) -->
            <svg viewBox="0 0 80 80" class="w-full h-full drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)]">
              <path d="M16 36 C16 10 64 10 64 36 C64 26 50 16 36 18 C26 20 18 26 16 36 Z" fill="#0f172a" />
              <rect x="20" y="24" width="40" height="38" rx="14" fill="#ffedd5" stroke="#0f172a" stroke-width="2.5" />
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
                <path d="M26 46 C26 50 23 52 23 48 Z" fill="#38bdf8" />
                <path d="M54 46 C54 50 57 52 57 48 Z" fill="#38bdf8" />
              </g>

              <!-- 學生水手制服與衣領領巾 -->
              <path d="M20 62 L60 62 L64 80 L16 80 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2" />
              <polygon points="26,62 34,74 24,72" fill="#ef4444" />
              <polygon points="54,62 46,74 56,72" fill="#ef4444" />
            </svg>

            <!-- 答對/答錯日系印章標記 -->
            <div 
              v-if="gameStore.isAnswered" 
              class="absolute -top-3 left-1/2 -translate-x-1/2 text-sm font-black whitespace-nowrap border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_#000] transform -rotate-6"
              :class="gameStore.isLastAnswerCorrect ? 'bg-yellow-400 text-black' : 'bg-[#ff0055] text-white'"
            >
              {{ gameStore.isLastAnswerCorrect ? '⭕ 正解 PASS' : '❌ 答錯 FAIL' }}
            </div>
          </div>
          <span class="text-[10px] font-black text-black bg-white px-2 py-0.5 border border-black mt-1">
            考生代表
          </span>
        </div>

        <!-- ================= 2. 中央：黑板選項題目區 (日系戰術按鈕) ================= -->
        <div class="relative z-20 flex-1 max-w-md mx-2 bg-[#001d33] border-[3px] border-black p-3 shadow-[4px_4px_0px_#000] flex flex-col gap-2 neo-cut-sm">
          <!-- 盲答迷霧解鎖按鈕 -->
          <div 
            v-if="isBlackoutActive"
            class="p-2 bg-[#3b0764] border-2 border-[#bd00ff] flex items-center justify-between text-xs text-white neo-cut-sm"
          >
            <span class="font-bold">// 考官啟動盲答迷霧 //</span>
            <button
              @click="gameStore.revealBlackoutOptions"
              class="neo-btn neo-btn-yellow py-0.5 px-2 text-[11px]"
            >
              花費 15 學分揭開
            </button>
          </div>

          <!-- 四個（或三選一）題目選項 (Neo-Arcade 按鈕) -->
          <div class="flex flex-col gap-2">
            <button 
              v-for="(option, idx) in visibleOptions" 
              :key="idx"
              @click="selectAnswer(idx)"
              :disabled="gameStore.isAnswered || isOptionDisabled(idx)"
              class="neo-btn p-2.5 text-left flex items-center justify-between text-xs sm:text-sm transition-all neo-cut-sm"
              :class="getOptionButtonClass(idx)"
            >
              <div class="flex items-center gap-2.5">
                <!-- 數字序號 1, 2, 3, 4 (黑底黃字粗框) -->
                <span class="w-6 h-6 bg-black border border-yellow-400 flex items-center justify-center font-black font-mono text-yellow-400 text-xs">
                  {{ idx + 1 }}
                </span>
                
                <!-- 選項文字：若處於盲答迷霧中且未揭開，反黑隱藏 -->
                <span v-if="isBlackoutActive && !gameStore.isAnswered" class="italic text-purple-300">
                  [選項已被考官迷霧遮蔽]
                </span>
                <span v-else class="font-sans font-bold">
                  {{ option }}
                </span>
              </div>

              <!-- 答對/答錯圖示標記 -->
              <span v-if="gameStore.isAnswered && idx === gameStore.currentQuestion?.correctIndex" class="px-2 py-0.5 bg-yellow-400 text-black text-[11px] font-black border border-black transform rotate-1">
                ✓ 正解
              </span>
              <span v-else-if="gameStore.isAnswered && idx === gameStore.lastSelectedChoice && !gameStore.isLastAnswerCorrect" class="px-2 py-0.5 bg-[#ff0055] text-white text-[11px] font-black border border-black transform -rotate-1">
                ✗ 錯誤
              </span>
            </button>
          </div>
        </div>

        <!-- ================= 3. 右側：可替換授課老師 (手持教鞭指黑板) ================= -->
        <div class="relative z-20 flex flex-col items-center w-24 sm:w-32 flex-shrink-0 select-none">
          <div class="relative w-20 h-20 sm:w-24 sm:h-24">
            <div class="w-full h-full border-[3px] border-black p-0.5 bg-yellow-400 shadow-[3px_3px_0px_#000] overflow-hidden">
              <img 
                :src="characterStore.activeTeacher.avatarUrl" 
                :alt="characterStore.activeTeacher.name"
                class="w-full h-full object-cover"
                @error="onTeacherImgError"
              />
            </div>

            <!-- 教鞭圖標 (直指黑板選項) -->
            <div class="absolute -bottom-2 -left-3 pointer-events-none transform -rotate-12">
              <div class="w-16 h-2 bg-yellow-500 rounded-full border border-black shadow"></div>
            </div>
          </div>

          <!-- 老師姓名標牌 -->
          <div class="mt-1 flex flex-col items-center">
            <span class="text-[10px] font-black text-black bg-yellow-400 px-2 py-0.5 border border-black">
              {{ characterStore.activeTeacher.name }}
            </span>
            <span class="text-[9px] text-yellow-300 font-bold">
              {{ characterStore.activeTeacher.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- 名師解答小彩蛋 (作答後才顯示) -->
      <div 
        v-if="gameStore.isAnswered && gameStore.currentQuestion.explanation" 
        class="p-2.5 bg-[#121620] border-2 border-yellow-400 text-xs text-yellow-200 font-sans leading-relaxed neo-cut-sm shadow-[3px_3px_0px_#000]"
      >
        ★ <strong>名師解答：</strong> {{ gameStore.currentQuestion.explanation }}
      </div>

      <!-- 底部計時條與道具操作列 -->
      <div class="flex items-center justify-between gap-3 pt-1 border-t-2 border-black">
        <!-- 倒數計時條 -->
        <div class="flex-1 flex flex-col gap-1">
          <div class="flex items-center justify-between text-xs text-gray-300">
            <span class="font-bold">作答倒數：</span>
            <span 
              class="font-black font-mono text-sm px-1.5 border border-black" 
              :class="gameStore.timeRemaining <= 3 ? 'bg-[#ff0055] text-white animate-pulse' : 'bg-yellow-400 text-black'"
            >
              {{ gameStore.timeRemaining }} 秒
            </span>
          </div>
          <div class="w-full bg-black h-2.5 border border-gray-700 overflow-hidden">
            <div 
              class="h-full transition-all duration-1000"
              :class="gameStore.timeRemaining <= 3 ? 'bg-[#ff0055]' : 'bg-yellow-400'"
              :style="{ width: `${(gameStore.timeRemaining / gameStore.maxTimeLimit) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- 答題道具輔助列 -->
        <div v-if="!gameStore.isAnswered" class="flex items-center gap-1.5 text-xs">
          <button 
            @click="gameStore.useItem('MAGNIFIER')"
            :disabled="(gameStore.inventory.MAGNIFIER || 0) <= 0 || gameStore.disabledOptionIndices.length >= 2"
            class="neo-btn bg-[#121620] hover:bg-[#1a2130] text-gray-200 px-2 py-1 text-xs disabled:opacity-40"
          >
            [放大鏡: {{ gameStore.inventory.MAGNIFIER || 0 }}]
          </button>
          <button 
            @click="gameStore.useItem('CLOCK')"
            :disabled="(gameStore.inventory.CLOCK || 0) <= 0"
            class="neo-btn bg-[#121620] hover:bg-[#1a2130] text-gray-200 px-2 py-1 text-xs disabled:opacity-40"
          >
            [加時: {{ gameStore.inventory.CLOCK || 0 }}]
          </button>
          <button 
            @click="gameStore.useItem('PASS_TICKET')"
            :disabled="(gameStore.inventory.PASS_TICKET || 0) <= 0"
            class="neo-btn bg-[#121620] hover:bg-[#1a2130] text-gray-200 px-2 py-1 text-xs disabled:opacity-40"
          >
            [PASS券: {{ gameStore.inventory.PASS_TICKET || 0 }}]
          </button>
        </div>
        <div v-else></div>

        <!-- 作答完成後繼續推進按鈕 -->
        <button 
          v-if="gameStore.isAnswered"
          @click="handleCloseModal"
          class="neo-btn neo-btn-yellow text-black font-black text-xs sm:text-sm py-1.5 px-5 flex items-center gap-1 shadow-[4px_4px_0px_#000]"
        >
          <span>繼續前進 ➔</span>
          <span class="text-[10px] bg-black text-yellow-400 px-1 font-mono">ENTER</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file QuizCard.vue
 * @description 日系新潮街機風 答題舞台組件 (Neo-Arcade Quiz Card)
 * 具備日系大字報排版、戰術切角按鈕、實木深海軍藍黑板、動態表情學生與手持教鞭名師。
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

/**
 * 依據作答狀態動態計算選項按鈕樣式 (日系撞色打擊感)
 * @param {number} index 選項索引
 */
function getOptionButtonClass(index: number): string {
  if (isOptionDisabled(index)) {
    return 'opacity-30 cursor-not-allowed bg-black text-gray-500 border-gray-800';
  }

  if (gameStore.isAnswered) {
    if (index === gameStore.currentQuestion?.correctIndex) {
      return 'bg-yellow-400 text-black border-black shadow-[4px_4px_0px_#000] scale-[1.02]';
    }
    if (index === gameStore.lastSelectedChoice && !gameStore.isLastAnswerCorrect) {
      return 'bg-[#ff0055] text-white border-black shadow-[4px_4px_0px_#000]';
    }
    return 'opacity-40 bg-[#090b10] text-gray-400 border-black';
  }

  return 'bg-[#121620] hover:bg-[#1a2130] text-white border-black hover:border-yellow-400';
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
