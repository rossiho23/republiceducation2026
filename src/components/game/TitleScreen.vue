<template>
  <div class="flex flex-col items-center justify-center flex-1 py-6 px-4 text-center font-mono">
    <!-- 主視覺街機標題 -->
    <div class="relative mb-4">
      <div class="text-xs sm:text-sm font-mono tracking-widest text-arcade-cyan mb-2">
        ★ LAMAN / NAKANIHON 1993 · 2026 WEB REMAKE ★
      </div>
      <h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-arcade-yellow drop-shadow-[0_4px_10px_rgba(255,230,0,0.4)]">
        民國教育委員會 2026
      </h1>
      <p class="text-sm sm:text-base text-gray-300 mt-2 font-bold tracking-wide">
        經典街機大富翁 × 現代輕度肉鴿選路 · 自訂題庫復刻版
      </p>
    </div>

    <!-- 經典 INSERT COIN 閃爍標語 -->
    <div class="my-3">
      <span class="inline-block px-4 py-1.5 rounded-full bg-red-950/80 border-2 border-arcade-red text-arcade-red font-mono font-black text-sm tracking-widest animate-pulse shadow-arcade-red">
        ● 1 COIN 1 PLAY · 請選擇入學模式 ●
      </span>
    </div>

    <!-- 模式選擇卡片 (三張卡片：肉鴿、經典、CMS) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full my-4">
      <!-- 模式一：輕度肉鴿選路 (推薦) -->
      <div 
        @click="startRoguelike"
        class="bg-gradient-to-b from-indigo-950 to-slate-900 hover:from-indigo-900 hover:to-slate-800 border-2 border-amber-400 rounded-2xl p-4 text-left cursor-pointer transition-all duration-200 hover:scale-105 shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_25px_rgba(250,204,21,0.6)] group flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-3xl">🌲</span>
            <span class="text-[11px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded shadow">
              🔥 現代推薦
            </span>
          </div>
          <h3 class="text-base font-black text-yellow-300 group-hover:text-amber-200 transition-colors">
            輕度肉鴿選路模式 (Slay the Spire)
          </h3>
          <p class="text-xs text-gray-300 mt-2 leading-relaxed">
            告別純擲骰！自主挑選前進節點，結合 <strong>8-bit 聽力猜歌、局部照片解謎、答題前即時下注、期中留級補考與稀有被動聖物裝備</strong>！
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-indigo-700/60 flex items-center justify-between text-xs text-amber-300 font-bold">
          <span>開啟肉鴿冒險</span>
          <span>➔</span>
        </div>
      </div>

      <!-- 模式二：經典街機大富翁雙軌模式 -->
      <div 
        @click="startClassic"
        class="bg-arcade-panel hover:bg-slate-800 border-2 border-arcade-yellow rounded-2xl p-4 text-left cursor-pointer transition-all duration-200 hover:scale-105 shadow-pixel hover:shadow-arcade-yellow group flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-3xl">🎲</span>
            <span class="text-[11px] bg-arcade-yellow text-black font-black px-2 py-0.5 rounded">
              原版雙軌
            </span>
          </div>
          <h3 class="text-base font-black text-white group-hover:text-arcade-yellow transition-colors">
            經典街機大富翁模式
          </h3>
          <p class="text-xs text-gray-300 mt-2 leading-relaxed">
            重現 1993 年大型電玩橫向卷軸雙軌卡匣軌道！大頭娃娃吉祥物骰子、三選一送分、TROUBLE 骷髏災難與期末升學 Boss 戰！
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-arcade-yellow font-bold">
          <span>投幣開始擲骰</span>
          <span>➔</span>
        </div>
      </div>

      <!-- 模式三：題庫與人物管理中心 (CMS) -->
      <div 
        @click="$emit('open-cms')"
        class="bg-arcade-panel hover:bg-slate-800 border-2 border-arcade-purple rounded-2xl p-4 text-left cursor-pointer transition-all duration-200 hover:scale-105 shadow-pixel hover:shadow-arcade-glow group flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-3xl">📚</span>
            <span class="text-[11px] bg-arcade-purple text-white font-black px-2 py-0.5 rounded">
              出題中心
            </span>
          </div>
          <h3 class="text-base font-black text-white group-hover:text-purple-300 transition-colors">
            題庫與名師主播 CMS
          </h3>
          <p class="text-xs text-gray-300 mt-2 leading-relaxed">
            自由自訂！支援 Excel/CSV/JSON 題庫批次拖曳匯入匯出、自訂執教名師、以及雙主播名人相片自由更換與試播。
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-purple-300 font-bold">
          <span>進入管理後台</span>
          <span>➔</span>
        </div>
      </div>
    </div>

    <!-- 遊戲特色摘要提示 -->
    <div class="max-w-2xl text-center text-xs text-gray-400 font-mono mt-2 space-y-1">
      <div>✦ 涵蓋台灣歷史、地理、自然科學、體育、90 年代華語流行歌曲與經典廣告台詞冷知識</div>
      <div>✦ 支援街機動態難度 (Rank 0~10)、福利社道具背包、期末升學檢定考與 9 秒投幣續關</div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file TitleScreen.vue
 * @description 遊戲開場標題與模式選擇組件
 * 提供：輕度 Roguelike 樹狀選路模式、經典街機大富翁雙軌模式與題庫 CMS 入口。
 */

import { soundEngine } from '../../utils/audioEngine';

const emit = defineEmits<{
  (e: 'open-cms'): void;
  (e: 'start-roguelike'): void;
  (e: 'start-classic'): void;
}>();

function startRoguelike(): void {
  soundEngine.playCoin();
  emit('start-roguelike');
}

function startClassic(): void {
  soundEngine.playCoin();
  emit('start-classic');
}
</script>
