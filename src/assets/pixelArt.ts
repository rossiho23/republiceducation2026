/**
 * @file pixelArt.ts
 * @description 16-Bit 大型街機手繪像素點陣畫資產庫 (Authentic Arcade Pixel Art Assets)
 * 100% 忠實致敬 pic/quiz1.jpg (西裝教鞭名師、制服學生)、pic/new1.jpg (雙主播)、
 * pic/地圖.jpg (趴在骰子上的大頭吉祥物) 與 pic/map1.jpg (TROUBLE 骷髏、三選一、天才問題)。
 * 純前端向量/點陣代碼繪製，徹底去除 AI 廉價模板感，零外部網路依賴。
 */

/* ================= 1. 名師陣容 (16-Bit Pixel Teachers) ================= */

/** 督學名師 (100% 還原 pic/quiz1.jpg 右側手持教鞭名師) */
export const PIXEL_STRICT_TEACHER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- 頭髮與頭型 -->
  <rect x="22" y="8" width="20" height="8" fill="%2318181b"/>
  <rect x="18" y="12" width="28" height="12" fill="%2318181b"/>
  <rect x="16" y="20" width="32" height="6" fill="%2318181b"/>
  <!-- 臉部皮膚 -->
  <rect x="20" y="16" width="24" height="24" fill="%23fde047"/>
  <rect x="18" y="24" width="28" height="14" fill="%23fed7aa"/>
  <!-- 粗黑框眼鏡與高光鏡片 (quiz1.jpg 招牌) -->
  <rect x="22" y="24" width="8" height="6" fill="%2309090b"/>
  <rect x="34" y="24" width="8" height="6" fill="%2309090b"/>
  <rect x="30" y="26" width="4" height="2" fill="%2309090b"/>
  <rect x="24" y="26" width="4" height="2" fill="%2338bdf8"/>
  <rect x="36" y="26" width="4" height="2" fill="%2338bdf8"/>
  <!-- 眼神瞳孔 -->
  <rect x="26" y="26" width="2" height="2" fill="%23000000"/>
  <rect x="38" y="26" width="2" height="2" fill="%23000000"/>
  <!-- 眉毛與嚴肅嘴型 -->
  <rect x="22" y="22" width="8" height="2" fill="%2318181b"/>
  <rect x="34" y="22" width="8" height="2" fill="%2318181b"/>
  <rect x="28" y="34" width="8" height="2" fill="%23991b1b"/>
  <!-- 西裝衣領與紅領帶 -->
  <rect x="14" y="40" width="36" height="24" fill="%231e293b"/>
  <polygon points="26,40 38,40 32,54" fill="%23ffffff"/>
  <polygon points="30,42 34,42 33,58 31,58" fill="%23dc2626"/>
  <!-- 手持教鞭直指黑板 (quiz1.jpg 靈魂) -->
  <rect x="46" y="32" width="4" height="6" fill="%23fed7aa"/>
  <line x1="48" y1="34" x2="6" y2="10" stroke="%23854d0e" stroke-width="2.5"/>
  <circle cx="6" cy="10" r="2" fill="%23facc15"/>
</svg>`;

/** 至聖先師孔子 (16-bit 像素手繪冠冕與長髯) */
export const PIXEL_CONFUCIUS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- 先師冠冕 -->
  <rect x="18" y="6" width="28" height="6" fill="%230f172a"/>
  <rect x="14" y="12" width="36" height="4" fill="%23334155"/>
  <rect x="30" y="8" width="4" height="4" fill="%23dc2626"/>
  <!-- 慈眉與膚色 -->
  <rect x="20" y="16" width="24" height="20" fill="%23fed7aa"/>
  <rect x="24" y="24" width="4" height="2" fill="%230f172a"/>
  <rect x="36" y="24" width="4" height="2" fill="%230f172a"/>
  <line x1="22" y1="20" x2="28" y2="22" stroke="%23f1f5f9" stroke-width="2"/>
  <line x1="42" y1="20" x2="36" y2="22" stroke="%23f1f5f9" stroke-width="2"/>
  <!-- 飄逸三綹長白鬍鬚 -->
  <polygon points="22,34 42,34 32,58" fill="%23f1f5f9"/>
  <!-- 漢服儒袍 -->
  <rect x="14" y="36" width="36" height="28" fill="%23475569"/>
  <polygon points="26,36 38,36 32,50" fill="%231e293b"/>
</svg>`;

