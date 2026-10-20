/**
 * @file roguelikeGenerator.ts
 * @description Slay the Spire 式樹狀節點網絡地圖生成器 (Roguelike Map Generator)
 * 負責依據各學程階段與自選關卡長度 (5 關速通 vs 10 關馬拉松) 動態產生多樓層、分支分叉與匯流之自主選路地圖。
 */

import { RoguelikeNode, StageGrade, GameLengthMode } from '../types/quiz';

/**
 * 依據學程與遊戲長度模式產生專屬的 Roguelike 樹狀分支地圖
 * @param {StageGrade} stage 學程階段 (國小/國中/高中/大學)
 * @param {GameLengthMode} [length=10] 關卡長度模式 (5: 五關速通賽, 10: 十關馬拉松)
 * @returns {RoguelikeNode[][]} 分層節點陣列 (由 Floor 0 至頂層 Boss 戰)
 */
export function generateRoguelikeMap(stage: StageGrade, length: GameLengthMode = 10): RoguelikeNode[][] {
  if (length === 5) {
    return generateFiveFloorMap(stage);
  }
  return generateTenFloorMap(stage);
}

/**
 * 產生 5 關速通賽地圖 (Floors 0~4)
 * @param {StageGrade} stage 學程階段
 * @returns {RoguelikeNode[][]} 5 層節點網絡
 */
