<template>
  <!-- 現代極簡 SaaS 風格 畢業結算成績單組件 -->
  <div v-if="gameStore.activeModal === 'VICTORY' || (gameStore.activeModal === 'CONTINUE' && gameStore.continueCountdown <= 0)" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
    <div class="w-full max-w-2xl bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center gap-6">
      <!-- 獎章圖標 -->
      <div class="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(99,102,241,0.25)]">
        {{ isVictory ? '🎓' : '📜' }}
      </div>

      <div>
        <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight" :class="isVictory ? 'text-indigo-400' : 'text-zinc-200'">
          {{ isVictory ? '光榮畢業！大學文憑頒發' : '學業成績結算清單' }}
        </h2>
        <p class="text-xs sm:text-sm text-zinc-400 mt-2 font-mono">
          {{ isVictory ? '恭喜您完成了《民國教育委員會》最高學府全部學制關卡！' : '學海無涯，隨時歡迎投幣重新入學再戰！' }}
        </p>
      </div>

      <!-- 成績單 Bento 卡片 -->
      <div class="w-full bg-zinc-950/60 border border-white/[0.08] rounded-xl p-5 sm:p-6 flex flex-col gap-4 text-xs sm:text-sm font-mono">
        <div class="flex justify-between border-b border-white/[0.06] pb-3">
          <span class="text-zinc-500">達成最高學歷：</span>
          <span class="font-medium text-zinc-200">{{ gameStore.currentStageConfig.title }} ({{ isVictory ? '正式畢業' : '肄業' }})</span>
        </div>
        <div class="flex justify-between border-b border-white/[0.06] pb-3">
          <span class="text-zinc-500">最終累積得分：</span>
          <span class="font-bold text-indigo-400 text-sm sm:text-base">{{ gameStore.score }} 分</span>
        </div>
        <div class="flex justify-between border-b border-white/[0.06] pb-3">
          <span class="text-zinc-500">殘餘學分儲備：</span>
          <span class="font-medium text-zinc-200">{{ gameStore.credits }} 學分</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-zinc-500">名人堂綜合評級：</span>
          <span class="saas-pill text-xs font-mono font-semibold" :class="getGradePillClass(finalRankGrade)">
            RANK [ {{ finalRankGrade }} ] - {{ getGradeTitle(finalRankGrade) }}
          </span>
        </div>
      </div>

      <!-- 重新挑戰按鈕 -->
      <button 
        @click="restart"
        class="saas-btn saas-btn-primary py-3.5 px-8 rounded-xl w-full text-sm sm:text-base font-medium flex items-center justify-center gap-2"
      >
        <span>🔄 重新入學挑戰 (START NEW GAME)</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ResultModal.vue
 * @description 現代極簡 SaaS 風格 畢業結算成績單組件 (Linear Modern Result Modal)
 */
import { computed, watch } from 'vue';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../stores/gameStore';

const gameStore = useGameStore();

const isVictory = computed(() => gameStore.activeModal === 'VICTORY');

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
    case 'SSS': return '天選狀元';
    case 'S': return '國士無雙';
    case 'A': return '博學多聞';
    case 'B': return '品學兼優';
    default: return '勤能補拙';
  }
}

function getGradePillClass(grade: string): string {
  switch (grade) {
    case 'SSS': return 'saas-pill-indigo font-bold animate-pulse';
    case 'S': return 'saas-pill-indigo';
    case 'A': return 'saas-pill-emerald';
    default: return 'bg-zinc-800 text-zinc-300 border-white/[0.08]';
  }
}

watch(() => gameStore.activeModal, (modal) => {
  if (modal === 'VICTORY') {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
});

function restart(): void {
  gameStore.startNewGame('國小');
}
</script>