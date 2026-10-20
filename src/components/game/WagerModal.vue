<template>
  <!-- 現代極簡 SaaS 風格 信心下注彈窗 (Linear Modern Wagering Modal) -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none"
  >
    <!-- 主彈窗容器 (Bento Grid 圓角卡片) -->
    <div class="relative w-full max-w-xl bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 flex flex-col gap-6 overflow-hidden">
      
      <!-- 頂部看板標題 -->
      <div class="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h2 class="text-xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>即時信心下注</span>
          </h2>
          <p class="text-xs text-zinc-400 mt-1 font-mono">
            Confidence Wagering · 評估擅長領域下注
          </p>
        </div>
        <div class="saas-pill saas-pill-indigo text-xs font-mono font-medium">
          自動倒數 {{ countdownSeconds }}s
        </div>
      </div>

      <!-- 題目情報封印看板 (未揭露題幹) -->
      <div class="p-4 bg-zinc-950/60 border border-white/[0.08] rounded-xl flex flex-col gap-3">
        <div class="flex items-center justify-between text-xs text-zinc-400">
          <span>考場即時情報</span>
          <span class="font-mono">當前學分: <strong class="text-zinc-100 font-semibold">{{ gameStore.credits }}</strong></span>
        </div>

        <div class="flex items-center gap-2.5">
          <span class="saas-pill saas-pill-indigo text-xs">
            {{ currentTargetQuestion?.stage || '通用' }}
          </span>
          <span class="text-base font-medium text-zinc-100">
            【{{ currentTargetQuestion?.subject || '綜合學科' }}】
          </span>
          <span 
            class="saas-pill text-xs font-mono"
            :class="currentTargetQuestion?.difficulty === '困難' ? 'saas-pill-rose' : 'saas-pill-emerald'"
          >
            {{ currentTargetQuestion?.difficulty || '普通' }}
          </span>
        </div>

        <!-- 題幹封印提示 -->
        <div class="p-2.5 bg-zinc-900/80 border border-white/[0.06] rounded-lg text-center text-xs text-zinc-400">
          🔒 題目題幹內容目前封印中，將於下注完成後即刻展開
        </div>
      </div>

      <!-- 四檔下注按鍵區 (Modern Bento Grid 卡片) -->
      <div class="flex flex-col gap-3">
        <label class="text-xs font-mono text-zinc-400">
          選擇信心下注額度：
        </label>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <!-- 0 學分 (保本) -->
          <button
            @click="selectedWager = 0"
            class="p-3.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all duration-200"
            :class="selectedWager === 0 ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-zinc-850/50 border-white/[0.08] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'"
          >
            <span class="text-[11px] font-mono text-zinc-400">保本</span>
            <span class="text-2xl font-bold font-mono text-zinc-100">0</span>
            <span class="text-[10px] text-zinc-500">零風險</span>
          </button>

          <!-- 20 學分 -->
          <button
            @click="selectWagerSafe(20)"
            :disabled="gameStore.credits < 20"
            class="p-3.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all duration-200"
            :class="[
              selectedWager === 20 ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-zinc-850/50 border-white/[0.08] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
              gameStore.credits < 20 ? 'opacity-30 cursor-not-allowed' : ''
            ]"
          >
            <span class="text-[11px] font-mono text-zinc-400">小試</span>
            <span class="text-2xl font-bold font-mono text-zinc-100">20</span>
            <span class="text-[10px] text-indigo-400">1.5x 倍率</span>
          </button>

          <!-- 50 學分 -->
          <button
            @click="selectWagerSafe(50)"
            :disabled="gameStore.credits < 50"
            class="p-3.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all duration-200"
            :class="[
              selectedWager === 50 ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-zinc-850/50 border-white/[0.08] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
              gameStore.credits < 50 ? 'opacity-30 cursor-not-allowed' : ''
            ]"
          >
            <span class="text-[11px] font-mono text-zinc-400">自信</span>
            <span class="text-2xl font-bold font-mono text-zinc-100">50</span>
            <span class="text-[10px] text-indigo-400">2.0x 倍率</span>
          </button>

          <!-- All-In 孤注一擲 -->
          <button
            @click="selectWagerSafe(maxAllInAmount)"
            :disabled="gameStore.credits <= 0"
            class="p-3.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all duration-200"
            :class="[
              selectedWager === maxAllInAmount && selectedWager > 0 ? 'bg-indigo-600/25 border-indigo-400 text-indigo-200 shadow-[0_0_20px_rgba(99,102,241,0.25)]' : 'bg-zinc-850/50 border-white/[0.08] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
              gameStore.credits <= 0 ? 'opacity-30 cursor-not-allowed' : ''
            ]"
          >
            <span class="text-[11px] font-mono text-zinc-400">ALL-IN</span>
            <span class="text-2xl font-bold font-mono text-zinc-100">{{ maxAllInAmount }}</span>
            <span class="text-[10px] text-rose-400">3.0x 狂熱</span>
          </button>
        </div>
      </div>

      <!-- 預期回饋提示列 -->
      <div class="p-3.5 bg-zinc-950/60 border border-white/[0.08] rounded-xl flex items-center justify-between text-xs sm:text-sm">
        <span class="text-zinc-400">預期答對回饋：</span>
        <span class="font-mono font-semibold text-indigo-400">
          +{{ calculateEstimatedWin() }} 學分 ({{ getMultiplierText() }})
        </span>
      </div>

      <!-- 底部確認按鈕 (唯一 Accent 焦點按鍵) -->
      <div class="flex items-center justify-between pt-4 border-t border-white/[0.08]">
        <span class="text-xs text-zinc-500 font-mono">
          答題結束後直接結算收益
        </span>
        <button
          @click="confirmWagerAndStart"
          class="saas-btn saas-btn-primary py-2.5 px-6 text-sm font-medium"
        >
          鎖定下注，開始作答 ➔
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file WagerModal.vue
 * @description 現代極簡 SaaS 風格 即時信心下注彈窗 (Linear Modern Wagering Modal)
 * 具備 Bento Grid 下注卡片、微光邊框、題幹保護與平滑互動反饋。
 */
