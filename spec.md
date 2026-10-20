# 《民國教育委員會 2026》現代化升級規格書 (spec.md)

## 1. 專案概述 (Project Overview)
本專案為致敬 1993 年台灣大型電玩街機（Arcade）名作《民國教育委員會》之現代化 Web 復刻升級版。在保留街機復古美學（8-bit 音效、CRT 掃描線、雙主播新聞過場、師生黑板對決）的基礎上，全面導入**現代數位遊戲化機制（Gamification）**：
1. **現代化動態題型與博弈機制**：聽力猜歌猜台詞、視覺局部放大辨識、手速搶答、反向選錯陷阱題、盲答迷霧題，以及答題前「即時信心下注（Wagering）」。
2. **輕度 Roguelike 樹狀分支地圖 (Slay the Spire 架構)**：告別純擲骰看運氣的拖沓節奏，改為透明可視的樹狀節點路線，玩家可依自身學科強項與血量規劃通關路徑。
3. **校園「留級／重修補考」機制**：答錯率過高時強制觸發期中補考，通過考驗可獲得稀有被動聖物裝備（如作弊小抄、免死金牌）。

---

## 2. 技術選型 (Tech Stack)
* **核心框架**：Vue 3 (Composition API with `<script setup>`) + TypeScript
* **建置工具**：Vite 6
* **樣式與主題**：Tailwind CSS (自訂 Retro Arcade 調色盤、CRT 掃描線、動態發光特效)
* **狀態管理**：Pinia
* **多媒體與音效模組**：Web Audio API 程序化合成器（8-bit 音階旋律產生器，支援離線即時合成動漫歌與廣告旋律）
* **資料持久化**：瀏覽器 LocalStorage（無伺服器架構，保存自訂題庫、歷史戰績、人物形象設定）
* **視覺特效**：Canvas Confetti (通關撒花)、SVG 貝茲曲線動態路徑繪製

---

## 3. 系統流程圖與狀態機 (UML Diagrams)

### 3.1 Roguelike 地圖與現代化答題主流程圖 (Flowchart)
```mermaid
flowchart TD
    Start([啟動遊戲 / 投幣]) --> Title[街機標題畫面]
    Title --> SelectMode{地圖模式選擇}

    SelectMode -->|輕度肉鴿模式 (推薦)| InitRogue[產生 Roguelike 樹狀節點地圖]
    SelectMode -->|經典街機模式| InitClassic[初始化傳統卡匣軌道]

    InitRogue --> ViewMap[檢視本層可選節點路線]
    ViewMap --> PickNode[玩家自主挑選前進節點]

    PickNode --> NodeTypeCheck{節點類型判定}
    NodeTypeCheck -->|學科考題| WagerPhase[即時信心下注階段]
    NodeTypeCheck -->|聽力猜歌| AudioQuiz[8-bit 懷舊旋律聽力題]
    NodeTypeCheck -->|視覺謎題| VisualQuiz[局部放大照片辨識]
    NodeTypeCheck -->|福利社補給| ShopModal[福利社購買道具與裝備]
    NodeTypeCheck -->|突發事件| EventModal[校園命運事件]
    NodeTypeCheck -->|期末終點| BossExam[升學大考 Boss 檢定]

    WagerPhase --> RevealQuiz[揭露題目與特殊規則: 陷阱/盲答/雙倍]
    RevealQuiz --> PlayerAnswer[玩家限時作答]
    AudioQuiz --> PlayerAnswer
    VisualQuiz --> PlayerAnswer

    PlayerAnswer --> SettleAnswer{答案判定}
    SettleAnswer -->|答對| RewardWin[結算: 下注獲利加倍 + 體力維持 + Rank提升]
    SettleAnswer -->|答錯| PenaltyLoss[結算: 下注歸零 + 體力扣除 + 記錄失誤]

    RewardWin --> RetentionCheck{本學程累積失誤 >= 3 題?}
    PenaltyLoss --> RetentionCheck

    RetentionCheck -->|是| TriggerRemedial[觸發: 教官留級警告 & 期中補考]
    RetentionCheck -->|否| CheckHp{體力 HP > 0?}

    TriggerRemedial --> RemedialExam[期中補考考驗: 連續答對3題]
    RemedialExam -->|補考通過| RemedialPass[獲取特殊聖物裝備 + 危機解除]
    RemedialExam -->|補考失敗| RemedialFail[降級留級 / 扣除續關代幣]
    RemedialPass --> CheckHp
    RemedialFail --> CheckHp

    CheckHp -->|體力耗盡| ContinueScreen[9秒投幣續關畫面]
    ContinueScreen -->|投幣續關| Revive[滿血復活繼續闖關]
    ContinueScreen -->|放棄| Summary[結算成績單]

    CheckHp -->|體力存續| FloorFinish{到達本學程頂層?}
    FloorFinish -->|未達頂層| ViewMap
    FloorFinish -->|已達頂層| BossExam

    BossExam --> BossResult{大考檢定通過?}
    BossResult -->|通過| GraduateStage[晉級下一個學程: 國中 -> 高中 -> 大學]
    BossResult -->|失敗| ContinueScreen
    GraduateStage --> Victory[光榮畢業典禮]
```

---

### 3.2 信心下注與動態題型循序圖 (Sequence Diagram)
```mermaid
sequenceDiagram
    autonumber
    actor Player as 玩家 (Player)
    participant Map as 肉鴿地圖 (RoguelikeMap)
    participant Wager as 下注彈窗 (WagerModal)
    participant Quiz as 答題舞台 (QuizCard)
    participant Audio as 旋律合成器 (AudioMelody)
    participant Store as 遊戲引擎 (GameStore)

    Player->>Map: 點擊前進節點 (如: 流行音樂·困難)
    Map->>Store: activateNode(nodeId)
    Store->>Wager: 顯示學科資訊與下注面板
    Note over Wager: 提示題目分類與難度，未揭露題幹
    Player->>Wager: 選擇下注金額 (例: 50 學分)
    Wager->>Store: placeWager(50)
    Store->>Quiz: 啟動答題模式 (帶入下注與特殊規則)

    alt 聽力題型 (Audio Quiz)
        Quiz->>Audio: playMelody(melodyId)
        Audio-->>Player: 播放 8-bit 程序化動漫旋律
    else 視覺題型 (Visual Quiz)
        Quiz->>Player: 顯示漸進式像素局部放大遮罩
    else 盲答/陷阱題型
        Quiz->>Player: 顯示反向選錯警示 / 黑色遮罩選項
    end

    Player->>Quiz: 選定答案 (或使用道具輔助)
    Quiz->>Store: submitAnswer(choiceIndex)

    alt 答對
        Store->>Player: 贏得 100 學分 (本金 + 1:1 獲利) + 連擊提升
    else 答錯
        Store->>Player: 扣除下注 50 學分 + 扣除 20 體力 HP
    end

    Store->>Map: 前進至下一層 (更新可選節點)
```

