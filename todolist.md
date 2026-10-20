# 《民國教育委員會》開發任務清單 (TodoList)

- 規格優先原則：所有實作皆嚴格依循 [`spec.md`](./spec.md) 規格書執行。
- 語言要求：全繁體中文記錄。

---

## 階段一：專案架構建立與基礎型別配置
- [x] 使用 CLI 工具建立 Vue 3 + TypeScript + Tailwind CSS 專案環境
- [x] 配置大型機台黑底 Neo-Retro 配色系統 (`tailwind.config.js`)
- [x] 建立資料模型介面：`src/types/quiz.ts` (題目、玩家、學程階段、排行榜、街機設定)
- [x] 建立音效合成器引擎：`src/utils/audioEngine.ts` (Web Audio API 合成投幣音、答對提示、警報聲)
- [x] 驗證開發伺服器運行正常 (`npm run dev`)

## 階段二：題庫狀態管理庫與預設資料庫建置
- [x] 建立狀態庫：`src/stores/questionStore.ts` (Pinia)
- [x] 擴充台灣 90 年代懷舊考題：地理、歷史、三民主義、流行娛樂、生活常識
- [x] 實作隨機題庫篩選演算法 (依難度、學程年級動態出題)
- [x] 建立 Excel / CSV / JSON 批次匯入解析模組 (`xlsx` 套件整合)

## 階段三：遊戲核心玩法引擎開發
- [x] 建立狀態庫：`src/stores/gameStore.ts` (Pinia)
- [x] 實作作答倒數計時器 (每題 10 秒限制，剩 3 秒警報音效)
- [x] 實作連擊計分 (Combo Multiplier) 與升學學分累積機制
- [x] 實作「動態街機難度系統 (Dynamic Rank System)」(依玩家連勝/連敗動態調整)
- [x] 實作晉級升學檢定考規則 (國小 ➔ 國中 ➔ 高中 ➔ 大學)

## 階段四：街機風格前端組件實作
- [x] 實作頂部街機資訊面板組件：`src/components/game/ArcadeHeader.vue` (LED 計分板、HP 愛心、代幣數)
- [x] 實作復古黑板作答卡片組件：`src/components/game/QuizCard.vue` (粉筆字、ABCD 按鍵、倒數燈號)
- [x] 實作答題結果與晉級/淘汰彈窗組件：`src/components/game/ResultModal.vue`
- [x] 實作 9 秒投幣續關倒數組件：`src/components/game/ContinueModal.vue`
- [x] 實作首頁街機啟動畫面：`src/components/game/TitleScreen.vue` (PRESS START TO PLAY, 投幣效果)

## 階段五：自訂題庫與名師形象管理中心 (CMS)
- [x] 實作自訂題庫管理主面板：`src/components/cms/QuestionCMS.vue`
- [x] 支援題庫即時預覽、增刪查改 (CRUD)
- [x] 支援名師授課形象相片更換與語音台詞自訂
- [x] 支援自訂題庫匯出為 JSON / CSV 檔案

## 階段六：系統整合、音效校調與驗收
- [x] 整合所有視圖於主應用入口：`src/App.vue`
- [x] 全面校調 Web Audio API 合成音效之頻率與復古音色
- [x] 撰寫函式級繁體中文 Docstrings 註解
- [x] 執行本地 Production Build 驗證 (`npm run build`)
- [x] 產出專案交付成果報告 `report.md` 與使用手冊 `README.md`

