<template>
  <div class="w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none font-medium p-1 rounded-lg">
    <!-- 1. 起點「昇學」大格 -->
    <div v-if="tileIndex === 0" class="w-full h-full flex flex-col items-center justify-center p-1 bg-indigo-950/40 border border-indigo-500/30 rounded-lg">
      <img :src="PIXEL_ICON_START" alt="昇學起點" class="w-9 h-9 sm:w-11 sm:h-11 object-contain select-none" />
      <span class="text-xs sm:text-sm font-semibold text-indigo-300 tracking-wider mt-1">
        起點
      </span>
    </div>

    <!-- 2. 分叉選擇點 (FORK) -->
    <div v-else-if="type === 'FORK'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-zinc-800/80 border border-white/[0.12] rounded-lg text-zinc-100">
      <div class="flex items-center gap-1.5 my-1">
        <span class="text-xs sm:text-sm">⬆️</span>
        <span class="text-xs sm:text-sm">⬇️</span>
      </div>
      <span class="text-[11px] sm:text-xs font-semibold text-zinc-300">
        路線分叉
      </span>
    </div>

    <!-- 3. 三選一格 (THREE_CHOICE) -->
    <div v-else-if="type === 'THREE_CHOICE'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-sky-950/40 border border-sky-500/30 rounded-lg">
      <img :src="PIXEL_ICON_THREE_CHOICE" alt="三選一" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none" />
      <span class="text-xs sm:text-sm font-semibold text-sky-300 mt-1">
        三選一
      </span>
    </div>

    <!-- 4. TROUBLE 骷髏危險格 -->
    <div v-else-if="type === 'TROUBLE'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-rose-950/30 border border-rose-500/30 rounded-lg">
      <img :src="PIXEL_ICON_TROUBLE" alt="TROUBLE" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none opacity-90" />
      <span class="text-xs sm:text-sm font-semibold text-rose-300 mt-1">
        危機格
      </span>
    </div>

    <!-- 5. 天才問題格 (TALENT) -->
    <div v-else-if="type === 'TALENT'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-amber-950/30 border border-amber-500/30 rounded-lg">
      <img :src="PIXEL_ICON_TALENT" alt="天才問題" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none" />
      <span class="text-xs sm:text-sm font-semibold text-amber-300 mt-1">
        天才雙倍
      </span>
    </div>

    <!-- 6. 健康教育格 (HEALTH) -->
    <div v-else-if="type === 'HEALTH' || (type === 'QUIZ' && subject === '健康教育')" class="w-full h-full flex flex-col items-center justify-center p-1 bg-emerald-950/30 border border-emerald-500/30 rounded-lg">
      <img :src="PIXEL_ICON_HEALTH" alt="健康教育" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none" />
      <span class="text-xs sm:text-sm font-semibold text-emerald-300 mt-1">
        健康恢復
      </span>
    </div>

    <!-- 7. 美術格 -->
    <div v-else-if="subject === '美術' || (type === 'QUIZ' && subject === '藝能')" class="w-full h-full flex flex-col items-center justify-center p-1 bg-zinc-900/80 border border-white/[0.08] rounded-lg">
      <img :src="PIXEL_ICON_ART" alt="美術" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none" />
      <span class="text-xs sm:text-sm font-medium text-zinc-300 mt-1">美術</span>
    </div>

    <!-- 8. 音樂格 -->
    <div v-else-if="subject === '流行音樂'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-zinc-900/80 border border-white/[0.08] rounded-lg">
      <img :src="PIXEL_ICON_MUSIC" alt="音樂" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none" />
      <span class="text-xs sm:text-sm font-medium text-indigo-300 mt-1">音樂</span>
    </div>

    <!-- 9. 國文格 -->
    <div v-else-if="type === 'QUIZ' && subject === '國文'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-zinc-900/80 border border-white/[0.08] rounded-lg">
      <img :src="PIXEL_ICON_CHINESE" alt="國文" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none" />
      <span class="text-xs sm:text-sm font-medium text-zinc-300 mt-1">國文</span>
    </div>

    <!-- 10. 自然/理化格 -->
    <div v-else-if="type === 'QUIZ' && subject === '自然'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-zinc-900/80 border border-white/[0.08] rounded-lg">
      <img :src="PIXEL_ICON_SCIENCE" alt="自然" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none" />
      <span class="text-xs sm:text-sm font-medium text-zinc-300 mt-1">自然</span>
    </div>

    <!-- 11. 數學格 -->
    <div v-else-if="type === 'QUIZ' && subject === '數學'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-zinc-900/80 border border-white/[0.08] rounded-lg">
      <img :src="PIXEL_ICON_MATH" alt="數學" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none" />
      <span class="text-xs sm:text-sm font-medium text-zinc-300 mt-1">數學</span>
    </div>

    <!-- 12. 社會/地理格 -->
    <div v-else-if="type === 'QUIZ' && subject === '社會'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-zinc-900/80 border border-white/[0.08] rounded-lg">
      <img :src="PIXEL_ICON_GEOGRAPHY" alt="社會地理" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none" />
      <span class="text-xs sm:text-sm font-medium text-zinc-300 mt-1">社會</span>
    </div>

    <!-- 13. 課外常識格 -->
    <div v-else-if="type === 'EXTRACURRICULAR' || subject === '課外'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-zinc-900/80 border border-white/[0.08] rounded-lg">
      <span class="text-sm sm:text-base font-semibold text-zinc-100 tracking-wider">
        課外
      </span>
      <span class="text-[10px] sm:text-xs text-zinc-400 mt-1">常識</span>
    </div>

    <!-- 14. 福利社格 (CANTEEN) -->
    <div v-else-if="type === 'CANTEEN'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-amber-950/20 border border-amber-500/30 rounded-lg">
      <img :src="PIXEL_ICON_CANTEEN" alt="福利社" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none" />
      <span class="text-xs sm:text-sm font-semibold text-amber-300 mt-1">福利社</span>
    </div>

    <!-- 15. 事件/命運格 -->
    <div v-else-if="type === 'EVENT' || type === 'FATE'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-zinc-900/80 border border-white/[0.08] rounded-lg">
      <span class="text-xl sm:text-2xl font-bold font-mono text-zinc-300">?</span>
      <span class="text-xs sm:text-sm font-medium text-zinc-400 mt-1">
        {{ type === 'EVENT' ? '事件' : '命運' }}
      </span>
    </div>

    <!-- 16. 升學大考 BOSS 終點格 -->
    <div v-else-if="type === 'EXAM'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-indigo-950/40 border border-indigo-500/40 rounded-lg">
      <img :src="PIXEL_ICON_EXAM_BOSS" alt="升學大考" class="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none animate-pulse" />
      <span class="text-xs sm:text-sm font-semibold text-indigo-300 mt-1">
        大考檢定
      </span>
    </div>

    <!-- 17. 預設其他測驗 -->
    <div v-else class="w-full h-full flex flex-col items-center justify-center p-1 bg-zinc-900/80 border border-white/[0.08] rounded-lg text-zinc-200">
      <span class="text-xs sm:text-sm font-medium">測驗</span>
      <span class="text-[10px] text-zinc-400 mt-1">{{ subject || '一般' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file RetroTileIcon.vue
 * @description 現代極簡雙軌卡匣格子圖標組件 (Modern Minimalist Tile Icon)
 * 採用低飽和冷調 Zinc 底色搭配半透明微邊框，保留 16-Bit 精緻手繪像素圖標。
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