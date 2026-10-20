<template>
  <ArcadeFrame @open-cms="isCmsOpen = true">
    <!-- 電影級開頭映畫組件 (重整網頁或進入首頁時優先播放) -->
    <IntroCinema 
      v-if="showIntroCinema" 
      @complete="handleIntroComplete" 
    />

    <!-- 首頁街機標題畫面 (未進入地圖時) -->
    <TitleScreen 
      v-if="!isGameStarted" 
      @open-cms="isCmsOpen = true"
      @start-roguelike="startRoguelikeGame"
      @start-classic="startClassicGame"
    />

    <!-- 遊戲主體畫面 (已入學開始闖關) -->
    <div v-else class="flex flex-col gap-4 flex-1">
      <!-- 輕度 Roguelike 樹狀分支地圖 (Slay the Spire 架構) -->
      <RoguelikeMap 
        v-if="currentMapMode === 'ROGUELIKE'" 
        @switch-to-classic="currentMapMode = 'CLASSIC'"
      />

      <!-- 經典街機橫向卷軸雙軌卡匣軌道 -->
      <GameBoard 
        v-else 
        @switch-to-roguelike="currentMapMode = 'ROGUELIKE'"
      />
    </div>

    <!-- 彈窗群 -->
    <WagerModal />
    <RemedialExamModal />
    <QuizCard />
    <CanteenModal />
    <TransferModal />
    <EventModal />
    <BossExamModal />
    <ForkModal />
    <NewsIntroModal />
    <ContinueModal />
    <ResultModal />
    <ResetModal />

    <!-- 題庫自訂後台中心 CMS (可隨時開啟) -->
    <QuestionCMS 
      v-if="isCmsOpen" 
      @close="isCmsOpen = false" 
    />
  </ArcadeFrame>
</template>

<script setup lang="ts">
/**
 * @file App.vue
 * @description 遊戲主入口組件，調度街機外框、標題畫面、Slay the Spire 樹狀地圖、經典棋盤與各項彈窗
 */
import { ref, computed, onMounted } from 'vue';
import { useGameStore } from './stores/gameStore';
import { useQuestionStore } from './stores/questionStore';
import { useCharacterStore } from './stores/characterStore';
import ArcadeFrame from './components/retro/ArcadeFrame.vue';
import TitleScreen from './components/game/TitleScreen.vue';
import GameBoard from './components/game/GameBoard.vue';
import RoguelikeMap from './components/game/RoguelikeMap.vue';
import WagerModal from './components/game/WagerModal.vue';
import RemedialExamModal from './components/game/RemedialExamModal.vue';
import QuizCard from './components/game/QuizCard.vue';
import CanteenModal from './components/game/CanteenModal.vue';
import TransferModal from './components/game/TransferModal.vue';
import EventModal from './components/game/EventModal.vue';
import ForkModal from './components/game/ForkModal.vue';
import NewsIntroModal from './components/game/NewsIntroModal.vue';
import BossExamModal from './components/game/BossExamModal.vue';
import ContinueModal from './components/game/ContinueModal.vue';
import ResultModal from './components/game/ResultModal.vue';
import ResetModal from './components/game/ResetModal.vue';
import QuestionCMS from './components/cms/QuestionCMS.vue';
import IntroCinema from './components/game/IntroCinema.vue';
import { bgmEngine } from './utils/bgmEngine';

const gameStore = useGameStore();
const questionStore = useQuestionStore();
const characterStore = useCharacterStore();

const showIntroCinema = ref<boolean>(true);

/**
 * 開頭映畫結束或被跳過時的回呼處理
 * 關閉片頭組件，立即播放「民國教育委員會！」標題語音，並同時啟動 BGM 避讓混音循環播放
 */
function handleIntroComplete(): void {
  showIntroCinema.value = false;
  bgmEngine.playTitleVoiceWithDucking();
}

const isCmsOpen = ref<boolean>(false);
const isGameStarted = ref<boolean>(false);
const currentMapMode = ref<'ROGUELIKE' | 'CLASSIC'>('ROGUELIKE');

function startRoguelikeGame(): void {
  currentMapMode.value = 'ROGUELIKE';
  isGameStarted.value = true;
  gameStore.startNewGame('國小', gameStore.gameLength);
}

function startClassicGame(): void {
  currentMapMode.value = 'CLASSIC';
  isGameStarted.value = true;
  gameStore.startNewGame('國小', gameStore.gameLength);
}

onMounted(() => {
  // 初始化題庫與人物形象資料
  questionStore.initQuestions();
  characterStore.initCharacters();
});
</script>
