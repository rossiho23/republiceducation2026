<template>
  <div class="flex flex-col items-center justify-center flex-1 py-8 px-4 text-center">
    <!-- 主視覺街機標題 -->
    <div class="relative mb-6">
      <div class="text-xs sm:text-sm font-mono tracking-widest text-arcade-cyan mb-2">
        ★ LAMAN / NAKANIHON 1993 · 2026 WEB REMAKE ★
      </div>
      <h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-arcade-yellow drop-shadow-[0_4px_10px_rgba(255,230,0,0.4)]">
        民國教育委員會
      </h1>
      <p class="text-sm sm:text-base text-gray-300 mt-2 font-bold tracking-wide">
        經典街機大富翁升學問答 · 自訂題庫復刻版
      </p>
    </div>

    <!-- 經典 INSERT COIN 閃爍標語 -->
    <div class="my-4">
      <span class="inline-block px-4 py-1.5 rounded-full bg-red-950/80 border-2 border-arcade-red text-arcade-red font-mono font-black text-sm tracking-widest animate-pulse shadow-arcade-red">
        ● 1 COIN 1 PLAY · 請選擇入學模式 ●
      </span>
    </div>

    <!-- 模式選擇卡片 (雙路線) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full my-6">
      <!-- 路線一：民國教育委員會 (學制闖關模式) -->
      <div 
        @click="startSchoolRoute"
        class="bg-arcade-panel hover:bg-slate-800 border-2 border-arcade-yellow rounded-2xl p-5 text-left cursor-pointer transition-all duration-200 hover:scale-105 shadow-pixel hover:shadow-arcade-yellow group flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-3xl">🎒</span>
            <span class="text-xs bg-arcade-yellow text-black font-black px-2 py-0.5 rounded">
              經典主線
            </span>
          </div>
          <h3 class="text-lg font-black text-white group-hover:text-arcade-yellow transition-colors">
            學制闖關模式 (民國教育委員會)
          </h3>
          <p class="text-xs text-gray-300 mt-2 leading-relaxed">
            由國小一年級啟程，擲骰探索大富翁棋盤，歷經期末升學大考、福利社補給、不良少年阻礙與動態 Rank 考驗，目標一路直奔大學光榮畢業！
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-arcade-yellow font-bold">
          <span>開始投幣入學</span>
          <span>➔</span>
        </div>
      </div>

      <!-- 路線二：題庫管理中心 (自行更新題庫) -->
      <div 
        @click="$emit('open-cms')"
        class="bg-arcade-panel hover:bg-slate-800 border-2 border-arcade-purple rounded-2xl p-5 text-left cursor-pointer transition-all duration-200 hover:scale-105 shadow-pixel hover:shadow-arcade-glow group flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-3xl">📚</span>
            <span class="text-xs bg-arcade-purple text-white font-black px-2 py-0.5 rounded">
              自訂系統
            </span>
          </div>
          <h3 class="text-lg font-black text-white group-hover:text-purple-300 transition-colors">
            自訂題庫管理中心 (CMS)
          </h3>
          <p class="text-xs text-gray-300 mt-2 leading-relaxed">
            自由擴充題目！支援 Excel (.xlsx) / CSV / JSON 檔案批次拖曳匯入、官方 Excel 範本下載、題庫一鍵匯出與線上題目增修。
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-purple-300 font-bold">
          <span>進入出題後台</span>
          <span>➔</span>
        </div>
      </div>
    </div>

    <!-- 遊戲特色摘要提示 -->
    <div class="max-w-xl text-center text-xs text-gray-400 font-mono mt-2 space-y-1">
      <div>✦ 內建在地化題庫：涵蓋歷史、地理、自然、體育、90 年代流行音樂歌手與台灣經典綜藝冷知識</div>
      <div>✦ 支援街機動態難度 (Rank 系統)、福利社道具（放大鏡/懷錶/Pass券/養樂多）與升學 Boss 連對考驗</div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file TitleScreen.vue
 * @description 街機標題畫面組件，支援學制闖關入口與自訂題庫後台入口
 */
import { useGameStore } from '../../stores/gameStore';

defineEmits<{
  (e: 'open-cms'): void;
}>();

const gameStore = useGameStore();

function startSchoolRoute(): void {
  gameStore.startNewGame('國小');
}
</script>
