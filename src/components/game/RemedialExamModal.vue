<template>
  <!-- 日系新潮街機風 期中留級挽救補考彈窗 (Neo-Arcade Remedial Exam Modal) -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 font-mono select-none"
  >
    <!-- 主彈窗容器 (粗黑 4px 邊框、8px 實心紅陰影、日系戰術切角) -->
    <div class="relative w-full max-w-xl bg-[#090b10] border-[4px] border-black shadow-[8px_8px_0px_#ff0055] neo-cut flex flex-col overflow-hidden">
      
      <!-- 頂部黑紅警戒斑馬紋 -->
      <div class="w-full h-2 neo-hazard-red border-b-2 border-black"></div>

      <!-- 頂部警報飾條 -->
      <div class="bg-[#121620] px-4 py-2.5 border-b-2 border-black flex items-center justify-between text-white font-black">
        <div class="flex items-center gap-2 text-sm tracking-wider neo-skew-title">
          <span class="w-2.5 h-2.5 bg-yellow-400 animate-ping inline-block"></span>
          <span>// RETENTION NOTICE // 教務處留級通告</span>
        </div>
        <div class="text-xs bg-[#ff0055] text-white px-2.5 py-0.5 border border-black font-black">
          連對考驗: {{ currentStreak }} / {{ targetStreak }}
        </div>
      </div>

      <!-- 主體內容區塊 -->
      <div class="p-5 flex flex-col gap-4 bg-[#090b10]">
        <!-- 狀態 A: 補考成功，選擇稀有被動聖物裝備 -->
        <div v-if="isPassed" class="flex flex-col items-center text-center gap-4 py-3">
          <div class="w-14 h-14 bg-yellow-400 border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#000] transform -rotate-3">
            🎓
          </div>
          <div>
            <h2 class="text-2xl font-black text-yellow-400 neo-skew-title neo-text-stroke">
              期中補考全面合格！
            </h2>
            <p class="text-xs text-gray-300 mt-1">
              教官對你的逆境求生表示讚許，體力回復 +50 點！請挑選一項校園傳奇被動聖物裝備：
            </p>
          </div>

          <!-- 聖物三選一卡片 (Neo-Arcade 切角卡片) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-1">
            <button
              v-for="relic in AVAILABLE_RELICS"
              :key="relic.id"
              @click="claimRelicAndResume(relic)"
              class="neo-btn bg-[#121620] hover:bg-[#1a2130] p-3.5 border-2 border-black neo-cut-sm flex flex-col items-center text-center gap-2 transition-all shadow-[4px_4px_0px_#ffe600]"
            >
              <span class="text-3xl">{{ relic.icon }}</span>
              <span class="text-sm font-black text-yellow-400 neo-skew-title">{{ relic.name }}</span>
              <p class="text-[11px] text-gray-300 leading-tight">
                {{ relic.description }}
              </p>
              <span class="mt-auto px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-black border border-black">
                點擊裝備
              </span>
            </button>
          </div>
        </div>

        <!-- 狀態 B: 補考進行中 -->
        <div v-else class="flex flex-col gap-3.5">
          <!-- 教官訓示看板 -->
          <div class="p-3 bg-[#121620] border-2 border-black neo-cut-sm shadow-[3px_3px_0px_#000] flex items-center gap-3">
            <div class="w-10 h-10 border-2 border-black bg-yellow-400 flex-shrink-0 flex items-center justify-center text-xl shadow-[2px_2px_0px_#000]">
              👮
            </div>
            <div class="text-xs text-gray-300 leading-relaxed">
              <strong class="text-yellow-400 text-sm">【生輔組鐵血教官】：</strong>
              「同學！你的平時失誤已達退學邊緣！必須連續答對 3 題補考題才能化解留級危機，一旦答錯連對進度直接歸零！」
            </div>
          </div>

          <!-- 連對進度條 (高對比方塊) -->
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between text-xs text-gray-400 font-bold">
              <span>補考連對進度：</span>
              <span class="font-black text-yellow-400 font-mono">{{ currentStreak }} / {{ targetStreak }} 題</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div 
                v-for="step in [1, 2, 3]" 
                :key="step"
                class="h-3 border border-black transition-all"
                :class="currentStreak >= step ? 'bg-yellow-400 shadow-[2px_2px_0px_#000]' : 'bg-[#121620]'"
              ></div>
            </div>
          </div>

          <!-- 補考題目卡片 -->
          <div v-if="currentRemedialQuestion" class="p-3.5 bg-[#121620] border-2 border-black neo-cut-sm shadow-[4px_4px_0px_#000] flex flex-col gap-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="px-2 py-0.5 bg-yellow-400 text-black font-black border border-black">
                【{{ currentRemedialQuestion.subject }}】
              </span>
              <span class="font-black text-[#ff0055] font-mono border border-black px-1.5 bg-black">
                作答剩餘: {{ timerSeconds }}s
              </span>
            </div>

            <h4 class="text-sm font-black text-white leading-relaxed">
              {{ currentRemedialQuestion.question }}
            </h4>

            <!-- 四個選項 (Neo-Arcade 按鈕) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <button
                v-for="(option, idx) in currentRemedialQuestion.options"
                :key="idx"
                @click="submitRemedialAnswer(idx)"
                class="neo-btn bg-[#090b10] hover:bg-[#182030] p-2.5 text-left text-xs text-white font-bold flex items-center gap-2 neo-cut-sm"
              >
                <span class="w-5 h-5 bg-black border border-yellow-400 text-yellow-400 flex items-center justify-center font-mono font-black text-xs">
                  {{ idx + 1 }}
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
 * @description 日系新潮街機風 期中留級重修補考彈窗 (Neo-Arcade Remedial Exam)
 * 具備黑紅警戒斑馬條紋、日系戰術切角按鈕、生輔組教官訓示與聖物裝備獎勵。
 */
