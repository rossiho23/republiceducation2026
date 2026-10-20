/**
 * @file boardGenerator.ts
 * @description 學程地圖雙軌分叉路線產生器 (致敬 pic/map1.jpg)
 * 依據各升學階段配置起點、分叉選擇點 (FORK)、上分歧路線 (UPPER) 與下分歧路線 (LOWER)，並匯流至升學大考 Boss 關卡。
 */

import { MapTile, StageGrade, StageConfig, RandomEvent, GameItem, GameLengthMode } from '../types/quiz';

/** 各學程設定參數表 */
export const STAGE_CONFIGS: Record<StageGrade, StageConfig> = {
  國小: {
    grade: '國小',
    title: '國民小學',
    totalTiles: 12,
    examRequiredPass: 3,
    examAllowedMistakes: 2,
    examConsecutive: false,
    badgeColor: '#00FFA3', // 亮青綠
    baseRank: 1,
    layerCount: 15,
  },
  國中: {
    grade: '國中',
    title: '國民中學',
    totalTiles: 12,
    examRequiredPass: 4,
    examAllowedMistakes: 2,
    examConsecutive: false,
    badgeColor: '#00D2FF', // 街機青藍
    baseRank: 3,
    layerCount: 12,
  },
  高中: {
    grade: '高中',
    title: '高級中學',
    totalTiles: 14,
    examRequiredPass: 5,
    examAllowedMistakes: 1,
    examConsecutive: false,
    badgeColor: '#FFDD00', // 亮黃
    baseRank: 5,
    layerCount: 10, // 致敬截圖：「離畢業還有 10 層次」
  },
  大學: {
    grade: '大學',
    title: '最高學府',
    totalTiles: 14,
    examRequiredPass: 5,
    examAllowedMistakes: 0,
    examConsecutive: true, // 大學畢業考：連續答對 5 題
    badgeColor: '#FF2A55', // 熱血紅
    baseRank: 7,
    layerCount: 5,
  },
  通用: {
    grade: '通用',
    title: '終身學習',
    totalTiles: 12,
    examRequiredPass: 3,
    examAllowedMistakes: 2,
    examConsecutive: false,
    badgeColor: '#AF52DE',
    baseRank: 3,
    layerCount: 8,
  }
};

/** 福利社可購買之道具資料清單 */
export const CANTEEN_ITEMS: GameItem[] = [
  {
    id: 'MAGNIFIER',
    name: '名偵探放大鏡',
    icon: '🔍',
    description: '50/50 剔除：立即刪除兩個錯誤答案，僅留二選一！',
    price: 150
  },
  {
    id: 'CLOCK',
    name: '定時懷錶',
    icon: '⏰',
    description: '延長作答：當前題目立即增加 +10 秒作答時間！',
    price: 100
  },
  {
    id: 'PASS_TICKET',
    name: 'Pass 免試券',
    icon: '🎫',
    description: '換題神券：跳過當前刁鑽難題，免費更換新題目！',
    price: 200
  },
  {
    id: 'YAKULT',
    name: '冰鎮養樂多',
    icon: '🧃',
    description: '體力補給：立即回復 35 點體力愛心（HP）！',
    price: 120
  }
];

/**
 * 產生雙軌分叉地圖格子集合
 * 架構：
 * 1. 起點「昇學」
 * 2. 分叉選擇格 (FORK)
 * 3. 上分歧路線 (UPPER BRANCH / 理科與冒險)：自然理化、流行音樂、三選一、LUCKY 福利社、TROUBLE 骷髏
 * 4. 下分歧路線 (LOWER BRANCH / 文藝與挑戰)：健康教育、美術、天才問題、問號事件、課外常識
 * 5. 終點「升學大考 Boss 關卡」
 * 
 * @param {StageGrade} grade 學程階段
 * @param {GameLengthMode} length 關卡長度模式 (5 關速通 或 10 關馬拉松，預設 10)
 * @returns {MapTile[]} 格子資料陣列
 */
