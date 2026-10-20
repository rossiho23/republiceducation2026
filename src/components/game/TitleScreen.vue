<template>
  <!-- 現代極簡 SaaS 風格 首頁標題與模式選擇組件 (Linear / Vercel Hero & Mode Cards) -->
  <div class="flex flex-col items-center justify-center flex-1 py-8 px-4 text-center select-none">
    
    <!-- 頂部微膠囊標籤 (Linear 經典微光) -->
    <div class="mb-4">
      <span class="saas-pill saas-pill-indigo text-xs">
        ★ Spec-Driven Web Architecture · 2026 Edition
      </span>
    </div>

    <!-- 主視覺 Hero 大標題 (極簡無襯線緊湊大字) -->
    <div class="max-w-3xl mx-auto mb-3">
      <h1 class="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-100 leading-tight">
        民國教育委員會
      </h1>
      <p class="text-sm sm:text-base md:text-lg text-zinc-400 mt-4 leading-relaxed max-w-2xl mx-auto">
        將 1993 街機經典問答昇華為當代現代化知識測驗套件。支援輕度肉鴿樹狀選路、雙軌卡匣軌道與全自訂題庫。
      </p>
    </div>

    <!-- 模式選擇卡片 (Bento Grid 現代卡片 · 8px 倍數留白 · p-6 內距) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full my-8">
      
      <!-- 模式一：輕度肉鴿選路 (推薦主推模式) -->
      <div 
        @click="startRoguelike"
        class="saas-card saas-card-interactive p-6 sm:p-8 text-left flex flex-col justify-between group"
      >
        <div>
          <!-- 卡片頂部標籤 -->
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
            <span class="saas-pill saas-pill-indigo text-xs font-semibold">
              推薦首選
            </span>
            <span class="text-xs font-mono text-zinc-500">
              MODE 01
            </span>
          </div>

          <!-- 卡片標題 -->
          <h3 class="text-xl sm:text-2xl font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors tracking-tight">
            輕度肉鴿選路模式
          </h3>
          <div class="text-xs text-indigo-400/80 font-mono mt-1">
            Roguelike Branching Tree
          </div>

          <!-- 說明內文 -->
          <p class="text-sm text-zinc-400 mt-4 leading-relaxed">
            告別純擲骰運氣。自選樹狀分支路線，整合 8-Bit 懷舊聽力題、局部照片破案、信心下注、留級補考與稀有被動裝備。
          </p>
        </div>

        <!-- 底部前進按鈕 -->
        <div class="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-sm font-medium text-zinc-300 group-hover:text-indigo-400 transition-colors">
          <span>進入肉鴿冒險</span>
          <span class="text-base group-hover:translate-x-1 transition-transform">➔</span>
        </div>
      </div>

      <!-- 模式二：經典雙軌棋盤模式 -->
      <div 
        @click="startClassic"
        class="saas-card saas-card-interactive p-6 sm:p-8 text-left flex flex-col justify-between group"
      >
        <div>
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
            <span class="saas-pill text-xs font-mono text-zinc-400">
              經典復刻
            </span>
            <span class="text-xs font-mono text-zinc-500">
              MODE 02
            </span>
          </div>

          <h3 class="text-xl sm:text-2xl font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors tracking-tight">
            經典雙軌地圖模式
          </h3>
          <div class="text-xs text-zinc-400 font-mono mt-1">
            Dual-Track Cartridge Board
          </div>

          <p class="text-sm text-zinc-400 mt-4 leading-relaxed">
            重現 1993 橫向卷軸雙軌卡匣軌道。大頭吉祥物擲骰、三選一送分格、留級轉學命運、福利社商城與升學期末檢定考。
          </p>
        </div>

        <div class="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-sm font-medium text-zinc-300 group-hover:text-indigo-400 transition-colors">
          <span>開始擲骰闖關</span>
          <span class="text-base group-hover:translate-x-1 transition-transform">➔</span>
        </div>
      </div>

      <!-- 模式三：題庫與名師管理 CMS -->
      <div 
        @click="$emit('open-cms')"
        class="saas-card saas-card-interactive p-6 sm:p-8 text-left flex flex-col justify-between group"
      >
        <div>
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
            <span class="saas-pill text-xs font-mono text-zinc-400">
              資料庫管理
            </span>
            <span class="text-xs font-mono text-zinc-500">
              DATABASE
            </span>
          </div>

          <h3 class="text-xl sm:text-2xl font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors tracking-tight">
            題庫與名師後台
          </h3>
          <div class="text-xs text-zinc-400 font-mono mt-1">
            Excel / CSV / JSON CMS
          </div>

          <p class="text-sm text-zinc-400 mt-4 leading-relaxed">
            高度自訂化。支援 Excel/CSV 題庫批次匯入匯出、題目即時線上編輯、以及考官名師與主播台頭像彈性更換。
          </p>
        </div>

        <div class="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-sm font-medium text-zinc-300 group-hover:text-indigo-400 transition-colors">
          <span>開啟題庫管理</span>
          <span class="text-base group-hover:translate-x-1 transition-transform">➔</span>
        </div>
      </div>
    </div>

    <!-- 底部功能微標籤 (Subtle Badges) -->
    <div class="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-mono mt-2">
      <span class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        動態難度 RANK 0~10
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
        多態動態題型 (聽力 / 視覺 / 盲答)
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
        期末升學檢定 BOSS 戰
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file TitleScreen.vue
 * @description 現代極簡 SaaS 風格 首頁標題與模式選擇組件 (Linear / Vercel Modern Hero)
 * 提供極簡無襯線大標題、Bento Grid 模式卡片與乾淨典雅的選路入口。
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