import { ref, computed, watch, onUnmounted } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { soundEngine } from '../../utils/audioEngine';

const gameStore = useGameStore();

const isOpen = computed(() => gameStore.activeModal === 'WAGER');
const currentTargetQuestion = computed(() => gameStore.currentQuestion);

const selectedWager = ref<number>(0);
const countdownSeconds = ref<number>(6);
let timerId: any = null;

const maxAllInAmount = computed(() => {
  return Math.min(150, gameStore.credits);
});

watch(isOpen, (newVal) => {
  if (newVal) {
    selectedWager.value = 0;
    countdownSeconds.value = 6;
    soundEngine.playCoin();
    clearInterval(timerId);
    timerId = setInterval(() => {
      if (countdownSeconds.value > 1) {
        countdownSeconds.value -= 1;
      } else {
        clearInterval(timerId);
        confirmWagerAndStart();
      }
    }, 1000);
  } else {
    clearInterval(timerId);
  }
});

onUnmounted(() => {
  clearInterval(timerId);
});

function selectWagerSafe(amount: number): void {
  if (gameStore.credits >= amount) {
    selectedWager.value = amount;
    soundEngine.playCoin();
  }
}

function calculateEstimatedWin(): number {
  if (selectedWager.value === 0) return 30;
  if (selectedWager.value === 20) return Math.round(20 * 1.5 + 30);
  if (selectedWager.value === 50) return Math.round(50 * 2.0 + 30);
  return Math.round(selectedWager.value * 3.0 + 30);
}

function getMultiplierText(): string {
  if (selectedWager.value === 0) return '基礎回饋';
  if (selectedWager.value === 20) return '1.5x 倍率';
  if (selectedWager.value === 50) return '2.0x 倍率';
  return '3.0x 狂熱倍率';
}

function confirmWagerAndStart(): void {
  clearInterval(timerId);
  soundEngine.playEvent();
  gameStore.currentWagerAmount = selectedWager.value;
  gameStore.activeModal = 'QUIZ';
  const limit = gameStore.rank >= 7 ? 8 : gameStore.rank >= 4 ? 10 : 12;
  gameStore.startQuestionTimer(limit);
}
</script>