/** 愛因斯坦博士 (16-bit 爆炸白髮與俏皮吐舌) */
export const PIXEL_EINSTEIN = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- 爆炸蓬鬆白髮 -->
  <circle cx="20" cy="20" r="10" fill="%23e2e8f0"/>
  <circle cx="44" cy="20" r="10" fill="%23e2e8f0"/>
  <circle cx="32" cy="14" r="10" fill="%23e2e8f0"/>
  <circle cx="16" cy="30" r="8" fill="%23e2e8f0"/>
  <circle cx="48" cy="30" r="8" fill="%23e2e8f0"/>
  <!-- 臉部與大鼻子 -->
  <rect x="22" y="18" width="20" height="22" fill="%23fed7aa"/>
  <rect x="26" y="24" width="3" height="3" fill="%230f172a"/>
  <rect x="35" y="24" width="3" height="3" fill="%230f172a"/>
  <rect x="29" y="28" width="6" height="6" fill="%23fbcfe8"/>
  <!-- 茂密白八字鬍 -->
  <rect x="24" y="32" width="16" height="4" fill="%23cbd5e1"/>
  <!-- 招牌吐舌頭 -->
  <rect x="30" y="36" width="4" height="6" fill="%23ef4444"/>
  <!-- 院士服 -->
  <rect x="16" y="42" width="32" height="22" fill="%23581c87"/>
</svg>`;

/** 鐵血教官趙長官 (16-bit 像素軍訓大盤帽與威嚴目光) */
export const PIXEL_MILITARY = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- 草綠軍訓大盤帽 -->
  <polygon points="12,16 52,16 56,12 8,12" fill="%233f6212"/>
  <rect x="18" y="6" width="28" height="8" fill="%234d7c0f"/>
  <rect x="30" y="8" width="4" height="4" fill="%23facc15"/>
  <rect x="12" y="16" width="40" height="4" fill="%23000000"/>
  <!-- 嚴肅國字臉 -->
  <rect x="18" y="20" width="28" height="20" fill="%23fde047"/>
  <rect x="22" y="26" width="6" height="2" fill="%23000"/>
  <rect x="36" y="26" width="6" height="2" fill="%23000"/>
  <rect x="24" y="28" width="2" height="2" fill="%23000"/>
  <rect x="38" y="28" width="2" height="2" fill="%23000"/>
  <line x1="26" y1="36" x2="38" y2="36" stroke="%23000" stroke-width="2"/>
  <!-- 軍訓卡其夾克與黑領帶 -->
  <rect x="12" y="40" width="40" height="24" fill="%23854d0e"/>
  <polygon points="26,40 38,40 32,54" fill="%23ca8a04"/>
  <rect x="30" y="40" width="4" height="18" fill="%23000000"/>
</svg>`;

/* ================= 2. 新聞時事雙主播 (致敬 pic/new1.jpg) ================= */

/** 專業女主播 (還原 new1.jpg 左主播：90年代波浪吹高髮型、寶藍套裝) */
export const PIXEL_FEMALE_ANCHOR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- 90年代吹高波浪黑髮 -->
  <rect x="18" y="6" width="28" height="12" fill="%23172554"/>
  <rect x="14" y="12" width="36" height="16" fill="%23172554"/>
  <rect x="12" y="24" width="8" height="14" fill="%23172554"/>
  <rect x="44" y="24" width="8" height="14" fill="%23172554"/>
  <!-- 臉部與大眼睛 -->
  <rect x="20" y="16" width="24" height="22" fill="%23fed7aa"/>
  <rect x="24" y="24" width="4" height="3" fill="%23000"/>
  <rect x="36" y="24" width="4" height="3" fill="%23000"/>
  <rect x="25" y="24" width="1" height="1" fill="%23fff"/>
  <rect x="37" y="24" width="1" height="1" fill="%23fff"/>
  <!-- 金色珍珠大耳環 (new1.jpg 亮點) -->
  <circle cx="16" cy="32" r="3" fill="%23facc15"/>
  <circle cx="48" cy="32" r="3" fill="%23facc15"/>
  <!-- 紅色笑靨主播嘴 -->
  <polygon points="28,34 36,34 32,37" fill="%23dc2626"/>
  <!-- 寶藍色專業新聞套裝 -->
  <rect x="12" y="40" width="40" height="24" fill="%231d4ed8"/>
  <polygon points="26,40 38,40 32,54" fill="%23ffffff"/>