function generateFiveFloorMap(stage: StageGrade): RoguelikeNode[][] {
  const floors: RoguelikeNode[][] = [];

  // Floor 0: 起始入學檢定
  const f0_0: RoguelikeNode = {
    id: `node-${stage}-f0-0`,
    floor: 0,
    colIndex: 0,
    type: 'QUIZ_NORMAL',
    title: '開學隨堂檢定',
    subject: '國文',
    difficulty: '簡單',
    icon: '📖',
    isAvailable: true,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f1-0`, `node-${stage}-f1-1`]
  };
  floors.push([f0_0]);

  // Floor 1: 雙軌初試 (理化 vs 社會)
  const f1_0: RoguelikeNode = {
    id: `node-${stage}-f1-0`,
    floor: 1,
    colIndex: 0,
    type: 'QUIZ_NORMAL',
    title: '理化探索',
    subject: '自然',
    difficulty: '普通',
    icon: '🧪',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f2-0`, `node-${stage}-f2-1`]
  };
  const f1_1: RoguelikeNode = {
    id: `node-${stage}-f1-1`,
    floor: 1,
    colIndex: 1,
    type: 'QUIZ_NORMAL',
    title: '人文史地',
    subject: '社會',
    difficulty: '簡單',
    icon: '📜',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f2-0`, `node-${stage}-f2-1`]
  };
  floors.push([f1_0, f1_1]);

  // Floor 2: 多媒體特色測驗 (聽力猜歌 vs 局部照片)
  const f2_0: RoguelikeNode = {
    id: `node-${stage}-f2-0`,
    floor: 2,
    colIndex: 0,
    type: 'AUDIO_EVENT',
    title: '8-bit 聽力猜歌',
    subject: '流行音樂',
    difficulty: '普通',
    icon: '🎧',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f3-0`, `node-${stage}-f3-1`]
  };
  const f2_1: RoguelikeNode = {
    id: `node-${stage}-f2-1`,
    floor: 2,
    colIndex: 1,
    type: 'VISUAL_EVENT',
    title: '局部放大謎題',
    subject: '時事冷知識',
    difficulty: '普通',
    icon: '🔍',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f3-0`, `node-${stage}-f3-1`]
  };
  floors.push([f2_0, f2_1]);

  // Floor 3: 考前整備 (福利社採購 vs 自習充電)
  const f3_0: RoguelikeNode = {
    id: `node-${stage}-f3-0`,
    floor: 3,
    colIndex: 0,
    type: 'CANTEEN_REST',
    title: '福利社補給站',
    subject: '課外',
    difficulty: '簡單',
    icon: '🛒',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f4-0`]
  };
  const f3_1: RoguelikeNode = {
    id: `node-${stage}-f3-1`,
    floor: 3,
    colIndex: 1,
    type: 'CAMPUS_FATE',
    title: '考前自修充電',
    subject: '體育運動',
    difficulty: '簡單',
    icon: '💡',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f4-0`]
  };
  floors.push([f3_0, f3_1]);

  // Floor 4: 頂層升學檢定大考 (Boss 戰)
  const bossNode: RoguelikeNode = {
    id: `node-${stage}-f4-0`,
    floor: 4,
    colIndex: 0,
    type: 'FINAL_EXAM',
    title: `【${stage}升學大考】期末檢定`,
    subject: '綜合',
    difficulty: '困難',
    icon: '👑',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: []
  };
  floors.push([bossNode]);

  return floors;
}

/**
 * 產生 10 關馬拉松完整地圖 (Floors 0~9)
 * @param {StageGrade} stage 學程階段
 * @returns {RoguelikeNode[][]} 10 層節點網絡
 */
function generateTenFloorMap(stage: StageGrade): RoguelikeNode[][] {
  const floors: RoguelikeNode[][] = [];

  // Floor 0: 起始入學
  floors.push([{
    id: `node-${stage}-f0-0`,
    floor: 0,
    colIndex: 0,
    type: 'QUIZ_NORMAL',
    title: '開學隨堂檢定',
    subject: '國文',
    difficulty: '簡單',
    icon: '📖',
    isAvailable: true,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f1-0`, `node-${stage}-f1-1`]
  }]);

  // Floor 1: 雙軌初試
  floors.push([
    {
      id: `node-${stage}-f1-0`,
      floor: 1,
      colIndex: 0,
      type: 'QUIZ_NORMAL',
      title: '理化探索',
      subject: '自然',
      difficulty: '普通',
      icon: '🧪',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f2-0`, `node-${stage}-f2-1`]
    },
    {
      id: `node-${stage}-f1-1`,
      floor: 1,
      colIndex: 1,
      type: 'QUIZ_NORMAL',
      title: '人文史地',
      subject: '社會',
      difficulty: '簡單',
      icon: '📜',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f2-1`, `node-${stage}-f2-2`]
    }
  ]);

  // Floor 2: 多媒體聽力與視覺
  floors.push([
    {
      id: `node-${stage}-f2-0`,
      floor: 2,
      colIndex: 0,
      type: 'AUDIO_EVENT',
      title: '8-bit 聽力猜歌',
      subject: '流行音樂',
      difficulty: '普通',
      icon: '🎧',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f3-0`]
    },
    {
      id: `node-${stage}-f2-1`,
      floor: 2,
      colIndex: 1,
      type: 'QUIZ_ELITE',
      title: '菁英突破考',
      subject: '數學',
      difficulty: '困難',
      icon: '⚡',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f3-0`, `node-${stage}-f3-1`]
    },
    {
      id: `node-${stage}-f2-2`,
      floor: 2,
      colIndex: 2,
      type: 'VISUAL_EVENT',
      title: '局部放大謎題',
      subject: '時事冷知識',
      difficulty: '普通',
      icon: '🔍',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f3-1`]
    }
  ]);

  // Floor 3: 前期補給 (福利社)
  floors.push([
    {
      id: `node-${stage}-f3-0`,
      floor: 3,
      colIndex: 0,
      type: 'CANTEEN_REST',
      title: '校園福利社',
      subject: '課外',
      difficulty: '簡單',
      icon: '🛒',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f4-0`, `node-${stage}-f4-1`]
    },
    {
      id: `node-${stage}-f3-1`,
      floor: 3,
      colIndex: 1,
      type: 'CAMPUS_FATE',
      title: '操場廣播奇遇',
      subject: '體育運動',
      difficulty: '簡單',
      icon: '⚡',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f4-1`, `node-${stage}-f4-2`]
    }
  ]);

  // Floor 4: 中期學科抽考
  floors.push([
    {
      id: `node-${stage}-f4-0`,
      floor: 4,
      colIndex: 0,
      type: 'QUIZ_NORMAL',
      title: '數理演繹考',
      subject: '數學',
      difficulty: '普通',
      icon: '📐',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f5-0`]
    },
    {
      id: `node-${stage}-f4-1`,
      floor: 4,
      colIndex: 1,
      type: 'QUIZ_NORMAL',
      title: '藝能常識考',
      subject: '藝能',
      difficulty: '普通',
      icon: '🎨',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f5-0`, `node-${stage}-f5-1`]
    },
    {
      id: `node-${stage}-f4-2`,
      floor: 4,
      colIndex: 2,
      type: 'QUIZ_NORMAL',
      title: '生活健康常識',
      subject: '健康教育',
      difficulty: '簡單',
      icon: '❤️',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f5-1`]
    }
  ]);

  // Floor 5: 奧林匹亞菁英對決
  floors.push([
    {
      id: `node-${stage}-f5-0`,
      floor: 5,
      colIndex: 0,
      type: 'QUIZ_ELITE',
      title: '🔥 奧林匹亞菁英考',
      subject: '自然',
      difficulty: '困難',
      icon: '🏆',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f6-0`, `node-${stage}-f6-1`]
    },
    {
      id: `node-${stage}-f5-1`,
      floor: 5,
      colIndex: 1,
      type: 'QUIZ_ELITE',
      title: '文史狀元爭霸考',
      subject: '國文',
      difficulty: '困難',
      icon: '📜',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f6-0`, `node-${stage}-f6-1`]
    }
  ]);

  // Floor 6: 校園突發事件
  floors.push([
    {
      id: `node-${stage}-f6-0`,
      floor: 6,
      colIndex: 0,
      type: 'CAMPUS_FATE',
      title: '校園突發事件',
      subject: '課外',
      difficulty: '簡單',
      icon: '🎲',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f7-0`]
    },
    {
      id: `node-${stage}-f6-1`,
      floor: 6,
      colIndex: 1,
      type: 'AUDIO_EVENT',
      title: '懷舊綜藝猜旋律',
      subject: '流行音樂',
      difficulty: '普通',
      icon: '🎵',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f7-1`]
    }
  ]);

  // Floor 7: 模擬考總複習
  floors.push([
    {
      id: `node-${stage}-f7-0`,
      floor: 7,
      colIndex: 0,
      type: 'QUIZ_NORMAL',
      title: '升學第一模擬考',
      subject: '社會',
      difficulty: '普通',
      icon: '📝',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f8-0`]
    },
    {
      id: `node-${stage}-f7-1`,
      floor: 7,
      colIndex: 1,
      type: 'QUIZ_NORMAL',
      title: '升學第二模擬考',
      subject: '數學',
      difficulty: '普通',
      icon: '📝',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f8-0`]
    }
  ]);

  // Floor 8: 考前衝刺福利社與自修室 (匯流充電)
  floors.push([
    {
      id: `node-${stage}-f8-0`,
      floor: 8,
      colIndex: 0,
      type: 'CANTEEN_REST',
      title: '福利社最後整備',
      subject: '課外',
      difficulty: '簡單',
      icon: '🛒',
      isAvailable: false,
      isVisited: false,
      nextNodeIds: [`node-${stage}-f9-0`]
    }
  ]);

  // Floor 9: 頂層期末升學檢定大考 (Boss 戰)
  floors.push([{
    id: `node-${stage}-f9-0`,
    floor: 9,
    colIndex: 0,
    type: 'FINAL_EXAM',
    title: `【${stage}升學大考】期末檢定`,
    subject: '綜合',
    difficulty: '困難',
    icon: '👑',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: []
  }]);

  return floors;
}
