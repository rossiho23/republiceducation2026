<template>
  <!-- 日系新潮街機風 退學重置確認彈窗 (Neo-Arcade Reset Modal) -->
  <div 
    v-if="gameStore.activeModal === 'RESET_CONFIRM'"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-mono select-none"
  >
    <div class="relative w-full max-w-lg bg-[#0c0f17] border-[4px] border-black shadow-[10px_10px_0px_#000] p-5 sm:p-7 neo-cut">
      
      <!-- 頂部黑黃警戒條紋飾條 -->
      <div class="w-full h-2 neo-hazard-yellow border-b border-black -mt-2 mb-4"></div>

      <!-- 標題與警戒標籤 -->
      <div class="flex items-center justify-between gap-2 border-b-2 border-dashed border-gray-800 pb-3">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 bg-[#ff0055] text-white text-xs font-black uppercase tracking-wider transform -rotate-1 border border-black shadow-[2px_2px_0px_#000]">
            WARNING // 警告
          </span>
          <h3 class="text-xl sm:text-2xl font-black text-yellow-400 neo-skew-title">
            學籍重置退學確認
          </h3>
        </div>
        <span class="text-xs font-bold text-gray-400 font-mono">
          SYSTEM ALERT
        </span>
      </div>

      <!-- 警示圖標與內文說明 -->
      <div class="my-5 p-4 bg-[#141926] border-2 border-black neo-cut-sm flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-black border-2 border-[#ff0055] flex items-center justify-center text-2xl shadow-[3px_3px_0px_#ff0055]">
            ⚠️
          </div>
          <div>
            <div class="text-sm sm:text-base font-black text-white">
              確定要辦理退學手續嗎？
            </div>
            <div class="text-xs text-gray-400 mt-0.5">
              此操作將抹除當前學期所有成績與進度
            </div>
          </div>
        </div>

        <!-- 退學影響說明清單 -->
        <div class="text-xs sm:text-sm text-gray-300 space-y-1.5 pt-2 border-t border-gray-800 leading-relaxed">
          <p class="flex items-center gap-2 text-yellow-300 font-bold">
            <span>●</span> 學程進度將直接倒退回【國民小學】重新入學。
          </p>
          <p class="flex items-center gap-2 text-red-400">
            <span>●</span> 當前已累積之學分、得分、連擊數將全數清空。
          </p>
          <p class="flex items-center gap-2 text-gray-400">
            <span>●</span> 所有已裝備之校園聖物將歸還，道具背包重設。
          </p>
        </div>

        <!-- 當前玩家狀態預覽卡 -->
        <div class="grid grid-cols-3 gap-2 mt-1 pt-2 border-t border-gray-800 text-center">
          <div class="bg-black/60 p-2 border border-gray-800">
            <span class="text-[10px] text-gray-500 block">當前學程</span>
            <span class="text-xs sm:text-sm font-black text-yellow-400">{{ gameStore.currentStage }}</span>
          </div>
          <div class="bg-black/60 p-2 border border-gray-800">
            <span class="text-[10px] text-gray-500 block">當前學分</span>
            <span class="text-xs sm:text-sm font-black text-cyan-400">{{ gameStore.credits }}</span>
          </div>
          <div class="bg-black/60 p-2 border border-gray-800">
            <span class="text-[10px] text-gray-500 block">體力狀態</span>
            <span class="text-xs sm:text-sm font-black text-white">{{ gameStore.playerHp }}%</span>
          </div>
        </div>
      </div>

      <!-- 底部雙操作按鍵 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <!-- 取消繼續按鈕 -->
        <button
          type="button"
          @click="handleCancel"
          class="neo-btn bg-[#182030] hover:bg-[#222c42] text-gray-200 text-sm sm:text-base font-black py-3 px-4 neo-cut-sm border-2 border-black shadow-[4px_4px_0px_#000] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>↩</span>
          <span>繼續挑戰 (取消)</span>
        </button>

        <!-- 確定退學重開按鈕 -->
        <button
          type="button"
          @click="handleConfirmReset"
          class="neo-btn bg-[#ff0055] hover:bg-[#ff2a70] text-white text-sm sm:text-base font-black py-3 px-4 neo-cut-sm border-2 border-black shadow-[4px_4px_0px_#000] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>🔥</span>
          <span>確定退學 (回到國小)</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ResetModal.vue
 * @description 日系新潮街機風 退學重置確認彈窗 (Neo-Arcade Reset Modal)
 * 提供防誤觸二次確認對話框，確認後重設學程為國小並清空進度重啟遊戲。
 */
import { useGameStore } from '../../stores/gameStore';
import { soundEngine } from '../../utils/audioEngine';

const gameStore = useGameStore();

/**
 * 玩家取消退學，關閉確認彈窗並恢復計時
 */
function handleCancel(): void {
  soundEngine.playStep();
  gameStore.closeResetConfirmModal();
}

/**
 * 玩家確定退學，執行回到國小全新開局邏輯
 */
function handleConfirmReset(): void {
  soundEngine.playCoin();
  gameStore.resetGameToElementary();
}
</script>