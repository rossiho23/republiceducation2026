<template>
  <!-- 日系新潮街機風 樹狀分支地圖組件 (Neo-Arcade Roguelike Map) -->
  <div class="w-full flex-1 flex flex-col bg-[#090b10] border-[4px] border-black shadow-[8px_8px_0px_#000] p-3 sm:p-5 relative overflow-hidden font-mono select-none neo-cut">
    
    <!-- 頂部黑黃斑馬飾條 -->
    <div class="w-full h-1.5 neo-hazard-yellow border-b border-black -mt-1 mb-2"></div>

    <!-- 頂部學程狀態與聖物裝備列 (字級放大) -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 bg-[#121620] border-2 border-black shadow-[3px_3px_0px_#000] neo-cut-sm">
      <!-- 學程與樓層指標 -->
      <div class="flex flex-wrap items-center gap-3">
        <span class="px-3 py-1 bg-yellow-400 text-black text-xs sm:text-sm font-black uppercase tracking-wider transform -rotate-1 border border-black shadow-[2px_2px_0px_#000]">
          {{ gameStore.currentStage }}階段
        </span>
        <span class="px-2.5 py-1 bg-black border border-yellow-400 text-yellow-400 text-xs sm:text-sm font-black tracking-wider shadow-[2px_2px_0px_#000]">
          {{ gameStore.gameLength === 20 ? '👑 20 關長征' : '🏆 10 關挑戰' }}
        </span>
        <span 
          class="px-2.5 py-1 text-xs sm:text-sm font-black border border-black shadow-[2px_2px_0px_#000]"
          :class="gameStore.currentTimeOfDay === 'NIGHT' ? 'bg-[#1e1b4b] text-yellow-300' : gameStore.currentTimeOfDay === 'DUSK' ? 'bg-[#701a75] text-white' : gameStore.currentTimeOfDay === 'DAWN' ? 'bg-[#ea580c] text-white' : 'bg-[#0284c7] text-white'"
        >
          {{ timeOfDayLabel }}
        </span>
        <div class="text-sm sm:text-base text-gray-200 font-bold">
          探索進度：<span class="text-yellow-400 font-black text-base sm:text-lg">第 {{ currentFloor + 1 }} 層 / 共 {{ totalFloors }} 層</span>
        </div>
      </div>

      <!-- 玩家已裝備的稀有被動聖物清單 -->
      <div class="flex items-center gap-2">
        <span class="text-xs sm:text-sm text-gray-400 font-bold">[已裝備聖物]:</span>
        <div class="flex items-center gap-2">
          <div 
            v-for="relic in gameStore.ownedRelics" 
            :key="relic.id"
            class="px-2.5 py-1 bg-black border border-yellow-400 text-xs sm:text-sm font-bold text-yellow-300 flex items-center gap-1.5 shadow-[2px_2px_0px_#ffe600]"
            :title="relic.description"
          >
            <span>{{ relic.icon }}</span>
            <span class="text-xs sm:text-sm font-black">{{ relic.name }}</span>
          </div>
          <span v-if="gameStore.ownedRelics.length === 0" class="text-xs sm:text-sm text-gray-500 italic">
            (尚無聖物，通過補考或菁英戰可獲取)
          </span>
        </div>
      </div>

      <!-- 功能按鍵組 -->
      <div class="flex items-center gap-2">
        <button
          @click="$emit('switch-to-classic')"
          class="neo-btn bg-[#182030] hover:bg-[#222c42] text-yellow-400 text-xs sm:text-sm font-black py-1.5 px-3.5 neo-cut-sm tracking-wider shadow-[2px_2px_0px_#000] cursor-pointer"
        >
          🔄 切換雙軌
        </button>

        <button
          @click="gameStore.openResetConfirmModal()"
          class="neo-btn bg-[#ff0055] hover:bg-[#ff2a70] text-white text-xs sm:text-sm font-black py-1.5 px-3 neo-cut-sm tracking-wider shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1"
          title="緊急退學，回到國小重新入學"
        >
          <span>⚠️</span>
          <span>重置學業</span>
        </button>
      </div>
    </div>

    <!-- 樹狀地圖畫布區塊 (包含半色調網點與層次排列節點 · 寬屏放寬) -->
    <div 
      ref="mapContainerRef" 
      class="flex-1 w-full mt-3 neo-halftone-dark border-2 border-black p-4 sm:p-8 overflow-y-auto relative min-h-[500px] flex flex-col-reverse justify-between items-center gap-8 neo-cut-sm shadow-inner"
    >
      <!-- 每一層節點排列 (由下至上推進 · 寬度加寬) -->
      <div 
        v-for="(floorNodes, fIdx) in roguelikeFloors" 
        :key="fIdx"
        class="relative z-10 w-full max-w-3xl 2xl:max-w-4xl flex items-center justify-around py-2.5"
      >
        <!-- 節點按鈕 (日系戰術切角、粗黑邊框與實心陰影 · 尺寸加大) -->
        <button
          v-for="node in floorNodes"
          :key="node.id"
          @click="handleNodeClick(node)"
          :disabled="!node.isAvailable || node.isVisited"
          class="relative neo-btn p-3.5 sm:p-4 flex flex-col items-center gap-1.5 transition-all neo-cut-sm min-w-[130px] sm:min-w-[160px]"
          :class="getNodeClass(node)"
        >
          <!-- 當前玩家所處位置標籤 (日系紅黑立體小標牌) -->
          <div 
            v-if="isCurrentPlayerNode(node)"
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ff0055] text-white px-2.5 py-0.5 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] animate-bounce whitespace-nowrap transform -rotate-2"
          >
            YOU // 當前
          </div>

          <!-- 16-Bit 像素節點圖標 (尺寸等比放大) -->
          <img 
            :src="getNodeBadgeIcon(node)" 
            :alt="node.title"
            class="w-9 h-9 sm:w-10 sm:h-10 object-contain select-none"
          />

          <!-- 節點標題 (字體放大) -->
          <span class="text-sm sm:text-base font-black whitespace-nowrap px-1 neo-skew-title">
            {{ node.title }}
          </span>

          <!-- 難度或學科標記 (高對比方塊 · 字體放大) -->
          <span 
            class="text-xs sm:text-sm px-2 py-0.5 font-black border border-black"
            :class="node.difficulty === '困難' ? 'bg-[#ff0055] text-white' : 'bg-black text-yellow-400'"
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
 * @description 日系新潮街機風 樹狀分支地圖組件 (Neo-Arcade Roguelike Map)
 * 具備粗黑 4px 邊框、日系戰術切角按鈕、半色調波點網底與俐落乾淨的選路回饋，支援 5 關與 10 關模式。
 */