</svg>`;

/** 滑稽圓臉男主播 (還原 new1.jpg 右主播：方框眼鏡、圓大鼻頭、張大嘴) */
export const PIXEL_MALE_ANCHOR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- 旁分油頭短髮 -->
  <rect x="20" y="8" width="24" height="8" fill="%231c1917"/>
  <rect x="16" y="14" width="32" height="6" fill="%231c1917"/>
  <!-- 圓潤大臉盤 (new1.jpg 招牌) -->
  <rect x="16" y="18" width="32" height="24" fill="%23fed7aa"/>
  <!-- 黑色方框金屬眼鏡 -->
  <rect x="20" y="22" width="9" height="7" fill="none" stroke="%23000" stroke-width="2"/>
  <rect x="35" y="22" width="9" height="7" fill="none" stroke="%23000" stroke-width="2"/>
  <line x1="29" y1="25" x2="35" y2="25" stroke="%23000" stroke-width="2"/>
  <rect x="24" y="25" width="2" height="2" fill="%23000"/>
  <rect x="39" y="25" width="2" height="2" fill="%23000"/>
  <!-- 圓滾滾大鼻頭 -->
  <circle cx="32" cy="31" r="3.5" fill="%23fb923c"/>
  <!-- 播報張開的大口 (還原 new1.jpg) -->
  <ellipse cx="32" cy="37" rx="6" ry="4" fill="%23991b1b"/>
  <rect x="30" y="35" width="4" height="2" fill="%23ffffff"/>
  <!-- 灰色條紋西裝 -->
  <rect x="12" y="44" width="40" height="20" fill="%23475569"/>
  <polygon points="26,44 38,44 32,54" fill="%23ffffff"/>
  <rect x="30" y="44" width="4" height="12" fill="%23dc2626"/>
</svg>`;

/* ================= 3. 經典地圖上半部：校舍與趴在骰子上的大頭吉祥物 (致敬 pic/地圖.jpg) ================= */

/** 趴在深藍 3D 方塊骰子上的大頭吉祥物 (100% 依據 pic/地圖.jpg 重繪) */
export const PIXEL_MASCOT_ON_DICE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" shape-rendering="crispEdges">
  <!-- ================= 下方：深藍色立體方塊骰子 (3D Isometric Cube) ================= -->
  <!-- 頂面 (Top Face) -->
  <polygon points="50,42 84,52 50,62 16,52" fill="%231d4ed8"/>
  <!-- 左側面 (Left Face) -->
  <polygon points="16,52 50,62 50,96 16,84" fill="%231e3a8a"/>
  <!-- 右側面 (Right Face) -->
  <polygon points="50,62 84,52 84,84 50,96" fill="%23172554"/>
  <!-- 骰子正面點數 "2" 白色圓形點陣 (致敬 地圖.jpg) -->
  <circle cx="34" cy="70" r="4.5" fill="%23ffffff"/>
  <circle cx="66" cy="70" r="4.5" fill="%23ffffff"/>
  <circle cx="34" cy="70" r="3" fill="%23ef4444"/>
  <circle cx="66" cy="70" r="3" fill="%23ef4444"/>

  <!-- ================= 上方：趴在骰子上的經典大頭娃娃吉祥物 ================= -->
  <!-- 圓滾滾白色大遮陽帽 -->
  <ellipse cx="50" cy="24" rx="28" ry="14" fill="%23ffffff" stroke="%230f172a" stroke-width="2"/>
  <rect x="42" y="12" width="16" height="6" fill="%23ef4444"/>
  <!-- 大頭臉盤 -->
  <ellipse cx="50" cy="30" rx="20" ry="14" fill="%23fed7aa" stroke="%230f172a" stroke-width="2"/>
  <!-- 雙頰腮紅 -->
  <circle cx="36" cy="34" r="3.5" fill="%23f87171"/>
  <circle cx="64" cy="34" r="3.5" fill="%23f87171"/>
  <!-- 趴在骰子上眨眼笑臉 (吉祥物神態) -->
  <path d="M38 28 Q42 24 46 28" stroke="%230f172a" stroke-width="2.5" fill="none"/>
  <path d="M54 28 Q58 24 62 28" stroke="%230f172a" stroke-width="2.5" fill="none"/>
  <ellipse cx="50" cy="34" rx="3" ry="2" fill="%23ef4444"/>
  <!-- 趴在骰子頂面的兩隻胖胖小手 -->
  <ellipse cx="32" cy="46" rx="6" ry="4" fill="%23ffffff" stroke="%230f172a" stroke-width="1.5"/>
  <ellipse cx="68" cy="46" rx="6" ry="4" fill="%23ffffff" stroke="%230f172a" stroke-width="1.5"/>
</svg>`;

/* ================= 4. 立體雙軌卡匣軌道圖標 (致敬 pic/map1.jpg) ================= */

/** TROUBLE 骷髏災難 (還原 map1.jpg：白色立體骷髏頭骨與紫色毒氣) */
export const PIXEL_ICON_TROUBLE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <!-- 紫色毒氣背景光暈 -->
  <rect x="4" y="4" width="24" height="24" fill="%23581c87"/>
  <!-- 白色立體骷髏骨 -->
  <rect x="8" y="8" width="16" height="12" fill="%23ffffff"/>
  <rect x="10" y="20" width="12" height="6" fill="%23ffffff"/>
  <!-- 黑色空洞眼眶與鼻孔 -->
  <rect x="10" y="12" width="4" height="5" fill="%23000000"/>
  <rect x="18" y="12" width="4" height="5" fill="%23000000"/>
  <rect x="15" y="18" width="2" height="2" fill="%23000000"/>
  <!-- 牙齒縫隙 -->
  <rect x="12" y="22" width="2" height="4" fill="%23000000"/>
  <rect x="16" y="22" width="2" height="4" fill="%23000000"/>
  <rect x="20" y="22" width="2" height="4" fill="%23000000"/>
</svg>`;

