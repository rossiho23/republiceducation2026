<template>
  <!-- 日系新潮街機風 標題畫面組件 (Neo-Arcade Title Screen) -->
  <div class="flex flex-col items-center justify-center flex-1 py-4 px-2 text-center font-mono select-none">
    
    <!-- 頂部日系街機系列副標題 -->
    <div class="inline-block bg-black border-2 border-yellow-400 px-3 py-1 mb-3 shadow-[3px_3px_0px_#ffe600] transform -rotate-1">
      <span class="text-xs font-black tracking-widest text-yellow-400">
        // TAIWAN ARCADE 1993 · NEO WEB REMAKE 2026 //
      </span>
    </div>

    <!-- 主視覺粗黑大字報標題 (Persona 5 式斜體立體字) -->
    <div class="relative my-2">
      <h1 class="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-yellow-400 neo-skew-title neo-text-stroke leading-none">
        民國教育委員會
      </h1>
      <!-- 疊層裝飾副標 -->
      <div class="mt-2 text-xs sm:text-sm font-black tracking-widest text-white uppercase bg-[#ff0055] inline-block px-3 py-1 border-2 border-black shadow-[4px_4px_0px_#000] transform rotate-1">
        CLASSIC ARCADE × SLAY THE SPIRE ROGUELIKE
      </div>
    </div>

    <!-- 投幣警示條 (黑黃警戒斑馬條紋 · 尺寸放大) -->
    <div class="my-4 w-full max-w-xl neo-hazard-yellow p-1 neo-cut-sm border-2 border-black shadow-[4px_4px_0px_#000]">
      <div class="bg-black py-2 px-5 text-center">
        <span class="text-yellow-400 font-black text-sm sm:text-base tracking-widest animate-pulse">
          ▶ 1 COIN 1 PLAY · 請選擇入學推進模式 ◀
        </span>
      </div>
    </div>

    <!-- 關卡長度自選模式 (10 關 / 20 關 / 30 關 / 40 關 四段全自選) -->
    <div class="my-3 w-full max-w-4xl bg-[#121620] border-2 border-yellow-400 p-3.5 neo-cut-sm shadow-[5px_5px_0px_#000]">
      <div class="flex flex-wrap items-center justify-between mb-3 pb-2 border-b border-gray-800 text-left gap-2">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 bg-yellow-400 text-black text-xs font-black uppercase">
            LENGTH SELECT
          </span>
          <span class="text-xs sm:text-sm font-bold text-gray-200">
            請選擇關卡長度模式 (10 / 20 / 30 / 40 關)
          </span>
        </div>
        <span class="text-xs sm:text-sm text-yellow-400 font-mono font-black">
          當前：{{ currentLengthLabel }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- 10 關挑戰賽按鈕 -->
        <button
          type="button"
          @click="selectGameLength(10)"
          class="p-3 border-2 transition-all neo-cut-sm text-left flex flex-col justify-between cursor-pointer"
          :class="gameStore.gameLength === 10 
            ? 'bg-emerald-400 text-black border-black shadow-[4px_4px_0px_#000] scale-[1.02]' 
            : 'bg-[#0a0d14] text-gray-300 border-gray-700 hover:border-emerald-400 hover:text-white'"
        >
          <div class="flex items-center justify-between gap-1">
            <span class="text-sm sm:text-base font-black neo-skew-title flex items-center gap-1">
              ⚡ 十關挑戰賽
            </span>
            <span 
              class="text-[10px] font-bold px-1.5 py-0.5 border whitespace-nowrap"
              :class="gameStore.gameLength === 10 ? 'bg-black text-emerald-400 border-black' : 'bg-gray-800 text-gray-400 border-gray-700'"
            >
              10 關標準
            </span>
          </div>
          <p class="text-xs mt-2 leading-relaxed opacity-90">
            10 步輕快闖關！約 8~10 分鐘，快速體驗隨堂考、福利社與升學 Boss 戰！
          </p>
        </button>

        <!-- 20 關長征賽按鈕 -->
        <button
          type="button"
          @click="selectGameLength(20)"
          class="p-3 border-2 transition-all neo-cut-sm text-left flex flex-col justify-between cursor-pointer"
          :class="gameStore.gameLength === 20 
            ? 'bg-amber-400 text-black border-black shadow-[4px_4px_0px_#000] scale-[1.02]' 
            : 'bg-[#0a0d14] text-gray-300 border-gray-700 hover:border-amber-400 hover:text-white'"
        >
          <div class="flex items-center justify-between gap-1">
            <span class="text-sm sm:text-base font-black neo-skew-title flex items-center gap-1">
              🔥 二十關長征賽
            </span>
            <span 
              class="text-[10px] font-bold px-1.5 py-0.5 border whitespace-nowrap"
              :class="gameStore.gameLength === 20 ? 'bg-black text-amber-400 border-black' : 'bg-gray-800 text-gray-400 border-gray-700'"
            >
              20 關進階
            </span>
          </div>
          <p class="text-xs mt-2 leading-relaxed opacity-90">
            20 步中長程挑戰！約 15~20 分鐘，涵蓋聽力/局部謎題與奧賽菁英考！
          </p>
        </button>

        <!-- 30 關大考驗按鈕 -->
        <button
          type="button"
          @click="selectGameLength(30)"
          class="p-3 border-2 transition-all neo-cut-sm text-left flex flex-col justify-between cursor-pointer"
          :class="gameStore.gameLength === 30 
            ? 'bg-yellow-400 text-black border-black shadow-[4px_4px_0px_#000] scale-[1.02]' 
            : 'bg-[#0a0d14] text-gray-300 border-gray-700 hover:border-yellow-400 hover:text-white'"
        >
          <div class="flex items-center justify-between gap-1">
            <span class="text-sm sm:text-base font-black neo-skew-title flex items-center gap-1">
              🏆 三十關大考驗
            </span>
            <span 
              class="text-[10px] font-bold px-1.5 py-0.5 border whitespace-nowrap"
              :class="gameStore.gameLength === 30 ? 'bg-black text-yellow-400 border-black' : 'bg-gray-800 text-gray-400 border-gray-700'"
            >
              30 關深度
            </span>
          </div>
          <p class="text-xs mt-2 leading-relaxed opacity-90">
            30 步深度長征！約 20~30 分鐘，完整體驗晨昏日夜流轉與多次補給博弈！
          </p>
        </button>

        <!-- 40 關終極馬拉松按鈕 -->
        <button
          type="button"
          @click="selectGameLength(40)"
          class="p-3 border-2 transition-all neo-cut-sm text-left flex flex-col justify-between cursor-pointer"
          :class="gameStore.gameLength === 40 
            ? 'bg-cyan-400 text-black border-black shadow-[4px_4px_0px_#000] scale-[1.02]' 
            : 'bg-[#0a0d14] text-gray-300 border-gray-700 hover:border-cyan-400 hover:text-white'"
        >
          <div class="flex items-center justify-between gap-1">
            <span class="text-sm sm:text-base font-black neo-skew-title flex items-center gap-1">
              👑 四十關馬拉松
            </span>
            <span 
              class="text-[10px] font-bold px-1.5 py-0.5 border whitespace-nowrap"
              :class="gameStore.gameLength === 40 ? 'bg-black text-cyan-400 border-black' : 'bg-gray-800 text-gray-400 border-gray-700'"
            >
              40 關極限
            </span>
          </div>
          <p class="text-xs mt-2 leading-relaxed opacity-90">
            40 步終極馬拉松！約 30~40 分鐘，從清晨升旗奮戰至深夜夜讀之最高榮譽檢定！
          </p>
        </button>
      </div>
    </div>

    <!-- 介面視覺風格選擇 (現代旗艦版 vs 1993 街機版) -->
    <div class="my-3 w-full max-w-2xl bg-[#14050b] border-2 border-rose-500 p-3.5 neo-cut-sm shadow-[5px_5px_0px_#000]">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-rose-950 text-left">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 bg-rose-500 text-white text-xs font-black uppercase">
            VISUAL THEME
          </span>
          <span class="text-xs sm:text-sm font-bold text-gray-200">
            請選擇雙軌地圖視覺風格
          </span>
        </div>
        <span class="text-xs sm:text-sm text-rose-300 font-mono font-black">
          當前：{{ gameStore.visualTheme === 'MODERN_LUXURY' ? '🎨 現代旗艦版 (擬真酒紅金屬)' : '👾 1993 復古街機版 (8-Bit 像素懷舊)' }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <!-- 現代旗艦版按鈕 -->
        <button
          type="button"
          @click="selectVisualTheme('MODERN_LUXURY')"
          class="p-3.5 border-2 transition-all neo-cut-sm text-left flex flex-col justify-between cursor-pointer"
          :class="gameStore.visualTheme === 'MODERN_LUXURY' 
            ? 'bg-gradient-to-r from-[#9f1239] to-[#be123c] text-white border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-[1.02]' 
            : 'bg-[#1a050f] text-gray-300 border-rose-950 hover:border-rose-400 hover:text-white'"
        >
          <div class="flex items-center justify-between">
            <span class="text-base sm:text-lg font-black neo-skew-title flex items-center gap-1.5 text-amber-200">
              🎨 現代旗艦版
            </span>
            <span 
              class="text-[11px] font-bold px-2 py-0.5 border rounded"
              :class="gameStore.visualTheme === 'MODERN_LUXURY' ? 'bg-amber-400 text-black border-amber-400' : 'bg-black text-rose-300 border-rose-900'"
            >
              2026 擬真酒紅
            </span>
          </div>
          <p class="text-xs mt-2 leading-relaxed opacity-90 text-rose-100">
            奢華暗酒紅金屬卡匣質感！高清國小/國中/高中/大學實景舞台校舍與立體金屬升學門！
          </p>
        </button>

        <!-- 1993 復古街機版按鈕 -->
        <button
          type="button"
          @click="selectVisualTheme('RETRO_ARCADE')"
          class="p-3.5 border-2 transition-all neo-cut-sm text-left flex flex-col justify-between cursor-pointer"
          :class="gameStore.visualTheme === 'RETRO_ARCADE' 
            ? 'bg-yellow-400 text-black border-black shadow-[4px_4px_0px_#000] scale-[1.02]' 
            : 'bg-[#0a0d14] text-gray-300 border-gray-700 hover:border-yellow-400 hover:text-white'"
        >
          <div class="flex items-center justify-between">
            <span class="text-base sm:text-lg font-black neo-skew-title flex items-center gap-1.5">
              👾 1993 復古街機版
            </span>
            <span 
              class="text-[11px] font-bold px-2 py-0.5 border"
              :class="gameStore.visualTheme === 'RETRO_ARCADE' ? 'bg-black text-yellow-400 border-black' : 'bg-gray-800 text-gray-400 border-gray-700'"
            >
              16-Bit 像素原味
            </span>
          </div>
          <p class="text-xs mt-2 leading-relaxed opacity-90">
            還原 1993 大型機台卡匣軌道！像素黑板校舍、晨昏光影漸層與日系大頭吉祥物骰子！
          </p>
        </button>
      </div>
    </div>



    <!-- 模式選擇卡片 (三張日系戰術斜切卡片 · 寬屏加大版) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full my-4">
      
      <!-- 模式一：輕度肉鴿選路 (現代主推) -->
      <div 
        @click="startRoguelike"
        class="bg-[#0c0f17] border-[3px] border-yellow-400 p-6 text-left cursor-pointer neo-cut shadow-[6px_6px_0px_#ffe600] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#ffe600] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#ffe600] transition-all flex flex-col justify-between group relative overflow-hidden"
      >
        <!-- 背景裝飾暗紋 -->
        <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-yellow-400/10 rounded-full pointer-events-none"></div>

        <div>
          <!-- 卡片頂部標籤 -->
          <div class="flex items-center justify-between mb-3 border-b-2 border-yellow-400/40 pb-2.5">
            <span class="px-2.5 py-1 bg-yellow-400 text-black text-xs font-black uppercase tracking-wider">
              [RECOMMENDED]
            </span>
            <span class="text-sm font-mono font-bold text-yellow-300">
              MODE 01
            </span>
          </div>

          <!-- 卡片標題 -->
          <h3 class="text-xl sm:text-2xl font-black text-white group-hover:text-yellow-400 transition-colors neo-skew-title">
            輕度肉鴿選路模式
          </h3>
          <div class="text-xs sm:text-sm font-bold text-yellow-400/90 tracking-wide mt-1">
            // SLAY THE SPIRE ARCHITECTURE //
          </div>

          <!-- 說明內文 -->
          <p class="text-xs sm:text-sm text-gray-200 mt-3 leading-relaxed">
            告別純擲骰運氣！自選透明分支路線。整合 <strong>8-bit 聽力猜歌、局部照片破案、信心下注、留級期中補考與稀有被動裝備</strong>！
          </p>
        </div>

        <!-- 底部前進按鈕標示 -->
        <div class="mt-6 pt-3.5 border-t-2 border-dashed border-gray-800 flex items-center justify-between text-sm sm:text-base font-black text-yellow-400">
          <span>開啟肉鴿冒險</span>
          <span class="text-lg group-hover:translate-x-1.5 transition-transform">➔</span>
        </div>
      </div>

      <!-- 模式二：經典街機大富翁雙軌模式 -->
      <div 
        @click="startClassic"
        class="bg-[#0c0f17] border-[3px] border-cyan-400 p-6 text-left cursor-pointer neo-cut shadow-[6px_6px_0px_#00f0ff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#00f0ff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#00f0ff] transition-all flex flex-col justify-between group relative overflow-hidden"
      >
        <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-cyan-400/10 rounded-full pointer-events-none"></div>

        <div>
          <div class="flex items-center justify-between mb-3 border-b-2 border-cyan-400/40 pb-2.5">
            <span class="px-2.5 py-1 bg-cyan-400 text-black text-xs font-black uppercase tracking-wider">
              [AUTHENTIC 1993]
            </span>
            <span class="text-sm font-mono font-bold text-cyan-300">
              MODE 02
            </span>
          </div>

          <h3 class="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-400 transition-colors neo-skew-title">
            經典街機雙軌模式
          </h3>
          <div class="text-xs sm:text-sm font-bold text-cyan-400/90 tracking-wide mt-1">
            // DUAL-TRACK CARTRIDGE BOARD //
          </div>

          <p class="text-xs sm:text-sm text-gray-200 mt-3 leading-relaxed">
            重現 1993 大型電玩橫向卷軸雙軌卡匣軌道！大頭吉祥物骰子、三選一送分格、TROUBLE 骷髏災難與升學 Boss 戰！
          </p>
        </div>

        <div class="mt-6 pt-3.5 border-t-2 border-dashed border-gray-800 flex items-center justify-between text-sm sm:text-base font-black text-cyan-400">
          <span>投幣開始擲骰</span>
          <span class="text-lg group-hover:translate-x-1.5 transition-transform">➔</span>
        </div>
      </div>

      <!-- 模式三：題庫與人物 CMS 管理後台 -->
      <div 
        @click="$emit('open-cms')"
        class="bg-[#0c0f17] border-[3px] border-[#bd00ff] p-6 text-left cursor-pointer neo-cut shadow-[6px_6px_0px_#bd00ff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#bd00ff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#bd00ff] transition-all flex flex-col justify-between group relative overflow-hidden"
      >
        <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-[#bd00ff]/10 rounded-full pointer-events-none"></div>

        <div>
          <div class="flex items-center justify-between mb-3 border-b-2 border-purple-400/40 pb-2.5">
            <span class="px-2.5 py-1 bg-[#bd00ff] text-white text-xs font-black uppercase tracking-wider">
              [ADMIN CMS 🔒]
            </span>
            <span class="text-sm font-mono font-bold text-purple-300">
              PASSWORD GATE
            </span>
          </div>

          <h3 class="text-xl sm:text-2xl font-black text-white group-hover:text-purple-300 transition-colors neo-skew-title">
            題庫與名師管制中心
          </h3>
          <div class="text-xs sm:text-sm font-bold text-purple-400/90 tracking-wide mt-1">
            // ADMIN AUTH · EXCEL / CSV / JSON //
          </div>

          <p class="text-xs sm:text-sm text-gray-200 mt-3 leading-relaxed">
            教務處專屬管制後台（需密碼驗證登入）！支援 Excel/CSV/JSON 題庫批次匯入匯出、線上編輯與名師主播相片更換。
          </p>
        </div>

        <div class="mt-6 pt-3.5 border-t-2 border-dashed border-gray-800 flex items-center justify-between text-sm sm:text-base font-black text-purple-300">
          <span>🔒 管理員驗證進入</span>
          <span class="text-lg group-hover:translate-x-1.5 transition-transform">➔</span>
        </div>
      </div>
    </div>

    <!-- 底部硬核數值特色說明條 -->
    <div class="mt-4 px-4 py-2 bg-black border-2 border-gray-800 text-[11px] text-gray-400 flex flex-wrap items-center justify-center gap-4 neo-cut-sm">
      <span>★ 街機動態難度 RANK 0~10 機制</span>
      <span>★ 福利社道具背包 (放大鏡/懷錶/Pass券/養樂多)</span>
      <span>★ 期末升學 BOSS 檢定考 & 9秒投幣續關</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file TitleScreen.vue
 * @description 日系新潮街機風 標題畫面組件 (Neo-Arcade Title Screen)
 * 提供日系大字報斜體排版、Persona 5 風格戰術斜切卡片、五關/十關長度自選與乾淨去 AI 化的選路入口。
 */
import { computed } from 'vue';
import { useGameStore } from '../../stores/gameStore';
import { GameLengthMode, VisualTheme } from '../../types/quiz';
import { soundEngine } from '../../utils/audioEngine';

const emit = defineEmits<{
  (e: 'open-cms'): void;
  (e: 'start-roguelike'): void;
  (e: 'start-classic'): void;
}>();

const gameStore = useGameStore();

/**
 * 取得當前關卡長度模式之顯示名稱
 */
const currentLengthLabel = computed<string>(() => {
  switch (gameStore.gameLength) {
    case 10:
      return '⚡ 十關挑戰賽 (10 關標準)';
    case 20:
      return '🔥 二十關長征賽 (20 關進階)';
    case 30:
      return '🏆 三十關大考驗 (30 關深度)';
    case 40:
      return '👑 四十關終極馬拉松 (40 關極限)';
    default:
      return '⚡ 十關挑戰賽 (10 關標準)';
  }
});

/**
 * 切換雙軌地圖視覺風格主題 (現代旗艦版 ⇄ 1993 街機版)
 * @param {VisualTheme} theme 視覺風格
 * @returns {void}
 */
function selectVisualTheme(theme: VisualTheme): void {
  gameStore.setVisualTheme(theme);
}


/**
 * 切換關卡長度模式 (10 / 20 / 30 / 40 關)
 * @param {GameLengthMode} length 模式步數 (10 | 20 | 30 | 40)
 * @returns {void}
 */
function selectGameLength(length: GameLengthMode): void {
  gameStore.setGameLength(length);
}

function startRoguelike(): void {
  soundEngine.playCoin();
  emit('start-roguelike');
}

function startClassic(): void {
  soundEngine.playCoin();
  emit('start-classic');
}
</script>