---

### 3.3 系統實體關聯圖 (ER Diagram)
```mermaid
erDiagram
    PLAYER ||--o{ INVENTORY_ITEM : possesses
    PLAYER ||--o{ RELIC_EQUIPMENT : equips
    PLAYER ||--|| GAME_SESSION : current_state

    GAME_SESSION ||--|{ ROGUELIKE_NODE : traverses
    GAME_SESSION ||--o{ WAGER_RECORD : bets
    GAME_SESSION ||--o| REMEDIAL_STATE : undergoes

    ROGUELIKE_NODE ||--o| QUESTION_ITEM : triggers
    QUESTION_ITEM ||--o| AUDIO_MELODY : attaches_audio
    QUESTION_ITEM }|--|| SUBJECT_TYPE : categorizes

    PLAYER {
        string id
        int hp
        int maxHp
        int credits
        int rank
        int coins
    }

    GAME_SESSION {
        string currentGrade
        int currentFloor
        string activeNodeId
        int totalMistakesInStage
        boolean isRemedialTriggered
    }

    ROGUELIKE_NODE {
        string id
        int floor
        string type
        string subject
        string difficulty
        boolean isVisited
        boolean isAvailable
        string[] nextNodeIds
    }

    QUESTION_ITEM {
        string id
        string questionType
        string subject
        string difficulty
        string question
        string[] options
        int correctIndex
        boolean isTrapReverse
        boolean isBlackout
        string audioMelodyId
        string visualImageUrl
    }

    RELIC_EQUIPMENT {
        string id
        string name
        string description
        string effectType
    }
```

---

## 4. 模組規格詳細設計

### 4.1 核心答題機制的現代化改良 (Gamification)
1. **即時信心下注 (Confidence Wagering)**：
   * **觸發時機**：進入學科考題節點時，題幹暫不顯示，僅顯示學科（例：社會、流行音樂）與難易度標籤。
   * **下注檔次**：
     * `不下注 (0 學分)`：保本模式，答對獲得基礎獎勵。
     * `小賭怡情 (20 學分)`：1.5 倍學分回饋。
     * `重注博弈 (50 學分)`：2.0 倍學分回饋。
     * `孤注一擲 (All-In)`：投注目前所有學分（上限 200），3.0 倍獲利！
   * **答錯懲處**：賠光下注額；若下注超過 50 且答錯，額外扣除 10 點體力。

