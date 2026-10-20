<template>
  <!-- 現代極簡 SaaS 風格 樹狀分支地圖組件 (Linear Modern Roguelike Map) -->
  <div class="w-full flex-1 flex flex-col saas-card p-4 sm:p-6 relative overflow-hidden select-none">
    
    <!-- 頂部學程狀態與聖物裝備列 (Bento 資訊欄) -->
    <div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-950/60 border border-white/[0.08] rounded-xl">
      <!-- 學程與樓層指標 -->
      <div class="flex items-center gap-3">
        <span class="saas-pill saas-pill-indigo font-medium text-xs">
          {{ gameStore.currentStage }}階段
        </span>
        <div class="text-xs sm:text-sm text-zinc-300 font-mono">
          探索進度：<strong class="text-zinc-100 font-semibold">第 {{ currentFloor + 1 }} 層 / 共 {{ totalFloors }} 層</strong>
        </div>
      </div>

      <!-- 玩家已裝備的稀有被動聖物清單 -->
      <div class="flex items-center gap-2 text-xs">
        <span class="text-zinc-500 font-mono">裝備聖物:</span>
        <div class="flex items-center gap-2">
          <div 
            v-for="relic in gameStore.ownedRelics" 
            :key="relic.id"
            class="saas-pill bg-zinc-800/80 border-white/[0.1] text-zinc-200"
            :title="relic.description"
          >
            <span>{{ relic.icon }}</span>
            <span class="font-medium">{{ relic.name }}</span>
          </div>
          <span v-if="gameStore.ownedRelics.length === 0" class="text-xs text-zinc-600 italic">
            (尚無聖物裝備)
          </span>
        </div>
      </div>

      <!-- 模式切換按鈕 -->
      <button
        @click="$emit('switch-to-classic')"
        class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
      >
        切換為經典雙軌模式 ➔
      </button>
    </div>

    <!-- 樹狀地圖畫布區塊 (現代極簡網格背景與層次排列節點) -->
    <div 
      ref="mapContainerRef" 
      class="flex-1 w-full mt-4 bg-zinc-950/70 border border-white/[0.08] rounded-xl p-6 sm:p-10 overflow-y-auto relative min-h-[500px] flex flex-col-reverse justify-between items-center gap-8 shadow-inner"
    >
      <!-- 每一層節點排列 (由下至上推進) -->
      <div 
        v-for="(floorNodes, fIdx) in roguelikeFloors" 
        :key="fIdx"
        class="relative z-10 w-full max-w-3xl 2xl:max-w-4xl flex items-center justify-around py-3"
      >
        <!-- 節點卡片按鈕 (Modern SaaS Card · 微光邊框與平滑懸停) -->
        <button
          v-for="node in floorNodes"
          :key="node.id"
          @click="handleNodeClick(node)"
          :disabled="!node.isAvailable || node.isVisited"
          class="relative p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 min-w-[130px] sm:min-w-[160px]"
          :class="getNodeClass(node)"
        >
          <!-- 當前玩家所處位置標籤 (微膠囊指示器) -->
          <div 
            v-if="isCurrentPlayerNode(node)"
            class="absolute -top-3 left-1/2 -translate-x-1/2 saas-pill saas-pill-indigo text-[10px] py-0.5 whitespace-nowrap animate-pulse"
          >
            YOU 當前位置
          </div>

          <!-- 16-Bit 像素節點圖標 -->
          <img 
            :src="getNodeBadgeIcon(node)" 
            :alt="node.title"
            class="w-8 h-8 sm:w-9 sm:h-9 object-contain select-none opacity-90"
          />

          <!-- 節點標題 -->
          <span class="text-sm font-medium text-zinc-100 whitespace-nowrap px-1">
            {{ node.title }}
          </span>

          <!-- 難度或學科微標籤 -->
          <span 
            class="text-[11px] font-mono px-2 py-0.5 rounded-full border"
            :class="node.difficulty === '困難' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-zinc-800/80 text-zinc-400 border-white/[0.08]'"
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
 * @description 現代極簡 SaaS 風格 樹狀分支地圖組件 (Linear Modern Roguelike Map)
 * 具備 Bento 狀態欄、Zinc 冷調微透背景、Indigo 呼吸節點與平滑選路微互動。
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

