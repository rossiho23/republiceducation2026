<template>
  <div v-if="gameStore.activeModal === 'VICTORY' || (gameStore.activeModal === 'CONTINUE' && gameStore.continueCountdown <= 0)" class="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
    <div class="w-full max-w-2xl 2xl:max-w-3xl bg-arcade-dark border-4 rounded-3xl p-6 sm:p-10 shadow-pixel flex flex-col items-center text-center gap-6" :class="isVictory ? 'border-arcade-yellow shadow-arcade-yellow' : 'border-slate-700'">
      <!-- 獎章圖標 -->
      <div class="text-7xl animate-bounce-short">
        {{ isVictory ? '🎓' : '📜' }}
      </div>

      <div>
        <h2 class="text-3xl sm:text-4xl font-black tracking-wider" :class="isVictory ? 'text-arcade-yellow' : 'text-gray-300'">
          {{ isVictory ? '光榮畢業！大學文憑頒發！' : '學業成績結算清單' }}
        </h2>
        <p class="text-sm sm:text-base text-gray-300 mt-2 font-bold">
          {{ isVictory ? '恭喜您完成了《民國教育委員會》最高學府學制闖關！' : '學海無涯，勝敗乃兵家常事，隨時歡迎投幣再戰！' }}
        </p>
      </div>

      <!-- 成績單表格 -->
      <div class="w-full bg-slate-900/95 border border-slate-700 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 text-sm sm:text-base font-mono">
        <div class="flex justify-between border-b border-slate-800 pb-3">
          <span class="text-gray-400">達成最高學歷：</span>
          <span class="font-bold text-arcade-cyan text-base sm:text-lg">{{ gameStore.currentStageConfig.title }} ({{ isVictory ? '正式畢業' : '肄業' }})</span>
        </div>
        <div class="flex justify-between border-b border-slate-800 pb-3">
          <span class="text-gray-400">最終累積得分：</span>
          <span class="font-black text-arcade-yellow text-lg sm:text-xl">{{ gameStore.score }} 分</span>
        </div>
        <div class="flex justify-between border-b border-slate-800 pb-3">
          <span class="text-gray-400">殘餘學分金幣：</span>
          <span class="font-bold text-arcade-green text-base sm:text-lg">{{ gameStore.credits }} 學分</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">街機名人堂評級：</span>
          <span class="font-black text-lg sm:text-2xl" :class="getGradeColor(finalRankGrade)">
            RANK [ {{ finalRankGrade }} ] - {{ getGradeTitle(finalRankGrade) }}
          </span>
        </div>
      </div>

      <!-- 重新挑戰按鈕 -->
      <button 
        @click="restart"
        class="btn-arcade bg-gradient-to-r from-arcade-yellow via-amber-400 to-orange-500 text-black font-black text-base sm:text-lg py-4 px-10 rounded-2xl shadow-arcade-yellow w-full flex items-center justify-center gap-3"
      >
        <span>🔄 重新入學挑戰 (START NEW GAME)</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ResultModal.vue
 * @description 畢業結算成績單組件，支援撒花特效、評級換算與重玩
 */
import { computed, watch } from 'vue';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../stores/gameStore';

const gameStore = useGameStore();

const isVictory = computed(() => gameStore.activeModal === 'VICTORY');

/**
 * 計算最終綜合評級
 */
const finalRankGrade = computed(() => {
  const score = gameStore.score;
  if (isVictory.value && score >= 4000) return 'SSS';
  if (isVictory.value || score >= 3000) return 'S';
  if (score >= 2000) return 'A';
  if (score >= 1000) return 'B';
  return 'C';
});

function getGradeTitle(grade: string): string {
  switch (grade) {
    case 'SSS': return '天選狀元奇才';
    case 'S': return '國士無雙博士';
    case 'A': return '博學多聞碩士';
    case 'B': return '品學兼優學士';
    default: return '勤能補拙秀才';
  }
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'SSS': return 'text-purple-400 animate-pulse';
    case 'S': return 'text-arcade-yellow';
    case 'A': return 'text-arcade-green';
    case 'B': return 'text-arcade-cyan';
    default: return 'text-gray-300';
  }
}

/**
 * 監聽通關勝利，發射紙花特效
 */
watch(() => gameStore.activeModal, (modal) => {
  if (modal === 'VICTORY') {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 }
    });
  }
});

function restart(): void {
  gameStore.startNewGame('國小');
}
</script>
