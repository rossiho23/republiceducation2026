<template>
  <div class="flex flex-col gap-4 w-full select-none">
    <!-- 頂部情報燈箱 (Linear 現代極簡橫幅) -->
    <div class="saas-card py-3.5 px-6 flex items-center justify-center text-center">
      <h2 class="text-base sm:text-xl font-semibold tracking-wide text-zinc-200 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        <span>距離最高學府畢業，尚餘 <strong class="text-indigo-400 font-mono">{{ gameStore.remainingLayers }}</strong> 個學業層次</span>
      </h2>
    </div>

    <!-- 狀態 HUD 儀表板 (Bento 資訊列) -->
    <div class="saas-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
      <!-- 學制階段微膠囊 -->
      <div class="flex items-center gap-2.5">
        <span class="saas-pill saas-pill-indigo font-medium text-xs">
          {{ gameStore.currentStageConfig.title }}
        </span>
        <span class="text-xs text-zinc-400 font-mono">
          {{ gameStore.currentBranch === 'UPPER' ? '上路 (理科冒險)' : gameStore.currentBranch === 'LOWER' ? '下路 (文藝挑戰)' : '主線起點' }}
        </span>
      </div>

      <!-- 體力 HP 條 (極簡細線微動) -->
      <div class="flex items-center gap-2.5 min-w-[180px]">
        <span class="text-xs font-mono text-zinc-400">體力 HP:</span>
        <div class="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-300 rounded-full"
            :class="gameStore.playerHp <= 30 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'"
            :style="{ width: `${gameStore.playerHp}%` }"
          ></div>
        </div>
        <span class="font-mono text-xs font-semibold text-zinc-200">{{ gameStore.playerHp }}%</span>
      </div>

      <!-- 學分、得分與連擊 -->
      <div class="flex items-center gap-4 font-mono text-xs sm:text-sm">
        <div class="text-zinc-400">
          學分: <strong class="text-zinc-100 font-semibold">{{ gameStore.credits }}</strong>
        </div>
        <div class="text-zinc-400">
          得分: <strong class="text-zinc-100 font-semibold">{{ gameStore.score }}</strong>
        </div>
        <div v-if="gameStore.comboCount > 1" class="saas-pill saas-pill-rose text-xs font-semibold">
          COMBO x{{ gameStore.comboCount }}
        </div>
      </div>

      <!-- 動態難度 Rank 指示 -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-zinc-500 font-mono">難度:</span>
        <span 
          class="saas-pill text-xs font-mono"
          :class="gameStore.rank >= 7 ? 'saas-pill-rose' : gameStore.rank >= 4 ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'saas-pill-emerald'"
        >
          LV.{{ gameStore.rank }} ({{ getRankTitle(gameStore.rank) }})
        </span>
      </div>

      <!-- 切換肉鴿地圖按鈕 -->
      <button
        @click="$emit('switch-to-roguelike')"
        class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
      >
        切換肉鴿地圖 ➔
      </button>
    </div>

    <!-- 主持播音跑馬燈 (微光底欄) -->
    <div class="saas-card py-2.5 px-4 flex items-center gap-3 text-xs sm:text-sm">
      <span class="saas-pill saas-pill-indigo text-[11px] py-0.5">播音</span>
      <p class="text-zinc-300 truncate font-sans">
        {{ gameStore.hostComment }}
      </p>
    </div>

    <!-- 雙軌地圖主視窗容器 (Linear 現代工作畫布) -->
    <div class="saas-card overflow-hidden flex flex-col relative p-0 border border-white/[0.08]">
      
      <!-- ================= 上半部：校舍背景與大頭娃娃骰子 ================= -->
      <div class="relative w-full h-48 sm:h-56 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950/80 overflow-hidden flex flex-col justify-between border-b border-white/[0.08]">
        <!-- 遠景星光微點 -->
        <div class="absolute inset-0 bg-subtle-dots opacity-40 pointer-events-none"></div>

        <!-- 三層樓高中校舍與中央鐘樓 (沉靜現代色調) -->
        <div class="absolute bottom-5 left-0 right-0 flex justify-center pointer-events-none opacity-85">
          <div class="w-11/12 max-w-4xl h-28 bg-zinc-900 border border-zinc-700/80 rounded-t-lg shadow-lg flex flex-col justify-between relative">
            <!-- 中央高聳鐘樓 -->
            <div class="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-8 bg-zinc-800 border-t border-x border-zinc-600 rounded-t flex flex-col items-center justify-center">
              <div class="w-5 h-5 rounded-full bg-zinc-950 border border-zinc-500 flex items-center justify-center relative">
                <span class="w-1.5 h-0.5 bg-indigo-400 absolute top-2 right-1.5"></span>
                <span class="w-0.5 h-1.5 bg-indigo-400 absolute top-1 right-2"></span>
              </div>
            </div>

            <!-- 校舍屋頂細欄杆 -->
            <div class="w-full h-2 bg-zinc-800 border-b border-zinc-700 flex justify-around">
              <span v-for="i in 24" :key="i" class="w-0.5 h-2 bg-zinc-600"></span>
            </div>
            <!-- 排窗 -->
            <div class="flex justify-around px-4">
              <div v-for="i in 10" :key="'w3-'+i" class="w-6 sm:w-8 h-3.5 bg-indigo-950/60 border border-indigo-800/40 rounded-xs"></div>
            </div>
            <div class="flex justify-around px-4 mb-1">
              <div v-for="i in 10" :key="'w1-'+i" class="w-6 sm:w-8 h-3.5 bg-indigo-950/40 border border-indigo-800/30 rounded-xs"></div>
            </div>
          </div>
        </div>

        <!-- 校舍圍牆與校名名牌 -->
        <div class="absolute bottom-0 left-0 right-0 h-8 bg-zinc-950/90 border-t border-zinc-800 flex items-center px-6">
          <div class="bg-zinc-900 border border-zinc-700 px-3 py-0.5 rounded-full flex items-center gap-2">
            <span class="w-2 h-2 bg-indigo-400 rounded-full inline-block"></span>
            <span class="text-xs font-medium text-zinc-300">
              {{ gameStore.currentStageConfig.title }}
            </span>
          </div>
        </div>

        <!-- 中央 16-Bit 大頭吉祥物與骰子 -->
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <div 
            class="relative flex flex-col items-center transition-transform duration-150"
            :class="gameStore.isRollingDice ? 'scale-105' : ''"
          >
            <img 
              :src="PIXEL_MASCOT_ON_DICE" 
              alt="吉祥物"
              class="w-24 sm:w-32 h-auto drop-shadow-lg select-none pointer-events-none"
            />

            <!-- 浮動骰子即時點數標籤 -->
            <div 
              class="absolute bottom-1 bg-zinc-900/90 backdrop-blur-md border border-white/[0.12] text-zinc-100 font-mono text-xs sm:text-sm px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1.5"
              :class="gameStore.isRollingDice ? 'text-indigo-400' : ''"
            >
              <span>🎲</span>
              <span>{{ gameStore.isRollingDice ? '?' : gameStore.diceValue }} 步</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= 下半部：深調極簡雙軌卡片軌道 ================= -->
      <div class="relative w-full bg-zinc-950/60 py-6 px-4 overflow-hidden min-h-[260px] flex flex-col justify-center">
        <!-- 雙軌滾動容器 -->
        <div 
          ref="trackContainerRef"
          class="flex items-center gap-4 overflow-x-auto py-3 px-4 scroll-smooth relative z-10"
        >
          <!-- 1. 最左側：起點大格 -->
          <div 
            v-if="gameStore.mainStartTile"
            class="flex-shrink-0 flex flex-col items-center relative transition-transform"
            :class="gameStore.currentTileIndex === 0 ? 'scale-105 z-30' : 'opacity-85'"
          >
            <div 
              v-if="gameStore.currentTileIndex === 0" 
              class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-40"
            >
              <span class="saas-pill saas-pill-indigo text-[10px] py-0.5 whitespace-nowrap">
                起點 🚶
              </span>
            </div>
            <div 
              class="w-20 sm:w-24 h-36 sm:h-44 rounded-xl border border-white/[0.08] bg-zinc-900/70 overflow-hidden shadow-md flex items-center justify-center"
              :class="gameStore.currentTileIndex === 0 ? 'border-indigo-500/80 shadow-[0_0_20px_rgba(99,102,241,0.25)]' : ''"
            >
              <RetroTileIcon :tileIndex="0" type="RECOVERY" />
            </div>
            <div class="w-20 sm:w-24 h-5 bg-zinc-900 border-x border-b border-white/[0.08] rounded-b-xl flex items-center justify-center">
              <span class="text-[10px] font-mono text-zinc-400">START</span>
            </div>
          </div>

          <!-- 2. 分叉點選擇格 (FORK) -->
          <div 
            v-if="gameStore.mainForkTile"
            @click="gameStore.activeModal = 'FORK_SELECT'"
            class="flex-shrink-0 flex flex-col items-center relative transition-transform cursor-pointer"
            :class="gameStore.currentTileIndex === 1 ? 'scale-105 z-30' : 'opacity-85'"
          >
            <div 
              v-if="gameStore.currentTileIndex === 1" 
              class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-40"
            >
              <span class="saas-pill saas-pill-indigo text-[10px] py-0.5 whitespace-nowrap animate-pulse">
                路線選擇 🔀
              </span>
            </div>
            <div 
              class="w-20 sm:w-24 h-36 sm:h-44 rounded-xl border border-white/[0.08] bg-zinc-900/70 overflow-hidden shadow-md flex items-center justify-center"
              :class="gameStore.currentTileIndex === 1 ? 'border-indigo-500/80 shadow-[0_0_20px_rgba(99,102,241,0.25)]' : ''"
            >
              <RetroTileIcon :tileIndex="1" type="FORK" />
            </div>
            <div class="w-20 sm:w-24 h-5 bg-zinc-900 border-x border-b border-white/[0.08] rounded-b-xl flex items-center justify-center">
              <span class="text-[10px] font-mono text-indigo-400">FORK</span>
            </div>
          </div>

          <!-- 3. 中央雙軌分叉路線 (Upper vs Lower) -->
          <div class="flex-shrink-0 flex flex-col gap-3 justify-center">
            
            <!-- 上排路線 (Upper Track) -->
            <div class="flex items-center gap-3 p-2.5 rounded-xl border border-white/[0.06] bg-zinc-900/40">
              <span class="text-xs font-mono text-indigo-400 px-1 [writing-mode:vertical-lr] rotate-180">
                上路
              </span>
              <div 
                v-for="tile in gameStore.upperBranchTiles" 
                :key="tile.index"
                class="flex flex-col items-center relative transition-transform"
                :class="[
                  gameStore.currentTileIndex === tile.index 
                    ? 'scale-105 -translate-y-1 z-30' 
                    : 'opacity-85 hover:opacity-100'
                ]"
              >
                <!-- 角色在當前格頭頂 -->
                <div 
                  v-if="gameStore.currentTileIndex === tile.index" 
                  class="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center z-40"
                >
                  <span class="saas-pill saas-pill-indigo text-[10px] py-0.5 whitespace-nowrap">
                    當前 🚶
                  </span>
                </div>

                <div 
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-white/[0.08] bg-zinc-900/80 overflow-hidden shadow-sm flex items-center justify-center"
                  :class="gameStore.currentTileIndex === tile.index ? 'border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.25)]' : ''"
                >
                  <RetroTileIcon 
                    :tileIndex="tile.index" 
                    :type="tile.type" 
                    :subject="tile.subject" 
                  />
                </div>
                <div class="w-16 sm:w-20 h-4 bg-zinc-900 border-x border-b border-white/[0.08] rounded-b-lg flex items-center justify-center">
                  <span class="text-[10px] font-mono text-zinc-500">#{{ tile.stepNumber }}</span>
                </div>
              </div>
            </div>

            <!-- 下排路線 (Lower Track) -->
            <div class="flex items-center gap-3 p-2.5 rounded-xl border border-white/[0.06] bg-zinc-900/40">
              <span class="text-xs font-mono text-zinc-400 px-1 [writing-mode:vertical-lr] rotate-180">
                下路
              </span>
              <div 
                v-for="tile in gameStore.lowerBranchTiles" 
                :key="tile.index"
                class="flex flex-col items-center relative transition-transform"
                :class="[
                  gameStore.currentTileIndex === tile.index 
                    ? 'scale-105 -translate-y-1 z-30' 
                    : 'opacity-85 hover:opacity-100'
                ]"
              >
                <div 
                  v-if="gameStore.currentTileIndex === tile.index" 
                  class="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center z-40"
                >
                  <span class="saas-pill saas-pill-indigo text-[10px] py-0.5 whitespace-nowrap">
                    當前 🚶
                  </span>
                </div>

                <div 
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-white/[0.08] bg-zinc-900/80 overflow-hidden shadow-sm flex items-center justify-center"
                  :class="gameStore.currentTileIndex === tile.index ? 'border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.25)]' : ''"
                >
                  <RetroTileIcon 
                    :tileIndex="tile.index" 
                    :type="tile.type" 
                    :subject="tile.subject" 
                  />
                </div>
                <div class="w-16 sm:w-20 h-4 bg-zinc-900 border-x border-b border-white/[0.08] rounded-b-lg flex items-center justify-center">
                  <span class="text-[10px] font-mono text-zinc-500">#{{ tile.stepNumber }}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- 4. 最右側：匯流終點「升學大考 Boss 格」 -->
          <div 
            v-if="gameStore.mainExamTile"
            class="flex-shrink-0 flex flex-col items-center relative transition-transform"
            :class="gameStore.currentTileIndex === gameStore.mainExamTile.index ? 'scale-105 z-30' : 'opacity-85'"
          >
            <div 
              v-if="gameStore.currentTileIndex === gameStore.mainExamTile.index" 
              class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-40"
            >
              <span class="saas-pill saas-pill-rose text-[10px] py-0.5 whitespace-nowrap">
                大考 Boss 🎓
              </span>
            </div>
            <div 
              class="w-20 sm:w-24 h-36 sm:h-44 rounded-xl border border-white/[0.08] bg-zinc-900/70 overflow-hidden shadow-md flex items-center justify-center"
              :class="gameStore.currentTileIndex === gameStore.mainExamTile.index ? 'border-indigo-500/80 shadow-[0_0_20px_rgba(99,102,241,0.25)]' : ''"
            >
              <RetroTileIcon 
                :tileIndex="gameStore.mainExamTile.index" 
                type="EXAM" 
              />
            </div>
            <div class="w-20 sm:w-24 h-5 bg-zinc-900 border-x border-b border-white/[0.08] rounded-b-xl flex items-center justify-center">
              <span class="text-[10px] font-mono text-indigo-400">EXAM</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部控制與道具列 -->
      <div class="w-full bg-zinc-900/90 border-t border-white/[0.08] p-4 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3 font-mono text-xs sm:text-sm text-zinc-400">
          <span>持有代幣: <strong class="text-zinc-100">{{ gameStore.coins }} 枚</strong></span>
        </div>

        <!-- 道具快捷列 -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="text-zinc-500 font-mono hidden sm:inline">道具:</span>
          <button 
            @click="gameStore.useItem('MAGNIFIER')"
            :disabled="(gameStore.inventory.MAGNIFIER || 0) <= 0"
            class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
            title="50/50 剔除錯誤選項"
          >
            放大鏡: {{ gameStore.inventory.MAGNIFIER || 0 }}
          </button>
          <button 
            @click="gameStore.useItem('CLOCK')"
            :disabled="(gameStore.inventory.CLOCK || 0) <= 0"
            class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
            title="加 10 秒"
          >
            加時鐘: {{ gameStore.inventory.CLOCK || 0 }}
          </button>
          <button 
            @click="gameStore.useItem('PASS_TICKET')"
            :disabled="(gameStore.inventory.PASS_TICKET || 0) <= 0"
            class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
            title="換題"
          >
            PASS券: {{ gameStore.inventory.PASS_TICKET || 0 }}
          </button>
          <button 
            @click="gameStore.useItem('YAKULT')"
            :disabled="(gameStore.inventory.YAKULT || 0) <= 0"
            class="saas-btn saas-btn-secondary py-1.5 px-3 text-xs"
            title="補血 +35"
          >
            養樂多: {{ gameStore.inventory.YAKULT || 0 }}
          </button>
        </div>

        <!-- 擲骰前進按鈕 (唯一 Accent 焦點) -->
        <button 
          @click="gameStore.rollDice"
          :disabled="gameStore.isRollingDice || gameStore.activeModal !== 'NONE' || gameStore.playerHp <= 0"
          class="saas-btn saas-btn-primary py-2.5 px-6 flex items-center gap-2 text-sm font-medium"
        >
          <span>🎲 擲骰前進</span>
          <span class="saas-kbd text-[10px] bg-indigo-700/60 border-indigo-500/50 text-indigo-100">SPACE</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file GameBoard.vue
 * @description 現代極簡雙軌分叉地圖組件 (Linear / Vercel Modern Track Board)
 * 包含極簡進度橫幅、Bento 狀態 HUD、微透校舍背景、深灰冷調雙軌卡片軌道與平滑滾動控制。
 */
import { onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import RetroTileIcon from './RetroTileIcon.vue';
import { PIXEL_MASCOT_ON_DICE } from '../../assets/pixelArt';

defineEmits<{
  (e: 'switch-to-roguelike'): void;
}>();

const gameStore = useGameStore();

function getRankTitle(rankLV: number): string {
  if (rankLV <= 2) return '親民';
  if (rankLV <= 4) return '常識';
  if (rankLV <= 6) return '進階';
  if (rankLV <= 8) return '大師';
  return '專家';
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

<style scoped>
.bg-subtle-dots {
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>