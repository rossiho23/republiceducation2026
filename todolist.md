# 《民國教育委員會》復刻版 開發任務清單 (todolist.md)

## 階段一：專案環境與基礎骨架建立
- [x] 初始化 Vite + Vue 3 + TypeScript 專案架構
- [x] 安裝必要依賴項 (`pinia`, `tailwindcss`, `lucide-vue-next`, `xlsx`)
- [x] 設定 Tailwind CSS 復古街機主題樣式與調色盤
- [x] 建立專案目錄結構 (`src/components`, `src/stores`, `src/audio`, `src/utils`, `src/types`, `src/data`)

## 階段二：題庫核心模組與資料處理 (Question System)
- [x] 定義 TypeScript 資料模型與介面型別 (`src/types/quiz.ts`)
- [x] 撰寫 Excel (`xlsx`) 與 CSV 題庫解析與防呆驗證器 (`src/utils/questionParser.ts`)
- [x] 建立內建經典預設題庫種子資料 (`src/data/defaultQuestions.ts`)
  - [x] 擴充在地化台灣 90 年代流行歌手、綜藝娛樂、歷史、地理與體育題目
- [x] 實作題庫管理 Pinia 狀態庫與持久化儲存 (`src/stores/questionStore.ts`)
- [x] 實作 Excel 範本下載與自訂題庫匯出功能

## 階段三：街機音效引擎 (Retro Audio Synthesizer)
- [x] 實作基於 Web Audio API 之 8-bit 街機音效生成器 (`src/utils/audioEngine.ts`)
- [x] 實作投幣聲 (Coin Insert)、骰子滾動聲、按鈕點擊聲
- [x] 實作答對音 (Correct Ding)、答錯警報 (Wrong Buzzer)、倒數計時急促音 (Tick)
- [x] 實作通關升學號角聲 (Fanfare) 與遊戲結束音效 (Game Over)
- [x] 擴充道具使用聲、福利社商店鐘聲、跳級幸運號角聲

## 階段四：深度街機數值與狀態管理 (Game Engine)
- [x] 實作街機隱藏動態難度系統 (Rank 0~10 機制，依答題秒速、連對動態升降)
- [x] 實作學分金幣與福利社道具背包系統 (`src/stores/gameStore.ts`)
  - [x] 放大鏡 (50/50 刪除兩個錯誤選項)
  - [x] 定時懷錶 (+10 秒延長作答)
  - [x] Pass 免試券 (換一題)
  - [x] 冰鎮養樂多 (+35 體力)
- [x] 實作轉學跳級／留級命運機制
- [x] 實作升學 Boss 關卡嚴苛進度條（國小、國中、高中、大學逐級加難與連對扣血）
- [x] 實作 9 秒投幣續關倒數機制

## 階段五：地圖棋盤與特殊格子系統 (Board & Events)
- [x] 設計四階段地圖格子配置產生器 (`src/utils/boardGenerator.ts`)
- [x] 更新地圖配置加入「福利社商店格」與「轉學跳級格」
- [x] 製作地圖棋盤 UI 組件 (`src/components/game/GameBoard.vue`)
- [x] 實作福利社道具商店彈窗 (`src/components/game/CanteenModal.vue`)
- [x] 實作轉學跳級結果彈窗 (`src/components/game/TransferModal.vue`)
- [x] 實作突發校園事件彈窗 (`src/components/game/EventModal.vue`)

## 階段六：作答介面與在地化綜藝主持 (Quiz Interface)
- [x] 製作街機問答主彈窗組件 (`src/components/game/QuizCard.vue`)
- [x] 實作道具使用快捷列 (點擊或熱鍵 1/2/3/4 即時發動道具)
- [x] 實作動態倒數計時條、Rank 難度指示燈與在地化台味主持播音文字
- [x] 實作鍵盤快速鍵支援 (`A/B/C/D` 作答)
- [x] 實作答對／答錯像素特效與 50/50 剔除選項動畫

## 階段七：升學大考 Boss 戰與結算介面 (Exam & EndGame)
- [x] 製作升學 Boss 關卡檢定考介面 (`src/components/game/BossExamModal.vue`)
- [x] 製作接關投幣畫面 (`src/components/game/ContinueModal.vue`)
- [x] 製作光榮畢業典禮與成績單清冊 (`src/components/game/ResultModal.vue`)

## 階段八：題庫管理後台介面 (Question CMS)
- [x] 製作題庫管理視窗組件 (`src/components/cms/QuestionCMS.vue`)
- [x] 實作拖曳上傳 Excel / CSV / JSON 檔案匯入介面
- [x] 實作線上視覺化新增、編輯、刪除題目表單
- [x] 實作題庫搜尋、學科難度篩選與題目分頁預覽
- [x] 實作一鍵重設回預設題庫功能

## 階段九：整體整合、CRT濾鏡與優化
- [x] 整合遊戲主介面與標題投幣畫面 (`src/components/game/TitleScreen.vue`)
- [x] 加入復古街機 CRT 顯像管掃描線開關與外框
- [x] 進行完整遊玩與自訂題庫全流程端到端測試
- [x] 產出專案交付文件 `report.md` 與 `README.md`

