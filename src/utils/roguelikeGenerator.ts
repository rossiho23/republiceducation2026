/**
 * @file roguelikeGenerator.ts
 * @description Slay the Spire 式樹狀節點網絡地圖生成器 (Roguelike Map Generator)
 * 負責依據各學程階段與自選關卡長度 (30 關長征挑戰 vs 40 關終極馬拉松) 動態程序化產生多樓層、分支分叉與匯流之自主選路地圖。
 */

import { RoguelikeNode, StageGrade, GameLengthMode, SubjectType, DifficultyType, RoguelikeNodeType } from '../types/quiz';

/**
 * 節點樣板定義介面
 */
interface NodeTemplate {
  type: RoguelikeNodeType;
  title: string;
  subject: SubjectType;
  difficulty: DifficultyType;
  icon: string;
}

/** 一般學科隨堂考與校園奇遇題庫池 */
const NORMAL_FLOOR_TEMPLATES: NodeTemplate[][] = [
  [
    { type: 'QUIZ_NORMAL', title: '自然科隨堂考', subject: '自然', difficulty: '普通', icon: '🔬' },
    { type: 'QUIZ_NORMAL', title: '歷史科隨堂考', subject: '歷史', difficulty: '普通', icon: '📜' }
  ],
  [
    { type: 'QUIZ_NORMAL', title: '國文修辭小試', subject: '國文', difficulty: '普通', icon: '📖' },
    { type: 'QUIZ_NORMAL', title: '地理名勝考察', subject: '地理', difficulty: '普通', icon: '🗺️' },
    { type: 'QUIZ_NORMAL', title: '生活健康常識', subject: '健康教育', difficulty: '簡單', icon: '❤️' }
  ],
  [
    { type: 'CAMPUS_FATE', title: '校園突發事件', subject: '課外', difficulty: '簡單', icon: '🎲' },
    { type: 'QUIZ_NORMAL', title: '公民生活常識', subject: '社會', difficulty: '普通', icon: '🏛️' },
    { type: 'CAMPUS_FATE', title: '自習室巧遇同窗', subject: '課外', difficulty: '簡單', icon: '📚' }
  ],
  [
    { type: 'QUIZ_NORMAL', title: '數理邏輯演繹', subject: '數學', difficulty: '普通', icon: '📐' },
    { type: 'QUIZ_NORMAL', title: '藝能美學賞析', subject: '藝能', difficulty: '普通', icon: '🎨' }
  ],
  [
    { type: 'QUIZ_NORMAL', title: '世界文化常識', subject: '地理', difficulty: '普通', icon: '🌍' },
    { type: 'QUIZ_NORMAL', title: '名著文選閱讀', subject: '國文', difficulty: '普通', icon: '📚' },
    { type: 'CAMPUS_FATE', title: '操場廣播奇遇', subject: '體育運動', difficulty: '簡單', icon: '⚡' }
  ],
  [
    { type: 'QUIZ_NORMAL', title: '科學專案試驗', subject: '自然', difficulty: '普通', icon: '⚗️' },
    { type: 'QUIZ_NORMAL', title: '社會法規常識', subject: '社會', difficulty: '普通', icon: '⚖️' }
  ],
  [
    { type: 'QUIZ_NORMAL', title: '全真第一模擬考', subject: '數學', difficulty: '普通', icon: '📄' },
    { type: 'QUIZ_NORMAL', title: '全真第二模擬考', subject: '社會', difficulty: '普通', icon: '📄' },
    { type: 'QUIZ_NORMAL', title: '衛生急救常識', subject: '健康教育', difficulty: '簡單', icon: '🩹' }
  ],
  [
    { type: 'CAMPUS_FATE', title: '學長姐筆記傳承', subject: '課外', difficulty: '簡單', icon: '📒' },
    { type: 'QUIZ_NORMAL', title: '課外生活大百科', subject: '課外', difficulty: '普通', icon: '💡' }
  ]
];