2. **多樣動態題型 (Dynamic Quiz Modes)**：
   * **聽力題 (Audio Quiz)**：
     * 呼叫 [`src/utils/audioMelodySynthesizer.ts`](file:///C:/Users/rossiyeh/SegaProjectHub/quiz/src/utils/audioMelodySynthesizer.ts)。
     * 使用 Web Audio API 即時合成 8-bit 音頻。
     * 內建 10+ 首台灣懷舊旋律（例如：《無敵鐵金剛》、《灌籃高手》、《小虎隊·青蘋果樂園》、《大同電鍋主題歌》、《斯斯感冒膠囊》）。
     * 提供「▶ 重播旋律」按鈕。
   * **視覺題 (Visual Zoom Quiz)**：
     * 展示局部放大圖片或馬賽克遮罩。
     * 隨著計時器減少，馬賽克程度逐步減輕，考驗敏銳辨識力。
   * **陷阱題與盲答機制 (Traps & Blackout)**：
     * **反向題**：題幹附帶紅色警報霓虹閃爍，要求選出「非正確／錯誤」的敘述。
     * **雙倍傷害 (Double Trouble)**：答錯體力扣除 40 點。
     * **盲答迷霧 (Blackout)**：四個選項被黑霧覆蓋，玩家可花費 15 學分揭開，或直接盲點（盲點答對加倍得分）。

3. **答題狀態生命週期與答案隱蔽守則 (Answer Secrecy & Lifecycle)**：
   * **彈窗嚴格互斥**：答題黑板 (`QuizCard`) 僅在 `activeModal === 'QUIZ'` 且 `currentQuestion !== null` 時渲染，嚴禁在下注階段 (`WAGER`)、地圖探索或開新局時提前浮現。
   * **狀態徹底重置**：每次開啟題目或新局，必須重置 `isAnswered = false`、`lastSelectedChoice = null`、`isLastAnswerCorrect = null`、`disabledOptionIndices = []`。
   * **答案揭露時機**：只有在玩家親自點擊選項作答後，或倒數計時歸零時，`isAnswered` 轉為 `true`，方得高亮標示「✓ 正解」與顯示「💡 名師解答」。作答前嚴禁揭露任何正解線索。

---

### 4.2 Slay the Spire 式 Roguelike 樹狀節點地圖 (Node-based Map)
1. **地圖架構**：
   * 每一個學程（國小、國中、高中、大學）生成一個獨立的樹狀路線圖。
   * 共包含 **8~10 個樓層 (Floors)**，每層由 2~3 個可選節點構成。
   * 節點之間由貝茲曲線（SVG Cubic Bezier Curves）連接，可選節點呈現呼吸霓虹發光，已通過節點變灰。
2. **節點類型**：
   * `QUIZ_NORMAL`：一般隨堂考（普通題型，平穩獎勵）。
   * `QUIZ_ELITE`：菁英挑戰題（高難度，但必掉落大額學分或被動道具）。
   * `AUDIO_EVENT`：懷舊聽力題節點。
   * `VISUAL_EVENT`：視覺局部放大解謎節點。
   * `CANTEEN_REST`：校園福利社（可花費學分購買道具、吃點心回復 HP）。
   * `CAMPUS_FATE`：隨機校園事件（奇遇、不良少年、校長獎勵、抽籤）。
   * `FINAL_EXAM`：頂樓期末升學檢定大考 (Boss 戰)。

---

### 4.3 留級與期中重修補考機制 (Remedial Exam & Retention)
1. **觸發條件**：
   * 在單一學程內，若答錯累計達 **3 題**，或體力掉落至 **25% 以下**，在進入下一層時將強制跳出「教務處留級通告」與「期中補考」。
2. **補考規則**：
   * 玩家必須在有限時間內連續答對 **3 道** 題目。
   * 補考期間禁止使用背包常規道具。
3. **補考結算**：
   * **通過補考**：危機解除，體力補回 50 點，並獲得**稀有校園聖物裝備**（三選一）：
     * 📖 **作弊小抄 (Relic)**：之後每道題目開場自動替您剔除 1 個錯誤選項。
     * 🛡️ **免死金牌 (Relic)**：當體力歸零時，自動免死一次並回復 30 點 HP。
     * 💰 **獎學金證明 (Relic)**：每道題目答對額外獲得 +20% 學分。
   * **補考失敗**：若補考未過，強制扣除 1 枚街機代幣（Coin）留級重修當前學程。

---

## 5. 資料結構擴充定義 (TypeScript Interfaces)

```typescript
/** 題型種類 */
export type QuizQuestionType = 
  | 'STANDARD'      // 標準四選一單選
  | 'AUDIO_GUESS'   // 8-bit 聽力猜歌/猜台詞
  | 'VISUAL_ZOOM'   // 局部放大/馬賽克視覺題
  | 'TRAP_REVERSE'  // 反向選錯題
  | 'BLACKOUT';     // 盲答迷霧題

/** 下注檔次 */
export type WagerAmount = 0 | 20 | 50 | 'ALL_IN';

/** 肉鴿地圖節點類型 */
export type RoguelikeNodeType = 
  | 'QUIZ_NORMAL'
  | 'QUIZ_ELITE'
  | 'AUDIO_EVENT'
  | 'VISUAL_EVENT'
  | 'CANTEEN_REST'
  | 'CAMPUS_FATE'
  | 'FINAL_EXAM';

/** 地圖節點介面 */
export interface RoguelikeNode {
  id: string;
  floor: number;
  colIndex: number;
  type: RoguelikeNodeType;
  title: string;
  subject: SubjectType;
  difficulty: DifficultyType;
  icon: string;
  isAvailable: boolean;
  isVisited: boolean;
  nextNodeIds: string[];
}

/** 8-bit 旋律資料模型 */
export interface AudioMelodyItem {
  id: string;
  title: string;
  notes: Array<{ freq: number; duration: number }>;
}

/** 校園被動聖物裝備介面 */
export interface SchoolRelic {
  id: string;
  name: string;
  icon: string;
  description: string;
  effect: 'AUTO_REMOVE_WRONG' | 'DEATH_PREVENTION' | 'BONUS_CREDITS';
}

/** 補考即時狀態 */
export interface RemedialExamState {
  isActive: boolean;
  currentStreak: number;
  requiredStreak: number;
  timeRemaining: number;
}
```

---

## 6. 日系新潮街機撞色風 (Neo-Arcade Stylized) 視覺系統規格

### 6.1 去 AI 化 (De-AI) 設計理念與色彩體系
徹底摒除現代 Web3/AI 常見之死板深藍紫漸層（Tailwind slate-900 / indigo-950）、柔和毛玻璃（backdrop-blur）與圓潤膠囊圓角（rounded-3xl），全面引進日系大型街機（如《Persona 5》/《Street Fighter 6》）之高張力撞色與動漫幾何美學：

1. **核心配色盤 (Neo-Arcade Palette)**：
   * **警戒銘黃 (`#FFE600`)**：高對比主色，用於重要標題、按鈕、當前節點與關鍵倒數。
   * **曜石深墨黑 (`#090B10` / `#050608`)**：深邃底色，取代發灰的 slate-900。
   * **警示烈紅 (`#FF0055`)**：用於危急扣血、陷阱題、Boss 戰與倒數 3 秒。
   * **普魯士黑藍 (`#0A1224`)**：用於答題黑板內襯與深色模塊。
   * **電光青碧 (`#00F0FF`)**：用於學科標籤與科技線條。
   * **極限狂熱紫 (`#BD00FF`)**：用於盲答迷霧與特殊菁英考驗。
2. **幾何切割與質感紋理 (Brutal Geometry & Textures)**：
   * **日系戰術斜切角 (Chamfered Corners)**：使用 CSS `clip-path: polygon(...)` 實現 45° 與 15° 幾何切角，全面取代 rounded 圓角。
   * **美漫/日漫半色調網點 (Halftone Comic Dots)**：背景採用 SVG 幾何波點網紋，強化街機印刷感。
   * **警戒斑馬斜條紋 (Hazard Stripes)**：在視窗頂部與下注區域採用黑黃相間 45° 警戒紋理。
   * **硬實心陰影 (Hard Drop Shadows)**：採用 `box-shadow: 4px 4px 0px #000000`，按鍵按下時位移 `translate(4px, 4px)` 並消除陰影，產生無延遲的街機實體微動按鈕打擊感。
3. **符號去 Emoji 化**：
   * 全面淘汰現代手機 Emoji，改以專屬 SVG 像素標章與日系大字報標籤（如 `[NODE]`, `[ELITE]`, `[REST]`, `[EXAM]`）呈現。

### 6.2 視覺組件架構圖 (Mermaid UI Topology)
```mermaid
flowchart TD
    Frame["街機主外框 ArcadeFrame (黑黃斑馬斜條 / 漫畫網點背景)"] --> Title["標題畫面 TitleScreen (P5 斜角大字報 / 撞色卡片)"]
    Frame --> Roguelike["肉鴿地圖 RoguelikeMap (戰術切角節點 / 實心硬陰影軌跡)"]
    Frame --> Classic["經典雙軌 GameBoard (立體厚卡匣 / 原版地圖滾動)"]
    
    Roguelike --> Wager["下注彈窗 WagerModal (重金屬黑黃賭盤 / 粗黑描邊)"]
    Wager --> Quiz["答題主舞台 QuizCard (日系綜藝大字報 / 斜切選項 / 實時打擊反饋)"]
    Classic --> Quiz
    
    Quiz --> Remedial["期中補考 RemedialExamModal (高飽和警報框 / 連對進度條)"]
    Quiz --> Boss["升學大考 BossExamModal (烈紅斜切邊框 / 街機Boss血條)"]
```

---

## 7. 16-Bit 大型街機手繪像素點陣畫資產規格 (Pixel Art Assets Spec)

### 7.1 人物立繪規格 (致敬 `pic/quiz1.jpg` & `pic/new1.jpg`)
1. **督學名師 (Strict Master Teacher)**：
   * 100% 依據 `pic/quiz1.jpg` 復刻：深色西裝、立領白襯衫、暗紅領帶、手持木質金屬教鞭。
   * 精緻黑框眼鏡、反光鏡片與嚴肅抿嘴神態，呈現 90 年代升學補習班名師霸氣。
2. **考生代表學生 (Student Mascot)**：
   * 依據 `pic/quiz1.jpg` 左側學生重繪，具備三態高精度像素表情動態：
     * **思考態 (Thinking)**：托腮沉思、靈動眼神。
     * **答對態 (Correct)**：瞇瞇眼大笑、雙手比 V、開心跳躍。
     * **答錯態 (Wrong)**：淚流滿面、抱頭痛哭、汗滴滑落。
3. **時事雙主播 (News Anchors)**：
   * 依據 `pic/new1.jpg` 復刻：
     * **左女主播**：90 年代波浪吹高髮型、寶藍色套裝、珍珠耳環與播報手勢。
     * **右男主播**：經典圓臉、張大嘴巴、圓鼻子的名嘴滑稽神韻。
4. **歷史與軍訓名師 (Confucius, Einstein, Military)**：
   * 全數採用同等 16-bit 像素手繪重製，徹底淘汰粗糙 placeholder。

### 7.2 地圖美術資產規格 (致敬 `pic/地圖.jpg` & `pic/map1.jpg`)
1. **地圖上半部校舍與吉祥物骰子**：
   * **經典吉祥物**：大頭吉祥物趴在深藍立體方塊骰子上（還原 `pic/地圖.jpg`）。
   * **像素校舍背景**：雙層鐘樓校舍、紅瓦排窗、綠蔭遠山與藍天白雲。
2. **立體雙軌卡匣軌道圖標**：
   * **START**：小學生書包。
   * **TROUBLE**：精緻白色骷髏骨與紫色災難毒氣（致敬 `pic/map1.jpg`）。
   * **三選一**：立體藍底白色「三選一」大字牌。
   * **天才問題**：紅底白字立體金邊字。
   * **健康教育**：經典心型解剖紅心圖標。
   * **各學科**：國文古籍、地理地球儀、自然燒杯量筒、數學三角圓規。

### 7.3 美術資產管線流程圖 (Pipeline Diagram)
```mermaid
flowchart LR
    AssetDef["純前端像素資產定義 src/assets/pixelArt.ts"] --> CharStore["人物狀態庫 characterStore.ts"]
    AssetDef --> BoardComp["地圖模組 GameBoard.vue & RetroTileIcon.vue"]
    AssetDef --> QuizComp["答題舞台 QuizCard.vue"]
    AssetDef --> NewsComp["新聞播報 NewsIntroModal.vue"]
    
    CharStore --> TeacherUI["手持教鞭名師立繪"]
    CharStore --> AnchorUI["演播室雙主播立繪"]
    QuizComp --> StudentUI["學生三態動態表情 (思考/比V/哭泣)"]
    BoardComp --> MascotUI["趴骰子大頭吉祥物 & 3D卡匣格子圖標"]
```

---

## 8. 電腦版寬屏全畫面與全域字級階層規範 (Desktop Wide & Large Font Spec)

### 8.1 寬屏機台架構與原生全螢幕機制 (Fullscreen & Wide Canvas)
1. **框體寬度解除上限**：
   * 原架構 `max-w-5xl`（1024px）擴展為寬屏自適應模式（`w-full max-w-[1536px] 2xl:max-w-[1680px]`），填滿 1080p、2K 與 4K 螢幕兩側留白。
   * 保留頂部黑黃斑馬紋警戒條與 Neo-Arcade 戰術幾何切角。
2. **HTML5 Fullscreen API 整合**：
   * 在頂部導航燈箱新增 `🖥️ [全螢幕 FULLSCREEN]` 實體街機微動開關。
   * 支援 `document.fullscreenElement` 檢測與 `requestFullscreen()` / `exitFullscreen()`。
   * 玩家按下 ESC 或點擊按鍵時即時雙向同步開關狀態。

### 8.2 全域字級階梯規範 (Typography Hierarchy)

| 介面元件 | 原版字級 | 寬屏放大升級字級 | Tailwind 規範類別 | 備註說明 |
| :--- | :--- | :--- | :--- | :--- |
| **題目題幹文字** | 14px~16px | **22px ~ 26px** | `text-xl sm:text-2xl font-black` | 黑板大字報粗體，高對比黃字 |
| **四選一選項文字** | 12px~14px | **16px ~ 19px** | `text-base sm:text-lg font-bold` | 按鈕高度增至 56px+，點擊熱區擴大 |
| **雙軌地圖卡匣標籤** | 8px~10px | **12px ~ 14px** | `text-xs sm:text-sm font-black` | 3D 卡匣厚度與像素圖標等比放大 |
| **肉鴿地圖節點標籤** | 9px~10px | **12px ~ 14px** | `text-xs sm:text-sm font-black` | 節點按鈕寬度增至 130px~150px |
| **HUD 狀態列數值** | 12px | **15px ~ 18px** | `text-sm sm:text-base font-black` | HP 條增厚、分數與學分一目了然 |
| **主持評論跑馬燈** | 12px | **14px ~ 16px** | `text-sm sm:text-base font-bold` | 播報橫幅醒目清晰 |
| **操作功能按鍵** | 11px~12px | **14px ~ 16px** | `text-sm font-black py-2 px-4` | 擲骰 (SPACE) 與道具欄大幅擴大 |

### 8.3 寬屏佈局與全螢幕切換循序圖 (Sequence Diagram)
```mermaid
sequenceDiagram
    autonumber
    actor Player as 玩家 (Player)
    participant Frame as 街機外框 (ArcadeFrame)
    participant DOM as 瀏覽器核心 (HTML5 Fullscreen API)
    participant Stage as 寬屏主舞台 (QuizCard / GameBoard)

    Player->>Frame: 點擊「🖥️ [全螢幕]」或快捷鍵
    Frame->>DOM: 檢查 document.fullscreenElement
    alt 目前非全螢幕
        DOM->>DOM: requestFullscreen()
        DOM-->>Frame: 觸發 fullscreenchange 事件 (isFullScreen = true)
        Frame->>Stage: 啟動寬屏滿版模式 (w-full max-w-[1680px])
        Stage-->>Player: 全螢幕無黑邊、大字報題目極速呈現
    else 目前為全螢幕
        DOM->>DOM: exitFullscreen()
        DOM-->>Frame: 觸發 fullscreenchange 事件 (isFullScreen = false)
        Frame->>Stage: 還原為常規寬屏視窗模式
        Stage-->>Player: 退出全螢幕
    end
```



---

## 10. 「五關速通賽 vs 十關馬拉松」關卡長度自選系統規格 (Game Length Selection Spec)

### 10.1 模式定位與設計理念
為滿足不同場景與玩家節奏偏好，於開局首頁與遊戲中提供「五關速通賽」與「十關馬拉松」雙長度自選機制：

1. **⚡ 五關速通賽 (`GameLengthMode = 5`)**：
   * **適用場景**：碎片時間、快速單局試玩、課堂即時測驗競賽（約 3~5 分鐘通關）。
   * **肉鴿地圖樓層**：精縮為 5 個樓層（Floor 0 開學檢定 ➔ Floor 1 雙軌初試 ➔ Floor 2 聽力/視覺特考 ➔ Floor 3 福利社/奇遇補給 ➔ Floor 4 升學大考 Boss 戰）。
   * **經典雙軌棋盤**：精縮為 5 步關鍵節點（起點 ➔ 路線分叉 ➔ 2 關學科卡匣 ➔ 升學 Boss 終點），跑馬燈同步顯示「離畢業還有 5 層次」。
2. **🏆 十關馬拉松 (`GameLengthMode = 10`)**：
   * **適用場景**：完整沉浸、深度修煉、挑戰全學科與被動聖物（約 8~12 分鐘通關）。
   * **肉鴿地圖樓層**：展開為完整 10 個樓層（Floor 0~9），涵蓋隨堂考、菁英考、聽力猜歌、局部照片、多次福利社與留級補考機制。
   * **經典雙軌棋盤**：完整雙軌長軌道，還原大型街機「離畢業還有 10 層次」。

### 10.2 資料結構與參數對照表

```typescript
/** 關卡長度模式 */
export type GameLengthMode = 5 | 10;
```

| 關卡長度模式 | 肉鴿地圖總樓層 | 經典棋盤總格數 | 預估通關時間 | Boss 戰出現時機 | 跑馬燈標語 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **⚡ 5 關速通賽** | 5 層 (Floor 0~4) | 5 步關鍵節點 | 3 ~ 5 分鐘 | 第 5 關 (Floor 4) | // 離畢業還有 5 層次。 // |
| **🏆 10 關馬拉松** | 10 層 (Floor 0~9) | 12~14 步完整雙軌 | 8 ~ 12 分鐘 | 第 10 關 (Floor 9) | // 離畢業還有 10 層次。 // |

### 10.3 關卡長度切換與地圖生成循序圖 (Sequence Diagram)
```mermaid
sequenceDiagram
    autonumber
    actor Player as 玩家 (Player)
    participant Title as 標題首頁 (TitleScreen)
    participant Store as 遊戲狀態庫 (gameStore)
    participant GenRogue as 肉鴿生成器 (roguelikeGenerator)
    participant GenBoard as 棋盤生成器 (boardGenerator)

    Player->>Title: 點擊切換 [⚡ 5關速通 / 🏆 10關馬拉松]
    Title->>Store: setGameLength(5 或 10)
    Store-->>Title: 播放切換音效，高亮選中狀態按鈕
    Player->>Title: 點選模式 (如：輕度肉鴿選路)
    Title->>Store: startNewGame('國小' 或 '高中')
    alt 肉鴿模式
        Store->>GenRogue: generateRoguelikeMap(stage, gameLength)
        GenRogue-->>Store: 返回 5 層或 10 層之動態分支節點網絡
    else 經典模式
        Store->>GenBoard: generateBoardTiles(stage, gameLength)
        GenBoard-->>Store: 返回 5 步或 10 步之雙軌卡匣軌道
    end
    Store-->>Player: 進入對應長度之地圖，開始闖關！
```


---

## 11. 「緊急退學與重置入學系統」規格 (School Dropout & Reset System Spec)

### 11.1 需求背景與核心目標
玩家在遊玩過程中可能因選錯路線、體力低落、或希望重新挑戰時，需要隨時可觸發的「退學重置鍵」。
為防止誤觸並兼顧街機遊戲張力，設計二度確認對話框機制：
1. **觸發入口**：在經典雙軌 HUD 與肉鴿地圖頂部顯著位置設置「🔄 重置入學 / RESET」日系戰術按鈕。
2. **防誤觸防護**：點擊後立即暫停計時並開啟街機二度確認彈窗 (`ResetModal.vue`)。
3. **退學重置邏輯**：
   * 學程歸零重設為「國小」階段。
   * 體力 HP 補滿至 100%。
   * 學分重置為初始 150 分，得分歸 0，連擊歸 0。
   * 難度 Rank 重置回國小基礎等級 (LV.1)。
   * 背包道具恢復初始狀態（放大鏡 x1、懷錶 x1、Pass券 x0、養樂多 x0）。
   * 清空所有被動聖物裝備 (`ownedRelics = []`)。
   * 重新生成國小階段之 5 步/10 步地圖，立即以小學生身份展開全新學業！

### 11.2 資料結構擴充
```typescript
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
  | 'NEWS_INTRO'
  | 'WAGER'
  | 'REMEDIAL_EXAM'
  | 'RESET_CONFIRM'; // 新增：退學重置二度確認彈窗
```

### 11.3 系統流程圖 (Flowchart)
```mermaid
flowchart TD
    A["玩家於地圖中點擊 [🔄 重置入學] 按鈕"] --> B["暫停當前題目計時器"]
    B --> C["開啟 [ResetModal] 街機二度確認彈窗"]
    C --> D{"玩家選擇操作"}
    D -- "點擊 [繼續作答]" --> E["關閉確認彈窗，恢復計時與原遊戲進度"]
    D -- "點擊 [確定退學 (回到國小)]" --> F["播放街機投幣與退學音效"]
    F --> G["重設學程為「國小」"]
    G --> H["重設 HP=100, 學分=150, 得分=0, Rank=1"]
    H --> I["清空被動聖物，重置背包道具"]
    I --> J["重新生成國小地圖 (支援當前長度模式)"]
    J --> K["回到國小起點全新開局！"]
```

### 11.4 循序圖 (Sequence Diagram)
```mermaid
sequenceDiagram
    autonumber
    actor Player as 玩家 (Player)
    participant HUD as 地圖頂部資訊列 (HUD)
    participant Store as 遊戲狀態庫 (gameStore)
    participant Modal as 重置確認彈窗 (ResetModal)
    participant Audio as 音效引擎 (audioEngine)

    Player->>HUD: 點擊 [🔄 重置入學]
    HUD->>Store: openResetConfirmModal()
    Store->>Store: activeModal = 'RESET_CONFIRM' (暫停計時)
    Store-->>Modal: 顯示黑黃警戒退學確認彈窗
    alt 玩家取消
        Player->>Modal: 點擊 [繼續挑戰]
        Modal->>Store: closeResetConfirmModal()
        Store->>Store: activeModal = 'NONE' (恢復原狀態)
    else 玩家確認退學
        Player->>Modal: 點擊 [確定退學 (回到國小)]
        Modal->>Store: resetGameToElementary()
        Store->>Audio: playCoin()
        Store->>Store: startNewGame('國小', gameLength)
        Store-->>Player: 全新國小學程啟動！
    end
```


---

## 12. 「20關終極長征、國小預設起步與日夜晨昏校舍系統」規格 (Twenty Floors, Elementary Start & Day-Night Campus Spec)

### 12.1 需求背景與核心目標
依據最新教學與街機體驗需求進行三大系統重構：
1. **關卡長度體系調整**：廢止「5 關速通」，保留「10 關標準挑戰」，並新增極具沉浸感與策略深度的「20 關終極大考驗 (`GameLengthMode = 10 | 20`)」。
2. **起步學制重整**：網頁載入（F5 刷新）及全新開局全面校正為**【國民小學】**，確保學制晉升路徑（國小 ➔ 國中 ➔ 高中 ➔ 大學）之嚴謹與一致性。
3. **四大學程專屬校舍**：告別單一校舍貼圖，為國小、國中、高中、大學繪製四款專屬 16-Bit 程式化向量像素建築。
4. **進度演色日夜晨昏系統 (Day-Night Cycle)**：隨關卡推進動態流轉「早晨 ➔ 正午 ➔ 黃昏 ➔ 深夜」，呈現學子從清晨早自習奮戰至挑燈夜戰的完整情境。

### 12.2 資料結構與參數定義

```typescript
/** 關卡長度模式：10 關標準挑戰 或 20 關終極長征 */
export type GameLengthMode = 10 | 20;

/** 晨昏時段列舉 */
export type TimeOfDay = 'DAWN' | 'DAY' | 'DUSK' | 'NIGHT';

/** 時段視覺配置介面 */
export interface TimeOfDayVisualConfig {
  id: TimeOfDay;
  label: string;
  skyGradient: string;    // 天空背景漸層 CSS
  sunMoonIcon: string;    // 日月圖標
  ambientFilter: string;  // 環境色調濾鏡
  windowLight: boolean;   // 校舍窗戶是否點亮暖燈
}
```

#### 關卡長度對照表
| 關卡模式 | 總步數 / 總樓層 | 菁英挑戰次數 | 聽力/視覺特考 | 福利社整備 | Boss 戰時機 | 跑馬燈標示 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **🏆 10 關標準挑戰** | 10 層 (Floor 0~9) | 1~2 次 | 各 1 次 | 1 次 (Floor 8) | 第 10 關 (Floor 9) | // 離畢業還有 10 層次。 // |
| **👑 20 關終極長征** | 20 層 (Floor 0~19)| 3~4 次 | 各 2 次 | 2 次 (Floor 9, 18)| 第 20 關 (Floor 19)| // 離畢業還有 20 層次。 // |

#### 進度時段演色演算法
依當前進度比例 $P = rac{	ext{當前樓層}}{	ext{總樓層 - 1}}$ 計算：
- $0% le P < 25%$：`DAWN`（早晨升旗：金橘漸層日出、朝陽初升）
- $25% le P < 60%$：`DAY`（正午課堂：蔚藍天幕、浮雲飄動、烈日高照）
- $60% le P < 85%$：`DUSK`（黃昏放學：紫紅漸層彩霞、斜陽晚照）
- $85% le P le 100%$：`NIGHT`（深夜夜讀：深邃墨藍星空、銀月繁星、教室暖燈）

### 12.3 系統架構流程圖 (Flowchart)
```mermaid
flowchart TD
    A["玩家載入網頁 / F5 刷新"] --> B["初始化 currentStage = '國小'"]
    B --> C["首頁呈現 [10 關挑戰] / [20 關長征] 長度選擇"]
    C --> D{"玩家選擇模式並開局"}
    D --> E["生成對應長度地圖 (10 層或 20 層)"]
    E --> F["讀取當前學程 (國小/國中/高中/大學) 專屬校舍像素美術"]
    F --> G["依據當前關卡進度計算時段 (DAWN/DAY/DUSK/NIGHT)"]
    G --> H["動態渲染天空漸層、日月星辰與校舍窗光"]
    H --> I["玩家推進關卡 ➔ 即時動態流轉時段光影"]
```

### 12.4 循序圖 (Sequence Diagram)
```mermaid
sequenceDiagram
    autonumber
    actor Player as 玩家 (Player)
    participant Title as 標題首頁 (TitleScreen)
    participant Store as 遊戲核心狀態 (gameStore)
    participant Board as 棋盤組件 (GameBoard)
    participant Rogue as 肉鴿組件 (RoguelikeMap)
    participant Gen as 生成器模組 (board/rogue)

    Player->>Title: 點選 [👑 20關終極大考驗]
    Title->>Store: setGameLength(20)
    Player->>Title: 點選 [開啟肉鴿冒險] 或 [經典雙軌模式]
    Title->>Store: startNewGame('國小', 20)
    Store->>Gen: generateTwentyFloorMap('國小') 或 generateBoardTiles('國小', 20)
    Gen-->>Store: 返回 20 步長征網絡
    Store->>Board: 載入國小校舍 (PIXEL_SCHOOL_ELEMENTARY)
    Store->>Board: 計算時段: Floor 0 ➔ DAWN 晨曦金橘天色
    Board-->>Player: 呈現清晨國小校園，開始挑戰！
    loop 關卡推進
        Player->>Board: 推進至中段 (Floor 8 / 20)
        Board->>Store: 更新時段 ➔ DAY 正午蔚藍天幕
        Player->>Board: 推進至後段 (Floor 15 / 20)
        Board->>Store: 更新時段 ➔ DUSK 傍晚紫紅晚霞
        Player->>Board: 抵達第 20 關 Boss 戰 (Floor 19 / 20)
        Board->>Store: 更新時段 ➔ NIGHT 深夜挑燈夜戰
    end
```


---

## 13. 「現代旗艦版擬真金屬雙軌介面與雙風格切換系統」規格 (Modern Luxury Theme & Visual Style Switcher Spec)

### 13.1 需求背景與核心目標
依據使用者提供之高解析度現代版設計截圖 (`pic/國小.jfif`、`pic/國中.jfif`、`pic/高中.jfif`、`pic/大學.jfif`)，建立與截圖完全一致之現代旗艦級手遊視覺系統，並支援與 1993 復古街機版的一鍵無縫切換：
1. **雙視覺風格切換機制**：
   * `MODERN_LUXURY`（現代旗艦版）：100% 依據最新設計圖還原之奢華深酒紅暗紋金屬立體卡匣雙軌介面與學程專屬精緻校舍舞台。
   * `RETRO_ARCADE`（1993 復古街機版）：保留原創 16-Bit 點陣像素手繪、黑黃警戒斑馬紋與日系新潮街機大字報介面。
   * 玩家可在頂部隨時一鍵切換，狀態持久化儲存於瀏覽器 LocalStorage。
2. **現代版視覺架構規範**：
   * **上半部（學程專屬校舍與主角舞台）**：
     - **國小**：木牌小雛菊鉛筆「國民小學」招牌、彩色小學校舍、鐘樓尖塔時鐘、遠山、操場溜滑梯與彩虹跑道，黃帽紅書包小學生趴在深藍 3D 骰子上，前方配備「🎲 X 步」金屬藍光膠囊指示器。
     - **國中**：金屬深木牌「國民中學」招牌、現代三層水泥教學樓、藍紅運動場跑道、升旗台，立領短髮國中生。
     - **高中**：典雅深木招牌「高級中學」、大型排窗教學大樓、校徽時鐘樓，高中青年學生。
     - **大學**：綠藤校徽盾牌「綜合大學」木牌、巴洛克圓頂總圖書館、羅馬柱列門廊、歐式噴泉廣場與草坪，戴學士帽著學士袍夾著書本的大學畢業生。
   * **下半部（奢華暗酒紅金屬立體卡匣棋盤）**：
     - 底層：深邃奢華的暗酒紅幾何暗紋底板與暗光漸層。
     - 左側：【起點 昇學】金色金屬凹槽立體卡匣 +【分叉點 雙箭頭】霓虹青藍發光卡匣。
     - 中央雙軌：
       * 上路「路線上」（深青色發光膠囊標籤）：自然（顯微鏡）、音樂（金音符）、三選一、福利社（立體小雨棚商店）、社會（地球儀）、TROUBLE（黑紅骷髏警告三角）。
       * 下路「路線下」（深紫紅發光膠囊標籤）：健康教育（立體紅心）、美術（調色盤水彩筆）、天才問題（發光藍色人腦問號）、事件（紫色發光問號）、課外時事（書本問號）、天才問題（厚書本）、福利社。
     - 右側：【終點 升學大考】超華麗金色雕花發光神聖大考卡匣，金色神聖光暈、金色雕花外框、發光試卷與羽毛筆。
     - 步數指示器：玩家當前所在卡匣觸發呼吸金色/青藍微動霓虹光暈與立體浮起動畫。

### 13.2 資料結構定義
```typescript
/** 遊戲介面視覺風格主題 */
export type VisualTheme = 'MODERN_LUXURY' | 'RETRO_ARCADE';
```

### 13.3 系統架構流程圖 (Flowchart)
```mermaid
flowchart TD
    A["玩家點擊頂部 [🎨 切換風格] 按鈕"] --> B["gameStore.toggleVisualTheme()"]
    B --> C{"判斷目標主題"}
    C -- "切換至 MODERN_LUXURY" --> D["載入各學程專屬現代校舍高清舞台"]
    D --> E["載入深酒紅金屬立體雙軌卡匣棋盤 (ModernGameBoard)"]
    D --> F["啟動現代金屬藍光膠囊步數指示器"]
    C -- "切換至 RETRO_ARCADE" --> G["載入 16-Bit 程式化像素校舍與晨昏演色 (RetroGameBoard)"]
    G --> H["載入 1993 經典街機日系大字報與戰術切角介面"]
    E & H --> I["保存偏好至 LocalStorage，無縫保留當前題目與遊玩進度"]
```

### 13.4 循序圖 (Sequence Diagram)
```mermaid
sequenceDiagram
    autonumber
    actor Player as 玩家 (Player)
    participant HUD as 地圖頂部資訊列 (HUD)
    participant Store as 遊戲核心狀態 (gameStore)
    participant Modern as 現代版組件 (ModernGameBoard)
    participant Retro as 復古版組件 (RetroGameBoard)

    Player->>HUD: 點選 [🎨 現代版 / 街機版]
    HUD->>Store: toggleVisualTheme()
    Store->>Store: visualTheme = 'MODERN_LUXURY'
    alt 現代版啟動
        Store-->>Modern: 渲染對應學程之現代版高清校舍背景
        Store-->>Modern: 渲染暗酒紅立體金屬卡匣雙軌地圖
        Modern-->>Player: 呈現與設計稿一模一樣之現代奢華旗艦介面
    else 復古版啟動
        Store-->>Retro: 渲染 16-Bit 像素校舍與晨昏流轉
        Retro-->>Player: 呈現 1993 經典街機大型電玩介面
    end
```

---

## 14. 開頭映畫劇院、標題語音與雙曲輪播背景音樂架構 (Intro Cinema, Title Voice & Dual BGM Playlist)

### 14.1 設計理念與功能目標 (方案 A：智慧雙曲輪播電台 + HUD 切歌器 + 最新校舍)
1. **街機投幣式開場映畫劇院 (Intro Cinema)**：
   - 玩家重整網頁 (F5) 或初次進入遊戲首頁時，以黑底大型街機劇院全螢幕呈現日系霓虹「🪙 INSERT COIN · PRESS START TO WATCH INTRO」啟動門。
   - 玩家點擊螢幕任一處或按下任意按鍵（<kbd>SPACE</kbd> / <kbd>ENTER</kbd>），瞬間解鎖瀏覽器最高等級的音訊與視訊播放授權（User Gesture），同時觸發投幣音效。
   - 滿版有聲播放最新片頭動畫 `pic/1020.mp4`，右下方提供「⏩ 跳過片頭 [SPACE / 點擊]」戰術按鈕。
2. **首頁標題語音大吼 (`念標題.mp3`) 與手勢同步預溫熱 (Audio Warm-up)**：
   - **手勢同步預溫熱解鎖**：玩家在點擊「🪙 投幣啟動」的同一個使用者手勢事件週期中，系統立即對 `title_voice.mp3` 與 BGM 執行微秒級的靜音預載與授權溫熱（Warm-up Pre-unlock），使音訊實例完全繼承投幣手勢之特權。
   - **播畢零延遲大吼**：片頭動畫播畢或玩家跳過進入首頁瞬間，**100% 突破瀏覽器暫態手勢時效限制，立即以最高清晰度大聲播放 `念標題.mp3`（街機主標題語音「民國教育委員會！」）**。
3. **智慧雙曲交替輪播背景音樂 (`bgmEngine.ts`)**：
   - 內建播放清單佇列：
     - 曲目 1：`The_Final_Question.mp3` (最後審判大考曲)
     - 曲目 2：`Ten_Second_Countdown.mp3` (十秒命運倒數曲)
   - 監聽曲目播畢事件（`ended`），自動接續播放下一首，達到「雙曲交替無限輪播」。
   - 支援「**音訊避讓 (Audio Ducking)**」：在首頁念標題的 1.5 秒期間，BGM 音量先微降至 12% 襯底，語音播畢後平滑漸強回復至 35% 常駐播放。
   - 街機框體頂部 HUD 升級：顯示當前曲名狀態（如 `[♫ 1/2] The Final Question`），並新增「⏭️ 下一首」按鈕，玩家可隨時手動換歌。
4. **現代旗艦版校舍圖全面升級 (`ModernGameBoard.vue`)**：
   - 國小、國中、高中、大學四大學程全面採用 2026-10-20 最新版 `.jfif` 圖資：
     - `public/modern/school_elementary.jfif`
     - `public/modern/school_junior.jfif`
     - `public/modern/school_high.jfif`
     - `public/modern/school_university.jfif`

### 14.2 資料結構定義
```typescript
/** 背景音樂曲目定義 */
export interface BgmTrack {
  id: string;
  title: string;
  sources: string[];
}

/** 背景音樂引擎狀態介面 */
export interface BgmState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number; // 0.0 ~ 1.0
  isDucking: boolean; // 是否正在進行音訊避讓 (降低襯底)
  currentTrackIndex: number;
  currentTrackTitle: string;
}

/** 開頭片頭映畫狀態介面 */
export interface IntroVideoState {
  hasStarted: boolean; // 是否已投幣/點擊啟動
  isPlaying: boolean;
  hasEnded: boolean;
  isMuted: boolean;
  videoSrc: string; // 1020.mp4
}
```

### 14.3 開頭映畫、標題語音與雙曲輪播流程圖 (Flowchart - 方案 A)
```mermaid
flowchart TD
    A["使用者打開網頁 / F5 重整"] --> B["滿版呈現 [🪙 INSERT COIN / PRESS START] 啟動門"]
    B --> C["玩家點擊任意處 / 按 SPACE / 按 ENTER"]
    C --> D["播放投幣音效 + 獲取瀏覽器最高等級 User Gesture"]
    D --> E["100% 保證全螢幕原聲播放 1020.mp4"]

    E --> F{"影片播放狀態"}
    F -- "影片播放完畢 (ended)" --> G["400ms 黑屏平滑淡出"]
    F -- "玩家點擊 [⏩ 跳過片頭]" --> G

    G --> H["進入首頁 (TitleScreen)"]
    G --> I["前景立即大聲播放 念標題.mp3 ('民國教育委員會！')"]
    G --> J["背景啟動曲目一 The_Final_Question (啟動 Ducking: 音量微降至 12% 襯底)"]
    
    I -->|語音播畢 (ended)| K["BGM 平滑漸強回復至 35% 常駐播放"]
    
    J --> M{"曲目播放結束判定"}
    M -- "曲目一播放完畢 (ended)" --> N["自動切換播放 曲目二 Ten_Second_Countdown"]
    M -- "曲目二播放完畢 (ended)" --> O["自動切換回 曲目一 The_Final_Question"]
    M -- "玩家手動點擊 HUD [⏭️ 下一首]" --> P["立即淡出並切換至下一首曲目"]
    N & O & P --> M

    K --> L["頂部 HUD 呈現 [♫ 曲目] + [⏭️ 下一首] + [MUTE 開關]"]
```

### 14.4 開頭映畫、標題語音與雙曲輪播循序圖 (Sequence Diagram - 方案 A)
```mermaid
sequenceDiagram
    autonumber
    actor Player as 玩家 (Player)
    participant Cinema as 開頭映畫門 (IntroCinema.vue)
    participant Video as 視訊核心 (1020.mp4)
    participant App as 主應用容器 (App.vue)
    participant TitleVoice as 標題語音 (念標題.mp3)
    participant BGM as 背景音樂引擎 (bgmEngine)
    participant ModernBoard as 現代版校舍 (ModernGameBoard.vue)

    Player->>App: 進入網站或 F5 重整頁面
    App->>Cinema: 掛載開頭映畫組件 (showIntro = true)
    Cinema-->>Player: 呈現日系霓虹「🪙 INSERT COIN / PRESS START」
    Player->>Cinema: 點擊螢幕任意處或按 SPACE
    Cinema->>Video: video.play() (原聲放映 1020.mp4)
    Video-->>Player: 滿版播放片頭影片

    alt 玩家點擊跳過或影片播畢
        Player->>Cinema: 點擊 [⏩ 跳過片頭] (或 video.onended)
    end
    Cinema->>App: 觸發 complete 事件
    App->>TitleVoice: 播放「念標題.mp3」(前景高音量)
    App->>BGM: bgmEngine.playTitleVoiceWithDucking() (曲目一，音量 12% 襯底)
    TitleVoice-->>BGM: 語音播放結束，平滑回復至 35%
    
    loop 雙曲無限輪流播放
        BGM->>BGM: 曲目一結束 -> 自動播放曲目二
        BGM->>BGM: 曲目二結束 -> 自動播放曲目一
    end

    opt 進入現代旗艦版
        App->>ModernBoard: 載入最新校舍圖 (.jfif 國小/國中/高中/大學)
        ModernBoard-->>Player: 呈現最新校舍美學
    end
```

---

## 15. 版本發布管理與 Release Notes 規範 (Release Management Specification)

### 15.1 發布理念與核心要求
1. **強制發布日誌原則**：未來每一次功能開發、介面調整或 Bug 修復推送到 GitHub 遠端倉庫前，**必須先於根目錄 `RELEASE_NOTES.md` 追加該版本的完整 Release Note**。
2. **語意化版本號 (SemVer)**：採用 `v主版本.次版本.修訂號`（例如 `v2.5.0`），搭配詳細發布日期與時間。
3. **分類結構化規範**：
   - 🚀 **新功能與機制升級 (New Features)**
   - 🐛 **問題修復與相容性強化 (Bug Fixes)**
   - 🎨 **視覺風格與街機美學優化 (UI / UX)**
   - 🎵 **音效多媒體與混音控制 (Audio / Media)**
4. **語言強制**：所有 Release Notes 內容**強制使用繁體中文 (Traditional Chinese)**。

### 15.2 版本發布工作流程圖 (Flowchart)
```mermaid
flowchart TD
    A["完成功能開發 / 修復驗證"] --> B["執行本地 npm run build 通過"]
    B --> C["編寫 / 更新根目錄 RELEASE_NOTES.md"]
    C --> D["同步更新 todolist.md 與 report.md"]
    D --> E["執行 git commit -m '...'"]
    E --> F["執行 git push origin main 發布"]
    F --> G["回報使用者時附上當次 Release Note 摘要"]
```

