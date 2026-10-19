<template>
  <!-- 期中留級與重修補考彈窗 (Remedial Exam Modal) -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in font-mono"
  >
    <div class="relative w-full max-w-xl bg-slate-900 border-4 border-red-500 rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.6)] overflow-hidden flex flex-col">
      <!-- 頂部警報飾條 -->
      <div class="bg-gradient-to-r from-red-700 via-rose-600 to-red-700 px-4 py-2.5 flex items-center justify-between text-white font-black">
        <div class="flex items-center gap-2 text-sm tracking-wider">
          <span class="w-3 h-3 rounded-full bg-yellow-300 animate-ping inline-block"></span>
          <span>⚠️ 教務處留級通告 · 期中挽救補考</span>
        </div>
        <div class="text-xs bg-slate-950/80 text-yellow-300 px-2.5 py-0.5 rounded border border-yellow-400">
          連對考驗: {{ currentStreak }} / {{ targetStreak }}
        </div>
      </div>

      <!-- 主體內容區塊 -->
      <div class="p-5 flex flex-col gap-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
        <!-- 狀態 A: 補考成功，選擇稀有被動聖物裝備 -->
        <div v-if="isPassed" class="flex flex-col items-center text-center gap-4 py-4 animate-fade-in">
          <div class="text-4xl animate-bounce">🎓</div>
          <div>
            <h2 class="text-2xl font-black text-emerald-400 drop-shadow">期中補考全面合格！</h2>
            <p class="text-xs text-yellow-200 mt-1">教官對你的逆境求生表示讚許，體力回復 +50 點！請挑選一項校園傳奇被動聖物裝備：</p>
          </div>

          <!-- 聖物三選一卡片 -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-2">
            <button
              v-for="relic in AVAILABLE_RELICS"
              :key="relic.id"
              @click="claimRelicAndResume(relic)"
              class="p-3.5 bg-slate-800/90 hover:bg-slate-700 border-2 border-yellow-400 hover:border-yellow-200 rounded-xl flex flex-col items-center text-center gap-2 group transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <span class="text-3xl group-hover:scale-110 transition-transform">{{ relic.icon }}</span>
              <span class="text-sm font-black text-yellow-300">{{ relic.name }}</span>
              <p class="text-[11px] text-slate-300 leading-tight">
                {{ relic.description }}
              </p>
              <span class="mt-auto px-2 py-0.5 bg-yellow-400/20 text-yellow-300 text-[10px] font-bold rounded">
                點擊裝備
              </span>
            </button>
          </div>
        </div>

        <!-- 狀態 B: 補考進行中 -->
        <div v-else class="flex flex-col gap-4">
          <!-- 教官嚴厲訓示看板 -->
          <div class="p-3 bg-red-950/60 border border-red-500/60 rounded-xl flex items-center gap-3">
            <div class="w-12 h-12 rounded-full border-2 border-red-400 overflow-hidden bg-slate-800 flex-shrink-0 flex items-center justify-center text-2xl">
              👮
            </div>
            <div class="text-xs text-red-200 leading-relaxed">
              <strong class="text-yellow-300 text-sm">【生輔組鐵血教官】：</strong>
              「同學！你的平時失誤已達退學邊緣！必須連續答對 3 題補考題才能化解留級危機，一旦答錯連對進度直接歸零！」
            </div>
          </div>

          <!-- 連對進度條 -->
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>補考連對進度：</span>
              <span class="font-bold text-yellow-300">{{ currentStreak }} / {{ targetStreak }} 題</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div 
                v-for="step in [1, 2, 3]" 
                :key="step"
                class="h-3 rounded-full border border-slate-700 transition-all duration-300"
                :class="currentStreak >= step ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-800'"
              ></div>
            </div>
          </div>

          <!-- 補考題目卡片 -->
          <div v-if="currentRemedialQuestion" class="p-4 bg-slate-800/90 border-2 border-yellow-400/80 rounded-xl flex flex-col gap-3">
            <div class="flex items-center justify-between text-xs">
              <span class="px-2 py-0.5 bg-blue-600 text-white rounded font-bold">
                【{{ currentRemedialQuestion.subject }}】
              </span>
              <span class="font-bold text-yellow-400 font-mono">
                作答剩餘: {{ timerSeconds }}s
              </span>
            </div>

            <h4 class="text-sm font-bold text-white leading-relaxed">
              {{ currentRemedialQuestion.question }}
            </h4>

            <!-- 四個選項 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <button
                v-for="(option, idx) in currentRemedialQuestion.options"
                :key="idx"
                @click="submitRemedialAnswer(idx)"
                class="p-2.5 bg-slate-900 hover:bg-slate-700 border border-slate-600 hover:border-yellow-400 rounded-lg text-left text-xs text-white font-medium flex items-center gap-2 transition-all"
              >
                <span class="w-5 h-5 rounded bg-black/40 text-yellow-300 font-black flex items-center justify-center text-[11px]">
                  {{ ['A', 'B', 'C', 'D'][idx] }}
                </span>
                <span>{{ option }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file RemedialExamModal.vue
 * @description 期中留級與重修補考彈窗組件 (Remedial Exam Modal)
 * 當玩家累積 3 次答題失誤時觸發，需連續答對 3 題才能免於留級，通關後可獲得稀有校園被動聖物裝備。
 */

import { ref, computed, watch, onUnmounted } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { useQuestionStore } from '../../stores/questionStore';
import { QuestionItem, SchoolRelic } from '../../types/quiz';
import { soundEngine } from '../../utils/audioEngine';

const gameStore = useGameStore();
const questionStore = useQuestionStore();

const isOpen = computed(() => gameStore.activeModal === 'REMEDIAL_EXAM');

const currentStreak = ref<number>(0);
const targetStreak = 3;
const isPassed = ref<boolean>(false);
const currentRemedialQuestion = ref<QuestionItem | null>(null);
const timerSeconds = ref<number>(10);
let intervalId: any = null;

/** 可挑選之稀有被動聖物裝備清單 */
const AVAILABLE_RELICS: SchoolRelic[] = [
  {
    id: 'relic-cheat-sheet',
    name: '考霸作弊小抄',
    icon: '📖',
    description: '每道考題開場時，自動為您直接剔除 1 個錯誤選項！',
    effect: 'AUTO_REMOVE_WRONG'
  },
  {
    id: 'relic-death-pass',
    name: '校長特頒免死金牌',
    icon: '🛡️',
    description: '當體力 HP 歸零面臨退學時，自動抵擋一次致命扣血並回復 35 HP！',
    effect: 'DEATH_PREVENTION'
  },
  {
    id: 'relic-scholarship',
    name: '全校第一榮譽獎學金',
    icon: '💰',
    description: '此後所有隨堂測驗答對時，額外加贈 +20% 學分津貼！',
    effect: 'BONUS_CREDITS'
  }
];

watch(isOpen, (newVal) => {
  if (newVal) {
    currentStreak.value = 0;
    isPassed.value = false;
    soundEngine.playWrong();
    loadNextRemedialQuestion();
  } else {
    clearInterval(intervalId);
  }
});

onUnmounted(() => {
  clearInterval(intervalId);
});

function loadNextRemedialQuestion(): void {
  clearInterval(intervalId);
  timerSeconds.value = 10;
  // 從題庫中隨機挑選一道普通/困難題目
  const q = questionStore.pickQuestion(gameStore.currentStage);
  currentRemedialQuestion.value = q;

  intervalId = setInterval(() => {
    if (timerSeconds.value > 1) {
      timerSeconds.value -= 1;
    } else {
      clearInterval(intervalId);
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout(): void {
  soundEngine.playWrong();
  currentStreak.value = 0;
  gameStore.takeDamage(10);
  loadNextRemedialQuestion();
}

function submitRemedialAnswer(idx: number): void {
  clearInterval(intervalId);
  if (!currentRemedialQuestion.value) return;

  const isCorrect = idx === currentRemedialQuestion.value.correctIndex;
  if (isCorrect) {
    soundEngine.playCorrect();
    currentStreak.value += 1;
    if (currentStreak.value >= targetStreak) {
      // 補考通過！
      isPassed.value = true;
      soundEngine.playFanfare();
    } else {
      loadNextRemedialQuestion();
    }
  } else {
    soundEngine.playWrong();
    currentStreak.value = 0; // 進度歸零重計
    gameStore.takeDamage(10);
    loadNextRemedialQuestion();
  }
}

function claimRelicAndResume(relic: SchoolRelic): void {
  gameStore.passRemedialExam(relic);
}
</script>
