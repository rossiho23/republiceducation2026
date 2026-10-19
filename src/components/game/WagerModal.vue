<template>
  <!-- 即時信心下注彈窗 (Wager Modal) -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-mono"
  >
    <div class="relative w-full max-w-lg bg-slate-900 border-4 border-yellow-400 rounded-2xl shadow-[0_0_35px_rgba(250,204,21,0.5)] overflow-hidden flex flex-col">
      <!-- 頂部霓虹飾條 -->
      <div class="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-4 py-2 flex items-center justify-between text-slate-950 font-black">
        <div class="flex items-center gap-2 text-sm tracking-wider">
          <span>🎰 即時信心下注 (CONFIDENCE WAGERING)</span>
        </div>
        <div class="text-xs bg-slate-950 text-yellow-300 px-2 py-0.5 rounded border border-yellow-300">
          倒數 {{ countdownSeconds }}s
        </div>
      </div>

      <!-- 下注內容主體 -->
      <div class="p-6 flex flex-col gap-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
        <!-- 即將揭曉之題目情報看板 (未公布題幹) -->
        <div class="p-4 bg-slate-800/80 border-2 border-slate-600 rounded-xl flex flex-col gap-2 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-xs text-yellow-400 font-bold">★ 考場即時情報 ★</span>
            <span class="text-xs text-slate-400">目前學分庫存: <strong class="text-yellow-300 text-sm">{{ gameStore.credits }}</strong></span>
          </div>

          <div class="flex items-center gap-3 mt-1">
            <div class="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded border border-blue-400">
              {{ currentTargetQuestion?.stage || '通用' }}
            </div>
            <div class="text-lg font-black text-white">
              【{{ currentTargetQuestion?.subject || '綜合學科' }}】
            </div>
            <div 
              class="px-2 py-0.5 rounded text-xs font-bold"
              :class="currentTargetQuestion?.difficulty === '困難' ? 'bg-red-950 text-red-300 border border-red-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'"
            >
              {{ currentTargetQuestion?.difficulty || '普通' }}
            </div>
          </div>

          <!-- 題幹神秘覆蓋提示 -->
          <div class="mt-2 p-2.5 bg-slate-950/80 rounded border border-slate-700 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>🔒 題幹內容已被考官封印，請根據自身擅長領域評估信心！</span>
          </div>
        </div>

        <!-- 下注檔次選擇列 -->
        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-yellow-300">請選擇您的信心下注額度：</label>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <!-- 0 學分 (保本) -->
            <button
              @click="selectedWager = 0"
              class="p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all"
              :class="selectedWager === 0 ? 'bg-amber-400/20 border-yellow-400 text-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'"
            >
              <span class="text-xs font-bold">不下注</span>
              <span class="text-lg font-black font-mono">0</span>
              <span class="text-[10px] text-slate-400">保本無風險</span>
            </button>

            <!-- 20 學分 -->
            <button
              @click="selectWagerSafe(20)"
              :disabled="gameStore.credits < 20"
              class="p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all"
              :class="[
                selectedWager === 20 ? 'bg-amber-400/20 border-yellow-400 text-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500',
                gameStore.credits < 20 ? 'opacity-40 cursor-not-allowed' : ''
              ]"
            >
              <span class="text-xs font-bold text-emerald-400">小試身手</span>
              <span class="text-lg font-black font-mono">20</span>
              <span class="text-[10px] text-yellow-400">獲利 1.5x</span>
            </button>

            <!-- 50 學分 -->
            <button
              @click="selectWagerSafe(50)"
              :disabled="gameStore.credits < 50"
              class="p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all"
              :class="[
                selectedWager === 50 ? 'bg-amber-400/20 border-yellow-400 text-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500',
                gameStore.credits < 50 ? 'opacity-40 cursor-not-allowed' : ''
              ]"
            >
              <span class="text-xs font-bold text-blue-400">信心十足</span>
              <span class="text-lg font-black font-mono">50</span>
              <span class="text-[10px] text-yellow-400">獲利 2.0x</span>
            </button>

            <!-- 孤注一擲 All-In -->
            <button
              @click="selectWagerSafe(maxAllInAmount)"
              :disabled="gameStore.credits <= 0"
              class="p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all"
              :class="[
                selectedWager === maxAllInAmount && selectedWager > 0 ? 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500',
                gameStore.credits <= 0 ? 'opacity-40 cursor-not-allowed' : ''
              ]"
            >
              <span class="text-xs font-black text-red-400 animate-pulse">孤注一擲</span>
              <span class="text-lg font-black font-mono">{{ maxAllInAmount }}</span>
              <span class="text-[10px] text-red-300">高達 3.0x！</span>
            </button>
          </div>
        </div>

        <!-- 賠率與風險試算提示 -->
        <div class="p-3 bg-yellow-950/40 border border-yellow-500/40 rounded-xl text-xs text-yellow-200 flex items-center justify-between">
          <span>預期答對獎勵：</span>
          <span class="font-bold text-amber-300 text-sm">
            +{{ calculateEstimatedWin() }} 學分 ({{ getMultiplierText() }})
          </span>
        </div>
      </div>

      <!-- 底部確認按鈕 -->
      <div class="p-4 bg-slate-950 border-t-2 border-yellow-400 flex items-center justify-between">
        <div class="text-xs text-slate-400">
          下注額度將於答題結束後直接結算
        </div>
        <button
          @click="confirmWagerAndStart"
          class="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded shadow-[0_4px_0_#92400e] active:translate-y-1 active:shadow-none transition-all"
        >
          🎲 鎖定下注，開始作答！
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file WagerModal.vue
 * @description 即時信心下注彈窗 (Confidence Wagering Modal)
 * 允許玩家在題幹揭曉前依據題目學科與難易度下注學分，以換取高額報酬。
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

/** 最多 All-in 金額 (上限 150 學分) */
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
  if (selectedWager.value === 0) return 30; // 基礎答對學分
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

/**
 * 確認下注並切換至作答畫面
 */
function confirmWagerAndStart(): void {
  clearInterval(timerId);
  soundEngine.playEvent();
  // 將下注金額設定到 gameStore
  gameStore.currentWagerAmount = selectedWager.value;
  // 切換至題目答題卡
  gameStore.activeModal = 'QUIZ';
  const limit = gameStore.rank >= 7 ? 8 : gameStore.rank >= 4 ? 10 : 12;
  gameStore.startQuestionTimer(limit);
}
</script>
