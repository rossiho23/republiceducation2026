<template>
  <!-- Slay the Spire 式 Roguelike 樹狀分支地圖組件 -->
  <div class="w-full flex-1 flex flex-col bg-[#070b19] border-4 border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden font-mono select-none">
    <!-- 頂部學程狀態與聖物裝備欄 -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border-2 border-slate-700 rounded-2xl shadow">
      <!-- 學程與樓層指標 -->
      <div class="flex items-center gap-3">
        <span class="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black rounded-lg shadow border border-purple-300">
          {{ gameStore.currentStage }}階段
        </span>
        <div class="text-xs text-slate-300 font-bold">
          當前探索進度：<span class="text-yellow-400 font-black text-sm">第 {{ currentFloor + 1 }} 層 / 共 {{ totalFloors }} 層</span>
        </div>
      </div>

      <!-- 玩家已裝備的稀有被動聖物清單 -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-400 font-bold">已裝備聖物:</span>
        <div class="flex items-center gap-1.5">
          <div 
            v-for="relic in gameStore.ownedRelics" 
            :key="relic.id"
            class="px-2 py-1 bg-yellow-950/80 border border-yellow-400 rounded-lg text-xs font-bold text-yellow-300 flex items-center gap-1 shadow"
            :title="relic.description"
          >
            <span>{{ relic.icon }}</span>
            <span class="hidden sm:inline text-[11px]">{{ relic.name }}</span>
          </div>
          <span v-if="gameStore.ownedRelics.length === 0" class="text-xs text-slate-500 italic">
            (尚無聖物，通過補考或菁英戰可獲取)
          </span>
        </div>
      </div>

      <!-- 模式切換按鈕 -->
      <button
        @click="$emit('switch-to-classic')"
        class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-yellow-400 text-xs font-bold rounded-lg border border-slate-600 transition-colors"
      >
        🔄 切換為經典棋盤軌道
      </button>
    </div>

    <!-- 樹狀地圖畫布區塊 (包含 SVG 連線與層次排列節點) -->
    <div 
      ref="mapContainerRef" 
      class="flex-1 w-full mt-4 bg-gradient-to-b from-[#0a0f24] via-[#070b19] to-[#04060e] border-2 border-slate-800 rounded-2xl p-6 overflow-y-auto relative min-h-[480px] flex flex-col-reverse justify-between items-center gap-10"
    >
      <!-- 背景幾何星空格線 (SVG) -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="rogue-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#4f46e5" stroke-width="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rogue-grid)" />
      </svg>

      <!-- 每一層節點排列 (由下至上推進) -->
      <div 
        v-for="(floorNodes, fIdx) in roguelikeFloors" 
        :key="fIdx"
        class="relative z-10 w-full max-w-xl flex items-center justify-around py-3"
      >
        <!-- 節點按鈕 -->
        <button
          v-for="node in floorNodes"
          :key="node.id"
          @click="handleNodeClick(node)"
          :disabled="!node.isAvailable || node.isVisited"
          class="relative group p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all duration-300 transform"
          :class="getNodeClass(node)"
        >
          <!-- 節點發光呼吸光環 -->
          <span 
            v-if="node.isAvailable && !node.isVisited"
            class="absolute -inset-1 rounded-2xl bg-amber-400/30 animate-pulse pointer-events-none"
          ></span>

          <!-- 當前所處位置玩家標記 -->
          <div 
            v-if="isCurrentPlayerNode(node)"
            class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-950 px-2 py-0.2 rounded-full text-[10px] font-black border border-white shadow animate-bounce"
          >
            YOU
          </div>

          <!-- 節點圖標 -->
          <span class="text-2xl group-hover:scale-110 transition-transform">
            {{ node.icon }}
          </span>

          <!-- 節點標題 -->
          <span class="text-[11px] font-black whitespace-nowrap px-1">
            {{ node.title }}
          </span>

          <!-- 難度或類型標記 -->
          <span 
            class="text-[9px] px-1.5 py-0.2 rounded font-bold"
            :class="node.difficulty === '困難' ? 'bg-red-950 text-red-300' : 'bg-slate-900 text-slate-400'"
          >
            {{ node.subject }} · {{ node.difficulty }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file RoguelikeMap.vue
 * @description Slay the Spire 式樹狀分支節點地圖組件
 * 呈現各學程自主選路節點網絡，玩家依自身學科強項與血量規劃前進路線。
 */

import { ref, computed, onMounted, watch } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { useQuestionStore } from '../../stores/questionStore';
import { RoguelikeNode } from '../../types/quiz';
import { generateRoguelikeMap } from '../../utils/roguelikeGenerator';
import { soundEngine } from '../../utils/audioEngine';

defineEmits<{
  (e: 'switch-to-classic'): void;
}>();

const gameStore = useGameStore();
const questionStore = useQuestionStore();

const mapContainerRef = ref<HTMLDivElement | null>(null);

/** 當前學程專屬的 Roguelike 樹狀樓層陣列 */
const roguelikeFloors = ref<RoguelikeNode[][]>([]);
const currentFloor = ref<number>(0);
const activeNodeId = ref<string>('');

const totalFloors = computed(() => roguelikeFloors.value.length);

onMounted(() => {
  initMapForStage();
});

watch(() => gameStore.currentStage, () => {
  initMapForStage();
});

/**
 * 依據當前學程重新初始化地圖
 */
function initMapForStage(): void {
  roguelikeFloors.value = generateRoguelikeMap(gameStore.currentStage);
  currentFloor.value = 0;
  // 第一層預設可點選
  if (roguelikeFloors.value.length > 0 && roguelikeFloors.value[0].length > 0) {
    activeNodeId.value = roguelikeFloors.value[0][0].id;
  }
}

function isCurrentPlayerNode(node: RoguelikeNode): boolean {
  return node.id === activeNodeId.value;
}

function getNodeClass(node: RoguelikeNode): string {
  if (node.isVisited) {
    return 'bg-slate-950 border-slate-800 text-slate-600 opacity-60 cursor-default';
  }
  if (node.isAvailable) {
    if (node.type === 'FINAL_EXAM') {
      return 'bg-gradient-to-b from-amber-500 to-yellow-600 border-yellow-200 text-slate-950 shadow-[0_0_20px_rgba(250,204,21,0.6)] cursor-pointer hover:scale-105';
    }
    if (node.type === 'QUIZ_ELITE') {
      return 'bg-gradient-to-b from-red-950 to-slate-900 border-red-500 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer hover:scale-105';
    }
    return 'bg-slate-900 hover:bg-slate-800 border-amber-400 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.4)] cursor-pointer hover:scale-105';
  }
  return 'bg-slate-950 border-slate-800 text-slate-500 opacity-40 cursor-not-allowed';
}

/**
 * 玩家點選前進節點
 * @param {RoguelikeNode} node 點擊的節點
 */
function handleNodeClick(node: RoguelikeNode): void {
  if (!node.isAvailable || node.isVisited) return;

  soundEngine.playStep();
  node.isVisited = true;
  activeNodeId.value = node.id;
  currentFloor.value = node.floor;

  // 更新下一層可選節點
  if (node.nextNodeIds && node.nextNodeIds.length > 0) {
    const nextFloorIndex = node.floor + 1;
    if (roguelikeFloors.value[nextFloorIndex]) {
      roguelikeFloors.value[nextFloorIndex].forEach((n) => {
        if (node.nextNodeIds.includes(n.id)) {
          n.isAvailable = true;
        }
      });
    }
  }

  // 依據節點類型派發事件
  resolveNodeAction(node);
}

/**
 * 派發節點事件
 * @param {RoguelikeNode} node 節點
 */
function resolveNodeAction(node: RoguelikeNode): void {
  switch (node.type) {
    case 'QUIZ_NORMAL':
    case 'QUIZ_ELITE':
    case 'VISUAL_EVENT': {
      const q = questionStore.pickQuestion(gameStore.currentStage, node.subject);
      if (q) {
        gameStore.currentQuestion = q;
        gameStore.isTalentMode = node.type === 'QUIZ_ELITE';
        // 先跳出信心下注彈窗！
        gameStore.activeModal = 'WAGER';
        gameStore.hostComment = `抵達【${node.title}】！在揭曉題目內容前，請決定您的下注信心！`;
      }
      break;
    }
    case 'AUDIO_EVENT': {
      const q = questionStore.pickQuestion(gameStore.currentStage, '流行音樂');
      if (q) {
        gameStore.currentQuestion = q;
        gameStore.activeModal = 'WAGER';
        gameStore.hostComment = `🎧 抵達【8-bit 聽力猜歌】節點！請評估下注後開始聆聽！`;
      }
      break;
    }
    case 'CANTEEN_REST': {
      soundEngine.playShopBell();
      gameStore.activeModal = 'CANTEEN';
      gameStore.hostComment = `抵達【${node.title}】！添購補給道具與養樂多，準備衝向頂層大考！`;
      break;
    }
    case 'CAMPUS_FATE': {
      soundEngine.playEvent();
      gameStore.playerHp = Math.min(gameStore.maxHp, gameStore.playerHp + 20);
      gameStore.credits += 30;
      gameStore.hostComment = `在校園圖書館靜心自習，體力回復 +20 點，獲得研習津貼 +30 學分！`;
      break;
    }
    case 'FINAL_EXAM': {
      gameStore.initBossExam();
      break;
    }
  }
}
</script>