## 階段七：致敬 1993 街機原作「雙軌分叉地圖」與「命運轉學事件」
- [x] 在 `src/types/quiz.ts` 擴充地圖格子類型 (RECOVERY, QUIZ, CANTEEN, TRANSFER, EVENT, THREE_CHOICE, TALENT, TROUBLE, HEALTH, EXTRACURRICULAR, FORK, EXAM)
- [x] 建立雙軌地圖分叉演算法與校園隨機事件庫：`src/utils/boardGenerator.ts`
- [x] 在 `src/stores/gameStore.ts` 實作步數前進、雙軌分支路線選擇 (UPPER/LOWER)
- [x] 實作「轉學格 (TRANSFER)」隨機轉調至不同學制機制
- [x] 實作「三選一送分格 (THREE_CHOICE)」與「天才挑戰雙倍格 (TALENT)」特殊作答邏輯
- [x] 實作「校園福利社 (CANTEEN)」道具購買系統 (名偵探放大鏡、定時懷錶、Pass免試券、冰鎮養樂多)
- [x] 實作全新棋盤地圖組件：`src/components/game/GameBoard.vue` (致敬原作跑馬燈「離畢業還有 10 層次」、橫向卷軸雙軌卡匣、大頭吉祥物標記)
- [x] 實作分叉路線選擇對話框：`src/components/game/ForkModal.vue`
- [x] 實作校園福利社商店對話框：`src/components/game/CanteenModal.vue`
- [x] 實作轉學手續通知對話框：`src/components/game/TransferModal.vue`
- [x] 實作校園突發事件對話框：`src/components/game/EventModal.vue`
- [x] 實作各升學階段專屬「升學檢定大考 Boss 關卡」：`src/components/game/BossExamModal.vue`
- [x] 於 `src/App.vue` 全面整合雙軌地圖棋盤與新式彈窗

## 階段八：經典 16-Bit 復古像素圖標繪製 (純程式化向量/SVG 實作)
- [x] 建立獨立美術圖資庫：`src/assets/pixelArt.ts`
- [x] 繪製 16-Bit 點陣「綠色吉祥物大頭 (Mascot Dice)」
- [x] 繪製日式卡匣雙軌 12 類像素格子圖標 (昇學、隨堂考、三選一、天才、福利社、轉學、事件、健康、課外、分叉、升學大考)
- [x] 建立像素圖標渲染組件：`src/components/game/RetroTileIcon.vue`
- [x] 在 `GameBoard.vue` 與各對話框組件中替換純文字/Emoji，全面升級為正統 1993 大型電玩像素美術

## 階段九：雙人主播即時播報台與電視新聞大頭條開場
- [x] 在 `src/types/quiz.ts` 定義主播與名師形象介面 (`AnchorCharacter`, `SubjectTeacher`)
- [x] 建立角色形象與台詞狀態庫：`src/stores/characterStore.ts`
- [x] 繪製 16-Bit 像素「男主播（民國播報員）」與「女主播（校園特派員）」大頭貼
- [x] 繪製 16-Bit 像素七大學科專屬指導名師肖像
- [x] 實作「電視新聞大頭條開場動畫」組件：`src/components/game/NewsIntroModal.vue` (電視掃描線、快訊跑馬燈、主播即時點評)
- [x] 實作「雙主播電視新聞播音台」常駐 HUD (`ArcadeNewsAnchor.vue` / 整合於 `GameBoard.vue`)
- [x] 在作答黑板 (`QuizCard.vue`) 與大考 Boss 關卡 (`BossExamModal.vue`) 實作學科名師即時登場輔導機制
- [x] 在 CMS 後台 (`QuestionCMS.vue`) 建立獨立的「雙主播台詞與名師肖像管理」分頁，支援自訂頭像與口頭禪

