/**
 * @file roguelikeGenerator.ts
 * @description Slay the Spire 式樹狀節點網絡地圖生成器 (Roguelike Map Generator)
 * 負責依據各學程階段動態產生多樓層、分支分叉與匯流之自主選路節點地圖。
 */

import { RoguelikeNode, RoguelikeNodeType, StageGrade, SubjectType, DifficultyType } from '../types/quiz';

const SUBJECT_LIST: SubjectType[] = ['國文', '數學', '自然', '社會', '流行音樂', '時事冷知識', '體育運動', '藝能'];

/**
 * 依據學程產生專屬的 Roguelike 樹狀分支地圖
 * @param {StageGrade} stage 學程階段 (國小/國中/高中/大學)
 * @returns {RoguelikeNode[][]} 分層節點陣列 (每層包含若干節點)
 */
export function generateRoguelikeMap(stage: StageGrade): RoguelikeNode[][] {
  const floors: RoguelikeNode[][] = [];

  // ================= Floor 0: 起始入學節點 =================
  const startNode: RoguelikeNode = {
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
  floors.push([startNode]);

  // ================= Floor 1: 雙軌初試 (理組冒險 vs 文組精修) =================
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
    nextNodeIds: [`node-${stage}-f2-1`, `node-${stage}-f2-2`]
  };
  floors.push([f1_0, f1_1]);

  // ================= Floor 2: 多媒體與菁英分歧 (聽力猜歌 / 菁英挑戰 / 視覺謎題) =================
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
    nextNodeIds: [`node-${stage}-f3-0`]
  };
  const f2_1: RoguelikeNode = {
    id: `node-${stage}-f2-1`,
    floor: 2,
    colIndex: 1,
    type: 'QUIZ_ELITE',
    title: '🔥 菁英高難挑戰',
    subject: '數學',
    difficulty: '困難',
    icon: '⚔️',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f3-0`, `node-${stage}-f3-1`]
  };
  const f2_2: RoguelikeNode = {
    id: `node-${stage}-f2-2`,
    floor: 2,
    colIndex: 2,
    type: 'VISUAL_EVENT',
    title: '視覺局部照片謎題',
    subject: '時事冷知識',
    difficulty: '普通',
    icon: '🔍',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f3-1`]
  };
  floors.push([f2_0, f2_1, f2_2]);

  // ================= Floor 3: 福利社補給與突發命運 =================
  const f3_0: RoguelikeNode = {
    id: `node-${stage}-f3-0`,
    floor: 3,
    colIndex: 0,
    type: 'CANTEEN_REST',
    title: 'LUCKY 福利社休息站',
    subject: '課外',
    difficulty: '簡單',
    icon: '☕',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f4-0`, `node-${stage}-f4-1`]
  };
  const f3_1: RoguelikeNode = {
    id: `node-${stage}-f3-1`,
    floor: 3,
    colIndex: 1,
    type: 'CAMPUS_FATE',
    title: '校園突發命運事件',
    subject: '藝能',
    difficulty: '普通',
    icon: '🎲',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f4-1`, `node-${stage}-f4-2`]
  };
  floors.push([f3_0, f3_1]);

  // ================= Floor 4: 進階學科測驗 (三岔路) =================
  const f4_0: RoguelikeNode = {
    id: `node-${stage}-f4-0`,
    floor: 4,
    colIndex: 0,
    type: 'QUIZ_NORMAL',
    title: '國學常識大考驗',
    subject: '國文',
    difficulty: '普通',
    icon: '📚',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f5-0`]
  };
  const f4_1: RoguelikeNode = {
    id: `node-${stage}-f4-1`,
    floor: 4,
    colIndex: 1,
    type: 'AUDIO_EVENT',
    title: '經典動漫音樂會',
    subject: '藝能',
    difficulty: '普通',
    icon: '🎵',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f5-0`, `node-${stage}-f5-1`]
  };
  const f4_2: RoguelikeNode = {
    id: `node-${stage}-f4-2`,
    floor: 4,
    colIndex: 2,
    type: 'QUIZ_NORMAL',
    title: '自然與科技挑戰',
    subject: '自然',
    difficulty: '普通',
    icon: '🔬',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f5-1`]
  };
  floors.push([f4_0, f4_1, f4_2]);

  // ================= Floor 5: 決戰前哨 (菁英怪 vs 最後補給) =================
  const f5_0: RoguelikeNode = {
    id: `node-${stage}-f5-0`,
    floor: 5,
    colIndex: 0,
    type: 'QUIZ_ELITE',
    title: '🔥 奧林匹亞菁英考',
    subject: '數學',
    difficulty: '困難',
    icon: '🏆',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f6-0`]
  };
  const f5_1: RoguelikeNode = {
    id: `node-${stage}-f5-1`,
    floor: 5,
    colIndex: 1,
    type: 'CANTEEN_REST',
    title: '福利社最後整備',
    subject: '課外',
    difficulty: '簡單',
    icon: '🛒',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f6-0`]
  };
  floors.push([f5_0, f5_1]);

  // ================= Floor 6: 考前自習室 (匯流充電) =================
  const f6_0: RoguelikeNode = {
    id: `node-${stage}-f6-0`,
    floor: 6,
    colIndex: 0,
    type: 'CAMPUS_FATE',
    title: '考前圖書館自修室',
    subject: '體育運動',
    difficulty: '簡單',
    icon: '💡',
    isAvailable: false,
    isVisited: false,
    nextNodeIds: [`node-${stage}-f7-0`]
  };
  floors.push([f6_0]);

  // ================= Floor 7: 頂層期末升學檢定大考 (Boss 戰) =================
  const bossNode: RoguelikeNode = {
    id: `node-${stage}-f7-0`,
    floor: 7,
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
