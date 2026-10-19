/**
 * @file quiz.ts
 * @description 定義問答遊戲核心資料結構、學程階段、地圖雙軌分叉、人物名師與新聞主播模型
 */

/** 學科分類列舉型別 */
export type SubjectType = 
  | '國文' 
  | '數學' 
  | '自然' 
  | '社會' 
  | '藝能' 
  | '時事冷知識' 
  | '流行音樂' 
  | '體育運動' 
  | '健康教育' 
  | '美術' 
  | '課外';

/** 難易度列舉型別 */
export type DifficultyType = '簡單' | '普通' | '困難';

/** 學程階段列舉型別 */
export type StageGrade = '國小' | '國中' | '高中' | '大學' | '通用';

/** 路線分支列舉 */
export type BranchType = 'MAIN' | 'UPPER' | 'LOWER';

/**
 * 單一題目資料結構
 */
export interface QuestionItem {
  id: string;
  subject: SubjectType;
  stage: StageGrade;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation?: string;
  timeLimit?: number;
  difficulty: DifficultyType;
  isCustom?: boolean;
}

/** 道具類型列舉 */
export type ItemType = 'MAGNIFIER' | 'CLOCK' | 'PASS_TICKET' | 'YAKULT';

/**
 * 道具資料介面
 */
export interface GameItem {
  id: ItemType;
  name: string;
  icon: string;
  description: string;
  price: number;
}

/** 地圖格子類型 */
export type TileType = 
  | 'QUIZ'            // 一般學科隨堂考 (需答題)
  | 'FORK'            // 分叉選擇點 (玩家抉擇走上路或下路)
  | 'THREE_CHOICE'    // 三選一格 (致敬街機原版：只有三個選項，輕鬆拿分)
  | 'TROUBLE'         // 骷髏危險格 (致敬街機原版：體力或學分重創)
  | 'TALENT'          // 天才問題挑戰格 (極限高難度題，雙倍得分與學分)
  | 'HEALTH'          // 健康教育格 (人體心臟圖標，回復體力)
  | 'EXTRACURRICULAR' // 課外常識格 (校外大百科題型)
  | 'CANTEEN'         // 福利社補給站 (LUCKY 旭日光芒，購買道具與補給)
  | 'TRANSFER'        // 轉學跳級格 (機率直升下一階段或被留級)
  | 'EVENT'           // 校園隨機事件 (如不良少年、校長獎勵、教官突檢)
  | 'FATE'            // 命運格子 (前進/後退/學分機會)
  | 'RECOVERY'        // 健康中心 (回復體力學分)
  | 'EXAM';           // 期末升學大考檢定格 (Boss 關卡)

/**
 * 地圖格子資料結構
 */
export interface MapTile {
  index: number;
  type: TileType;
  title: string;
  description: string;
  subject?: SubjectType;
  icon: string;
  color?: string;
  branch: BranchType;
  trackRow?: number;
  stepNumber: number;
}

/**
 * 學程階段設定
 */
export interface StageConfig {
  grade: StageGrade;
  title: string;
  totalTiles: number;
  examRequiredPass: number;
  examAllowedMistakes: number;
  examConsecutive: boolean;
  badgeColor: string;
  baseRank: number;
  layerCount: number;
}

/**
 * 隨機事件定義
 */
export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  hpChange: number;
  creditsChange: number;
  scoreChange: number;
  moveChange?: number;
  icon: string;
}

/**
 * 升學 Boss 考試即時狀態
 */
export interface BossExamState {
  isActive: boolean;
  stage: StageGrade;
  currentQuestionIndex: number;
  passedCount: number;
  targetCount: number;
  mistakesCount: number;
  maxAllowedMistakes: number;
  isConsecutiveMode: boolean;
  currentQuestion: QuestionItem | null;
  timeRemaining: number;
  isCleared: boolean;
  isFailed: boolean;
}

/**
 * 授課老師角色介面 (致敬 quiz1.jpg 右側可替換老師)
 */
export interface TeacherProfile {
  id: string;
  name: string;
  title: string;
  avatarUrl: string; // 支援圖片 URL、Base64 或 SVG
  description: string;
  isCustom?: boolean;
}

/**
 * 新聞問題雙主播介面 (致敬 new1.jpg 新聞主播台)
 */
export interface AnchorProfile {
  id: string;
  title: string;
  leftAnchorName: string;
  leftAnchorAvatar: string;
  rightAnchorName: string;
  rightAnchorAvatar: string;
  isCustom?: boolean;
}

/**
 * 遊戲即時會話狀態
 */
export interface GameSessionState {
  currentStage: StageGrade;
  currentTileIndex: number;
  currentBranch: BranchType;
  isWaitingBranchChoice: boolean;
  playerHp: number;
  maxHp: number;
  credits: number;
  score: number;
  coins: number;
  comboCount: number;
  rank: number;
  inventory: Record<ItemType, number>;
  disabledOptionIndices: number[];
  currentQuestion: QuestionItem | null;
  isThreeChoiceMode: boolean;
  isTalentMode: boolean;
  timeRemaining: number;
  maxTimeLimit: number;
  isGameOver: boolean;
  isVictory: boolean;
  bossExam: BossExamState;
}