## 階段十：街機原版橫向卷軸地圖重構 (致敬 pic/地圖.jpg)
- [x] 繪製復古 8-bit 校舍外觀、藍天浮雲與「國小/國中/高中/大學」校門圍牆標牌
- [x] 打造中央經典「大頭娃娃／吉祥物」趴在立體跳動骰子上的趣味動畫
- [x] 重現下半部深藍菱格紋與「民國教育委員會」印章傾斜浮水印背景
- [x] 打造橫向立體厚度卡匣式格子軌道 (3D Track Tiles)
- [x] 實作原版圖標：START小學生、國文書本鉛筆、地理世界地圖、自然燒杯滴管、數學三角板、問號百葉窗、LUCKY 旭日放射
- [x] 實作角色在格子上方跳躍前進與視角自動水平平滑跟隨捲動
- [x] 進行畫面響應式測試與編譯驗證

## 階段十一：雙軌分叉路線系統實作 (致敬 pic/map1.jpg)
- [x] 擴充 `src/types/quiz.ts` 支援 `BranchType` 與新格子類型 (`THREE_CHOICE`, `TROUBLE`, `TALENT`, `HEALTH`, `EXTRACURRICULAR`, `FORK`)
- [x] 擴充 `src/components/game/RetroTileIcon.vue` 繪製新圖標：三選一、TROUBLE 骷髏、天才問題、健康教育人體紅心、課外、音樂五線譜、美術調色盤
- [x] 升級 `src/utils/boardGenerator.ts` 產生雙軌分叉地圖拓撲
- [x] 升級 `src/stores/gameStore.ts` 支援分叉選擇、三選一、天才問題雙倍計分、TROUBLE 扣血
- [x] 升級 `src/components/game/GameBoard.vue` 呈現雙軌平行卡匣軌道與「離畢業還有 N 層次」頂部燈箱
- [x] 實作分叉抉擇互動介面（上路理組冒險 vs 下路文藝修煉）
- [x] 執行專案編譯驗證 (`npm run build`)

## 階段十二：答題人物視覺系統（師生黑板與新聞主播替換）實作 (致敬 quiz1.jpg & new1.jpg)
- [x] 擴充 `src/types/quiz.ts` 支援 `TeacherProfile` 與 `AnchorProfile` 模型
- [x] 建立預設名師與主播資料庫 `src/data/defaultCharacters.ts`
- [x] 實作角色與名師狀態庫 `src/stores/characterStore.ts` (支援 LocalStorage 持久化)
- [x] 升級 `src/components/game/QuizCard.vue`：黑板背景、左側固定大頭學生（思考/答對/答錯動態表情）、右側手持教鞭名師（動態載入選定之老師）
- [x] 實作新聞問題特別過場彈窗 `src/components/game/NewsIntroModal.vue`（致敬 new1.jpg 世界地圖網格、金屬大字與雙主播立繪）
- [x] 在 `src/components/cms/QuestionCMS.vue` 增加「人物設定」標籤頁，支援切換與自訂老師/主播圖片
- [x] 執行專案編譯驗證 (`npm run build`)

## 階段十三：版本發佈與 Git 倉庫設定 (Release & Delivery)
- [x] 設定 `.gitignore` 排除 `/pic/` 與 `/log/` 目錄
- [x] 撰寫繁體中文版本發布說明 (`RELEASE_NOTES.md`)
- [x] 初始化 Git 儲存庫並建立首發 Commit
- [x] 設定主分支 `main` 並推送至遠端 GitHub 倉庫 (`republiceducation2026.git`)
- [x] 記錄推播歷程至 `log/20261019_4.md`

## 階段十四：現代化答題機制（聽力、視覺、陷阱、盲答、即時下注）實作
- [x] 擴充 `src/types/quiz.ts` 支援 `QuizQuestionType`、`AudioMelodyItem`、`WagerAmount` 與 `SchoolRelic` 模型
- [x] 實作 8-bit 動漫與台灣懷舊廣告旋律合成器 (`src/utils/audioMelodySynthesizer.ts`)
- [x] 擴充題庫資料集加入聽力題、視覺局部放大題、反向選錯題與盲答迷霧題
- [x] 製作答題前即時下注彈窗組件 (`src/components/game/WagerModal.vue`)
- [x] 升級 `src/components/game/QuizCard.vue` 支援：聽力播放控制器、視覺馬賽克漸進解鎖、反向題紅色警示、盲答遮罩