import { ref, computed, onMounted, watch } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { useQuestionStore } from '../../stores/questionStore';
import { RoguelikeNode } from '../../types/quiz';
import { generateRoguelikeMap } from '../../utils/roguelikeGenerator';
import { soundEngine } from '../../utils/audioEngine';
import {
  PIXEL_ROGUE_TROPHY,
  PIXEL_ROGUE_FLAME,
  PIXEL_ROGUE_HEADPHONE,
  PIXEL_ROGUE_MAGNIFIER,
  PIXEL_ROGUE_CART,
  PIXEL_ROGUE_LIGHTNING,
  PIXEL_ROGUE_SCROLL
} from '../../assets/pixelArt';

defineEmits<{
  (e: 'switch-to-classic'): void;
}>();

const gameStore = useGameStore();
const questionStore = useQuestionStore();

const mapContainerRef = ref<HTMLDivElement | null>(null);

const roguelikeFloors = ref<RoguelikeNode[][]>([]);
const currentFloor = ref<number>(0);
const activeNodeId = ref<string>('');

const totalFloors = computed(() => roguelikeFloors.value.length);

const timeOfDayLabel = computed(() => {
  switch (gameStore.currentTimeOfDay) {
    case 'DAWN': return '🌅 晨曦升旗';
    case 'DAY': return '☀️ 正午課堂';
    case 'DUSK': return '🌇 傍晚放學';
    case 'NIGHT': return '🌙 挑燈夜戰';
    default: return '☀️ 正午課堂';
  }
});