## 階段十：極度現代化 Roguelike 爬塔模式與硬核機制
- [x] 在 `src/types/quiz.ts` 定義 Slay the Spire 樹狀節點與現代肉鴿介面 (`RoguelikeNode`, `SchoolRelic`)
- [x] 建立樹狀分支地圖產生器：`src/utils/roguelikeGenerator.ts`
- [x] 實作「透明分支自選地圖」組件：`src/components/game/RoguelikeMap.vue`
- [x] 實作「信心下注博弈 (Wager)」彈窗組件：`src/components/game/WagerModal.vue`
- [x] 實作「留級警告與期中考補考機制」組件：`src/components/game/RemedialExamModal.vue`
- [x] 實作「8-bit 復古聽力猜歌 (Web Audio FM 合成)」測驗機制
- [x] 實作「局部照片放大破案題 (Visual Clue Zoom)」
- [x] 實作「盲答考驗 (Blackout)」黑板作答反向思維玩法
- [x] 實作「校園稀有被動裝備/聖物系統 (Relics)」
- [x] 於首頁 `TitleScreen.vue` 與主應用 `App.vue` 實作模式選擇 (經典雙軌大富翁 vs 輕度肉鴿選路)

## 階段十一：日系新潮街機風 (Neo-Arcade) 全面視覺重構
- [x] 確立「日系新潮街機風 (Neo-Arcade / Persona 5 × 橫向街機)」設計規範
- [x] 配置 `index.html` 引入「Noto Sans TC」與「Space Grotesk / Changa One」
- [x] 在 `src/style.css` 建立 Neo-Arcade 專屬工具類別 (`neo-cut`, `neo-skew-title`, `neo-hazard-yellow`, `neo-btn`)
- [x] 全面翻新首頁標題組件 (`src/components/game/TitleScreen.vue`)
- [x] 全面翻新作答黑板組件 (`src/components/game/QuizCard.vue`)
- [x] 全面翻新肉鴿分支地圖組件 (`src/components/game/RoguelikeMap.vue`)
- [x] 全面翻新經典雙軌棋盤組件 (`src/components/game/GameBoard.vue`)
- [x] 執行本地 `npm run build` 編譯檢驗確認 100% 通過
- [x] 提交並推送到 GitHub 遠端倉庫自動發布

## 階段十二：全面去除 AI 塑膠感與手繪像素美術重繪
- [x] 重新繪製 8 款 16-Bit 復古像素主角肖像圖資 (`src/assets/pixelArt.ts`)
- [x] 繪製 7 款學科代表色 16-Bit 像素書本名師圖資
- [x] 繪製 7 款肉鴿分支地圖戰術像素徽章
- [x] 修正首頁、地圖與作答介面，確保 100% 使用純正 16-Bit 像素圖資
- [x] 執行本地 `npm run build` 編譯檢驗確認 100% 通過
- [x] 提交並推送到 GitHub 遠端倉庫自動發布

## 階段十三：電腦端寬屏與大字報版面重構 (方案 1)
- [x] 展開主版面至全螢幕寬屏架構 (`max-w-7xl` / `max-w-full`)
- [x] 放大標題、跑馬燈、題目與按鈕字級，達到「日本大字報」震撼排版
- [x] 強化雙軌棋盤與肉鴿地圖橫向展開視覺體驗
- [x] 執行本地 `npm run build` 編譯檢驗確認 100% 通過
- [x] 提交並推送到 GitHub 遠端倉庫自動發布
- [x] 產出大字報重構日誌至 `/log` 目錄與更新 `report.md`

## 階段二十二：依使用者反饋還原為日系新潮街機撞色與大字報版面 (Rollback to Neo-Arcade Style)
- [x] 執行 Git Revert 撤銷 SaaS 風格，完整還原日系新潮街機撞色 (Neo-Arcade)、16-Bit 像素美術與寬屏沉浸大字報版面
- [x] 執行本地 `npm run build` 編譯檢驗確認 100% 通過
- [x] 更新 `spec.md`、`report.md` 與任務日誌 `log/20261020_8.md`
- [x] 將還原代碼推送至遠端 GitHub 倉庫重新發布