/** 多媒體特考 (8-bit 聽力與視覺局部放大) 樣板池 */
const MEDIA_FLOOR_TEMPLATES: NodeTemplate[][] = [
  [
    { type: 'AUDIO_EVENT', title: '8-Bit 聽力猜歌', subject: '流行音樂', difficulty: '普通', icon: '🎵' },
    { type: 'VISUAL_EVENT', title: '局部放大謎題', subject: '時事冷知識', difficulty: '普通', icon: '🔍' },
    { type: 'QUIZ_NORMAL', title: '生活健康常識', subject: '健康教育', difficulty: '簡單', icon: '❤️' }
  ],
  [
    { type: 'AUDIO_EVENT', title: '經典曲目盲猜', subject: '流行音樂', difficulty: '普通', icon: '🎧' },
    { type: 'VISUAL_EVENT', title: '老照片懷舊記憶', subject: '時事冷知識', difficulty: '普通', icon: '📷' }
  ],
  [
    { type: 'AUDIO_EVENT', title: '流行旋律聽音辨曲', subject: '流行音樂', difficulty: '普通', icon: '📻' },
    { type: 'VISUAL_EVENT', title: '古蹟景點辨識', subject: '時事冷知識', difficulty: '普通', icon: '🔍' },
    { type: 'CAMPUS_FATE', title: '音樂教室午後小憩', subject: '藝能', difficulty: '簡單', icon: '🎼' }
  ]
];

/** 高難度菁英挑戰樣板池 */
const ELITE_FLOOR_TEMPLATES: NodeTemplate[][] = [
  [
    { type: 'QUIZ_ELITE', title: '🔥 理化菁英挑戰', subject: '自然', difficulty: '困難', icon: '🏆' },
    { type: 'QUIZ_ELITE', title: '🔥 數學奧數菁英', subject: '數學', difficulty: '困難', icon: '📐' }
  ],
  [
    { type: 'QUIZ_ELITE', title: '🔥 期中甲級模擬考', subject: '數學', difficulty: '困難', icon: '📝' },
    { type: 'QUIZ_ELITE', title: '🔥 期中乙級模擬考', subject: '社會', difficulty: '困難', icon: '📜' }
  ],
  [
    { type: 'QUIZ_ELITE', title: '🔥 天才博弈題庫', subject: '自然', difficulty: '困難', icon: '💡' },
    { type: 'CAMPUS_FATE', title: '教務處表揚獎勵', subject: '課外', difficulty: '簡單', icon: '🎖️' },
    { type: 'QUIZ_ELITE', title: '🔥 史哲狀元測驗', subject: '歷史', difficulty: '困難', icon: '⚔️' }
  ],
  [
    { type: 'QUIZ_ELITE', title: '🔥 全國奧賽理組題', subject: '自然', difficulty: '困難', icon: '🌟' },
    { type: 'QUIZ_ELITE', title: '🔥 全國奧賽文組題', subject: '國文', difficulty: '困難', icon: '🖋️' }
  ]
];

/** 福利社與休息補給樣板池 */
const REST_FLOOR_TEMPLATES: NodeTemplate[][] = [
  [
    { type: 'CANTEEN_REST', title: '校園福利社補給站', subject: '課外', difficulty: '簡單', icon: '🛒' },
    { type: 'CAMPUS_FATE', title: '圖書館靜心自修', subject: '課外', difficulty: '簡單', icon: '📚' }
  ],
  [
    { type: 'CANTEEN_REST', title: '中繼福利社休息區', subject: '課外', difficulty: '簡單', icon: '🧃' }
  ]
];

/**
 * 依據學程與遊戲長度模式產生專屬的 Roguelike 樹狀分支地圖
 * @param {StageGrade} stage 學程階段 (國小/國中/高中/大學)
 * @param {GameLengthMode} [length=30] 關卡長度模式 (30: 三十關長征挑戰, 40: 四十關終極馬拉松)
 * @returns {RoguelikeNode[][]} 分層節點陣列 (由 Floor 0 至頂層 Boss 戰)
 */
export function generateRoguelikeMap(stage: StageGrade, length: GameLengthMode = 30): RoguelikeNode[][] {
  return generateProceduralFloorMap(stage, length);
}

/**
 * 程序化生成指定總層數 (30 層或 40 層) 之樹狀分支節點地圖與拓撲連線
 * @param {StageGrade} stage 學程階段
 * @param {number} totalFloors 總樓層數 (30 或 40)
 * @returns {RoguelikeNode[][]} 完整連接之節點矩陣
 */
