<template>
  <!-- 現代旗艦版 擬真金屬雙軌卡匣棋盤組件 (100% 還原 pic/國小.jfif ~ 大學.jfif) -->
  <div class="flex flex-col gap-3 w-full select-none font-mono">
    
    <!-- 頂部奢華酒紅金邊跑馬燈燈箱 -->
    <div class="w-full bg-gradient-to-r from-[#1c0209] via-[#3a0614] to-[#1c0209] border-[3px] border-[#9f1239] py-2.5 px-4 shadow-[0_4px_15px_rgba(159,18,57,0.4)] flex items-center justify-between rounded-lg">
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-0.5 bg-[#e11d48] text-white font-black text-xs rounded-full shadow-[0_0_8px_#e11d48]">
          廣播
        </span>
        <span class="text-xs sm:text-sm md:text-base text-amber-200 font-bold tracking-wide">
          {{ gameStore.hostComment }}
        </span>
      </div>
      <div class="text-xs sm:text-sm font-black text-yellow-400 tracking-widest hidden sm:block">
        // 離畢業還有 {{ gameStore.remainingLayers }} 層次 //
      </div>
    </div>

    <!-- 現代旗艦資訊 HUD (深黑酒紅金屬微光面板) -->
    <div class="bg-gradient-to-r from-[#12050b] via-[#1f0a14] to-[#12050b] border-2 border-[#881337] p-3 sm:p-4 shadow-lg rounded-xl flex flex-wrap items-center justify-between gap-3 text-sm sm:text-base">
      <!-- 學制階段徽章與長度標記 -->
      <div class="flex items-center gap-2.5">
        <span class="px-3 py-1 font-black text-xs sm:text-sm text-amber-100 bg-gradient-to-r from-[#be123c] to-[#e11d48] rounded-md border border-[#fda4af] shadow-[0_0_10px_rgba(225,29,72,0.4)]">
          {{ gameStore.currentStageConfig.title }}
        </span>
        <span class="px-2.5 py-0.5 bg-black/60 border border-amber-400 text-amber-300 text-xs font-black rounded">
          {{ gameStore.gameLength === 20 ? '👑 20 關長征' : '🏆 10 關挑戰' }}
        </span>
        <span class="text-xs sm:text-sm text-rose-300 font-bold hidden md:inline">
          路線: {{ gameStore.currentBranch === 'UPPER' ? '路線上' : gameStore.currentBranch === 'LOWER' ? '路線下' : '昇學主線' }}
        </span>
      </div>

      <!-- 體力愛心 HP 條 -->
      <div class="flex items-center gap-2 min-w-[180px] sm:min-w-[220px]">
        <span class="font-black text-rose-400 text-xs sm:text-sm flex items-center gap-1">
          <span>❤️</span>
          <span>體力 HP:</span>
        </span>
        <div class="flex-1 h-3.5 bg-black/80 rounded-full border border-rose-950 overflow-hidden p-0.5">
          <div 
            class="h-full rounded-full transition-all duration-300"
            :class="gameStore.playerHp <= 30 ? 'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse' : 'bg-gradient-to-r from-emerald-500 to-teal-300'"
            :style="{ width: `${gameStore.playerHp}%` }"
          ></div>
        </div>
        <span class="font-mono font-black text-rose-300 text-xs sm:text-sm">{{ gameStore.playerHp }}%</span>
      </div>

      <!-- 學分、得分與連擊 -->
      <div class="flex items-center gap-3 font-mono text-xs sm:text-sm">
        <div class="flex items-center gap-1 text-amber-300 font-black">
          <span>🪙 學分:</span>
          <span>{{ gameStore.credits }}</span>
        </div>
        <div class="flex items-center gap-1 text-cyan-300 font-black">
          <span>⭐ 得分:</span>
          <span>{{ gameStore.score }}</span>
        </div>
        <div v-if="gameStore.comboCount > 1" class="text-rose-400 font-black animate-bounce text-xs sm:text-sm">
          COMBO x{{ gameStore.comboCount }}
        </div>
      </div>

      <!-- 右側風格切換與退學重置鍵 -->
      <div class="flex items-center gap-2">
        <!-- 切換肉鴿地圖按鈕 -->
        <button
          @click="$emit('switch-to-roguelike')"
          class="bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-emerald-100 text-xs sm:text-sm font-black py-1 px-2.5 rounded border border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)] cursor-pointer flex items-center gap-1 transition-all"
          title="切換至 Slay the Spire 樹狀探索地圖"
        >
          <span>🌲</span>
          <span>肉鴿地圖</span>
        </button>

        <!-- 風格切換按鈕 -->
        <button
          @click="gameStore.toggleVisualTheme()"
          class="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black text-xs sm:text-sm font-black py-1 px-3 rounded border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)] cursor-pointer flex items-center gap-1 transition-all"
          title="在現代旗艦版與 1993 復古街機版之間自由切換"
        >
          <span>🎨</span>
          <span>切換街機版</span>
        </button>

        <!-- 退學重置按鍵 -->
        <button
          @click="gameStore.openResetConfirmModal()"
          class="bg-[#be123c] hover:bg-[#e11d48] text-white text-xs sm:text-sm font-black py-1 px-2.5 rounded border border-rose-400 shadow-[0_0_8px_rgba(225,29,72,0.4)] cursor-pointer flex items-center gap-1 transition-all"
          title="緊急退學，回到國小重新入學"
        >
          <span>⚠️</span>
          <span>重置學業</span>
        </button>
      </div>
    </div>

    <!-- ================= 現代主地圖大畫布 (與設計圖 pic/ 完全一致) ================= -->
    <div class="w-full bg-[#140207] border-[3px] border-[#9f1239] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col relative">
      
      <!-- 上半部：學程專屬校舍與主角舞台 (100% 依據 pic/國小.jfif ~ pic/大學.jfif 繪製) -->
      <div class="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden flex flex-col justify-between border-b-4 border-[#881337] bg-cover bg-center transition-all duration-700" :style="{ backgroundImage: `url(${currentModernSchoolBg})` }">
        
        <!-- 左上角學程立體木質招牌 -->
        <div class="absolute top-3 left-4 z-20 pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          <!-- 國小招牌 (小雛菊 + 鉛筆) -->
          <div v-if="gameStore.currentStage === '國小'" class="relative bg-gradient-to-b from-[#5c3a21] via-[#3d2413] to-[#26150a] border-[3px] border-[#8b5a2b] py-1.5 px-4 rounded-xl flex items-center gap-2 shadow-inner">
            <span class="w-3 h-3 bg-emerald-500 rounded-sm"></span>
            <span class="text-amber-100 font-black text-sm sm:text-base tracking-widest neo-skew-title">國民小學</span>
            <span class="text-sm">✏️🌼</span>
          </div>
          <!-- 國中招牌 (金屬鉚釘深木牌) -->
          <div v-else-if="gameStore.currentStage === '國中'" class="relative bg-gradient-to-b from-[#422213] via-[#2c140a] to-[#180a04] border-[3px] border-[#78350f] py-1.5 px-4 rounded-xl flex items-center gap-2 shadow-inner">
            <span class="w-3 h-3 bg-cyan-500 rounded-sm"></span>
            <span class="text-amber-100 font-black text-sm sm:text-base tracking-widest neo-skew-title">國民中學</span>
          </div>
          <!-- 高中招牌 (深色實木招牌) -->
          <div v-else-if="gameStore.currentStage === '高中'" class="relative bg-gradient-to-b from-[#3a1d10] via-[#241006] to-[#130702] border-[3px] border-[#92400e] py-1.5 px-4 rounded-xl flex items-center gap-2 shadow-inner">
            <span class="w-3 h-3 bg-amber-400 rounded-sm"></span>
            <span class="text-amber-100 font-black text-sm sm:text-base tracking-widest neo-skew-title">高級中學</span>
          </div>
          <!-- 大學招牌 (綠藤校徽盾牌木牌) -->
          <div v-else class="relative bg-gradient-to-b from-[#3b2514] via-[#26160a] to-[#140a04] border-[3px] border-[#a16207] py-1.5 px-4 rounded-xl flex items-center gap-2 shadow-inner">
            <span class="text-sm">🛡️</span>
            <span class="text-amber-100 font-black text-sm sm:text-base tracking-widest neo-skew-title">綜合大學</span>
            <span class="text-xs text-emerald-400">🌿</span>
          </div>
        </div>

        <!-- 中央主角 3D 骰子下方：金屬半透明藍光膠囊指示器「🎲 X 步」 -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div class="px-5 py-1.5 bg-gradient-to-r from-[#0369a1]/90 via-[#0284c7]/90 to-[#0369a1]/90 border-2 border-[#38bdf8] rounded-full shadow-[0_0_15px_#0284c7] flex items-center gap-2 backdrop-blur-sm animate-pulse">
            <span class="text-sm sm:text-base text-white">🎲</span>
            <span class="text-xs sm:text-sm font-black text-white font-mono tracking-wider">
              {{ gameStore.isRollingDice ? '擲骰中...' : `${gameStore.diceValue} 步` }}
            </span>
          </div>
        </div>
      </div>

      <!-- ================= 下半部：現代雙軌金屬立體卡匣棋盤 (100% 依據 pic/ 截圖) ================= -->
      <div class="w-full bg-gradient-to-b from-[#24030c] via-[#170107] to-[#0c0003] p-4 sm:p-6 overflow-x-auto relative flex items-center justify-between gap-4 min-h-[220px]">
        
        <!-- 背景幾何暗紋與淡水印 -->
        <div class="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <!-- 1. 左側【起點】：昇學金屬立體卡匣 -->
        <div class="relative flex flex-col items-center gap-2 z-10 flex-shrink-0">
          <div 
            class="w-16 sm:w-20 h-28 sm:h-32 bg-gradient-to-b from-[#422006] via-[#291302] to-[#170a00] border-2 border-[#f59e0b] rounded-xl flex flex-col items-center justify-center p-2 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition-all cursor-pointer relative"
            :class="gameStore.currentTileIndex === 0 ? 'ring-4 ring-yellow-400 shadow-[0_0_20px_#facc15] scale-105' : 'hover:border-yellow-300'"
          >
            <!-- 當前標籤 -->
            <div v-if="gameStore.currentTileIndex === 0" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff0055] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow animate-bounce">
              YOU
            </div>
            <!-- 凹凸金屬昇學標牌 -->
            <div class="w-12 h-10 border border-amber-600 rounded flex items-center justify-center bg-black/40 text-amber-300 text-lg sm:text-xl font-black">
              🎴
            </div>
            <span class="text-xs sm:text-sm font-black text-amber-200 mt-2">昇學</span>
          </div>
          <!-- 下方標記 -->
          <div class="px-3 py-0.5 bg-black/80 border border-amber-500/50 rounded-full text-[11px] font-bold text-amber-300">
            起點
          </div>
        </div>

        <!-- 2. 左側【分叉點】：雙青藍箭頭發光卡匣 -->
        <div class="relative flex flex-col items-center gap-2 z-10 flex-shrink-0">
          <div 
            class="w-16 sm:w-20 h-28 sm:h-32 bg-gradient-to-b from-[#0c4a6e] via-[#082f49] to-[#041d2d] border-2 border-[#38bdf8] rounded-xl flex flex-col items-center justify-center p-2 shadow-[0_4px_12px_rgba(56,189,248,0.3)] transition-all cursor-pointer relative"
            :class="gameStore.currentTileIndex === 1 ? 'ring-4 ring-cyan-400 shadow-[0_0_20px_#38bdf8] scale-105' : 'hover:border-cyan-300'"
          >
            <div v-if="gameStore.currentTileIndex === 1" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff0055] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow animate-bounce">
              YOU
            </div>
            <!-- 青藍雙向上箭頭 -->
            <div class="text-2xl text-cyan-300 animate-pulse">
              ⬆️⬆️
            </div>
            <span class="text-[11px] sm:text-xs font-black text-cyan-200 mt-2">路線分叉</span>
          </div>
          <div class="px-3 py-0.5 bg-black/80 border border-cyan-500/50 rounded-full text-[11px] font-bold text-cyan-300">
            分叉點
          </div>
        </div>

        <!-- 3. 中央雙軌道 (深色微透明底座包裹) -->
        <div class="relative z-10 bg-black/40 border border-[#881337]/60 rounded-2xl p-2.5 sm:p-3 flex flex-col gap-3 flex-1 min-w-[500px]">
          
          <!-- 上分歧路線 (路線上) -->
          <div class="flex items-center gap-2.5">
            <!-- 路線上 直立青藍膠囊標籤 -->
            <div class="w-6 py-2 bg-gradient-to-b from-[#0e7490] to-[#155e75] border border-cyan-400 rounded-md flex flex-col items-center justify-center text-[10px] font-black text-white shadow-[0_0_8px_#0e7490] flex-shrink-0">
              <span>路</span>
              <span>線</span>
              <span>上</span>
            </div>

            <!-- 上路卡匣清單 -->
            <div class="flex items-center gap-2.5 flex-1">
              <div 
                v-for="tile in gameStore.upperBranchTiles" 
                :key="tile.index"
                class="relative flex flex-col items-center group cursor-pointer flex-1 min-w-[60px]"
                :class="gameStore.currentTileIndex === tile.index ? 'scale-105' : ''"
              >
                <!-- 卡匣本體 (依類型客製色彩與圖標) -->
                <div 
                  class="w-full h-16 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center p-1 transition-all shadow-md relative"
                  :class="getModernTileClass(tile)"
                >
                  <div v-if="gameStore.currentTileIndex === tile.index" class="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#ff0055] text-white text-[9px] font-black px-1.5 rounded-full shadow animate-bounce">
                    YOU
                  </div>
                  <!-- 圖標 -->
                  <span class="text-base sm:text-xl select-none">{{ getModernTileIcon(tile) }}</span>
                  <!-- 標題 -->
                  <span class="text-[10px] sm:text-xs font-black text-white mt-1 truncate max-w-full">{{ getModernTileShortTitle(tile) }}</span>
                </div>
                <!-- 下方序號徽章 (如 #3, #4) -->
                <span class="text-[9px] font-mono text-gray-400 mt-1">#{{ tile.stepNumber }}</span>
              </div>
            </div>
          </div>

          <!-- 下分歧路線 (路線下) -->
          <div class="flex items-center gap-2.5">
            <!-- 路線下 直立紫紅膠囊標籤 -->
            <div class="w-6 py-2 bg-gradient-to-b from-[#9d174d] to-[#831843] border border-rose-400 rounded-md flex flex-col items-center justify-center text-[10px] font-black text-white shadow-[0_0_8px_#9d174d] flex-shrink-0">
              <span>路</span>
              <span>線</span>
              <span>下</span>
            </div>

            <!-- 下路卡匣清單 -->
            <div class="flex items-center gap-2.5 flex-1">
              <div 
                v-for="tile in gameStore.lowerBranchTiles" 
                :key="tile.index"
                class="relative flex flex-col items-center group cursor-pointer flex-1 min-w-[60px]"
                :class="gameStore.currentTileIndex === tile.index ? 'scale-105' : ''"
              >
                <div 
                  class="w-full h-16 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center p-1 transition-all shadow-md relative"
                  :class="getModernTileClass(tile)"
                >
                  <div v-if="gameStore.currentTileIndex === tile.index" class="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#ff0055] text-white text-[9px] font-black px-1.5 rounded-full shadow animate-bounce">
                    YOU
                  </div>
                  <span class="text-base sm:text-xl select-none">{{ getModernTileIcon(tile) }}</span>
                  <span class="text-[10px] sm:text-xs font-black text-white mt-1 truncate max-w-full">{{ getModernTileShortTitle(tile) }}</span>
                </div>
                <span class="text-[9px] font-mono text-gray-400 mt-1">#{{ tile.stepNumber }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- 4. 右側【終點】：金色神聖發光「升學大考」卡匣 (帶金色光暈與羽毛筆試卷) -->
        <div class="relative flex flex-col items-center gap-2 z-10 flex-shrink-0">
          <div 
            class="w-20 sm:w-24 h-28 sm:h-32 bg-gradient-to-b from-[#78350f] via-[#451a03] to-[#1f0901] border-[3px] border-[#fbbf24] rounded-2xl flex flex-col items-center justify-center p-2 shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-all cursor-pointer relative"
            :class="gameStore.currentTileIndex >= (gameStore.tiles.length - 1) ? 'ring-4 ring-yellow-300 scale-105 animate-pulse' : 'hover:border-yellow-200'"
          >
            <div v-if="gameStore.currentTileIndex >= (gameStore.tiles.length - 1)" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff0055] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow animate-bounce">
              BOSS
            </div>
            <!-- 發光考卷羽毛筆 -->
            <div class="w-12 h-10 bg-amber-100 border border-amber-400 rounded flex items-center justify-center text-lg sm:text-xl shadow">
              📝🪶
            </div>
            <span class="text-xs sm:text-sm font-black text-yellow-300 mt-2 neo-skew-title">升學大考</span>
          </div>
          <div class="px-3 py-0.5 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full text-[11px] font-black text-black shadow">
            終點
          </div>
        </div>

      </div>

      <!-- 底部控制按鍵區 (擲骰 SPACE) -->
      <div class="w-full bg-[#100105] border-t-2 border-[#881337] p-3 flex items-center justify-between">
        <div class="text-xs text-rose-300 font-bold">
          [目前位置: {{ gameStore.currentTile?.title || '起點' }}]
        </div>

        <!-- 擲骰前進按鈕 (現代金屬漸層微動) -->
        <button 
          @click="gameStore.rollDice"
          :disabled="gameStore.isRollingDice || gameStore.activeModal !== 'NONE' || gameStore.playerHp <= 0"
          class="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm sm:text-base py-2.5 px-7 rounded-xl border border-yellow-200 shadow-[0_0_15px_rgba(245,158,11,0.5)] disabled:opacity-40 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <span>🎲 擲骰前進</span>
          <span class="text-xs bg-black/20 px-2 py-0.5 rounded font-mono">SPACE</span>
        </button>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