export function generateBoardTiles(grade: StageGrade, length: GameLengthMode = 10): MapTile[] {
  const config = STAGE_CONFIGS[grade] || STAGE_CONFIGS['高中'];
  const tiles: MapTile[] = [];

  // 第 0 格：起點「昇學」格 (MAIN) - 步驟 1
  tiles.push({
    index: 0,
    type: 'RECOVERY',
    title: '昇學起跑點',
    description: '新階段學業展開！精神百倍，體力全滿！',
    icon: '🏫',
    color: '#00FFA3',
    branch: 'MAIN',
    trackRow: 0,
    stepNumber: 1
  });

  // 第 1 格：分叉選擇點 (FORK) - 步驟 2
  tiles.push({
    index: 1,
    type: 'FORK',
    title: '路線分叉抉擇點',
    description: '前方出現分叉路線！請選擇走【上路: 理組與幸運】或【下路: 文藝與天才挑戰】！',
    icon: '🔀',
    color: '#AF52DE',
    branch: 'MAIN',
    trackRow: 0,
    stepNumber: 2
  });

  // 根據 5 關或 10 關定義上下路格子
  const upperTilesDef = length === 5
    ? [
        { type: 'QUIZ', subject: '自然', title: '理化隨堂考', desc: '實驗室化學分析測驗！' },
        { type: 'CANTEEN', subject: undefined, title: 'LUCKY 校園福利社', desc: '旭日光芒補給站！購買戰略道具與養樂多！' }
      ]
    : [
        { type: 'QUIZ', subject: '自然', title: '理化隨堂考', desc: '實驗室化學分析測驗！' },
        { type: 'QUIZ', subject: '流行音樂', title: '音樂隨堂考', desc: '五線譜旋律與華語流行音樂題！' },
        { type: 'THREE_CHOICE', subject: '時事冷知識', title: '三選一送分格', desc: '只有三個選項的送分題目！' },
        { type: 'CANTEEN', subject: undefined, title: 'LUCKY 校園福利社', desc: '旭日光芒補給站！購買戰略道具與養樂多！' },
        { type: 'QUIZ', subject: '社會', title: '文理小試', desc: '綜合歷史地理與社會人文測驗！' },
        { type: 'TROUBLE', subject: undefined, title: 'TROUBLE 骷髏災難', desc: '校規記過警告！損失體力 20 點！' },
        { type: 'RECOVERY', subject: undefined, title: '模擬考前自修', desc: '安靜溫習，體力與專注度完全回復！' }
      ];

  const lowerTilesDef = length === 5
    ? [
        { type: 'HEALTH', subject: '健康教育', title: '健康教育護理', desc: '生理衛生保健常識，體力回復 +25 點！' },
        { type: 'TALENT', subject: '數學', title: '天才問題挑戰', desc: '極限高難度題！答對可獲雙倍分數與大量學分！' }
      ]
    : [
        { type: 'HEALTH', subject: '健康教育', title: '健康教育護理', desc: '生理衛生保健常識，體力回復 +25 點！' },
        { type: 'QUIZ', subject: '美術', title: '美術色彩學', desc: '調色盤與西洋藝術史測驗！' },
        { type: 'TALENT', subject: '數學', title: '天才問題挑戰', desc: '極限高難度題！答對可獲雙倍分數與大量學分！' },
        { type: 'EVENT', subject: undefined, title: '？號校園突發事件', desc: '走廊上突然發生神祕意外事件！' },
        { type: 'EXTRACURRICULAR', subject: '課外', title: '課外時事大百科', desc: '報章雜誌生活冷知識測驗！' },
        { type: 'TALENT', subject: '常識', title: '奧林匹克競賽題', desc: '金牌挑戰！極高難度思維題目！' },
        { type: 'CANTEEN', subject: undefined, title: '歷屆筆記傳授', desc: '向學長姐請益考試技巧與補充道具！' }
      ];

  upperTilesDef.forEach((item, i) => {
    tiles.push({
      index: 2 + i,
      type: item.type as any,
      title: item.title,
      description: item.desc,
      subject: item.subject as any,
      icon: '📝',
      branch: 'UPPER',
      trackRow: 0,
      stepNumber: 3 + i
    });
  });

  lowerTilesDef.forEach((item, i) => {
    tiles.push({
      index: 2 + upperTilesDef.length + i,
      type: item.type as any,
      title: item.title,
      description: item.desc,
      subject: item.subject as any,
      icon: '💡',
      branch: 'LOWER',
      trackRow: 1,
      stepNumber: 3 + i
    });
  });

  // 終點：升學大考 Boss 格 (MAIN 匯流)
  tiles.push({
    index: 2 + upperTilesDef.length + lowerTilesDef.length,
    type: 'EXAM',
    title: `${config.title}升學檢定大考`,
    description: `最嚴苛的升學考驗！通過後即可光榮晉級下一學制！`,
    icon: '🎓',
    color: '#FF2A55',
    branch: 'MAIN',
    trackRow: 0,
    stepNumber: 3 + upperTilesDef.length
  });

  return tiles;
}

/** 預設校園隨機事件庫 */
export const CAMPUS_EVENTS: RandomEvent[] = [
  {
    id: 'ev-bully',
    title: '遭遇後巷不良少年！',
    description: '放學途中被不良少年勒索零用錢，心情受創，損失體力 15 點！',
    hpChange: -15,
    creditsChange: -50,
    scoreChange: 0,
    icon: '🦹'
  },
  {
    id: 'ev-scholarship',
    title: '榮獲校長親自頒發獎學金！',
    description: '品學兼優深受師長肯定，獲得獎學金 150 學分，得分 +500 分！',
    hpChange: 10,
    creditsChange: 150,
    scoreChange: 500,
    icon: '🏆'
  },
  {
    id: 'ev-canteen',
    title: '福利社麵包大特價！',
    description: '下課搶到剛出爐的蘋果麵包與津津蘆筍汁，體力 +25 點！',
    hpChange: 25,
    creditsChange: 0,
    scoreChange: 100,
    icon: '🥐'
  },
  {
    id: 'ev-inspect',
    title: '教官服裝儀容大突檢！',
    description: '襪子太短不符校規，被罰站背誦青年守則，損失體力 10 點！',
    hpChange: -10,
    creditsChange: 0,
    scoreChange: 0,
    icon: '👮'
  },
  {
    id: 'ev-cram',
    title: '知名補習班名師指點！',
    description: '解開歷屆考題盲點，士氣大振！獲得 80 學分，得分 +300 分！',
    hpChange: 5,
    creditsChange: 80,
    scoreChange: 300,
    icon: '💡'
  },
  {
    id: 'ev-sports',
    title: '校慶大隊接力勇奪第一！',
    description: '全班歡聲雷動，榮譽感爆棚！得分 +400 分，體力 +15 點！',
    hpChange: 15,
    creditsChange: 50,
    scoreChange: 400,
    icon: '🏃'
  }
];

export function pickRandomCampusEvent(): RandomEvent {
  const idx = Math.floor(Math.random() * CAMPUS_EVENTS.length);
  return CAMPUS_EVENTS[idx];
}
