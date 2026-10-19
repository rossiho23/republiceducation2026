<template>
  <div class="w-full h-full flex items-center justify-center relative overflow-hidden select-none font-bold">
    <!-- 1. 起點「昇學」大格 (致敬 map1.jpg 最左側大格) -->
    <div v-if="tileIndex === 0" class="w-full h-full flex flex-col items-center justify-center p-1 bg-gradient-to-b from-red-600 to-rose-900 border-2 border-white shadow-inner">
      <span class="text-xs sm:text-sm font-black text-white drop-shadow-[0_2px_0_rgba(0,0,0,1)] tracking-widest leading-none">
        昇學
      </span>
      <span class="text-[8px] text-amber-300 font-mono mt-0.5 uppercase tracking-wider">
        START
      </span>
    </div>

    <!-- 2. 分叉選擇點 (FORK 雙向箭頭與紅藍斜紋) -->
    <div v-else-if="type === 'FORK'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-gradient-to-br from-blue-700 via-purple-700 to-red-600 text-white relative">
      <div class="flex items-center gap-1 my-0.5">
        <span class="text-xs animate-bounce-short">⬆️</span>
        <span class="text-xs animate-bounce-short">⬇️</span>
      </div>
      <span class="text-[9px] font-black text-yellow-300 drop-shadow-[0_1px_0_rgba(0,0,0,1)] uppercase">
        路線分叉
      </span>
    </div>

    <!-- 3. 三選一格 (THREE_CHOICE 藍底白字看板，致敬 map1.jpg 上路) -->
    <div v-else-if="type === 'THREE_CHOICE'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-[#1d4ed8] border-2 border-white/80 shadow-md">
      <span class="text-xs sm:text-sm font-black text-white drop-shadow-[0_2px_0_rgba(0,0,0,1)] tracking-wider">
        三選一
      </span>
      <span class="text-[8px] text-sky-200 mt-0.5">送分福利</span>
    </div>

    <!-- 4. TROUBLE 骷髏危險格 (黑底骷髏頭，致敬 map1.jpg 上路) -->
    <div v-else-if="type === 'TROUBLE'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-black border-2 border-amber-500 shadow-md">
      <span class="text-[9px] font-black tracking-widest text-amber-400 drop-shadow leading-none">
        TROUBLE
      </span>
      <svg viewBox="0 0 32 30" class="w-7 h-7 my-0.5 drop-shadow">
        <!-- 骷髏頭骨 -->
        <circle cx="16" cy="12" r="9" fill="#f8fafc" stroke="#000" stroke-width="1.5" />
        <rect x="11" y="16" width="10" height="7" rx="1" fill="#f8fafc" stroke="#000" stroke-width="1.5" />
        <!-- 黑眼窩與鼻孔 -->
        <circle cx="13" cy="12" r="2.5" fill="#000000" />
        <circle cx="19" cy="12" r="2.5" fill="#000000" />
        <polygon points="16,14 15,17 17,17" fill="#000000" />
        <!-- 牙齒縫 -->
        <line x1="13" y1="18" x2="13" y2="22" stroke="#000000" stroke-width="1" />
        <line x1="16" y1="18" x2="16" y2="22" stroke="#000000" stroke-width="1" />
        <line x1="19" y1="18" x2="19" y2="22" stroke="#000000" stroke-width="1" />
      </svg>
      <span class="text-[8px] font-bold text-red-500 leading-none">危險扣血</span>
    </div>

    <!-- 5. 天才問題格 (TALENT 紅底白字大框，致敬 map1.jpg 下路) -->
    <div v-else-if="type === 'TALENT'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-[#dc2626] border-2 border-white/90 shadow-md">
      <div class="flex flex-col items-center leading-tight">
        <span class="text-xs sm:text-sm font-black text-white drop-shadow-[0_2px_0_rgba(0,0,0,1)] tracking-widest">
          天才
        </span>
        <span class="text-[9px] font-bold text-yellow-300">
          問題
        </span>
      </div>
      <span class="text-[7px] text-amber-200 mt-0.5">雙倍學分</span>
    </div>

    <!-- 6. 健康教育格 (HEALTH 黑影人體發光心臟，致敬 map1.jpg 下路) -->
    <div v-else-if="type === 'HEALTH' || (type === 'QUIZ' && subject === '健康教育')" class="w-full h-full flex flex-col items-center justify-center p-1 bg-[#b91c1c]">
      <svg viewBox="0 0 36 34" class="w-8 h-8 drop-shadow">
        <!-- 黑色人體上半身剪影 -->
        <circle cx="18" cy="8" r="5" fill="#0f172a" />
        <path d="M8,26 C8,18 28,18 28,26 Z" fill="#0f172a" />
        <!-- 胸口紅心 -->
        <path d="M18,17 C16,14 13,15 13,18 C13,21 18,25 18,25 C18,25 23,21 23,18 C23,15 20,14 18,17 Z" fill="#ef4444" stroke="#ffffff" stroke-width="1" class="animate-pulse" />
      </svg>
      <span class="text-[9px] font-black text-white mt-0.5">健康教育</span>
    </div>

    <!-- 7. 美術格 (調色盤水彩筆，致敬 map1.jpg 下路) -->
    <div v-else-if="subject === '美術' || (type === 'QUIZ' && subject === '藝能')" class="w-full h-full flex flex-col items-center justify-center p-1 bg-[#ea580c]">
      <svg viewBox="0 0 44 34" class="w-9 h-8 drop-shadow">
        <!-- 白色調色盤 -->
        <path d="M8,18 C8,10 20,6 30,10 C38,14 36,26 28,28 C20,30 8,26 8,18 Z" fill="#ffffff" stroke="#000" stroke-width="1.5" />
        <!-- 調色盤顏料點 -->
        <circle cx="16" cy="13" r="2" fill="#ef4444" />
        <circle cx="22" cy="11" r="2" fill="#eab308" />
        <circle cx="28" cy="15" r="2" fill="#3b82f6" />
        <circle cx="24" cy="22" r="2" fill="#22c55e" />
        <circle cx="14" cy="21" r="2.5" fill="#94a3b8" /> <!-- 大拇指孔 -->
        <!-- 水彩畫筆 -->
        <line x1="28" y1="28" x2="38" y2="34" stroke="#78350f" stroke-width="2.5" stroke-linecap="round" />
        <polygon points="26,26 29,29 27,30" fill="#eab308" />
      </svg>
      <span class="text-[9px] font-black text-white mt-0.5">美術</span>
    </div>

    <!-- 8. 音樂格 (五線譜與高音譜記號，致敬 map1.jpg 上路) -->
    <div v-else-if="subject === '流行音樂' || (type === 'QUIZ' && subject === '藝能')" class="w-full h-full flex flex-col items-center justify-center p-1 bg-white text-black border-2 border-slate-700">
      <svg viewBox="0 0 44 32" class="w-9 h-7">
        <!-- 五線譜 -->
        <line x1="2" y1="6" x2="42" y2="6" stroke="#94a3b8" stroke-width="0.8" />
        <line x1="2" y1="11" x2="42" y2="11" stroke="#94a3b8" stroke-width="0.8" />
        <line x1="2" y1="16" x2="42" y2="16" stroke="#94a3b8" stroke-width="0.8" />
        <line x1="2" y1="21" x2="42" y2="21" stroke="#94a3b8" stroke-width="0.8" />
        <line x1="2" y1="26" x2="42" y2="26" stroke="#94a3b8" stroke-width="0.8" />
        <!-- 高音譜號 -->
        <text x="6" y="24" font-size="20" font-family="serif" font-weight="bold" fill="#000">𝄞</text>
        <!-- 八分音符 -->
        <ellipse cx="28" cy="20" rx="3" ry="2.5" fill="#000" transform="rotate(-20 28 20)" />
        <line x1="30" y1="20" x2="30" y2="8" stroke="#000" stroke-width="1.8" />
        <ellipse cx="37" cy="18" rx="3" ry="2.5" fill="#000" transform="rotate(-20 37 18)" />
        <line x1="39" y1="18" x2="39" y2="6" stroke="#000" stroke-width="1.8" />
        <polygon points="30,8 39,6 39,9 30,11" fill="#000" />
      </svg>
      <span class="text-[9px] font-black text-black">音樂</span>
    </div>

    <!-- 9. 課外常識格 (EXTRACURRICULAR 藍底白字，致敬 map1.jpg 下路) -->
    <div v-else-if="type === 'EXTRACURRICULAR' || subject === '課外'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-[#0284c7] border-2 border-white/80 shadow-md">
      <span class="text-xs sm:text-sm font-black text-white drop-shadow-[0_2px_0_rgba(0,0,0,1)] tracking-widest">
        課外
      </span>
      <span class="text-[8px] text-amber-200 mt-0.5">時事常識</span>
    </div>

    <!-- 10. 自然/理化格 (燒杯試管與滴管，黃綠底) -->
    <div v-else-if="type === 'QUIZ' && subject === '自然'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-lime-500">
      <svg viewBox="0 0 48 38" class="w-10 h-9 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
        <!-- 圓底燒杯 (裝深藍藥水) -->
        <path d="M12,12 L18,12 L18,18 C14,22 10,26 12,31 C14,35 24,35 26,31 C28,26 24,22 20,18 L20,12 L26,12" fill="none" stroke="#0f172a" stroke-width="1.8" />
        <path d="M13,26 C15,33 23,33 25,26 C22,24 16,24 13,26 Z" fill="#2563eb" opacity="0.9" />
        <!-- 玻璃刻度量筒 -->
        <rect x="29" y="14" width="12" height="18" rx="1" fill="#e0f2fe" stroke="#0f172a" stroke-width="1.8" />
        <rect x="31" y="20" width="8" height="11" fill="#0284c7" />
        <!-- 玻璃滴管滴落水滴 -->
        <polygon points="34,2 38,2 36,10" fill="#94a3b8" stroke="#0f172a" stroke-width="1" />
        <circle cx="36" cy="13" r="1.5" fill="#2563eb" />
      </svg>
      <span class="text-[9px] font-black text-lime-950 mt-0.5">自然</span>
    </div>

    <!-- 11. 國文格 (翻開書本與鉛筆) -->
    <div v-else-if="type === 'QUIZ' && subject === '國文'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-amber-400">
      <svg viewBox="0 0 48 38" class="w-10 h-9 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
        <polygon points="4,10 24,14 44,10 44,28 24,32 4,28" fill="#b91c1c" />
        <polygon points="6,9 23,12 23,28 6,25" fill="#fef08a" />
        <polygon points="25,12 42,9 42,25 25,28" fill="#ffffff" />
        <!-- 綠色鉛筆 -->
        <g transform="rotate(25 40 8)">
          <rect x="37" y="2" width="5" height="24" fill="#16a34a" />
          <polygon points="37,2 42,2 39.5,-4" fill="#fde047" />
        </g>
      </svg>
      <span class="text-[9px] font-black text-amber-950 mt-0.5">國文</span>
    </div>

    <!-- 12. 社會/地理格 (藍色世界地圖) -->
    <div v-else-if="type === 'QUIZ' && subject === '社會'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-sky-600">
      <svg viewBox="0 0 48 38" class="w-10 h-9 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
        <rect x="2" y="2" width="44" height="34" rx="2" fill="#0284c7" stroke="#0369a1" stroke-width="1.5" />
        <path d="M6,10 Q12,8 15,14 Q14,20 9,24 Q5,20 6,10 Z" fill="#facc15" />
        <path d="M22,8 Q34,6 40,12 Q42,20 35,22 Q27,18 24,14 Z" fill="#facc15" />
      </svg>
      <span class="text-[9px] font-black text-white mt-0.5 drop-shadow">地理</span>
    </div>

    <!-- 13. 數學格 (三角板直尺) -->
    <div v-else-if="type === 'QUIZ' && subject === '數學'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-emerald-600">
      <svg viewBox="0 0 48 38" class="w-10 h-9 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
        <polygon points="8,8 8,30 36,30" fill="#ecfdf5" stroke="#0f172a" stroke-width="1.8" />
        <polygon points="12,18 12,26 24,26" fill="#emerald-600" />
      </svg>
      <span class="text-[9px] font-black text-emerald-950 mt-0.5">數學</span>
    </div>

    <!-- 14. 幸運福利社格 (LUCKY 旭日放射光芒) -->
    <div v-else-if="type === 'CANTEEN'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-amber-400 relative overflow-hidden">
      <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite] opacity-60">
        <polygon points="50,50 0,0 25,0" fill="#ef4444" />
        <polygon points="50,50 50,0 75,0" fill="#ef4444" />
        <polygon points="50,50 100,0 100,25" fill="#ef4444" />
        <polygon points="50,50 100,50 100,75" fill="#ef4444" />
        <polygon points="50,50 100,100 75,100" fill="#ef4444" />
        <polygon points="50,50 50,100 25,100" fill="#ef4444" />
        <polygon points="50,50 0,100 0,75" fill="#ef4444" />
        <polygon points="50,50 0,50 0,25" fill="#ef4444" />
      </svg>
      <div class="relative z-10 flex flex-col items-center">
        <span class="text-xs sm:text-sm font-black tracking-widest text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,1)] uppercase">
          LUCKY
        </span>
        <span class="text-[8px] bg-red-600 text-white font-bold px-1 rounded shadow-pixel-sm">
          福利社
        </span>
      </div>
    </div>

    <!-- 15. 事件/命運格 (銀灰百葉窗條紋與問號 ？) -->
    <div v-else-if="type === 'EVENT' || type === 'FATE'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-gradient-to-b from-slate-200 via-slate-400 to-slate-300 relative">
      <div class="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(0,0,0,0.4)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
      <div class="relative z-10 flex flex-col items-center">
        <span class="text-2xl font-black font-mono text-slate-900 drop-shadow-[0_2px_0_rgba(255,255,255,0.8)] leading-none">
          ?
        </span>
        <span class="text-[8px] font-bold text-slate-800 uppercase mt-0.5">
          {{ type === 'EVENT' ? '事件' : '命運' }}
        </span>
      </div>
    </div>

    <!-- 16. 升學大考 BOSS 終點格 (EXAM) -->
    <div v-else-if="type === 'EXAM'" class="w-full h-full flex flex-col items-center justify-center p-1 bg-gradient-to-b from-red-600 to-rose-900 text-white relative">
      <svg viewBox="0 0 48 38" class="w-10 h-9 drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
        <polygon points="24,4 42,12 24,20 6,12" fill="#fbbf24" stroke="#78350f" stroke-width="1.5" />
        <rect x="18" y="19" width="12" height="6" fill="#172554" />
      </svg>
      <span class="text-[9px] font-black text-amber-300 uppercase">
        升學大考
      </span>
    </div>

    <!-- 17. 預設其他 -->
    <div v-else class="w-full h-full flex flex-col items-center justify-center p-1 bg-indigo-600 text-white">
      <span class="text-xl">📝</span>
      <span class="text-[9px] font-black mt-0.5">{{ subject || '測驗' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file RetroTileIcon.vue
 * @description 街機經典卡匣格子圖標繪製組件，包含三選一、TROUBLE 骷髏、天才問題、健康教育等原版圖標
 */
import { TileType, SubjectType } from '../../types/quiz';

defineProps<{
  tileIndex: number;
  type: TileType;
  subject?: SubjectType;
}>();
</script>