onMounted(() => {
  initMapForStage();
});

watch(() => gameStore.currentStage, () => {
  initMapForStage();
});

function initMapForStage(): void {
  roguelikeFloors.value = generateRoguelikeMap(gameStore.currentStage);
  currentFloor.value = 0;
  if (roguelikeFloors.value.length > 0 && roguelikeFloors.value[0].length > 0) {
    activeNodeId.value = roguelikeFloors.value[0][0].id;
  }
}

function isCurrentPlayerNode(node: RoguelikeNode): boolean {
  return node.id === activeNodeId.value;
}

/**
 * 依據節點狀態動態決定按鈕樣式 (Linear 現代極簡微光)
 * @param {RoguelikeNode} node 節點
 */
function getNodeClass(node: RoguelikeNode): string {
  if (node.isVisited) {
    return 'bg-zinc-950/40 text-zinc-600 border-white/[0.04] opacity-35 cursor-default';
  }
  if (node.isAvailable) {
    if (node.type === 'FINAL_EXAM') {
      return 'bg-indigo-950/40 border-indigo-500/60 shadow-[0_0_25px_rgba(99,102,241,0.3)] text-zinc-100 hover:bg-indigo-900/40 hover:scale-[1.02] cursor-pointer';
    }
    if (node.type === 'QUIZ_ELITE') {
      return 'bg-zinc-900/90 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)] text-zinc-100 hover:bg-zinc-850 hover:scale-[1.02] cursor-pointer';
    }
    return 'bg-zinc-900/90 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.15)] text-zinc-100 hover:bg-zinc-800 hover:border-indigo-400 hover:scale-[1.02] cursor-pointer';
  }
  return 'bg-zinc-950/20 text-zinc-600 border-white/[0.04] opacity-30 cursor-not-allowed';
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
      const q = questionStore.pickQuestion(gameStore.currentStage, node.subject);
      if (q) {
        gameStore.startDirectQuiz(q, false);
        gameStore.hostComment = `抵達【${node.title}】！請應對【${node.subject}】隨堂測驗。`;
      }
      break;
    }
    case 'QUIZ_ELITE': {
      const q = questionStore.pickQuestion(gameStore.currentStage, node.subject);
      if (q) {
        gameStore.startWagerQuiz(q, true);
        gameStore.hostComment = `抵達【${node.title}】！面臨菁英考驗，請評估信心下注。`;
      }
      break;
    }
    case 'VISUAL_EVENT': {
      const q = questionStore.pickQuestion(gameStore.currentStage, node.subject);
      if (q) {
        gameStore.startWagerQuiz(q, false);
        gameStore.hostComment = `抵達【${node.title}】！視覺局部放大題，開始辨識。`;
      }
      break;
    }
    case 'AUDIO_EVENT': {
      const q = questionStore.pickQuestion(gameStore.currentStage, '流行音樂');
      if (q) {
        gameStore.startWagerQuiz(q, false);
        gameStore.hostComment = `抵達【8-Bit 聽力猜歌】節點，請準備聆聽。`;
      }
      break;
    }
    case 'CANTEEN_REST': {
      soundEngine.playShopBell();
      gameStore.activeModal = 'CANTEEN';
      gameStore.hostComment = `抵達【${node.title}】！添購補給道具與養樂多。`;
      break;
    }
    case 'CAMPUS_FATE': {
      soundEngine.playEvent();
      gameStore.playerHp = Math.min(gameStore.maxHp, gameStore.playerHp + 20);
      gameStore.credits += 30;
      gameStore.hostComment = `在校園圖書館靜心自習，體力回復 +20 點，獲得津貼 +30 學分。`;
      break;
    }
    case 'FINAL_EXAM': {
      gameStore.initBossExam();
      break;
    }
  }
}
</script>