## 階段十五：Slay the Spire 輕度 Roguelike 樹狀分支地圖與重修補考機制實作
- [x] 實作 Roguelike 樹狀節點網絡生成器 (`src/utils/roguelikeGenerator.ts`)
- [x] 製作 Slay the Spire 式樹狀節點地圖組件 (`src/components/game/RoguelikeMap.vue`，具備 SVG 貝茲曲線與動態節點發光)
- [x] 製作留級教官警告與期中連續答對補考彈窗 (`src/components/game/RemedialExamModal.vue`)
- [x] 在 `src/stores/gameStore.ts` 整合肉鴿地圖前進、下注倍率計算、失誤累積與留級聖物被動效果
- [x] 在 `src/components/game/TitleScreen.vue` 增加「輕度肉鴿模式」與「經典街機模式」雙模式切換

## 階段十六：全流程整合、編譯驗證與交付報告
- [x] 執行 `npm run build` 驗證 TypeScript 型別與 Vue 模板編譯
- [x] 更新 `log/20261019_5.md`
- [x] 更新 `report.md` 任務總結

## 階段十七：GitHub Pages 自動部署與發布實作 (CI/CD Pipeline)
- [x] 在 `vite.config.ts` 設定 `base: '/republiceducation2026/'`
- [x] 撰寫 GitHub Actions 自動部署腳本 (`.github/workflows/deploy.yml`)
- [x] 執行本地打包檢查確認路徑與編譯無誤 (`npm run build`)
- [x] 將更新代碼提交並推送到遠端 GitHub 倉庫 (`main` 分支)
- [x] 撰寫部署日誌至 `log/20261019_7.md`

## 階段十八：肉鴿地圖題目前置狀態重置與答案提早洩露修復
- [x] 修正 `QuizCard.vue` 顯示條件，嚴格限制為 `activeModal === 'QUIZ' && currentQuestion`，防止下注前或地圖中提早彈出
- [x] 在 `gameStore.ts` 擴充乾淨的題目準備與狀態重置機制 (`startDirectQuiz`, `startWagerQuiz`, `closeQuizModal`, `startNewGame`)，確保 `isAnswered`、`lastSelectedChoice` 等狀態在每一次作答前必定為初始乾淨值
- [x] 重構 `RoguelikeMap.vue` 與 `WagerModal.vue` 的題目流轉機制，確保在玩家確定下注或直接進入題目時，絕不提前標記正解與解答
- [x] 執行本地 `npm run build` 編譯檢驗
- [x] 將修復結果輸出至 `/log` 目錄

## 階段十九：日系新潮街機撞色風 (Neo-Arcade) 全介面去 AI 味重構
- [x] 撰寫 `src/styles/neoArcade.css` 核心樣式（日系戰術切角、斑馬斜紋、漫畫半色調波點網紋、硬實心陰影）
- [x] 重構街機外框組件 (`src/components/retro/ArcadeFrame.vue`)：導入黑黃斑馬紋頂飾、網點底色與日系排版
- [x] 重構首頁標題與模式選擇組件 (`src/components/game/TitleScreen.vue`)：大字報粗體排版、Persona 5 風格斜切卡片、去 Emoji 化
- [x] 重構街機答題黑板主舞台 (`src/components/game/QuizCard.vue`)：綜藝大看板、戰術切角作答按鈕、動漫打擊反饋
- [x] 重構即時下注彈窗 (`src/components/game/WagerModal.vue`)：黑黃警戒斜條紋、粗黑框實心陰影
- [x] 重構 Roguelike 樹狀選路地圖 (`src/components/game/RoguelikeMap.vue`)：戰術幾何節點、去 AI 漸層、電路導航路徑
- [x] 重構經典雙軌棋盤、補考與 Boss 戰彈窗組件 (`GameBoard.vue`, `RemedialExamModal.vue`, `BossExamModal.vue`)
- [x] 執行全專案 `npm run build` 編譯與型別檢驗
- [x] 提交並推送到 GitHub 遠端倉庫自動發布
- [x] 產出重構日誌至 `/log` 目錄

## 階段二十：16-Bit 大型街機手繪像素點陣美術全面升級
- [x] 撰寫 `src/assets/pixelArt.ts`：精繪督學名師、孔子、愛因斯坦、鐵血教官、新聞雙主播之 16-Bit 像素立繪
- [x] 重製答題黑板學生立繪 (`QuizCard.vue`)：精繪 16-bit 學生思考、答對、答錯三態表情
- [x] 重製地圖上半部校舍與吉祥物骰子 (`GameBoard.vue`)：還原 `pic/地圖.jpg` 趴在骰子上的大頭吉祥物與鐘樓校舍
- [x] 重製立體雙軌卡匣軌道圖標 (`RetroTileIcon.vue`)：重繪 TROUBLE 骷髏、三選一、天才問題、各科卡匣圖標
- [x] 替換視覺解謎題目圖片 (`defaultQuestions.ts`)：換裝台灣 90 年代像素插畫 (大同電鍋、紅白機、彈珠汽水)
- [x] 升級新聞過場主播台 (`NewsIntroModal.vue`)：導入 16-bit 雙主播與電視網格
- [x] 執行全專案 `npm run build` 編譯驗證
- [x] 提交並推送到 GitHub 遠端倉庫自動發布
- [x] 產出像素美術升級日誌至 `/log` 目錄

