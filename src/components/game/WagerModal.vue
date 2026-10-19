<template>
  <!-- 日系新潮街機風 即時信心下注彈窗 (Neo-Arcade Wagering Modal) -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 font-mono select-none"
  >
    <!-- 主彈窗容器 (粗黑 4px 邊框、8px 實心黑陰影、日系戰術切角) -->
    <div class="relative w-full max-w-lg bg-[#090b10] border-[4px] border-black shadow-[8px_8px_0px_#000000] neo-cut flex flex-col overflow-hidden">
      
      <!-- 頂部黑黃警戒條 -->
      <div class="w-full h-2 neo-hazard-yellow border-b-2 border-black"></div>

      <!-- 頂部看板標題 -->
      <div class="bg-[#121620] px-4 py-2.5 border-b-2 border-black flex items-center justify-between text-yellow-400 font-black">
        <div class="flex items-center gap-2 text-sm tracking-wider neo-skew-title">
          <span>// CONFIDENCE WAGERING // 即時信心下注</span>
        </div>
        <div class="text-xs bg-yellow-400 text-black px-2 py-0.5 font-black border border-black animate-pulse">
          倒數 {{ countdownSeconds }}S
        </div>
      </div>

      <!-- 下注內容主體 -->
      <div class="p-5 sm:p-6 flex flex-col gap-4 bg-[#090b10]">
        <!-- 題目情報封印看板 (未揭露題幹) -->
        <div class="p-3.5 bg-[#121620] border-2 border-black neo-cut-sm shadow-[4px_4px_0px_#000] flex flex-col gap-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-yellow-400 font-black tracking-widest">// 考場即時情報 //</span>
            <span class="text-gray-300 font-bold">學分庫存: <strong class="text-yellow-400 text-sm">{{ gameStore.credits }}</strong></span>
          </div>

          <div class="flex items-center gap-2.5 mt-1">
            <span class="px-2.5 py-0.5 bg-yellow-400 text-black text-xs font-black border border-black">
              {{ currentTargetQuestion?.stage || '通用' }}
            </span>
            <span class="text-base font-black text-white neo-skew-title">
              【{{ currentTargetQuestion?.subject || '綜合學科' }}】
            </span>
            <span 
              class="px-2 py-0.5 text-xs font-black border border-black"
              :class="currentTargetQuestion?.difficulty === '困難' ? 'bg-[#ff0055] text-white' : 'bg-cyan-400 text-black'"
            >
              {{ currentTargetQuestion?.difficulty || '普通' }}
            </span>
          </div>

          <!-- 題幹封印提示 -->
          <div class="mt-1 p-2 bg-black border border-gray-700 text-center text-xs text-gray-400 font-bold">
            [🔒 題幹內容已被考官封印 · 請依擅長領域下注]
          </div>
        </div>

        <!-- 四檔下注按鍵區 (日系戰術實心陰影按鈕) -->
        <div class="flex flex-col gap-2">
          <label class="text-xs font-black text-yellow-400 tracking-wider">
            ▶ 選擇您的信心下注額度：
          </label>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <!-- 0 學分 (保本) -->
            <button
              @click="selectedWager = 0"
              class="neo-btn p-3 text-center flex flex-col items-center gap-1 neo-cut-sm"
              :class="selectedWager === 0 ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_#000] scale-[1.03]' : 'bg-[#121620] text-gray-300 hover:border-yellow-400'"
            >
              <span class="text-[11px] font-black uppercase">[保本]</span>
              <span class="text-xl font-black font-mono">0</span>
              <span class="text-[9px] text-gray-400">零風險</span>
            </button>

            <!-- 20 學分 -->
            <button
              @click="selectWagerSafe(20)"
              :disabled="gameStore.credits < 20"
              class="neo-btn p-3 text-center flex flex-col items-center gap-1 neo-cut-sm"
              :class="[
                selectedWager === 20 ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_#000] scale-[1.03]' : 'bg-[#121620] text-gray-300 hover:border-yellow-400',
                gameStore.credits < 20 ? 'opacity-30 cursor-not-allowed' : ''
              ]"
            >
              <span class="text-[11px] font-black uppercase text-cyan-400">[小試]</span>
              <span class="text-xl font-black font-mono">20</span>
              <span class="text-[9px] text-yellow-300">1.5x 倍率</span>
            </button>

            <!-- 50 學分 -->
            <button
              @click="selectWagerSafe(50)"
              :disabled="gameStore.credits < 50"
              class="neo-btn p-3 text-center flex flex-col items-center gap-1 neo-cut-sm"
              :class="[
                selectedWager === 50 ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_#000] scale-[1.03]' : 'bg-[#121620] text-gray-300 hover:border-yellow-400',
                gameStore.credits < 50 ? 'opacity-30 cursor-not-allowed' : ''
              ]"
            >
              <span class="text-[11px] font-black uppercase text-cyan-400">[自信]</span>
              <span class="text-xl font-black font-mono">50</span>
              <span class="text-[9px] text-yellow-300">2.0x 倍率</span>
            </button>

            <!-- All-In 孤注一擲 -->
            <button
              @click="selectWagerSafe(maxAllInAmount)"
              :disabled="gameStore.credits <= 0"
              class="neo-btn p-3 text-center flex flex-col items-center gap-1 neo-cut-sm"
              :class="[
                selectedWager === maxAllInAmount && selectedWager > 0 ? 'bg-[#ff0055] text-white shadow-[4px_4px_0px_#000] scale-[1.03]' : 'bg-[#121620] text-gray-300 hover:border-red-500',
                gameStore.credits <= 0 ? 'opacity-30 cursor-not-allowed' : ''
              ]"
            >
              <span class="text-[11px] font-black uppercase text-yellow-300">[ALL-IN]</span>
              <span class="text-xl font-black font-mono">{{ maxAllInAmount }}</span>
              <span class="text-[9px] text-red-300 font-bold">高達 3.0x</span>
            </button>
          </div>
        </div>

        <!-- 預期回饋提示列 -->
        <div class="p-2.5 bg-black border-2 border-black flex items-center justify-between text-xs neo-cut-sm">
          <span class="text-gray-400">預期答對回饋：</span>
          <span class="font-black text-yellow-400 text-sm font-mono">
            +{{ calculateEstimatedWin() }} 學分 ({{ getMultiplierText() }})
          </span>
        </div>
      </div>

      <!-- 底部確認按鈕 -->
      <div class="p-3.5 bg-[#121620] border-t-2 border-black flex items-center justify-between">
        <span class="text-[11px] text-gray-400 font-bold">
          // 答題結束後直接結算 //
        </span>
        <button
          @click="confirmWagerAndStart"
          class="neo-btn neo-btn-yellow py-2 px-6 text-xs sm:text-sm font-black tracking-wider uppercase shadow-[4px_4px_0px_#000]"
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
 * @description 日系新潮街機風 即時信心下注彈窗 (Neo-Arcade Wagering Modal)
 * 具備黑黃斑馬紋、粗黑邊框、實心黑陰影戰術按鈕與題幹封印保護。
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