/** 三選一送分格 (還原 map1.jpg：藍底白字立體方塊) */
export const PIXEL_ICON_THREE_CHOICE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%231d4ed8"/>
  <rect x="4" y="4" width="24" height="24" fill="%232563eb"/>
  <!-- 白色粗體 "3" 與金邊標記 -->
  <rect x="10" y="6" width="12" height="4" fill="%23ffe600"/>
  <rect x="18" y="10" width="4" height="6" fill="%23ffe600"/>
  <rect x="12" y="14" width="10" height="4" fill="%23ffe600"/>
  <rect x="18" y="18" width="4" height="6" fill="%23ffe600"/>
  <rect x="10" y="22" width="12" height="4" fill="%23ffe600"/>
</svg>`;

/** 天才問題 (還原 map1.jpg：紅底白字金邊立體大框) */
export const PIXEL_ICON_TALENT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%23991b1b"/>
  <rect x="4" y="4" width="24" height="24" fill="%23dc2626"/>
  <!-- "天" 像素字 -->
  <rect x="8" y="8" width="16" height="3" fill="%23ffffff"/>
  <rect x="6" y="14" width="20" height="3" fill="%23ffffff"/>
  <rect x="14" y="11" width="4" height="15" fill="%23ffffff"/>
  <rect x="10" y="19" width="4" height="6" fill="%23ffffff"/>
  <rect x="18" y="19" width="4" height="6" fill="%23ffffff"/>
</svg>`;

/** 健康教育人體解剖心臟 (還原 map1.jpg) */
export const PIXEL_ICON_HEALTH = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%231e3a8a"/>
  <!-- 紅色經典愛心與十字 -->
  <rect x="8" y="8" width="6" height="6" fill="%23ef4444"/>
  <rect x="18" y="8" width="6" height="6" fill="%23ef4444"/>
  <rect x="6" y="12" width="20" height="8" fill="%23ef4444"/>
  <rect x="10" y="20" width="12" height="4" fill="%23ef4444"/>
  <rect x="13" y="24" width="6" height="3" fill="%23ef4444"/>
  <!-- 白色高光點 -->
  <rect x="9" y="10" width="2" height="3" fill="%23ffffff"/>
</svg>`;

/* ================= 5. 視覺解謎題庫像素插畫 (取代隨機 Unsplash) ================= */

/** 經典綠色大同電鍋 (台灣懷舊地道像素畫) */
export const PIXEL_TATUNG_COOKER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- 電鍋蓋手把與亮銀鍋蓋 -->
  <rect x="29" y="6" width="6" height="6" fill="%231e293b"/>
  <ellipse cx="32" cy="18" rx="24" ry="8" fill="%23e2e8f0"/>
  <ellipse cx="32" cy="16" rx="20" ry="6" fill="%23ffffff"/>
  <!-- 經典軍綠色鍋身 -->
  <rect x="10" y="22" width="44" height="24" fill="%2315803d"/>
  <ellipse cx="32" cy="46" rx="22" ry="6" fill="%23166534"/>
  <!-- 兩側黑色大耳朵提把 -->
  <rect x="4" y="26" width="6" height="8" fill="%230f172a"/>
  <rect x="54" y="26" width="6" height="8" fill="%230f172a"/>
  <!-- 開關撥桿與保溫紅燈 -->
  <rect x="26" y="32" width="12" height="8" fill="%23f8fafc"/>
  <circle cx="32" cy="34" r="2" fill="%23dc2626"/>
  <rect x="30" y="38" width="4" height="2" fill="%230f172a"/>
</svg>`;

/** 8-Bit 懷舊紅白機卡匣 (台灣任天堂紅白機神作) */
export const PIXEL_FAMICOM = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- 紅白機卡匣黃色外殼 -->
  <rect x="8" y="10" width="48" height="44" fill="%23facc15" stroke="%23000" stroke-width="2"/>
  <!-- 頂部防滑凹槽 -->
  <rect x="14" y="14" width="36" height="4" fill="%23ca8a04"/>
  <!-- 中央遊戲宣傳貼紙 (紅黑金邊) -->
  <rect x="14" y="22" width="36" height="24" fill="%23dc2626"/>
  <rect x="16" y="24" width="32" height="20" fill="%23000000"/>
  <rect x="20" y="30" width="24" height="6" fill="%23facc15"/>
  <!-- 底部 60-Pin 金手指插槽 -->
  <rect x="12" y="54" width="40" height="4" fill="%23713f12"/>