/**
 * @file ModernGameBoard.vue
 * @description 現代旗艦版 擬真金屬雙軌卡匣棋盤組件 (100% 還原 pic/國小.jfif ~ 大學.jfif)
 * 包含學程專屬現代高清校舍舞台、奢華深酒紅暗紋底板、立體金屬卡匣與神聖發光升學大考終點。
 */
import { computed, onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { MapTile } from '../../types/quiz';

const emit = defineEmits<{
  (e: 'switch-to-roguelike'): void;
}>();

const gameStore = useGameStore();

/**
 * 依據學程階段載入對應的現代校舍舞台背景圖 (自動解析 Base URL)
 */
const baseUrl = ((import.meta as any).env?.BASE_URL as string) || '/';
const currentModernSchoolBg = computed(() => {
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  switch (gameStore.currentStage) {
    case '國小': return `${cleanBase}modern/school_elementary.jfif`;
    case '國中': return `${cleanBase}modern/school_junior.jfif`;
    case '高中': return `${cleanBase}modern/school_high.jfif`;
    case '大學': return `${cleanBase}modern/school_university.jfif`;
    default: return `${cleanBase}modern/school_elementary.jfif`;
  }
});

/**
 * 依據卡匣類型動態設定現代金屬邊框與發光色彩
 * @param {MapTile} tile 格子資料
 */
function getModernTileClass(tile: MapTile): string {
  const isCurrent = gameStore.currentTileIndex === tile.index;
  const currentRing = isCurrent ? 'ring-4 ring-yellow-400 shadow-[0_0_15px_#facc15]' : '';

  switch (tile.type) {
    case 'QUIZ':
      if (tile.subject === '自然') return `bg-gradient-to-b from-[#14532d] via-[#052e16] to-[#02170b] border-[#22c55e] ${currentRing}`;
      if (tile.subject === '流行音樂') return `bg-gradient-to-b from-[#713f12] via-[#422006] to-[#1c0c02] border-[#eab308] ${currentRing}`;
      return `bg-gradient-to-b from-[#0f172a] via-[#020617] to-[#000000] border-[#38bdf8] ${currentRing}`;
    case 'THREE_CHOICE':
      return `bg-gradient-to-b from-[#1e3a8a] via-[#172554] to-[#0b132b] border-[#60a5fa] ${currentRing}`;
    case 'CANTEEN':
      return `bg-gradient-to-b from-[#0369a1] via-[#082f49] to-[#041d2d] border-[#38bdf8] ${currentRing}`;
    case 'HEALTH':
      return `bg-gradient-to-b from-[#881337] via-[#4c0519] to-[#1f0108] border-[#fb7185] ${currentRing}`;
    case 'TALENT':
      return `bg-gradient-to-b from-[#0e7490] via-[#164e63] to-[#082f49] border-[#22d3ee] ${currentRing}`;
    case 'TROUBLE':
      return `bg-gradient-to-b from-[#450a0a] via-[#2a0404] to-[#120101] border-[#ef4444] ${currentRing}`;
    case 'EVENT':
      return `bg-gradient-to-b from-[#581c87] via-[#3b0764] to-[#1d0333] border-[#c084fc] ${currentRing}`;
    default:
      return `bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] border-slate-500 ${currentRing}`;
  }
}

/**
 * 依據卡匣類型取得現代立體圖標
 * @param {MapTile} tile 格子資料
 */
function getModernTileIcon(tile: MapTile): string {
  switch (tile.type) {
    case 'QUIZ':
      if (tile.subject === '自然') return '🔬';
      if (tile.subject === '流行音樂') return '🎵';
      if (tile.subject === '社會') return '🌐';
      return '📝';
    case 'THREE_CHOICE': return '3️⃣';
    case 'CANTEEN': return '🏪';
    case 'HEALTH': return '❤️';
    case 'TALENT': return '🧠';
    case 'TROUBLE': return '💀';
    case 'EVENT': return '❓';
    case 'RECOVERY': return '📚';
    default: return '💡';
  }
}

/**
 * 取得精簡標題
 * @param {MapTile} tile 格子資料
 */
function getModernTileShortTitle(tile: MapTile): string {
  if (tile.type === 'THREE_CHOICE') return '三選一';
  if (tile.type === 'CANTEEN') return '福利社';
  if (tile.type === 'TALENT') return '天才問題';
  if (tile.type === 'TROUBLE') return 'TROUBLE';
  if (tile.type === 'HEALTH') return '健康教育';
  if (tile.type === 'EVENT') return '事件';
  if (tile.subject) return tile.subject;
  return tile.title.slice(0, 4);
}

function handleKeyDown(e: KeyboardEvent): void {
  if (e.code === 'Space' && gameStore.activeModal === 'NONE' && !gameStore.isRollingDice) {
    e.preventDefault();
    gameStore.rollDice();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>