<template>
  <div class="flex flex-col gap-3 w-full select-none font-mono">
    <!-- 頂部跑馬燈燈箱：致敬 map1.jpg「離畢業還有 10 層次。」 (日系戰術切角) -->
    <div class="w-full bg-black border-[3px] border-black py-2.5 px-4 shadow-[6px_6px_0px_#000] flex items-center justify-center neo-cut-sm">
      <h2 class="text-base sm:text-xl md:text-2xl font-black tracking-widest text-yellow-400 neo-skew-title neo-text-stroke animate-pulse">
        // 離畢業還有 {{ gameStore.remainingLayers }} 層次。 //
      </h2>
    </div>

    <!-- 街機資訊 HUD (Neo-Arcade 撞色面板) -->
    <div class="bg-[#121620] border-2 border-black p-2.5 sm:p-3 shadow-[4px_4px_0px_#000] flex flex-wrap items-center justify-between gap-2.5 text-xs neo-cut-sm">
      <!-- 學制階段徽章 -->
      <div class="flex items-center gap-2">
        <span 
          class="px-2.5 py-1 font-black text-xs text-black uppercase tracking-wider border border-black shadow-[2px_2px_0px_#000]"
          :style="{ backgroundColor: gameStore.currentStageConfig.badgeColor }"
        >
          {{ gameStore.currentStageConfig.title }}
        </span>
        <span class="text-xs text-yellow-400 font-bold">
          路線: {{ gameStore.currentBranch === 'UPPER' ? '上路 (理科冒險)' : gameStore.currentBranch === 'LOWER' ? '下路 (文藝挑戰)' : '主線起點' }}
        </span>
      </div>

      <!-- 體力愛心 HP 條 -->
      <div class="flex items-center gap-2 min-w-[170px]">
        <span class="font-black text-[#ff0055]">HP 體力:</span>
        <div class="flex-1 h-3.5 bg-black border border-gray-700 overflow-hidden p-0.5">
          <div 
            class="h-full transition-all duration-300"
            :class="gameStore.playerHp <= 30 ? 'bg-[#ff0055] animate-pulse' : 'bg-yellow-400'"
            :style="{ width: `${gameStore.playerHp}%` }"
          ></div>
        </div>
        <span class="font-mono font-black text-yellow-400">{{ gameStore.playerHp }}%</span>
      </div>

      <!-- 學分、得分與連擊 -->
      <div class="flex items-center gap-3 font-mono">
        <div class="flex items-center gap-1 text-yellow-400 font-black">
          <span>學分:</span>
          <span>{{ gameStore.credits }}</span>
        </div>
        <div class="flex items-center gap-1 text-cyan-400 font-black">
          <span>得分:</span>
          <span>{{ gameStore.score }}</span>
        </div>
        <div v-if="gameStore.comboCount > 1" class="text-[#ff0055] font-black animate-bounce-short">
          COMBO x{{ gameStore.comboCount }}
        </div>
      </div>

      <!-- 動態難度 Rank 指示 -->
      <div class="flex items-center gap-1 text-[11px] bg-gray-900/90 px-2 py-0.5 rounded border border-gray-700">
        <span class="text-gray-400">機台難度:</span>
        <span 
          class="font-black font-mono"
          :class="gameStore.rank >= 7 ? 'text-arcade-red animate-pulse' : gameStore.rank >= 4 ? 'text-arcade-yellow' : 'text-arcade-green'"
        >
          LV.{{ gameStore.rank }} ({{ getRankTitle(gameStore.rank) }})
        </span>
      </div>

      <!-- 切換肉鴿地圖按鈕 -->
      <button
        @click="$emit('switch-to-roguelike')"
        class="neo-btn neo-btn-yellow text-black text-xs py-1 px-3 neo-cut-sm tracking-wider"
      >
        [切換肉鴿地圖]
      </button>
    </div>

    <!-- 主持播音跑馬燈 -->
    <div class="bg-[#121620] border-2 border-black border-l-[6px] border-l-yellow-400 px-3 py-1.5 shadow-[3px_3px_0px_#000] flex items-center gap-2 text-xs neo-cut-sm">
      <span class="px-1.5 py-0.5 bg-yellow-400 text-black font-black text-[10px]">主持</span>
      <p class="text-yellow-300 font-bold tracking-wide truncate">
        {{ gameStore.hostComment }}
      </p>
    </div>

    <!-- 街機原創地圖外框 (雙軌分叉版 · 致敬 map1.jpg) -->
    <div class="w-full bg-[#090b10] border-[4px] border-black overflow-hidden shadow-[8px_8px_0px_#000] flex flex-col relative neo-cut">
      
      <!-- ================= 上半部：校舍背景與大頭娃娃骰子 ================= -->
      <div class="relative w-full h-44 sm:h-52 bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#bae6fd] overflow-hidden flex flex-col justify-between border-b-4 border-amber-800/80">
        <!-- 像素白雲飄動 -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div class="pixel-cloud cloud-1"></div>
          <div class="pixel-cloud cloud-2"></div>
          <div class="pixel-cloud cloud-3"></div>
        </div>

        <!-- 遠處像素綠林山脈 -->
        <div class="absolute bottom-12 left-0 right-0 h-14 flex items-end pointer-events-none opacity-90">
          <div class="w-full h-10 bg-[#15803d] rounded-t-full scale-y-125 transform translate-y-2"></div>
        </div>

        <!-- 三層樓高中校舍與中央高聳鐘樓 (致敬 map1.jpg) -->
        <div class="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <div class="w-11/12 max-w-3xl h-28 bg-[#f1f5f9] border-2 border-slate-700 shadow-md flex flex-col justify-between relative">
            <!-- 中央高聳鐘樓 -->
            <div class="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#e2e8f0] border-t-2 border-x-2 border-slate-700 flex flex-col items-center justify-center">
              <!-- 大時鐘 -->
              <div class="w-5 h-5 rounded-full bg-white border border-slate-800 flex items-center justify-center relative">
                <span class="w-1.5 h-0.5 bg-black absolute top-2 right-2"></span>
                <span class="w-0.5 h-1.5 bg-black absolute top-1 right-2.5"></span>
              </div>
            </div>

            <!-- 校舍屋頂欄杆 -->
            <div class="w-full h-2 bg-[#cbd5e1] border-b border-slate-400 flex justify-around">
              <span v-for="i in 20" :key="i" class="w-0.5 h-2 bg-slate-500"></span>
            </div>
            <!-- 三樓教室排窗 -->
            <div class="flex justify-around px-4">
              <div v-for="i in 8" :key="'w3-'+i" class="w-6 sm:w-8 h-4 bg-[#93c5fd] border border-slate-600"></div>
            </div>
            <!-- 二樓教室排窗 -->
            <div class="flex justify-around px-4">
              <div v-for="i in 8" :key="'w2-'+i" class="w-6 sm:w-8 h-4 bg-[#bfdbfe] border border-slate-600"></div>
            </div>
            <!-- 一樓教室排窗與大門 -->
            <div class="flex justify-around px-4 mb-0.5">
              <div v-for="i in 8" :key="'w1-'+i" class="w-6 sm:w-8 h-4 bg-[#bfdbfe] border border-slate-600"></div>
            </div>
          </div>
        </div>

        <!-- 校舍圍牆與校名名牌 (左側白底綠字「高中」) -->
        <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-[#94a3b8] via-[#cbd5e1] to-[#94a3b8] border-t-2 border-slate-600 flex items-center px-6">
          <div class="bg-[#f8fafc] border-2 border-slate-800 px-3 py-0.5 rounded shadow-pixel-sm flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 bg-emerald-600 rounded-sm inline-block"></span>
            <span class="text-xs sm:text-sm font-black text-emerald-800 tracking-wider">
              {{ gameStore.currentStageConfig.title }}
            </span>
          </div>
        </div>

        <!-- 中央大頭娃娃吉祥物與立體方塊骰子 -->
        <div class="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <div 
            class="relative transition-transform duration-150"
            :class="gameStore.isRollingDice ? 'animate-bounce-short scale-110' : ''"
          >
            <!-- 頭頂三根呆毛 -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-0.5">
              <span class="w-0.5 h-3 bg-black transform -rotate-12"></span>
              <span class="w-0.5 h-3.5 bg-black"></span>
              <span class="w-0.5 h-3 bg-black transform rotate-12"></span>
            </div>

            <!-- 光頭臉蛋 -->
            <div class="w-14 h-12 bg-[#ffedd5] border-2 border-black rounded-full flex flex-col items-center justify-center relative shadow-md">
              <div class="flex gap-3 mb-1">
                <div class="w-2.5 h-3 bg-black rounded-full relative flex items-start justify-end p-0.5">
                  <span class="w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div class="w-2.5 h-3 bg-black rounded-full relative flex items-start justify-end p-0.5">
                  <span class="w-1 h-1 bg-white rounded-full"></span>
                </div>
              </div>
              <div class="w-full flex justify-between px-1.5 absolute bottom-2.5">
                <span class="w-2 h-1.5 bg-rose-400 rounded-full opacity-80"></span>
                <span class="w-2 h-1.5 bg-rose-400 rounded-full opacity-80"></span>
              </div>
              <div class="w-2 h-1 border-b-2 border-black rounded-full"></div>
            </div>

            <!-- 趴在骰子上的小圓手 -->
            <div class="w-full flex justify-between px-1 absolute -bottom-1">
              <span class="w-3.5 h-3.5 bg-[#ffedd5] border border-black rounded-full"></span>
              <span class="w-3.5 h-3.5 bg-[#ffedd5] border border-black rounded-full"></span>
            </div>
          </div>

          <!-- 藍色立體骰子 -->
          <div 
            class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-[#2563eb] to-[#1e3a8a] border-2 border-slate-900 rounded-lg flex items-center justify-center shadow-pixel transition-transform duration-100"
            :class="gameStore.isRollingDice ? 'rotate-12 scale-105 ring-2 ring-yellow-300' : ''"
          >
            <span class="text-3xl sm:text-4xl font-black font-retro text-white drop-shadow-[0_2px_0_rgba(0,0,0,1)] select-none">
              {{ gameStore.diceValue }}
            </span>
          </div>
        </div>
      </div>

      <!-- ================= 下半部：粉紅/深藍幾何菱格雙軌分叉軌道 ================= -->
      <div class="relative w-full bg-[#be185d] py-6 px-3 overflow-hidden min-h-[260px] flex flex-col justify-center">
        <!-- 復古粉紅/深藍幾何菱格底圖與浮水印 (致敬 map1.jpg) -->
        <div class="absolute inset-0 bg-pink-grid pointer-events-none opacity-40"></div>
        <div class="absolute inset-0 flex items-center justify-around pointer-events-none opacity-15 select-none font-bold text-white text-lg tracking-widest transform -rotate-12">
          <span>民國教育委員會</span>
          <span>民國教育委員會</span>
          <span>民國教育委員會</span>
        </div>

        <!-- 雙軌分叉滾動容器 -->
        <div 
          ref="trackContainerRef"
          class="flex items-center gap-3 sm:gap-4 overflow-x-auto py-3 px-4 scroll-smooth scrollbar-retro relative z-10"
        >
          <!-- 1. 最左側：起點「昇學」大格 (雙排高度) -->
          <div 
            v-if="gameStore.mainStartTile"
            class="flex-shrink-0 flex flex-col items-center relative transition-transform"
            :class="gameStore.currentTileIndex === 0 ? 'scale-105 z-30' : 'opacity-90'"
          >
            <div 
              v-if="gameStore.currentTileIndex === 0" 
              class="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce-short z-40"
            >
              <div class="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full border border-white shadow-pixel-sm whitespace-nowrap">
                起點 🚶
              </div>
            </div>
            <!-- 起點大卡匣 -->
            <div 
              class="w-16 sm:w-20 h-28 sm:h-36 rounded-md border-2 border-slate-900 overflow-hidden shadow-lg flex items-center justify-center"
              :class="gameStore.currentTileIndex === 0 ? 'ring-2 ring-yellow-300' : ''"
            >
              <RetroTileIcon :tileIndex="0" type="RECOVERY" />
            </div>
            <div class="w-16 sm:w-20 h-4 bg-slate-950 border-x-2 border-b-2 border-black rounded-b-md shadow-pixel flex items-center justify-center">
              <span class="text-[9px] font-mono font-bold text-slate-400">起點</span>
            </div>
          </div>

          <!-- 2. 分叉點選擇格 (FORK) -->
          <div 
            v-if="gameStore.mainForkTile"
            @click="gameStore.activeModal = 'FORK_SELECT'"
            class="flex-shrink-0 flex flex-col items-center relative transition-transform cursor-pointer"
            :class="gameStore.currentTileIndex === 1 ? 'scale-105 z-30' : 'opacity-90'"
          >
            <div 
              v-if="gameStore.currentTileIndex === 1" 
              class="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce-short z-40"
            >
              <div class="bg-amber-400 text-black font-black text-[10px] px-2 py-0.5 rounded-full border border-black shadow-pixel-sm whitespace-nowrap animate-pulse">
                分叉選擇 🔀
              </div>
            </div>
            <div 
              class="w-16 sm:w-20 h-28 sm:h-36 rounded-md border-2 border-slate-900 overflow-hidden shadow-lg flex items-center justify-center"
              :class="gameStore.currentTileIndex === 1 ? 'ring-4 ring-yellow-300 shadow-arcade-yellow' : ''"
            >
              <RetroTileIcon :tileIndex="1" type="FORK" />
            </div>
            <div class="w-16 sm:w-20 h-4 bg-slate-950 border-x-2 border-b-2 border-black rounded-b-md shadow-pixel flex items-center justify-center">
              <span class="text-[9px] font-mono font-bold text-yellow-300">分叉點</span>
            </div>
          </div>

          <!-- 3. 中央雙軌分叉路線 (Upper Track 與 Lower Track 平行對齊) -->
          <div class="flex-shrink-0 flex flex-col gap-3 justify-center">
            
            <!-- 上排路線 (Upper Track: 理化、音樂、三選一、LUCKY、TROUBLE) -->
            <div class="flex items-center gap-2.5 sm:gap-3 p-1.5 rounded-xl border border-sky-400/30 bg-sky-950/30">
              <span class="text-[10px] font-black font-mono text-sky-300 uppercase px-1 [writing-mode:vertical-lr] rotate-180">
                上路線
              </span>
              <div 
                v-for="tile in gameStore.upperBranchTiles" 
                :key="tile.index"
                class="flex flex-col items-center relative transition-transform"
                :class="[
                  gameStore.currentTileIndex === tile.index 
                    ? 'scale-110 -translate-y-1 z-30' 
                    : 'opacity-85 hover:opacity-100'
                ]"
              >
                <!-- 角色在當前格頭頂 -->
                <div 
                  v-if="gameStore.currentTileIndex === tile.index" 
                  class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce-short z-40"
                >
                  <div class="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border border-white shadow-pixel-sm whitespace-nowrap">
                    你在此 🚶
                  </div>
                </div>

                <div 
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded border-2 border-slate-900 overflow-hidden shadow-md flex items-center justify-center"
                  :class="gameStore.currentTileIndex === tile.index ? 'ring-2 ring-yellow-300' : ''"
                >
                  <RetroTileIcon 
                    :tileIndex="tile.index" 
                    :type="tile.type" 
                    :subject="tile.subject" 
                  />
                </div>
                <div class="w-14 sm:w-16 h-3 bg-slate-950 border-x-2 border-b-2 border-black rounded-b shadow-pixel flex items-center justify-center">
                  <span class="text-[8px] font-mono text-slate-400">#{{ tile.stepNumber }}</span>
                </div>
              </div>
            </div>

            <!-- 下排路線 (Lower Track: 健康教育、美術、天才問題、問號、課外) -->
            <div class="flex items-center gap-2.5 sm:gap-3 p-1.5 rounded-xl border border-rose-400/30 bg-rose-950/30">
              <span class="text-[10px] font-black font-mono text-rose-300 uppercase px-1 [writing-mode:vertical-lr] rotate-180">
                下路線
              </span>
              <div 
                v-for="tile in gameStore.lowerBranchTiles" 
                :key="tile.index"
                class="flex flex-col items-center relative transition-transform"
                :class="[
                  gameStore.currentTileIndex === tile.index 
                    ? 'scale-110 -translate-y-1 z-30' 
                    : 'opacity-85 hover:opacity-100'
                ]"
              >
                <div 
                  v-if="gameStore.currentTileIndex === tile.index" 
                  class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce-short z-40"
                >
                  <div class="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border border-white shadow-pixel-sm whitespace-nowrap">
                    你在此 🚶
                  </div>
                </div>

                <div 
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded border-2 border-slate-900 overflow-hidden shadow-md flex items-center justify-center"
                  :class="gameStore.currentTileIndex === tile.index ? 'ring-2 ring-yellow-300' : ''"
                >
                  <RetroTileIcon 
                    :tileIndex="tile.index" 
                    :type="tile.type" 
                    :subject="tile.subject" 
                  />
                </div>
                <div class="w-14 sm:w-16 h-3 bg-slate-950 border-x-2 border-b-2 border-black rounded-b shadow-pixel flex items-center justify-center">
                  <span class="text-[8px] font-mono text-slate-400">#{{ tile.stepNumber }}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- 4. 最右側：匯流終點「升學大考 Boss 格」 -->
          <div 
            v-if="gameStore.mainExamTile"
            class="flex-shrink-0 flex flex-col items-center relative transition-transform"
            :class="gameStore.currentTileIndex === gameStore.mainExamTile.index ? 'scale-105 z-30' : 'opacity-90'"
          >
            <div 
              v-if="gameStore.currentTileIndex === gameStore.mainExamTile.index" 
              class="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce-short z-40"
            >
              <div class="bg-amber-300 text-black font-black text-[10px] px-2 py-0.5 rounded-full border border-black shadow-pixel-sm whitespace-nowrap">
                大考 Boss 🎓
              </div>
            </div>
            <div 
              class="w-16 sm:w-20 h-28 sm:h-36 rounded-md border-2 border-red-600 overflow-hidden shadow-arcade-red flex items-center justify-center"
              :class="gameStore.currentTileIndex === gameStore.mainExamTile.index ? 'ring-4 ring-yellow-300' : ''"
            >
              <RetroTileIcon 
                :tileIndex="gameStore.mainExamTile.index" 
                type="EXAM" 
              />
            </div>
            <div class="w-16 sm:w-20 h-4 bg-slate-950 border-x-2 border-b-2 border-black rounded-b-md shadow-pixel flex items-center justify-center">
              <span class="text-[9px] font-mono font-bold text-red-400">終點</span>
            </div>
          </div>
        </div>

        <!-- 左右陰影指示可滑動 -->
        <div class="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-rose-950 to-transparent pointer-events-none z-20"></div>
        <div class="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-rose-950 to-transparent pointer-events-none z-20"></div>
      </div>

      <!-- 底部街機狀態列 (CREDIT 1 與操作按鈕) -->
      <div class="w-full bg-arcade-dark border-t-2 border-slate-800 p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3 font-mono text-xs font-black">
          <span class="text-arcade-cyan tracking-widest text-sm drop-shadow">
            CREDIT {{ gameStore.coins }}
          </span>
          <span class="text-gray-400 text-[11px]">
            [1 COIN 1 PLAY]
          </span>
        </div>

        <!-- 道具快捷列 -->
        <div class="flex items-center gap-2 text-xs">
          <span class="text-gray-400 font-bold hidden sm:inline">🎒 道具:</span>
          <button 
            @click="gameStore.useItem('MAGNIFIER')"
            :disabled="(gameStore.inventory.MAGNIFIER || 0) <= 0"
            class="btn-arcade text-xs py-1 px-2 rounded bg-slate-800 disabled:opacity-40"
            title="50/50 剔除錯誤選項"
          >
            🔍 x{{ gameStore.inventory.MAGNIFIER || 0 }}
          </button>
          <button 
            @click="gameStore.useItem('CLOCK')"
            :disabled="(gameStore.inventory.CLOCK || 0) <= 0"
            class="btn-arcade text-xs py-1 px-2 rounded bg-slate-800 disabled:opacity-40"
            title="加 10 秒"
          >
            ⏰ x{{ gameStore.inventory.CLOCK || 0 }}
          </button>
          <button 
            @click="gameStore.useItem('PASS_TICKET')"
            :disabled="(gameStore.inventory.PASS_TICKET || 0) <= 0"
            class="btn-arcade text-xs py-1 px-2 rounded bg-slate-800 disabled:opacity-40"
            title="換題"
          >
            🎫 x{{ gameStore.inventory.PASS_TICKET || 0 }}
          </button>
          <button 
            @click="gameStore.useItem('YAKULT')"
            :disabled="(gameStore.inventory.YAKULT || 0) <= 0"
            class="btn-arcade text-xs py-1 px-2 rounded bg-slate-800 disabled:opacity-40"
            title="補血 +35"
          >
            🧃 x{{ gameStore.inventory.YAKULT || 0 }}
          </button>
        </div>

        <!-- 擲骰前進按鈕 (SPACE) -->
        <button 
          @click="gameStore.rollDice"
          :disabled="gameStore.isRollingDice || gameStore.activeModal !== 'NONE' || gameStore.playerHp <= 0"
          class="btn-arcade bg-gradient-to-r from-arcade-yellow to-orange-500 text-black font-black text-xs sm:text-sm py-2 px-5 rounded-lg disabled:opacity-40 flex items-center gap-1.5 shadow-arcade-yellow"
        >
          <span>🎲 擲骰前進</span>
          <span class="text-[10px] bg-black/20 px-1 py-0.5 rounded font-mono">SPACE</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file GameBoard.vue
 * @description 街機經典雙軌分叉地圖組件 (致敬 pic/map1.jpg)
 * 包含「離畢業還有 N 層次」頂部燈箱、三層校舍、大頭吉祥物骰子與上下分歧路線軌道
 */
import { onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import RetroTileIcon from './RetroTileIcon.vue';

const emit = defineEmits<{
  (e: 'switch-to-roguelike'): void;
}>();

const gameStore = useGameStore();

function getRankTitle(rankLV: number): string {
  if (rankLV <= 2) return '親民送分';
  if (rankLV <= 4) return '標準常識';
  if (rankLV <= 6) return '微辣刁鑽';
  if (rankLV <= 8) return '街機魔王';
  return '極限地獄';
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
/* 復古粉紅/深紅菱格紋背景 (致敬 map1.jpg 高中背景) */
.bg-pink-grid {
  background-image: 
    linear-gradient(45deg, rgba(157, 23, 77, 0.6) 25%, transparent 25%, transparent 75%, rgba(157, 23, 77, 0.6) 75%, rgba(157, 23, 77, 0.6)),
    linear-gradient(45deg, rgba(157, 23, 77, 0.6) 25%, transparent 25%, transparent 75%, rgba(157, 23, 77, 0.6) 75%, rgba(157, 23, 77, 0.6));
  background-size: 32px 32px;
  background-position: 0 0, 16px 16px;
}

.pixel-cloud {
  position: absolute;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 0 0 rgba(148, 163, 184, 0.6);
  opacity: 0.85;
}

.cloud-1 {
  width: 70px;
  height: 22px;
  top: 15px;
  left: 10%;
  animation: floatCloud 24s linear infinite;
}

.cloud-2 {
  width: 90px;
  height: 26px;
  top: 35px;
  left: 60%;
  animation: floatCloud 32s linear infinite reverse;
}

.cloud-3 {
  width: 55px;
  height: 18px;
  top: 55px;
  left: 35%;
  animation: floatCloud 20s linear infinite;
}

@keyframes floatCloud {
  0% { transform: translateX(-120px); }
  100% { transform: translateX(800px); }
}

.scrollbar-retro::-webkit-scrollbar {
  height: 8px;
}
.scrollbar-retro::-webkit-scrollbar-track {
  background: #500724;
}
.scrollbar-retro::-webkit-scrollbar-thumb {
  background: #db2777;
  border-radius: 4px;
}
.scrollbar-retro::-webkit-scrollbar-thumb:hover {
  background: #f472b6;
}
</style>
