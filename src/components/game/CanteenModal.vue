<template>
  <div v-if="gameStore.activeModal === 'CANTEEN'" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
    <div class="w-full max-w-xl bg-arcade-dark border-4 border-arcade-yellow rounded-2xl p-5 sm:p-6 shadow-arcade-yellow flex flex-col gap-4">
      <!-- 商店招牌標頭 -->
      <div class="flex items-center justify-between border-b border-gray-800 pb-3">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🏪</span>
          <div>
            <h2 class="text-lg sm:text-xl font-black text-arcade-yellow">校園福利社 · 戰略補給站</h2>
            <p class="text-xs text-gray-400">消耗學分金幣，選購強效道具！助你一路直通大學！</p>
          </div>
        </div>

        <!-- 玩家學分餘額 -->
        <div class="bg-gray-900 border border-arcade-yellow/50 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-mono font-bold text-arcade-yellow shadow-pixel-sm">
          <span>🪙 學分餘額:</span>
          <span class="text-sm">{{ gameStore.credits }}</span>
        </div>
      </div>

      <!-- 貨架商品清單 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
        <div 
          v-for="item in CANTEEN_ITEMS" 
          :key="item.id"
          class="bg-arcade-panel border-2 border-slate-700 rounded-xl p-3 flex flex-col justify-between gap-2 transition-all hover:border-arcade-yellow/60"
        >
          <div class="flex items-start gap-2.5">
            <span class="text-3xl p-1.5 bg-slate-800 rounded-lg border border-slate-600">
              {{ item.icon }}
            </span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-sm text-white">{{ item.name }}</h4>
                <span class="text-xs font-mono text-gray-400">持有: {{ gameStore.inventory[item.id] || 0 }}</span>
              </div>
              <p class="text-[11px] text-gray-300 mt-1 leading-snug">
                {{ item.description }}
              </p>
            </div>
          </div>

          <!-- 購買按鈕與價格標籤 -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-700/60 mt-1">
            <span class="text-xs font-mono font-bold text-arcade-yellow">
              🪙 {{ item.price }} 學分
            </span>
            <button 
              @click="gameStore.buyItem(item)"
              :disabled="gameStore.credits < item.price"
              class="btn-arcade text-xs py-1 px-3 rounded bg-gradient-to-r from-arcade-yellow to-orange-500 text-black font-black disabled:opacity-40 disabled:cursor-not-allowed"
            >
              購買
            </button>
          </div>
        </div>
      </div>

      <!-- 離開福利社按鈕 -->
      <div class="flex justify-end pt-2 border-t border-gray-800">
        <button 
          @click="gameStore.activeModal = 'NONE'"
          class="btn-arcade bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm py-2 px-6 rounded-lg"
        >
          離開福利社 ➔
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file CanteenModal.vue
 * @description 校園福利社道具商店彈窗，支援購買放大鏡、時鐘、Pass券、養樂多
 */
import { useGameStore } from '../../stores/gameStore';
import { CANTEEN_ITEMS } from '../../utils/boardGenerator';

const gameStore = useGameStore();
</script>
