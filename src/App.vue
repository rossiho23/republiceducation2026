<template>
  <ArcadeFrame @open-cms="isCmsOpen = true">
    <!-- 首頁街機標題畫面 (未進入棋盤時) -->
    <TitleScreen 
      v-if="gameStore.tiles.length === 0" 
      @open-cms="isCmsOpen = true" 
    />

    <!-- 遊戲主體棋盤畫面 (已入學開始闖關) -->
    <div v-else class="flex flex-col gap-4 flex-1">
      <GameBoard />
    </div>

    <!-- 彈窗群 -->
    <QuizCard />
    <CanteenModal />
    <TransferModal />
    <EventModal />
    <BossExamModal />
    <ForkModal />
    <NewsIntroModal />
    <ContinueModal />
    <ResultModal />

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
 * @description 遊戲主入口組件，調度街機外框、標題畫面、地圖棋盤與各項彈窗
 */
import { ref, onMounted } from 'vue';
import { useGameStore } from './stores/gameStore';
import { useQuestionStore } from './stores/questionStore';
import { useCharacterStore } from './stores/characterStore';
import ArcadeFrame from './components/retro/ArcadeFrame.vue';
import TitleScreen from './components/game/TitleScreen.vue';
import GameBoard from './components/game/GameBoard.vue';
import QuizCard from './components/game/QuizCard.vue';
import CanteenModal from './components/game/CanteenModal.vue';
import TransferModal from './components/game/TransferModal.vue';
import EventModal from './components/game/EventModal.vue';
import ForkModal from './components/game/ForkModal.vue';
import NewsIntroModal from './components/game/NewsIntroModal.vue';
import BossExamModal from './components/game/BossExamModal.vue';
import ContinueModal from './components/game/ContinueModal.vue';
import ResultModal from './components/game/ResultModal.vue';
import QuestionCMS from './components/cms/QuestionCMS.vue';

const gameStore = useGameStore();
const questionStore = useQuestionStore();
const characterStore = useCharacterStore();

const isCmsOpen = ref<boolean>(false);

onMounted(() => {
  // 初始化題庫與人物形象資料
  questionStore.initQuestions();
  characterStore.initCharacters();
});
</script>
