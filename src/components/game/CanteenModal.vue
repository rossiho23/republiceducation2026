<template>
  <!-- 現代極簡 SaaS 風格 校園福利社彈窗 (Linear Modern Canteen Modal) -->
  <div 
    v-if="gameStore.activeModal === 'CANTEEN'" 
    class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none"
  >
    <!-- 主彈窗容器 (Bento Grid 圓角卡片) -->
    <div class="w-full max-w-3xl 2xl:max-w-4xl bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 flex flex-col gap-6">
      <!-- 商店標頭 -->
      <div class="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-zinc-850 border border-white/[0.08] flex items-center justify-center text-xl">
            🏪
          </div>
          <div>
            <h2 class="text-xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2">
              <span>校園福利社</span>
              <span class="saas-pill saas-pill-indigo text-xs font-mono">SUPPLY STORE</span>
            </h2>
            <p class="text-xs text-zinc-400 mt-0.5">消耗學分儲備，選購答題戰略道具</p>
          </div>
        </div>

        <!-- 玩家學分餘額 -->
        <div class="saas-pill bg-zinc-800/80 border-white/[0.1] text-zinc-200 text-xs sm:text-sm font-mono">
          <span>學分餘額:</span>
          <strong class="text-indigo-400 font-semibold">{{ gameStore.credits }}</strong>
        </div>
      </div>

      <!-- 貨架商品清單 (Bento Grid 卡片) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          v-for="item in CANTEEN_ITEMS" 
          :key="item.id"
          class="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/60 flex flex-col justify-between gap-4 transition-all duration-200"
        >
          <div class="flex items-start gap-3.5">
            <span class="text-3xl p-2.5 bg-zinc-900 rounded-xl border border-white/[0.08] flex-shrink-0">
              {{ item.icon }}
            </span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-base text-zinc-100">{{ item.name }}</h4>
                <span class="text-xs font-mono text-zinc-400">持有: {{ gameStore.inventory[item.id] || 0 }}</span>
              </div>
              <p class="text-xs text-zinc-400 mt-1 leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>

          <!-- 購買按鈕與價格標籤 -->
          <div class="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <span class="text-sm font-mono font-medium text-zinc-300">
              {{ item.price }} 學分
            </span>
            <button 
              @click="gameStore.buyItem(item)"
              :disabled="gameStore.credits < item.price"
              class="saas-btn saas-btn-primary py-1.5 px-4 text-xs font-medium"
            >
              購買道具
            </button>
          </div>
        </div>
      </div>

      <!-- 離開福利社按鈕 -->
      <div class="flex justify-end pt-4 border-t border-white/[0.08]">
        <button 
          @click="gameStore.activeModal = 'NONE'"
          class="saas-btn saas-btn-secondary py-2.5 px-6 text-xs sm:text-sm"
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
 * @description 現代極簡 SaaS 風格 校園福利社道具商店彈窗 (Linear Modern Canteen Modal)
 * 具備 Bento Grid 貨架卡片、學分餘額指示與平滑購買回饋。
 */
import { useGameStore } from '../../stores/gameStore';
import { CANTEEN_ITEMS } from '../../utils/boardGenerator';

const gameStore = useGameStore();
</script>