</svg>`;

/* ================= 6. 學生三態 16-Bit 像素立繪 (致敬 quiz1.jpg 左側作答學生) ================= */

/** 學生：思考中 (眉頭深鎖、托腮轉眼珠) */
export const PIXEL_STUDENT_THINKING = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- 黑色學生平頭短髮 -->
  <rect x="18" y="8" width="28" height="12" fill="%230f172a"/>
  <rect x="14" y="14" width="36" height="10" fill="%230f172a"/>
  <!-- 臉部與耳朵 -->
  <rect x="18" y="20" width="28" height="20" fill="%23fed7aa"/>
  <rect x="14" y="24" width="4" height="8" fill="%23fed7aa"/>
  <rect x="46" y="24" width="4" height="8" fill="%23fed7aa"/>
  <!-- 思考眼神 (向上望) -->
  <rect x="22" y="24" width="6" height="3" fill="%230f172a"/>
  <rect x="36" y="24" width="6" height="3" fill="%230f172a"/>
  <rect x="24" y="27" width="4" height="4" fill="%230f172a"/>
  <rect x="38" y="27" width="4" height="4" fill="%230f172a"/>
  <rect x="26" y="27" width="2" height="2" fill="%23ffffff"/>
  <rect x="40" y="27" width="2" height="2" fill="%23ffffff"/>
  <!-- 腮紅與抿嘴苦思 -->
  <rect x="20" y="32" width="4" height="3" fill="%23f87171"/>
  <rect x="40" y="32" width="4" height="3" fill="%23f87171"/>
  <rect x="30" y="35" width="6" height="2" fill="%23991b1b"/>
  <!-- 托腮右手手指 -->
  <rect x="42" y="36" width="6" height="6" fill="%23fed7aa"/>
  <rect x="44" y="34" width="2" height="4" fill="%23fca5a5"/>
  <!-- 白色水手服衣領與深藍領巾 -->
  <rect x="16" y="42" width="32" height="18" fill="%23f8fafc"/>
  <rect x="24" y="42" width="16" height="18" fill="%231e3a8a"/>
  <rect x="28" y="48" width="8" height="12" fill="%23ef4444"/>
</svg>`;

/** 學生：答對滿分 (燦爛瞇眼、雙手比 V、自豪紅臉) */
export const PIXEL_STUDENT_CORRECT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- 黑色學生平頭短髮 -->
  <rect x="18" y="8" width="28" height="12" fill="%230f172a"/>
  <rect x="14" y="14" width="36" height="10" fill="%230f172a"/>
  <!-- 臉部與耳朵 -->
  <rect x="18" y="20" width="28" height="20" fill="%23fed7aa"/>
  <rect x="14" y="24" width="4" height="8" fill="%23fed7aa"/>
  <rect x="46" y="24" width="4" height="8" fill="%23fed7aa"/>
  <!-- 開心瞇瞇眼笑開懷 (^ ^) -->
  <rect x="22" y="26" width="6" height="2" fill="%230f172a"/>
  <rect x="24" y="24" width="2" height="2" fill="%230f172a"/>
  <rect x="36" y="26" width="6" height="2" fill="%230f172a"/>
  <rect x="38" y="24" width="2" height="2" fill="%230f172a"/>
  <!-- 燦爛大笑大張嘴 -->
  <rect x="28" y="32" width="8" height="6" fill="%23dc2626"/>
  <rect x="30" y="32" width="4" height="2" fill="%23ffffff"/>
  <rect x="20" y="31" width="4" height="3" fill="%23fb7185"/>
  <rect x="40" y="31" width="4" height="3" fill="%23fb7185"/>
  <!-- 雙手大比勝利 V 手勢 -->
  <rect x="8" y="26" width="4" height="8" fill="%23fed7aa"/>
  <rect x="6" y="22" width="2" height="6" fill="%23fed7aa"/>
  <rect x="10" y="22" width="2" height="6" fill="%23fed7aa"/>
  <rect x="52" y="26" width="4" height="8" fill="%23fed7aa"/>
  <rect x="52" y="22" width="2" height="6" fill="%23fed7aa"/>
  <rect x="56" y="22" width="2" height="6" fill="%23fed7aa"/>
  <!-- 白色水手服衣領與深藍領巾 -->
  <rect x="16" y="42" width="32" height="18" fill="%23f8fafc"/>
  <rect x="24" y="42" width="16" height="18" fill="%231e3a8a"/>
  <rect x="28" y="48" width="8" height="12" fill="%23ef4444"/>
