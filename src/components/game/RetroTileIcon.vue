<template>
  <div class="w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none font-bold p-0.5">
    <!-- 1. 起點「昇學」大格 (致敬 map1.jpg 最左側大格) -->
    <div v-if="tileIndex === 0" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#b91c1c] border-2 border-yellow-300 shadow-inner">
      <img :src="PIXEL_ICON_START" alt="昇學起點" class="w-7 h-7 object-contain select-none" />
      <span class="text-[9px] font-black text-yellow-300 drop-shadow-[0_1px_0_#000] tracking-wider mt-0.5">
        昇學
      </span>
    </div>

    <!-- 2. 分叉選擇點 (FORK 雙向箭頭與街機斜紋) -->
    <div v-else-if="type === 'FORK'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-gradient-to-br from-blue-700 via-purple-700 to-red-600 text-white relative">
      <div class="flex items-center gap-1 my-0.5">
        <span class="text-xs animate-bounce-short">⬆️</span>
        <span class="text-xs animate-bounce-short">⬇️</span>
      </div>
      <span class="text-[8px] font-black text-yellow-300 drop-shadow-[0_1px_0_#000] uppercase">
        路線分叉
      </span>
    </div>

    <!-- 3. 三選一格 (THREE_CHOICE 藍底金字，100% 致敬 map1.jpg 上路) -->
    <div v-else-if="type === 'THREE_CHOICE'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#1e40af] border-2 border-yellow-300 shadow-md">
      <img :src="PIXEL_ICON_THREE_CHOICE" alt="三選一" class="w-7 h-7 object-contain select-none" />
      <span class="text-[8px] font-black text-yellow-300 mt-0.5 tracking-wider">
        三選一
      </span>
    </div>

    <!-- 4. TROUBLE 骷髏危險格 (黑底骷髏頭骨，100% 致敬 map1.jpg 上路) -->
    <div v-else-if="type === 'TROUBLE'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-black border-2 border-amber-500 shadow-md">
      <img :src="PIXEL_ICON_TROUBLE" alt="TROUBLE" class="w-7 h-7 object-contain select-none animate-pulse" />
      <span class="text-[8px] font-black text-amber-400 mt-0.5 tracking-wider">
        TROUBLE
      </span>
    </div>

    <!-- 5. 天才問題格 (TALENT 紅底白字大框，100% 致敬 map1.jpg 下路) -->
    <div v-else-if="type === 'TALENT'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#991b1b] border-2 border-yellow-300 shadow-md">
      <img :src="PIXEL_ICON_TALENT" alt="天才問題" class="w-7 h-7 object-contain select-none" />
      <span class="text-[8px] font-black text-white mt-0.5 tracking-wider">
        天才問題
      </span>
    </div>

    <!-- 6. 健康教育格 (HEALTH 黑影發光紅心，100% 致敬 map1.jpg 下路) -->
    <div v-else-if="type === 'HEALTH' || (type === 'QUIZ' && subject === '健康教育')" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#1e3a8a] border-2 border-red-500 shadow-md">
      <img :src="PIXEL_ICON_HEALTH" alt="健康教育" class="w-7 h-7 object-contain select-none animate-pulse" />
      <span class="text-[8px] font-black text-white mt-0.5 tracking-wider">
        健康教育
      </span>
    </div>

    <!-- 7. 美術格 (調色盤水彩筆，100% 16-Bit 手繪像素) -->
    <div v-else-if="subject === '美術' || (type === 'QUIZ' && subject === '藝能')" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#c2410c] border border-black shadow">
      <img :src="PIXEL_ICON_ART" alt="美術" class="w-7 h-7 object-contain select-none" />
      <span class="text-[8px] font-black text-white mt-0.5">美術</span>
    </div>

    <!-- 8. 音樂格 (五線譜金色音符，100% 16-Bit 手繪像素) -->
    <div v-else-if="subject === '流行音樂'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#0f172a] border border-yellow-400/80 shadow">
      <img :src="PIXEL_ICON_MUSIC" alt="音樂" class="w-7 h-7 object-contain select-none" />
      <span class="text-[8px] font-black text-yellow-300 mt-0.5">音樂</span>
    </div>

    <!-- 9. 國文格 (線裝書毛筆，100% 16-Bit 手繪像素) -->
    <div v-else-if="type === 'QUIZ' && subject === '國文'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#92400e] border border-black shadow">
      <img :src="PIXEL_ICON_CHINESE" alt="國文" class="w-7 h-7 object-contain select-none" />
      <span class="text-[8px] font-black text-amber-200 mt-0.5">國文</span>
    </div>

    <!-- 10. 自然/理化格 (燒瓶藥水，100% 16-Bit 手繪像素) -->
    <div v-else-if="type === 'QUIZ' && subject === '自然'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#4d7c0f] border border-black shadow">
      <img :src="PIXEL_ICON_SCIENCE" alt="自然" class="w-7 h-7 object-contain select-none" />
      <span class="text-[8px] font-black text-lime-100 mt-0.5">自然</span>
    </div>

    <!-- 11. 數學格 (三角板圓規，100% 16-Bit 手繪像素) -->
    <div v-else-if="type === 'QUIZ' && subject === '數學'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#065f46] border border-black shadow">
      <img :src="PIXEL_ICON_MATH" alt="數學" class="w-7 h-7 object-contain select-none" />
      <span class="text-[8px] font-black text-emerald-100 mt-0.5">數學</span>
    </div>

    <!-- 12. 社會/地理格 (地球儀經緯，100% 16-Bit 手繪像素) -->
    <div v-else-if="type === 'QUIZ' && subject === '社會'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#0369a1] border border-black shadow">
      <img :src="PIXEL_ICON_GEOGRAPHY" alt="社會地理" class="w-7 h-7 object-contain select-none" />
      <span class="text-[8px] font-black text-sky-100 mt-0.5">社會</span>
    </div>

    <!-- 13. 課外常識格 (藍底白字，致敬 map1.jpg 下路) -->
    <div v-else-if="type === 'EXTRACURRICULAR' || subject === '課外'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#0284c7] border-2 border-white/80 shadow-md">
      <span class="text-xs font-black text-white drop-shadow-[0_1px_0_#000] tracking-widest">
        課外
      </span>
      <span class="text-[7px] text-amber-200 mt-0.5">時事常識</span>
    </div>

    <!-- 14. 幸運福利社格 (LUCKY 養樂多菠蘿麵包，100% 16-Bit 手繪像素) -->
    <div v-else-if="type === 'CANTEEN'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#d97706] border-2 border-yellow-300 shadow-md">
      <img :src="PIXEL_ICON_CANTEEN" alt="福利社" class="w-7 h-7 object-contain select-none animate-bounce-short" />
      <span class="text-[8px] font-black text-yellow-200 mt-0.5">福利社</span>
    </div>

    <!-- 15. 事件/命運格 (問號方塊) -->
    <div v-else-if="type === 'EVENT' || type === 'FATE'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#334155] border border-slate-400 shadow">
      <span class="text-xl font-black font-mono text-yellow-300 drop-shadow-[0_2px_0_#000]">?</span>
      <span class="text-[8px] font-black text-slate-200 mt-0.5 uppercase">
        {{ type === 'EVENT' ? '事件' : '命運' }}
      </span>
    </div>

    <!-- 16. 升學大考 BOSS 終點格 (博士帽，100% 16-Bit 手繪像素) -->
    <div v-else-if="type === 'EXAM'" class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#881337] border-2 border-amber-400 shadow-md">
      <img :src="PIXEL_ICON_EXAM_BOSS" alt="升學大考" class="w-7 h-7 object-contain select-none animate-pulse" />
      <span class="text-[8px] font-black text-amber-300 uppercase mt-0.5">
        升學大考
      </span>
    </div>

    <!-- 17. 預設其他測驗 -->
    <div v-else class="w-full h-full flex flex-col items-center justify-center p-0.5 bg-indigo-700 text-white">
      <span class="text-xs font-black">測驗</span>
      <span class="text-[8px] text-yellow-300 mt-0.5">{{ subject || '一般' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file RetroTileIcon.vue
 * @description 街機經典雙軌卡匣格子圖標組件 (100% 依據 pic/map1.jpg 與 16-Bit 像素手繪重製)
 * 涵蓋三選一送分、TROUBLE 骷髏災難、天才問題、健康教育以及國英數理化全學科卡匣。
 */
import { TileType, SubjectType } from '../../types/quiz';
import {
  PIXEL_ICON_TROUBLE,
  PIXEL_ICON_THREE_CHOICE,
  PIXEL_ICON_TALENT,
  PIXEL_ICON_HEALTH,
  PIXEL_ICON_ART,
  PIXEL_ICON_MUSIC,
  PIXEL_ICON_CHINESE,
  PIXEL_ICON_SCIENCE,
  PIXEL_ICON_MATH,
  PIXEL_ICON_GEOGRAPHY,
  PIXEL_ICON_CANTEEN,
  PIXEL_ICON_START,
  PIXEL_ICON_EXAM_BOSS
} from '../../assets/pixelArt';

defineProps<{
  tileIndex: number;
  type: TileType;
  subject?: SubjectType;
}>();
</script>