onMounted(() => {
  initMapForStage();
});

watch(() => [gameStore.currentStage, gameStore.gameLength], () => {
  initMapForStage();
});

function initMapForStage(): void {
  roguelikeFloors.value = generateRoguelikeMap(gameStore.currentStage, gameStore.gameLength);
  currentFloor.value = 0;
  if (roguelikeFloors.value.length > 0 && roguelikeFloors.value[0].length > 0) {
    activeNodeId.value = roguelikeFloors.value[0][0].id;
  }
}

function isCurrentPlayerNode(node: RoguelikeNode): boolean {
  return node.id === activeNodeId.value;
}

/**
 * 依據節點狀態動態決定按鈕樣式 (日系撞色)
 * @param {RoguelikeNode} node 節點
 */
function getNodeClass(node: RoguelikeNode): string {
  if (node.isVisited) {
    return 'bg-[#050608] text-gray-600 border-gray-800 opacity-40 shadow-none cursor-default';
  }
  if (node.isAvailable) {
    if (node.type === 'FINAL_EXAM') {
      return 'neo-hazard-yellow text-black border-black shadow-[5px_5px_0px_#000] hover:scale-105';
    }
    if (node.type === 'QUIZ_ELITE') {
      return 'bg-[#ff0055] text-white border-black shadow-[5px_5px_0px_#000] hover:scale-105';
    }
    return 'bg-yellow-400 text-black border-black shadow-[5px_5px_0px_#000] hover:scale-105';
  }
  return 'bg-[#090b10] text-gray-500 border-gray-800 opacity-40 cursor-not-allowed shadow-none';
}

function getNodeBadgeIcon(node: RoguelikeNode): string {
  switch (node.type) {
    case 'FINAL_EXAM': return PIXEL_ROGUE_TROPHY;
    case 'QUIZ_ELITE': return PIXEL_ROGUE_FLAME;
    case 'AUDIO_EVENT': return PIXEL_ROGUE_HEADPHONE;
    case 'VISUAL_EVENT': return PIXEL_ROGUE_MAGNIFIER;
    case 'CANTEEN_REST': return PIXEL_ROGUE_CART;
    case 'CAMPUS_FATE': return PIXEL_ROGUE_LIGHTNING;
    default: return PIXEL_ROGUE_SCROLL;
  }
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

  resolveNodeAction(node);
}

/**
 * 派發節點事件
 * @param {RoguelikeNode} node 節點
 */
function resolveNodeAction(node: RoguelikeNode): void {
  switch (node.type) {
    case 'QUIZ_NORMAL': {
      // 一般隨堂考：直接乾淨開啟作答黑板，節奏俐落
      const q = questionStore.pickQuestion(gameStore.currentStage, node.subject);
      if (q) {
        gameStore.startDirectQuiz(q, false);
        gameStore.hostComment = `抵達【${node.title}】！請沉著應對【${node.subject}】隨堂測驗！`;
      }
      break;
    }
    case 'QUIZ_ELITE': {
      // 菁英挑戰考：進入信心下注博弈
      const q = questionStore.pickQuestion(gameStore.currentStage, node.subject);
      if (q) {
        gameStore.startWagerQuiz(q, true);
        gameStore.hostComment = `抵達【${node.title}】！面臨高難度菁英考驗，請評估信心下注！`;
      }
      break;
    }
    case 'VISUAL_EVENT': {
      const q = questionStore.pickQuestion(gameStore.currentStage, node.subject);
      if (q) {
        gameStore.startWagerQuiz(q, false);
        gameStore.hostComment = `抵達【${node.title}】！視覺局部放大題，評估信心後開始辨識！`;
      }
      break;
    }
    case 'AUDIO_EVENT': {
      const q = questionStore.pickQuestion(gameStore.currentStage, '流行音樂');
      if (q) {
        gameStore.startWagerQuiz(q, false);
        gameStore.hostComment = `抵達【8-bit 聽力猜歌】節點！請評估下注後開始聆聽！`;
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