</svg>`;

/** 學生：答錯受挫 (荷包蛋眼淚、大張哭嘴、痛失學分) */
export const PIXEL_STUDENT_WRONG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- 黑色學生短髮 -->
  <rect x="18" y="8" width="28" height="12" fill="%230f172a"/>
  <rect x="14" y="14" width="36" height="10" fill="%230f172a"/>
  <!-- 臉部與耳朵 -->
  <rect x="18" y="20" width="28" height="20" fill="%23fed7aa"/>
  <rect x="14" y="24" width="4" height="8" fill="%23fed7aa"/>
  <rect x="46" y="24" width="4" height="8" fill="%23fed7aa"/>
  <!-- 悲傷緊閉雙眼 (> <) -->
  <rect x="22" y="24" width="6" height="2" fill="%230f172a"/>
  <rect x="24" y="26" width="2" height="2" fill="%230f172a"/>
  <rect x="36" y="24" width="6" height="2" fill="%230f172a"/>
  <rect x="38" y="26" width="2" height="2" fill="%230f172a"/>
  <!-- 雙眼大噴藍色像素眼淚 -->
  <rect x="18" y="28" width="4" height="12" fill="%2338bdf8"/>
  <rect x="16" y="34" width="2" height="8" fill="%230284c7"/>
  <rect x="42" y="28" width="4" height="12" fill="%2338bdf8"/>
  <rect x="46" y="34" width="2" height="8" fill="%230284c7"/>
  <!-- 悲鳴下垂波浪嘴 -->
  <rect x="28" y="34" width="8" height="4" fill="%23450a0a"/>
  <!-- 抱頭垂頭喪氣 -->
  <rect x="10" y="36" width="6" height="10" fill="%23fed7aa"/>
  <rect x="48" y="36" width="6" height="10" fill="%23fed7aa"/>
  <!-- 白色水手服衣領與深藍領巾 -->
  <rect x="16" y="42" width="32" height="18" fill="%23f8fafc"/>
  <rect x="24" y="42" width="16" height="18" fill="%231e3a8a"/>
  <rect x="28" y="48" width="8" height="12" fill="%23ef4444"/>
</svg>`;

/* ================= 7. 全學科 16-Bit 街機卡匣圖標 ================= */

/** 美術卡匣圖標 (調色盤、顏料水彩筆) */
export const PIXEL_ICON_ART = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%23ea580c"/>
  <rect x="6" y="6" width="18" height="16" fill="%23ffffff"/>
  <rect x="10" y="8" width="4" height="4" fill="%23ef4444"/>
  <rect x="16" y="8" width="4" height="4" fill="%23eab308"/>
  <rect x="10" y="14" width="4" height="4" fill="%233b82f6"/>
  <rect x="16" y="14" width="4" height="4" fill="%2322c55e"/>
  <!-- 木質水彩筆插在右下 -->
  <rect x="18" y="20" width="10" height="4" fill="%2378350f"/>
  <rect x="26" y="18" width="4" height="4" fill="%23facc15"/>
</svg>`;

/** 音樂卡匣圖標 (五線譜、高音譜號與八分音符) */
export const PIXEL_ICON_MUSIC = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%230f172a"/>
  <!-- 五線譜細線 -->
  <rect x="4" y="8" width="24" height="1" fill="%2364748b"/>
  <rect x="4" y="12" width="24" height="1" fill="%2364748b"/>
  <rect x="4" y="16" width="24" height="1" fill="%2364748b"/>
  <rect x="4" y="20" width="24" height="1" fill="%2364748b"/>
  <rect x="4" y="24" width="24" height="1" fill="%2364748b"/>
  <!-- 金色八分音符 (16-bit 點陣) -->
  <rect x="10" y="18" width="6" height="4" fill="%23facc15"/>
  <rect x="14" y="8" width="2" height="12" fill="%23facc15"/>
  <rect x="16" y="8" width="6" height="3" fill="%23facc15"/>
  <rect x="20" y="16" width="6" height="4" fill="%23facc15"/>
  <rect x="24" y="10" width="2" height="8" fill="%23facc15"/>
</svg>`;

/** 國文卡匣圖標 (朱紅古代線裝書與毛筆) */
export const PIXEL_ICON_CHINESE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%23b45309"/>
  <!-- 線裝書頁 -->
  <rect x="6" y="6" width="18" height="20" fill="%23fef3c7"/>
  <rect x="6" y="6" width="4" height="20" fill="%231e3a8a"/>
  <!-- 國 字點陣象徵 -->
  <rect x="12" y="10" width="8" height="2" fill="%23991b1b"/>
  <rect x="12" y="12" width="2" height="8" fill="%23991b1b"/>
  <rect x="18" y="12" width="2" height="8" fill="%23991b1b"/>
  <rect x="12" y="18" width="8" height="2" fill="%23991b1b"/>
  <!-- 綠竹毛筆 -->
  <rect x="20" y="8" width="8" height="3" fill="%2315803d"/>
  <rect x="18" y="9" width="3" height="1" fill="%23000000"/>
