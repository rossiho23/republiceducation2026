<template>
  <!-- 現代極簡 SaaS 風格 期中留級挽救補考彈窗 (Linear Modern Remedial Exam Modal) -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none"
  >
    <!-- 主彈窗容器 (Bento Grid 圓角卡片) -->
    <div class="relative w-full max-w-3xl 2xl:max-w-4xl bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 flex flex-col gap-5 overflow-hidden">
      
      <!-- 頂部飾條 -->
      <div class="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <div>
            <h2 class="text-xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2">
              <span>期中留級補考</span>
              <span class="saas-pill saas-pill-rose text-xs font-mono">REMEDIAL</span>
            </h2>
            <p class="text-xs text-zinc-400 mt-0.5 font-mono">
              連續答對 3 題即可化解留級危機並獲得傳奇聖物
            </p>
          </div>
        </div>

        <div class="saas-pill saas-pill-indigo text-xs font-mono">
          連對考驗: {{ currentStreak }} / {{ targetStreak }}
        </div>
      </div>

      <!-- 主體內容區塊 -->
      <div class="flex flex-col gap-4">
        <!-- 狀態 A: 補考成功，選擇稀有被動聖物裝備 -->
        <div v-if="isPassed" class="flex flex-col items-center text-center gap-5 py-4">
          <div class="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(99,102,241,0.25)]">
            🎓
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-zinc-100 tracking-tight">
              期中補考全面及格！
            </h2>
            <p class="text-sm text-zinc-400 mt-1 max-w-md">
              成功逆境求生，體力補回 +50 點。請挑選一項校園傳奇被動聖物裝備：
            </p>
          </div>

          <!-- 聖物三選一卡片 (Modern Bento Grid) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-2">
            <button
              v-for="relic in AVAILABLE_RELICS"
              :key="relic.id"
              @click="claimRelicAndResume(relic)"
              class="saas-card saas-card-interactive p-5 flex flex-col items-center text-center gap-3 group"
            >
              <span class="text-3xl">{{ relic.icon }}</span>
              <span class="text-base font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">{{ relic.name }}</span>
              <p class="text-xs text-zinc-400 leading-relaxed">
                {{ relic.description }}
              </p>
              <span class="mt-auto saas-btn saas-btn-primary w-full py-1.5 text-xs">
                選取裝備
              </span>
            </button>
          </div>
        </div>

        <!-- 狀態 B: 補考進行中 -->
        <div v-else class="flex flex-col gap-4">
          <!-- 教官提示看板 -->
          <div class="p-4 bg-zinc-950/60 border border-white/[0.08] rounded-xl flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-zinc-850 border border-white/[0.08] flex-shrink-0 flex items-center justify-center text-xl">
              👮
            </div>
            <div class="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              <strong class="text-indigo-400">【生活輔導組提示】：</strong>
              必須連續答對 3 題補考題才能解除留級處分；答錯連對進度將立即歸零，請謹慎應對。
            </div>
          </div>

          <!-- 連對進度條 -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>連對進度</span>
              <span class="text-indigo-400 font-semibold">{{ currentStreak }} / {{ targetStreak }} 題</span>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div 
                v-for="step in [1, 2, 3]" 
                :key="step"
                class="h-2 rounded-full transition-all duration-300"
                :class="currentStreak >= step ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-zinc-800'"
              ></div>
            </div>
          </div>

          <!-- 補考題目卡片 -->
          <div v-if="currentRemedialQuestion" class="p-5 bg-zinc-950/60 border border-white/[0.08] rounded-xl flex flex-col gap-4">
            <div class="flex items-center justify-between text-xs">
              <span class="saas-pill saas-pill-indigo text-xs">
                {{ currentRemedialQuestion.subject }}
              </span>
              <span class="text-xs font-mono text-zinc-400">
                剩餘時間: <strong class="text-rose-400 font-mono">{{ timerSeconds }}s</strong>
              </span>
            </div>

            <h4 class="text-lg sm:text-xl font-semibold text-zinc-100 leading-snug tracking-tight">
              {{ currentRemedialQuestion.question }}
            </h4>

            <!-- 四個選項 (Modern 卡片按鈕) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <button
                v-for="(option, idx) in currentRemedialQuestion.options"
                :key="idx"
                @click="submitRemedialAnswer(idx)"
                class="p-3.5 sm:p-4 rounded-xl border border-white/[0.08] bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-indigo-500/50 text-left text-sm text-zinc-100 flex items-center gap-3 transition-all duration-200 cursor-pointer"
              >
                <span class="saas-kbd w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {{ idx + 1 }}
                </span>
                <span class="font-normal">{{ option }}</span>
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
 * @description 現代極簡 SaaS 風格 期中留級重修補考彈窗 (Linear Modern Remedial Exam)
 * 具備 Bento 聖物選擇卡片、細緻進度條、教官提示與連對機制。
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
    loadNextRemedialQuestion();
    startTimer();
  } else {
    stopTimer();
  }
});

onUnmounted(() => {
  stopTimer();
});

function startTimer(): void {
  stopTimer();
  timerSeconds.value = 10;
  timerId = setInterval(() => {
    if (timerSeconds.value > 1) {
      timerSeconds.value -= 1;
    } else {
      handleRemedialTimeout();
    }
  }, 1000);
}

function stopTimer(): void {
  clearInterval(timerId);
}

function loadNextRemedialQuestion(): void {
  const subjects = ['國文', '自然', '數學', '社會'] as const;
  const s = subjects[Math.floor(Math.random() * subjects.length)];
  const q = questionStore.pickQuestion(gameStore.currentStage, s);
  currentRemedialQuestion.value = q;
  startTimer();
}

function submitRemedialAnswer(choiceIdx: number): void {
  if (!currentRemedialQuestion.value) return;

  const isCorrect = choiceIdx === currentRemedialQuestion.value.correctIndex;
  if (isCorrect) {
    soundEngine.playCorrect();
    currentStreak.value += 1;
    if (currentStreak.value >= targetStreak) {
      stopTimer();
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