## 階段二十三：五關速通賽 vs 十關馬拉松關卡長度自選系統實作 (方案 A)
- [x] 在 `src/types/quiz.ts` 擴充 `GameLengthMode = 5 | 10` 關卡長度列舉型別
- [x] 在 `src/stores/gameStore.ts` 增加 `gameLength` 狀態與 `setGameLength(length)` Action，並連動 `remainingLayers`
- [x] 擴充肉鴿地圖生成器 (`src/utils/roguelikeGenerator.ts`)：支援 5 層速通模式與 10 層完整馬拉松模式動態生成
- [x] 擴充經典雙軌棋盤生成器 (`src/utils/boardGenerator.ts`)：支援 5 關與 10 關卡匣軌道長度與步數動態切換
- [x] 在首頁畫面 (`src/components/game/TitleScreen.vue`) 實作「⚡ 五關速通賽」與「🏆 十關馬拉松」日系大字報切換按鍵組
- [x] 在雙軌地圖與肉鴿地圖 HUD 顯示當前挑戰長度標籤與正確的剩餘關卡數
- [x] 執行本地 `npm run build` 編譯檢驗確認 100% 通過
- [x] 將新功能代碼提交並推送到遠端 GitHub 倉庫自動發布
- [x] 產出關卡長度自選日誌至 `log/20261020_9.md` 與更新 `report.md`


## 階段二十四：緊急退學與重置入學系統實作 (方案 A)
- [x] 在 `src/stores/gameStore.ts` 之 `ActiveModalType` 增加 `'RESET_CONFIRM'` 類型
- [x] 在 `src/stores/gameStore.ts` 實作 `resetGameToElementary()` 與確認彈窗開關 Action
- [x] 建立日系新潮街機二度確認彈窗組件 `src/components/game/ResetModal.vue`
- [x] 在經典雙軌地圖頂部 HUD (`src/components/game/GameBoard.vue`) 增設「🔄 重置入學」戰術按鈕
- [x] 在樹狀肉鴿地圖頂部 HUD (`src/components/game/RoguelikeMap.vue`) 增設「🔄 重置入學」戰術按鈕
- [x] 在主應用 (`src/App.vue`) 掛載 `ResetModal.vue` 並綁定觸發
- [x] 執行本地 `npm run build` 編譯檢驗確認 100% 通過
- [x] 將新功能代碼提交並推送到遠端 GitHub 倉庫自動發布
- [x] 產出重置退學日誌至 `log/20261020_10.md` 與更新 `report.md`


## 階段二十五：20關終極長征、國小預設起步與日夜晨昏校舍系統實作 (方案 A)
- [x] 在 `src/types/quiz.ts` 更新 `GameLengthMode = 10 | 20` 並定義 `TimeOfDay` 時段型別
- [x] 在 `src/stores/gameStore.ts` 將初始學程與各處預設全面改為「國小」，並支援 10 關 / 20 關動態步數與進度時段計算
- [x] 在 `src/assets/pixelArt.ts` 繪製國小、國中、高中、大學四套專屬 16-Bit 程式化向量像素校舍圖資
- [x] 擴充肉鴿生成器 (`src/utils/roguelikeGenerator.ts`)：實作 20 層深度網絡 (`generateTwentyFloorMap`)
- [x] 擴充雙軌棋盤生成器 (`src/utils/boardGenerator.ts`)：支援 20 步長卡匣軌道動態生成
- [x] 更新首頁畫面 (`src/components/game/TitleScreen.vue`)：將 5 關更換為「🏆 10 關挑戰賽」與「👑 20 關終極大考驗」
- [x] 在雙軌棋盤 (`src/components/game/GameBoard.vue`) 實現四大學程專屬校舍切換與晨昏光影漸層 (早晨/正午/黃昏/夜晚)
- [x] 在肉鴿地圖 (`src/components/game/RoguelikeMap.vue`) 頂部橫幅連動當前時段光影標籤
- [x] 執行本地 `npm run build` 編譯檢驗確認 100% 通過
- [x] 將新功能代碼提交並推送到遠端 GitHub 倉庫自動發布
- [x] 產出日誌至 `log/20261020_11.md` 與更新 `report.md`