</svg>`;

/** 自然/理化卡匣圖標 (綠色燒瓶與藍色藥水) */
export const PIXEL_ICON_SCIENCE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%2365a30d"/>
  <!-- 圓底玻璃燒瓶瓶口與頸 -->
  <rect x="13" y="6" width="6" height="8" fill="%23e0f2fe"/>
  <!-- 燒瓶底部肚腹 -->
  <rect x="8" y="14" width="16" height="12" fill="%23e0f2fe"/>
  <!-- 瓶內深藍魔法藥水與氣泡 -->
  <rect x="9" y="18" width="14" height="7" fill="%230284c7"/>
  <rect x="12" y="16" width="2" height="2" fill="%23ffffff"/>
  <rect x="18" y="20" width="2" height="2" fill="%23ffffff"/>
</svg>`;

/** 數學卡匣圖標 (三角板與量角器) */
export const PIXEL_ICON_MATH = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%23047857"/>
  <!-- 白色 45 度直角三角板 (階梯像素) -->
  <rect x="6" y="6" width="4" height="20" fill="%23ffffff"/>
  <rect x="6" y="22" width="20" height="4" fill="%23ffffff"/>
  <rect x="10" y="10" width="4" height="4" fill="%23ffffff"/>
  <rect x="14" y="14" width="4" height="4" fill="%23ffffff"/>
  <rect x="18" y="18" width="4" height="4" fill="%23ffffff"/>
  <!-- 刻度與中央鏤空 -->
  <rect x="10" y="18" width="6" height="4" fill="%23047857"/>
</svg>`;

/** 地理/社會卡匣圖標 (地球儀與陸地經緯) */
export const PIXEL_ICON_GEOGRAPHY = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%230284c7"/>
  <!-- 蔚藍圓形地球儀 -->
  <rect x="8" y="6" width="16" height="18" fill="%2338bdf8"/>
  <rect x="6" y="8" width="20" height="14" fill="%2338bdf8"/>
  <!-- 綠色島嶼大陸塊 -->
  <rect x="10" y="10" width="6" height="4" fill="%2322c55e"/>
  <rect x="14" y="14" width="8" height="4" fill="%2322c55e"/>
  <!-- 金色地球儀底座與弧形架 -->
  <rect x="5" y="8" width="2" height="14" fill="%23facc15"/>
  <rect x="14" y="24" width="4" height="4" fill="%23ca8a04"/>
  <rect x="10" y="26" width="12" height="2" fill="%23ca8a04"/>
</svg>`;

/** 福利社卡匣圖標 (養樂多紅頂與金黃菠蘿麵包) */
export const PIXEL_ICON_CANTEEN = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%23f59e0b"/>
  <!-- 紅色養樂多鋁箔蓋與小瓶身 -->
  <rect x="7" y="10" width="8" height="3" fill="%23dc2626"/>
  <rect x="8" y="13" width="6" height="11" fill="%23fed7aa"/>
  <rect x="9" y="16" width="4" height="2" fill="%23dc2626"/>
  <!-- 金黃色菠蘿麵包 (帶深色格紋) -->
  <rect x="17" y="12" width="10" height="12" fill="%23fde047"/>
  <rect x="19" y="14" width="2" height="8" fill="%23ca8a04"/>
  <rect x="23" y="14" width="2" height="8" fill="%23ca8a04"/>
  <rect x="17" y="17" width="10" height="2" fill="%23ca8a04"/>
</svg>`;

/** 昇學 START 卡匣圖標 (街機紅色發光出發點) */
export const PIXEL_ICON_START = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%23dc2626"/>
  <!-- 金黃外框與閃爍 START -->
  <rect x="4" y="4" width="24" height="24" fill="%23b91c1c"/>
  <rect x="8" y="8" width="16" height="4" fill="%23fef08a"/>
  <!-- 昇學 紅印章白字 -->
  <rect x="8" y="14" width="16" height="10" fill="%23ffffff"/>
  <rect x="10" y="16" width="12" height="2" fill="%23b91c1c"/>
  <rect x="12" y="18" width="8" height="2" fill="%23b91c1c"/>
  <rect x="10" y="20" width="12" height="2" fill="%23b91c1c"/>
</svg>`;

/** 升學大考 BOSS 終點卡匣圖標 (黑色學位帽與金流蘇) */
export const PIXEL_ICON_EXAM_BOSS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="%23450a0a"/>
  <!-- 黑色學士方帽菱形 -->
  <rect x="14" y="6" width="4" height="4" fill="%230f172a"/>
  <rect x="10" y="9" width="12" height="3" fill="%230f172a"/>
  <rect x="6" y="12" width="20" height="3" fill="%230f172a"/>
  <rect x="11" y="15" width="10" height="6" fill="%231e293b"/>
  <!-- 金色垂吊流蘇 -->
  <rect x="22" y="12" width="4" height="2" fill="%23facc15"/>
  <rect x="24" y="14" width="2" height="6" fill="%23facc15"/>
  <!-- BOSS 紅印章 -->
  <rect x="8" y="23" width="16" height="5" fill="%23dc2626"/>