import { ref, computed, watch, onUnmounted } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { useQuestionStore } from '../../stores/questionStore';
import { QuestionItem, SchoolRelic } from '../../types/quiz';
import { soundEngine } from '../../utils/audioEngine';

const gameStore = useGameStore();
const questionStore = useQuestionStore();

const isOpen = computed(() => gameStore.activeModal === 'REMEDIAL_EXAM');

const targetStreak = 3;
const currentStreak = ref<number>(0);
const isPassed = ref<boolean>(false);
const timerSeconds = ref<number>(10);
let timerId: any = null;

const currentRemedialQuestion = ref<QuestionItem | null>(null);

const AVAILABLE_RELICS: SchoolRelic[] = [
  {
    id: 'cheat_note',
    name: '作弊小抄',
    icon: '📖',
    description: '每題作答開場時，系統自動幫您剔除 1 個錯誤選項。',
    effect: 'AUTO_REMOVE_WRONG'
  },
  {
    id: 'death_token',
    name: '免死金牌',
    icon: '🛡️',
    description: '體力歸零時自動觸發護盾抵禦，滿血回升至 35 HP。',
    effect: 'DEATH_PREVENTION'
  },
  {
    id: 'scholarship',
    name: '獎學金證明',
    icon: '💰',
    description: '之後每道題目答對時額外享有 +20% 學分津貼回饋。',
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
    clearInterval(timerId);
  }
});

onUnmounted(() => {
  clearInterval(timerId);
});

function loadNextRemedialQuestion(): void {
  clearInterval(timerId);
  const q = questionStore.pickQuestion(gameStore.currentStage);
  currentRemedialQuestion.value = q;
  timerSeconds.value = 10;

  timerId = setInterval(() => {
    if (timerSeconds.value > 1) {
      timerSeconds.value -= 1;
      if (timerSeconds.value <= 3) {
        soundEngine.playTick(true);
      }
    } else {
      clearInterval(timerId);
      handleRemedialTimeout();
    }
  }, 1000);
}

function submitRemedialAnswer(idx: number): void {
  if (!currentRemedialQuestion.value) return;
  clearInterval(timerId);

  if (idx === currentRemedialQuestion.value.correctIndex) {
    soundEngine.playCorrect();
    currentStreak.value += 1;
    if (currentStreak.value >= targetStreak) {
      isPassed.value = true;
      soundEngine.playFanfare();
    } else {
      loadNextRemedialQuestion();
    }
  } else {
    soundEngine.playWrong();
    currentStreak.value = 0;
    gameStore.takeDamage(15);
    if (gameStore.playerHp <= 0) {
      gameStore.failRemedialExam();
    } else {
      loadNextRemedialQuestion();
    }
  }
}

function handleRemedialTimeout(): void {
  soundEngine.playWrong();
  currentStreak.value = 0;
  gameStore.takeDamage(15);
  if (gameStore.playerHp <= 0) {
    gameStore.failRemedialExam();
  } else {
    loadNextRemedialQuestion();
  }
}

function claimRelicAndResume(relic: SchoolRelic): void {
  gameStore.passRemedialExam(relic);
}
</script>