## 階段二十六：現代旗艦版擬真金屬雙軌介面與雙風格切換系統實作 (方案 A)
- [x] 將 `pic/` 目錄中的四大學程最新設計圖資源安全部署至公開資產目錄 (`public/modern/`)
- [x] 在 `src/types/quiz.ts` 增加 `VisualTheme = 'MODERN_LUXURY' | 'RETRO_ARCADE'` 主題型別
- [x] 在 `src/stores/gameStore.ts` 增加 `visualTheme` 狀態與 `toggleVisualTheme()` Action，支援 LocalStorage 本地儲存
- [x] 實作現代版專屬組件 `src/components/game/ModernGameBoard.vue`，100% 還原截圖中的暗酒紅金屬立體雙軌卡匣、起點昇學、分叉雙箭頭、終點黃金大考與各學程校舍舞台
- [x] 在經典雙軌棋盤 (`src/components/game/GameBoard.vue`) 與頂部 HUD 整合風格切換開關，無縫切換現代旗艦版與復古街機版
- [x] 執行本地 `npm run build` 編譯檢驗確認 100% 通過
- [x] 將新功能代碼提交並推送到遠端 GitHub 倉庫自動發布
- [x] 產出日誌至 `log/20261020_12.md` 與更新 `report.md`


## 階段二十七：全域主題調度修復與現代版完全響應實作 (方案 A)
- [x] 在 `src/stores/gameStore.ts` 增補 `setVisualTheme(theme: VisualTheme)` Action 支援精準主題設定
- [x] 修復 `src/components/game/ModernGameBoard.vue` 背景圖片 Base URL 絕對路徑缺陷，避免 GitHub Pages 404
- [x] 在 `src/components/game/ModernGameBoard.vue` 增設 `switch-to-roguelike` 事件與頂部功能按鍵
- [x] 修復 `src/components/game/GameBoard.vue` 模板條件分支，確保 `v-if="visualTheme === 'MODERN_LUXURY'"` 正確渲染現代版
- [x] 在首頁畫面 (`src/components/game/TitleScreen.vue`) 新增現代旗艦版與 1993 街機版主題切換面板
- [x] 在肉鴿地圖 (`src/components/game/RoguelikeMap.vue`) 頂部 HUD 支援主題切換按鈕
- [x] 執行本地 `npm run build` 編譯檢驗確認 100% 通過
- [x] 將修復與新功能代碼提交並推送到遠端 GitHub 倉庫自動發布
- [x] 產出修復日誌至 `log/20261020_13.md` 與更新 `report.md`


## 階段二十八：開頭映畫劇院全螢幕模式與全域 BGM 智慧循環調度實作 (方案 A)
- [x] 部署多媒體檔案：將 `pic/The_Final_Question.mp3` 與 `pic/開頭.mp4` 部署至公開資產目錄 (`public/media/`)
- [x] 建立獨立全域背景音樂引擎：`src/utils/bgmEngine.ts`，支援自動無限循環播放、音量調整、靜音開關與狀態監聽
- [x] 實作電影級開頭映畫組件：`src/components/game/IntroCinema.vue`，支援黑底全螢幕、Autoplay 點擊解鎖提示、跳過按鍵 (SPACE / 點擊) 與淡出過場
- [x] 在主應用入口 (`src/App.vue`) 掛載開頭映畫組件，於網頁載入或重整時優先播放，結束後平滑過渡並啟動 BGM 循環
- [x] 在街機外框組件 (`src/components/retro/ArcadeFrame.vue`) 增設「🎵 BGM」即時開關與音量微調按鈕
- [x] 執行本地 `npm run build` 編譯檢驗確認 100% 通過
- [x] 將新功能代碼提交並推送到遠端 GitHub 倉庫自動發布
- [x] 產出日誌至 `log/20261020_14.md` 與更新 `report.md`


