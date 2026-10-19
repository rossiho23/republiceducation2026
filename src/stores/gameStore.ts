/**
 * @file gameStore.ts
 * @description 遊戲核心進行狀態庫 (Game Engine Store)
 * 支援雙軌分叉路線拓撲 (致敬 pic/map1.jpg)、三選一、天才問題、TROUBLE 骷髏、Rank 動態難度與升學 Boss 關卡。
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  StageGrade, 
  MapTile, 
  QuestionItem, 
  RandomEvent, 
  ItemType, 
  GameItem, 
  BossExamState,
  BranchType 
} from '../types/quiz';
import { 
  generateBoardTiles, 
  STAGE_CONFIGS, 
  pickRandomCampusEvent 
} from '../utils/boardGenerator';
import { soundEngine } from '../utils/audioEngine';
import { useQuestionStore } from './questionStore';

/** 作用中彈窗列舉 */
export type ActiveModalType = 
  | 'NONE'
  | 'QUIZ'
  | 'CANTEEN'
  | 'TRANSFER'
  | 'EVENT'
  | 'FATE'
  | 'FORK_SELECT'
  | 'BOSS_EXAM'
  | 'CONTINUE'
  | 'VICTORY'
  | 'CMS'
  | 'NEWS_INTRO';

export const useGameStore = defineStore('gameStore', () => {
  const questionStore = useQuestionStore();

  // ================= 核心數值狀態 =================
  const currentStage = ref<StageGrade>('高中'); // 預設體驗致敬截圖之高中或國小
  const tiles = ref<MapTile[]>([]);
  const currentTileIndex = ref<number>(0);
  const currentBranch = ref<BranchType>('MAIN'); // 當前所屬分支
  const playerHp = ref<number>(100);
  const maxHp = ref<number>(100);
  const credits = ref<number>(150); // 初始學分金幣
  const score = ref<number>(0);
  const coins = ref<number>(3);     // 街機續關代幣
  const comboCount = ref<number>(0);

  // 街機動態難度 Rank (0 ~ 10 級)
  const rank = ref<number>(5);

  // 道具背包
  const inventory = ref<Record<ItemType, number>>({
    MAGNIFIER: 1,
    CLOCK: 1,
    PASS_TICKET: 0,
    YAKULT: 0,
  });

  // 擲骰狀態
  const isRollingDice = ref<boolean>(false);
  const diceValue = ref<number>(1);

  // 作用中彈窗
  const activeModal = ref<ActiveModalType>('NONE');

  // 當前題目與答題計時
  const currentQuestion = ref<QuestionItem | null>(null);
  const isThreeChoiceMode = ref<boolean>(false); // 三選一模式
  const isTalentMode = ref<boolean>(false);      // 天才挑戰模式
  const timeRemaining = ref<number>(10);
  const maxTimeLimit = ref<number>(10);
  const timerInterval = ref<number | null>(null);
  const disabledOptionIndices = ref<number[]>([]);
  const isAnswered = ref<boolean>(false);
  const lastSelectedChoice = ref<number | null>(null);
  const isLastAnswerCorrect = ref<boolean | null>(null);

  // 主持播音跑馬燈文字
  const hostComment = ref<string>('歡迎來到《民國教育委員會》！前方即將面臨學業分歧路線！');

  // 當前事件與轉學結果
  const currentEvent = ref<RandomEvent | null>(null);
  const transferMessage = ref<{ isLucky: boolean; title: string; desc: string } | null>(null);

  // 升學 Boss 關卡狀態
  const bossExam = ref<BossExamState>({
    isActive: false,
    stage: '高中',
    currentQuestionIndex: 0,
    passedCount: 0,
    targetCount: 5,
    mistakesCount: 0,
    maxAllowedMistakes: 1,
    isConsecutiveMode: false,
    currentQuestion: null,
    timeRemaining: 10,
    isCleared: false,
    isFailed: false,
  });

  // 續關倒數 (9 秒)
  const continueCountdown = ref<number>(9);
  const continueTimer = ref<number | null>(null);

  // ================= 輔助計算屬性 =================
  const currentStageConfig = computed(() => STAGE_CONFIGS[currentStage.value]);
  const currentTile = computed(() => tiles.value[currentTileIndex.value] || null);

  // 分支格子集合篩選 (供雙軌排版使用)
  const upperBranchTiles = computed(() => tiles.value.filter(t => t.branch === 'UPPER'));
  const lowerBranchTiles = computed(() => tiles.value.filter(t => t.branch === 'LOWER'));
  const mainStartTile = computed(() => tiles.value.find(t => t.index === 0));
  const mainForkTile = computed(() => tiles.value.find(t => t.index === 1));
  const mainExamTile = computed(() => tiles.value.find(t => t.type === 'EXAM'));

  // 離畢業還有幾層次
  const remainingLayers = computed(() => {
    const base = currentStageConfig.value.layerCount;
    const progress = Math.min(base, currentTileIndex.value);
    return Math.max(1, base - progress);
  });

  // ================= 核心方法 =================

  /**
   * 初始化並啟動新局遊戲
   * @param {StageGrade} [stage='高中'] 起始學程
   */
  function startNewGame(stage: StageGrade = '高中'): void {
    questionStore.initQuestions();
    questionStore.clearUsedQuestions();
    soundEngine.playCoin();

    currentStage.value = stage;
    tiles.value = generateBoardTiles(stage);
    currentTileIndex.value = 0;
    currentBranch.value = 'MAIN';
    playerHp.value = 100;
    credits.value = 150;
    score.value = 0;
    coins.value = 3;
    comboCount.value = 0;
    rank.value = STAGE_CONFIGS[stage].baseRank;
    inventory.value = {
      MAGNIFIER: 1,
      CLOCK: 1,
      PASS_TICKET: 0,
      YAKULT: 0,
    };
    activeModal.value = 'NONE';
    hostComment.value = `歡迎進入【${STAGE_CONFIGS[stage].title}】！離畢業還有 ${STAGE_CONFIGS[stage].layerCount} 層次！請擲骰出發！`;
  }

  function stopTimer(): void {
    if (timerInterval.value !== null) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  }

  function startQuestionTimer(seconds: number): void {
    stopTimer();
    maxTimeLimit.value = seconds;
    timeRemaining.value = seconds;
    disabledOptionIndices.value = [];
    isAnswered.value = false;
    lastSelectedChoice.value = null;
    isLastAnswerCorrect.value = null;

    // 若為三選一模式，隨機隱藏 1 個錯誤選項
    if (isThreeChoiceMode.value && currentQuestion.value) {
      const wrongIndices = [0, 1, 2, 3].filter(i => i !== currentQuestion.value?.correctIndex);
      const randomWrong = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      disabledOptionIndices.value = [randomWrong];
    }

    timerInterval.value = window.setInterval(() => {
      timeRemaining.value -= 1;
      if (timeRemaining.value <= 3 && timeRemaining.value > 0) {
        soundEngine.playTick(true);
      } else if (timeRemaining.value > 3) {
        soundEngine.playTick(false);
      }

      if (timeRemaining.value <= 0) {
        stopTimer();
        handleTimeOut();
      }
    }, 1000);
  }

  function handleTimeOut(): void {
    if (isAnswered.value) return;
    isAnswered.value = true;
    isLastAnswerCorrect.value = false;
    soundEngine.playWrong();
    comboCount.value = 0;
    takeDamage(20);
    adjustRank(-2);
    hostComment.value = '作答時間到！猶豫不決痛失分數，體力扣除 20 點！';
  }

  function takeDamage(damage: number): void {
    playerHp.value = Math.max(0, playerHp.value - damage);
    if (playerHp.value <= 0) {
      triggerGameOver();
    }
  }

  function adjustRank(delta: number): void {
    rank.value = Math.max(0, Math.min(10, rank.value + delta));
  }

  /**
   * 玩家擲骰前進
   */
  function rollDice(): void {
    if (isRollingDice.value || activeModal.value !== 'NONE' || playerHp.value <= 0) return;

    // 若玩家正好在分叉點且未選擇路線，強制彈出分叉抉擇
    if (currentTile.value?.type === 'FORK' && currentBranch.value === 'MAIN') {
      activeModal.value = 'FORK_SELECT';
      soundEngine.playEvent();
      hostComment.value = '前方路線分叉！請先選擇走【上路: 理組與幸運】或【下路: 文藝與天才挑戰】！';
      return;
    }

    isRollingDice.value = true;
    let rollCounter = 0;

    const rollTimer = setInterval(() => {
      diceValue.value = Math.floor(Math.random() * 3) + 1; // 1 ~ 3 步，節奏適中
      soundEngine.playStep();
      rollCounter++;

      if (rollCounter >= 8) {
        clearInterval(rollTimer);
        isRollingDice.value = false;
        advancePath(diceValue.value);
      }
    }, 70);
  }

  /**
   * 依據目前分叉分支推進路徑
   * @param {number} steps 移動步數
   */
  function advancePath(steps: number): void {
    // 若在起點 (index: 0)，第一步會走到分叉點 (index: 1)
    if (currentTileIndex.value === 0) {
      currentTileIndex.value = 1;
      soundEngine.playStep();
      // 停在分叉點等待選擇
      activeModal.value = 'FORK_SELECT';
      soundEngine.playEvent();
      hostComment.value = '抵達分叉路標！請選擇要走【上路: 理科幸運】或【下路: 文科天才挑戰】！';
      return;
    }

    // 若已選分支 (UPPER 或 LOWER)
    const upperList = upperBranchTiles.value;
    const lowerList = lowerBranchTiles.value;
    const activeList = currentBranch.value === 'UPPER' ? upperList : lowerList;
    const examTile = mainExamTile.value;

    const currentSubIndex = activeList.findIndex(t => t.index === currentTileIndex.value);

    let nextTileIndex: number;
    if (currentSubIndex === -1) {
      // 剛離開分叉點，進入分支第 0 格
      const targetSub = Math.min(activeList.length - 1, steps - 1);
      nextTileIndex = activeList[targetSub].index;
    } else {
      const targetSub = currentSubIndex + steps;
      if (targetSub >= activeList.length) {
        // 到達終點升學大考！
        nextTileIndex = examTile ? examTile.index : activeList[activeList.length - 1].index;
      } else {
        nextTileIndex = activeList[targetSub].index;
      }
    }

    // 平滑前進
    currentTileIndex.value = nextTileIndex;
    soundEngine.playStep();
    resolveTileAction();
  }

  /**
   * 玩家在分叉點選擇路線
   * @param {BranchType} branch 選擇的分支 ('UPPER' | 'LOWER')
   */
  function chooseBranch(branch: BranchType): void {
    currentBranch.value = branch;
    activeModal.value = 'NONE';
    soundEngine.playCoin();

    const activeList = branch === 'UPPER' ? upperBranchTiles.value : lowerBranchTiles.value;
    // 馬上邁入該分支的第一格
    currentTileIndex.value = activeList[0].index;
    soundEngine.playStep();

    if (branch === 'UPPER') {
      hostComment.value = '選擇走【上路線: 理組與幸運】！小心前方的 TROUBLE 骷髏災難！';
    } else {
      hostComment.value = '選擇走【下路線: 文藝與挑戰】！前方有健康教育與天才高難問題！';
    }

    resolveTileAction();
  }

  /**
   * 踩中格子後的事件判定
   */
  function resolveTileAction(): void {
    const tile = currentTile.value;
    if (!tile) return;

    isThreeChoiceMode.value = false;
    isTalentMode.value = false;

    switch (tile.type) {
      case 'FORK': {
        activeModal.value = 'FORK_SELECT';
        soundEngine.playEvent();
        hostComment.value = '站在分叉路口！請選擇前往上路或下路！';
        break;
      }
      case 'THREE_CHOICE': {
        isThreeChoiceMode.value = true;
        const q = questionStore.pickQuestion(currentStage.value, tile.subject);
        if (q) {
          currentQuestion.value = q;
          activeModal.value = 'QUIZ';
          startQuestionTimer(12);
          soundEngine.playEvent();
          hostComment.value = '【三選一送分格】觸發！系統已剔除一個錯誤選項，輕鬆作答！';
        }
        break;
      }
      case 'TALENT': {
        isTalentMode.value = true;
        const q = questionStore.pickQuestion(currentStage.value, tile.subject);
        if (q) {
          currentQuestion.value = q;
          activeModal.value = 'QUIZ';
          startQuestionTimer(10);
          soundEngine.playEvent();
          hostComment.value = '🔥 進入【天才問題挑戰】！極限高難度！答對可獲雙倍學分與 400 分！';
        }
        break;
      }
      case 'TROUBLE': {
        soundEngine.playWrong();
        takeDamage(20);
        credits.value = Math.max(0, credits.value - 40);
        hostComment.value = '💀 踩中【TROUBLE 骷髏災難】！慘遭記過處分，體力 -20，學分扣除 40！';
        break;
      }
      case 'HEALTH': {
        soundEngine.playCorrect();
        playerHp.value = Math.min(maxHp.value, playerHp.value + 25);
        hostComment.value = '❤️ 上完【健康教育】護理課，體力回復 +25 點！精力充沛！';
        break;
      }
      case 'CANTEEN': {
        soundEngine.playShopBell();
        activeModal.value = 'CANTEEN';
        hostComment.value = '☀️ 踩中【LUCKY 福利社】！備妥道具與養樂多，升學之路更順遂！';
        break;
      }
      case 'EXTRACURRICULAR': {
        const q = questionStore.pickQuestion(currentStage.value, tile.subject || '課外');
        if (q) {
          currentQuestion.value = q;
          activeModal.value = 'NEWS_INTRO';
          hostComment.value = '📺【特別新聞快報】！現場連線新聞主播台，時事問題即將開跑！';
        }
        break;
      }
      case 'QUIZ': {
        const q = questionStore.pickQuestion(currentStage.value, tile.subject);
        if (q) {
          currentQuestion.value = q;
          activeModal.value = 'QUIZ';
          const limit = rank.value >= 7 ? 8 : rank.value >= 4 ? 10 : 12;
          startQuestionTimer(limit);
          hostComment.value = `現在進行【${tile.subject || '綜合'}】隨堂測驗！請選出正確答案！`;
        }
        break;
      }
      case 'EVENT': {
        soundEngine.playEvent();
        const ev = pickRandomCampusEvent();
        currentEvent.value = ev;
        playerHp.value = Math.max(0, Math.min(maxHp.value, playerHp.value + ev.hpChange));
        credits.value = Math.max(0, credits.value + ev.creditsChange);
        score.value += ev.scoreChange;
        activeModal.value = 'EVENT';
        hostComment.value = `校園突發事件：${ev.title}`;
        if (playerHp.value <= 0) triggerGameOver();
        break;
      }
      case 'RECOVERY': {
        soundEngine.playCorrect();
        playerHp.value = Math.min(maxHp.value, playerHp.value + 30);
        hostComment.value = '精神抖擻！體力充沛！朝著升學大考出發！';
        break;
      }
      case 'EXAM': {
        initBossExam();
        break;
      }
    }
  }

  function answerCurrentQuestion(choiceIndex: number): void {
    if (isAnswered.value || !currentQuestion.value) return;
    stopTimer();
    isAnswered.value = true;
    lastSelectedChoice.value = choiceIndex;

    const isCorrect = choiceIndex === currentQuestion.value.correctIndex;
    isLastAnswerCorrect.value = isCorrect;

    if (isCorrect) {
      soundEngine.playCorrect();
      comboCount.value += 1;

      // 天才問題雙倍獎勵
      const baseScore = isTalentMode.value ? 400 : 200;
      const speedBonus = Math.floor((timeRemaining.value / maxTimeLimit.value) * 100);
      const totalEarned = baseScore + speedBonus + comboCount.value * 50;

      score.value += totalEarned;
      const creditsEarned = isTalentMode.value ? 80 : 40;
      credits.value += creditsEarned;

      if (timeRemaining.value / maxTimeLimit.value >= 0.7) adjustRank(1);
      if (comboCount.value % 2 === 0) adjustRank(1);

      hostComment.value = `太優秀了！回答完全正確！獲得 ${totalEarned} 分與 ${creditsEarned} 學分！(連擊: ${comboCount.value})`;
    } else {
      soundEngine.playWrong();
      comboCount.value = 0;
      takeDamage(isTalentMode.value ? 25 : 15);
      adjustRank(-2);
      hostComment.value = `答錯了！正確答案是【${currentQuestion.value.options[currentQuestion.value.correctIndex]}】！損失體力！`;
    }
  }

  function closeQuizModal(): void {
    stopTimer();
    activeModal.value = 'NONE';
    currentQuestion.value = null;
    isThreeChoiceMode.value = false;
    isTalentMode.value = false;
  }

  function useItem(itemType: ItemType): boolean {
    if ((inventory.value[itemType] || 0) <= 0) return false;

    if (itemType === 'MAGNIFIER') {
      if (activeModal.value !== 'QUIZ' && activeModal.value !== 'BOSS_EXAM') return false;
      const activeQ = activeModal.value === 'BOSS_EXAM' ? bossExam.value.currentQuestion : currentQuestion.value;
      if (!activeQ || disabledOptionIndices.value.length >= 2) return false;

      const wrongIndices = [0, 1, 2, 3].filter(i => i !== activeQ.correctIndex && !disabledOptionIndices.value.includes(i));
      const chosenWrong = wrongIndices[0];
      disabledOptionIndices.value = [...disabledOptionIndices.value, chosenWrong];

      inventory.value.MAGNIFIER -= 1;
      soundEngine.playItemUse();
      hostComment.value = '使用了【名偵探放大鏡】！已排除錯誤選項！';
      return true;
    }

    if (itemType === 'CLOCK') {
      if (activeModal.value !== 'QUIZ' && activeModal.value !== 'BOSS_EXAM') return false;
      timeRemaining.value += 10;
      inventory.value.CLOCK -= 1;
      soundEngine.playItemUse();
      hostComment.value = '使用了【定時懷錶】！答題時間立即增加 +10 秒！';
      return true;
    }

    if (itemType === 'PASS_TICKET') {
      if (activeModal.value !== 'QUIZ' && activeModal.value !== 'BOSS_EXAM') return false;
      inventory.value.PASS_TICKET -= 1;
      soundEngine.playItemUse();

      const newQ = questionStore.pickQuestion(currentStage.value);
      if (newQ) {
        if (activeModal.value === 'BOSS_EXAM') {
          bossExam.value.currentQuestion = newQ;
        } else {
          currentQuestion.value = newQ;
        }
        disabledOptionIndices.value = [];
        startQuestionTimer(12);
        hostComment.value = '使用了【Pass 免試券】！成功更換了一道全新題目！';
      }
      return true;
    }

    if (itemType === 'YAKULT') {
      playerHp.value = Math.min(maxHp.value, playerHp.value + 35);
      inventory.value.YAKULT -= 1;
      soundEngine.playItemUse();
      hostComment.value = '喝下【冰鎮養樂多】！精神百倍，體力回復 +35 點！';
      return true;
    }

    return false;
  }

  function buyItem(item: GameItem): boolean {
    if (credits.value < item.price) {
      hostComment.value = '學分金幣不足！請多在隨堂考中答對題目賺取學分！';
      return false;
    }
    credits.value -= item.price;
    inventory.value[item.id] = (inventory.value[item.id] || 0) + 1;
    soundEngine.playCoin();
    hostComment.value = `成功購買【${item.name}】！目前持有數量：${inventory.value[item.id]}`;
    return true;
  }

  // ================= 升學 Boss 關卡邏輯 =================
  function initBossExam(): void {
    const config = currentStageConfig.value;
    soundEngine.playEvent();
    bossExam.value = {
      isActive: true,
      stage: currentStage.value,
      currentQuestionIndex: 0,
      passedCount: 0,
      targetCount: config.examRequiredPass,
      mistakesCount: 0,
      maxAllowedMistakes: config.examAllowedMistakes,
      isConsecutiveMode: config.examConsecutive,
      currentQuestion: null,
      timeRemaining: 10,
      isCleared: false,
      isFailed: false,
    };

    activeModal.value = 'BOSS_EXAM';
    hostComment.value = `緊張緊張！【${config.title}升學檢定大考】開始！必須答對 ${config.examRequiredPass} 題方可及格！`;
    loadNextBossQuestion();
  }

  function loadNextBossQuestion(): void {
    const q = questionStore.pickQuestion(currentStage.value);
    if (!q) return;

    bossExam.value.currentQuestion = q;
    disabledOptionIndices.value = [];
    isAnswered.value = false;
    lastSelectedChoice.value = null;
    isLastAnswerCorrect.value = null;
    startQuestionTimer(10);
  }

  function handleBossAnswer(choiceIndex: number): void {
    if (isAnswered.value || !bossExam.value.currentQuestion) return;
    stopTimer();
    isAnswered.value = true;
    lastSelectedChoice.value = choiceIndex;

    const isCorrect = choiceIndex === bossExam.value.currentQuestion.correctIndex;
    isLastAnswerCorrect.value = isCorrect;

    if (isCorrect) {
      soundEngine.playCorrect();
      bossExam.value.passedCount += 1;
      score.value += 300;

      if (bossExam.value.passedCount >= bossExam.value.targetCount) {
        bossExam.value.isCleared = true;
        soundEngine.playVictory();
        hostComment.value = `太狂了！通過【${currentStageConfig.value.title}升學大考】！取得畢業證書！`;
        setTimeout(() => {
          advanceToNextStage();
        }, 1800);
        return;
      }
    } else {
      soundEngine.playWrong();
      bossExam.value.mistakesCount += 1;
      takeDamage(20);

      if (bossExam.value.isConsecutiveMode && bossExam.value.passedCount > 0) {
        bossExam.value.passedCount -= 1;
        hostComment.value = '連續答對中斷！進度條倒扣 1 題！咬緊牙關再接再厲！';
      }

      if (!bossExam.value.isConsecutiveMode && bossExam.value.mistakesCount > bossExam.value.maxAllowedMistakes) {
        bossExam.value.isFailed = true;
        hostComment.value = '升學大考不及格！成績未達標，遭判定留級重修！';
        setTimeout(() => {
          activeModal.value = 'NONE';
          currentTileIndex.value = Math.max(0, currentTileIndex.value - 2);
        }, 1800);
        return;
      }
    }

    setTimeout(() => {
      if (bossExam.value.isActive && !bossExam.value.isCleared && !bossExam.value.isFailed && playerHp.value > 0) {
        loadNextBossQuestion();
      }
    }, 1200);
  }

  function advanceToNextStage(): void {
    activeModal.value = 'NONE';
    bossExam.value.isActive = false;

    if (currentStage.value === '國小') {
      currentStage.value = '國中';
    } else if (currentStage.value === '國中') {
      currentStage.value = '高中';
    } else if (currentStage.value === '高中') {
      currentStage.value = '大學';
    } else if (currentStage.value === '大學') {
      activeModal.value = 'VICTORY';
      soundEngine.playVictory();
      hostComment.value = '恭喜畢業！榮獲最高榮譽學位！登頂名人堂榜首！';
      return;
    }

    tiles.value = generateBoardTiles(currentStage.value);
    currentTileIndex.value = 0;
    currentBranch.value = 'MAIN';
    playerHp.value = 100;
    rank.value = STAGE_CONFIGS[currentStage.value].baseRank;
    hostComment.value = `恭喜榮升【${STAGE_CONFIGS[currentStage.value].title}】！離畢業還有 ${STAGE_CONFIGS[currentStage.value].layerCount} 層次！`;
  }

  function triggerGameOver(): void {
    stopTimer();
    soundEngine.playGameOver();
    activeModal.value = 'CONTINUE';
    continueCountdown.value = 9;

    if (continueTimer.value !== null) {
      clearInterval(continueTimer.value);
    }

    continueTimer.value = window.setInterval(() => {
      continueCountdown.value -= 1;
      soundEngine.playTick(true);

      if (continueCountdown.value <= 0) {
        if (continueTimer.value !== null) {
          clearInterval(continueTimer.value);
          continueTimer.value = null;
        }
        hostComment.value = '接關時間截止！遊戲結束，請查閱您的成績單！';
      }
    }, 1000);
  }

  function insertCoinToContinue(): boolean {
    if (coins.value <= 0) {
      hostComment.value = '代幣不足！無法續關！';
      return false;
    }

    if (continueTimer.value !== null) {
      clearInterval(continueTimer.value);
      continueTimer.value = null;
    }

    coins.value -= 1;
    soundEngine.playCoin();
    playerHp.value = 100;
    activeModal.value = 'NONE';
    hostComment.value = '投幣成功！學籍保留！原地滿血復活繼續挑戰！';
    return true;
  }

  function giveUpContinue(): void {
    if (continueTimer.value !== null) {
      clearInterval(continueTimer.value);
      continueTimer.value = null;
    }
    continueCountdown.value = 0;
  }

  return {
    // 狀態
    currentStage,
    tiles,
    currentTileIndex,
    currentBranch,
    playerHp,
    maxHp,
    credits,
    score,
    coins,
    comboCount,
    rank,
    inventory,
    isRollingDice,
    diceValue,
    activeModal,
    currentQuestion,
    isThreeChoiceMode,
    isTalentMode,
    timeRemaining,
    maxTimeLimit,
    disabledOptionIndices,
    isAnswered,
    lastSelectedChoice,
    isLastAnswerCorrect,
    hostComment,
    currentEvent,
    transferMessage,
    bossExam,
    continueCountdown,
    currentStageConfig,
    currentTile,
    upperBranchTiles,
    lowerBranchTiles,
    mainStartTile,
    mainForkTile,
    mainExamTile,
    remainingLayers,

    // 方法
    startNewGame,
    rollDice,
    chooseBranch,
    startQuestionTimer,
    answerCurrentQuestion,
    closeQuizModal,
    useItem,
    buyItem,
    initBossExam,
    handleBossAnswer,
    insertCoinToContinue,
    giveUpContinue,
  };
});
