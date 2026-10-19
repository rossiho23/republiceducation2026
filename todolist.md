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