</svg>`;

/* ================= 8. 肉鴿地圖 16-Bit 街機像素節點徽章 ================= */

/** 肉鴿：大考金盃 (FINAL_EXAM) */
export const PIXEL_ROGUE_TROPHY = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="6" y="3" width="12" height="8" fill="%23facc15"/>
  <rect x="4" y="4" width="2" height="5" fill="%23ca8a04"/>
  <rect x="18" y="4" width="2" height="5" fill="%23ca8a04"/>
  <rect x="8" y="11" width="8" height="3" fill="%23eab308"/>
  <rect x="10" y="14" width="4" height="4" fill="%23ca8a04"/>
  <rect x="7" y="18" width="10" height="3" fill="%23a16207"/>
  <rect x="8" y="5" width="2" height="4" fill="%23ffffff"/>
</svg>`;

/** 肉鴿：菁英烈火 (QUIZ_ELITE) */
export const PIXEL_ROGUE_FLAME = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="11" y="2" width="2" height="4" fill="%23ef4444"/>
  <rect x="9" y="6" width="6" height="4" fill="%23f97316"/>
  <rect x="6" y="10" width="12" height="6" fill="%23f97316"/>
  <rect x="7" y="16" width="10" height="5" fill="%23ef4444"/>
  <rect x="10" y="9" width="4" height="6" fill="%23fef08a"/>
</svg>`;

/** 肉鴿：音樂耳機 (AUDIO_EVENT) */
export const PIXEL_ROGUE_HEADPHONE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="7" y="3" width="10" height="2" fill="%2338bdf8"/>
  <rect x="5" y="5" width="2" height="6" fill="%2338bdf8"/>
  <rect x="17" y="5" width="2" height="6" fill="%2338bdf8"/>
  <rect x="3" y="10" width="4" height="8" fill="%230284c7"/>
  <rect x="17" y="10" width="4" height="8" fill="%230284c7"/>
  <rect x="4" y="12" width="2" height="4" fill="%23ffffff"/>
</svg>`;

/** 肉鴿：視覺放大鏡 (VISUAL_EVENT) */
export const PIXEL_ROGUE_MAGNIFIER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="6" y="3" width="8" height="2" fill="%23facc15"/>
  <rect x="4" y="5" width="2" height="8" fill="%23facc15"/>
  <rect x="14" y="5" width="2" height="8" fill="%23facc15"/>
  <rect x="6" y="13" width="8" height="2" fill="%23facc15"/>
  <rect x="6" y="5" width="8" height="8" fill="%23e0f2fe"/>
  <!-- 手柄 -->
  <rect x="13" y="13" width="3" height="3" fill="%23ca8a04"/>
  <rect x="16" y="16" width="4" height="4" fill="%2378350f"/>
</svg>`;

/** 肉鴿：福利社補給車 (CANTEEN_REST) */
export const PIXEL_ROGUE_CART = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="4" y="5" width="14" height="8" fill="%2310b981"/>
  <rect x="2" y="3" width="3" height="4" fill="%2364748b"/>
  <rect x="18" y="6" width="2" height="7" fill="%2364748b"/>
  <!-- 輪子 -->
  <rect x="6" y="15" width="3" height="3" fill="%230f172a"/>
  <rect x="14" y="15" width="3" height="3" fill="%230f172a"/>
  <!-- 貨物 -->
  <rect x="7" y="7" width="3" height="4" fill="%23facc15"/>
  <rect x="12" y="7" width="3" height="4" fill="%23ef4444"/>
</svg>`;

/** 肉鴿：校園奇遇閃電 (CAMPUS_FATE) */
export const PIXEL_ROGUE_LIGHTNING = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="12" y="2" width="4" height="6" fill="%23ffe600"/>
  <rect x="9" y="7" width="5" height="5" fill="%23ffe600"/>
  <rect x="6" y="11" width="12" height="3" fill="%23ffe600"/>
  <rect x="10" y="14" width="4" height="4" fill="%23ffe600"/>
  <rect x="9" y="18" width="2" height="4" fill="%23ffe600"/>
</svg>`;

/** 肉鴿：隨堂測驗紙 (QUIZ_NORMAL) */
export const PIXEL_ROGUE_SCROLL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="4" y="3" width="16" height="18" fill="%23ffffff"/>
  <rect x="4" y="3" width="16" height="2" fill="%23cbd5e1"/>
  <!-- 紅筆 100 分字樣 -->
  <rect x="7" y="6" width="2" height="4" fill="%23ef4444"/>
  <rect x="10" y="6" width="3" height="4" fill="%23ef4444"/>
  <rect x="14" y="6" width="3" height="4" fill="%23ef4444"/>
  <!-- 墨筆線條 -->
  <rect x="7" y="12" width="10" height="1.5" fill="%23475569"/>
  <rect x="7" y="15" width="7" height="1.5" fill="%23475569"/>
</svg>`;