function generateProceduralFloorMap(stage: StageGrade, totalFloors: number): RoguelikeNode[][] {
  const floors: RoguelikeNode[][] = [];

  for (let f = 0; f < totalFloors; f++) {
    // 1. Floor 0: 起始入學檢定 (單一入口)
    if (f === 0) {
      floors.push([
        {
          id: `node-${stage}-f0-0`,
          floor: 0,
          colIndex: 0,
          type: 'QUIZ_NORMAL',
          title: '開學實力檢定',
          subject: '國文',
          difficulty: '簡單',
          icon: '📝',
          isAvailable: true,
          isVisited: false,
          nextNodeIds: []
        }
      ]);
      continue;
    }

    // 2. 頂層 (totalFloors - 1): 期末升學檢定大考 Boss 戰 (單一匯流終點)
    if (f === totalFloors - 1) {
      floors.push([
        {
          id: `node-${stage}-f${f}-0`,
          floor: f,
          colIndex: 0,
          type: 'FINAL_EXAM',
          title: `【${stage}升學大考】${totalFloors}關總檢定`,
          subject: '綜合',
          difficulty: '困難',
          icon: '🎓',
          isAvailable: false,
          isVisited: false,
          nextNodeIds: []
        }
      ]);
      continue;
    }

    // 3. 倒數第二層 (totalFloors - 2): 考前最終福利社大整備 (匯流整備點)
    if (f === totalFloors - 2) {
      floors.push([
        {
          id: `node-${stage}-f${f}-0`,
          floor: f,
          colIndex: 0,
          type: 'CANTEEN_REST',
          title: '福利社考前大整備',
          subject: '課外',
          difficulty: '簡單',
          icon: '🛒',
          isAvailable: false,
          isVisited: false,
          nextNodeIds: []
        }
      ]);
      continue;
    }

    // 4. 中間樓層 (1 ~ totalFloors - 3) 依周期配置不同特色節點
    let templates: NodeTemplate[];
    if (f % 6 === 0) {
      // 每 6 層配置福利社補給區
      templates = REST_FLOOR_TEMPLATES[(f / 6) % REST_FLOOR_TEMPLATES.length];
    } else if (f % 5 === 0) {
      // 每 5 層配置高難度菁英挑戰
      templates = ELITE_FLOOR_TEMPLATES[(f / 5) % ELITE_FLOOR_TEMPLATES.length];
    } else if (f % 4 === 2) {
      // 周期配置 8-bit 聽力與視覺放大特考
      templates = MEDIA_FLOOR_TEMPLATES[Math.floor(f / 4) % MEDIA_FLOOR_TEMPLATES.length];
    } else {
      // 常規學科隨堂考與校園奇遇分支
      templates = NORMAL_FLOOR_TEMPLATES[f % NORMAL_FLOOR_TEMPLATES.length];
    }

    const floorNodes: RoguelikeNode[] = templates.map((tpl, colIdx) => ({
      id: `node-${stage}-f${f}-${colIdx}`,
      floor: f,
      colIndex: colIdx,
      type: tpl.type,
      title: tpl.title,
      subject: tpl.subject,
      difficulty: tpl.difficulty,
      icon: tpl.icon,
      isAvailable: false,
      isVisited: false,
      nextNodeIds: []
    }));

    floors.push(floorNodes);
  }

  // 5. 自動建立上下樓層節點之拓撲連線 (確保每個節點皆有前進路線且無死路)
  for (let f = 0; f < totalFloors - 1; f++) {
    const currentFloor = floors[f];
    const nextFloor = floors[f + 1];
    const m = currentFloor.length;
    const n = nextFloor.length;

    if (n === 1) {
      currentFloor.forEach((node) => {
        node.nextNodeIds = [nextFloor[0].id];
      });
    } else if (m === 1) {
      currentFloor[0].nextNodeIds = nextFloor.map((target) => target.id);
    } else if (m === 2 && n === 2) {
      currentFloor[0].nextNodeIds = [nextFloor[0].id, nextFloor[1].id];
      currentFloor[1].nextNodeIds = [nextFloor[0].id, nextFloor[1].id];
    } else if (m === 2 && n === 3) {
      currentFloor[0].nextNodeIds = [nextFloor[0].id, nextFloor[1].id];
      currentFloor[1].nextNodeIds = [nextFloor[1].id, nextFloor[2].id];
    } else if (m === 3 && n === 2) {
      currentFloor[0].nextNodeIds = [nextFloor[0].id];
      currentFloor[1].nextNodeIds = [nextFloor[0].id, nextFloor[1].id];
      currentFloor[2].nextNodeIds = [nextFloor[1].id];
    } else {
      // m === 3 && n === 3
      currentFloor[0].nextNodeIds = [nextFloor[0].id, nextFloor[1].id];
      currentFloor[1].nextNodeIds = [nextFloor[1].id];
      currentFloor[2].nextNodeIds = [nextFloor[1].id, nextFloor[2].id];
    }
  }

  return floors;
}
