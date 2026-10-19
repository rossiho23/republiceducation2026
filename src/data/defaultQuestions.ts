/**
 * @file defaultQuestions.ts
 * @description 《民國教育委員會》復刻版 內建經典題庫種子資料
 * 涵蓋國小至大學各階段學科，並深度融合台灣 90 年代華語流行歌手、在地綜藝文化、台灣歷史、地理與體育。
 */

import { QuestionItem } from '../types/quiz';
import { PIXEL_TATUNG_COOKER, PIXEL_FAMICOM } from '../assets/pixelArt';

export const DEFAULT_QUESTIONS: QuestionItem[] = [
  // ================= 現代化動態題型 (聽力猜歌 / 視覺辨識 / 反向陷阱 / 盲答) =================
  {
    id: 'dyn-audio-01',
    subject: '流行音樂',
    stage: '通用',
    question: '【🎧 8-bit 聽力猜歌】請聆聽這段極具代表性的懷舊廣告旋律，請問這是哪一家歷史悠久的台灣國貨品牌？',
    options: ['大同電鍋 (大同寶寶)', '聲寶家電', '東元電機', '歌林電器'],
    correctIndex: 0,
    explanation: '這首正是家喻戶曉的「大同大同國貨好，大同產品最可靠～」大同企業歌！',
    difficulty: '簡單',
    questionType: 'AUDIO_GUESS',
    audioMelodyId: 'melody-tatung',
    timeLimit: 12
  },
  {
    id: 'dyn-audio-02',
    subject: '時事冷知識',
    stage: '通用',
    question: '【🎧 8-bit 聽力猜台詞】請仔細聆聽這段無人不知的台灣經典藥品電視廣告配樂，請問這是在宣傳哪款產品？',
    options: ['斯斯感冒膠囊', '普拿疼伏冒熱飲', '五洲製藥牛黃解毒片', '白花油'],
    correctIndex: 0,
    explanation: '豬哥亮代言的「感冒用斯斯，咳嗽用斯斯，鼻塞鼻炎用斯斯～」紅遍大街小巷！',
    difficulty: '簡單',
    questionType: 'AUDIO_GUESS',
    audioMelodyId: 'melody-susu',
    timeLimit: 12
  },
  {
    id: 'dyn-audio-03',
    subject: '藝能',
    stage: '國中',
    question: '【🎧 8-bit 聽力猜歌】這段熱血沸騰的經典卡通機器人旋律，出自哪一部陪伴無數五六年級生童年的經典動漫？',
    options: ['無敵鐵金剛', '勇者王', '機動戰士鋼彈', '魔神英雄傳'],
    correctIndex: 0,
    explanation: '「無敵鐵金剛！無敵鐵金剛！無敵鐵金～剛！」柯國隆駕駛指揮艇組合！',
    difficulty: '普通',
    questionType: 'AUDIO_GUESS',
    audioMelodyId: 'melody-mazinger',
    timeLimit: 12
  },
  {
    id: 'dyn-audio-04',
    subject: '流行音樂',
    stage: '高中',
    question: '【🎧 8-bit 聽力猜歌】聆聽這首風靡 90 年代台灣校園的偶像男團代表作旋律，請問這首歌的歌名是什麼？',
    options: ['小虎隊《青蘋果樂園》', '紅孩兒《初戀》', '草蜢《失戀陣線聯盟》', 'L.A. Boyz《跳》'],
    correctIndex: 0,
    explanation: '小虎隊吳奇隆、蘇有朋、陳志朋的成名神曲《青蘋果樂園》！',
    difficulty: '普通',
    questionType: 'AUDIO_GUESS',
    audioMelodyId: 'melody-green-apple',
    timeLimit: 12
  },
  {
    id: 'dyn-trap-01',
    subject: '社會',
    stage: '國小',
    question: '【⚠️ 反向陷阱題】請選出下列選項中，【非】中華民國中央政府五院之一的機構？',
    options: ['行政院', '立法院', '內政部 (非院級)', '監察院'],
    correctIndex: 2,
    explanation: '內政部隸屬於行政院管轄之下，並非憲法規範之五院獨立中央機關！',
    difficulty: '簡單',
    questionType: 'TRAP_REVERSE',
    isTrapReverse: true,
    timeLimit: 10
  },
  {
    id: 'dyn-trap-02',
    subject: '自然',
    stage: '國中',
    question: '【⚠️ 反向陷阱題】請選出下列關於物理特性的描述中，哪一項是【錯誤】的？',
    options: ['水在 4°C 時密度最大', '聲音在真空中傳播速度最快 (錯誤！)', '光在真空中速度約每秒30萬公里', '物體自由落體與質量無關'],
    correctIndex: 1,
    explanation: '聲音是力學波，需要介質才能傳播，因此聲音在真空中完全無法傳播！',
    difficulty: '普通',
    questionType: 'TRAP_REVERSE',
    isTrapReverse: true,
    timeLimit: 10
  },
  {
    id: 'dyn-blackout-01',
    subject: '歷史',
    stage: '高中',
    question: '【🌑 盲答迷霧題】1990 年代台灣推動全民健康保險制度，請問健保是在哪一年正式開辦實施的？',
    options: ['民國 84 年 (1995年)', '民國 79 年 (1990年)', '民國 89 年 (2000年)', '民國 80 年 (1991年)'],
    correctIndex: 0,
    explanation: '台灣全民健保於民國 84 年 (1995年) 3 月 1 日正式開辦實施！',
    difficulty: '困難',
    questionType: 'BLACKOUT',
    isBlackout: true,
    timeLimit: 12
  },
  {
    id: 'dyn-visual-01',
    subject: '自然',
    stage: '國小',
    question: '【🔍 16-Bit 視覺線索題】請辨識這款 1960 年代推出、台灣家家戶戶廚房必備的經典神物是什麼電器？',
    options: ['大同電鍋 (綠色經典款)', '電子壓力萬用鍋', '商用蒸烤保溫箱', '電磁微波爐'],
    correctIndex: 0,
    explanation: '大同電鍋自民國 49 年推出以來，以堅固耐用聞名，是台灣最具代表性的國民家電！',
    difficulty: '普通',
    questionType: 'VISUAL_ZOOM',
    visualImageUrl: PIXEL_TATUNG_COOKER,
    timeLimit: 12
  },
  {
    id: 'dyn-visual-02',
    subject: '藝能',
    stage: '國中',
    question: '【🔍 16-Bit 視覺線索題】請辨識這張 8-Bit 卡匣點陣插畫，是哪一款風靡全台小學生下課時光的經典主機卡匣？',
    options: ['任天堂紅白機 (Famicom)', 'Sega Mega Drive', 'Game Boy 灰機', '超級任天堂 (SFC)'],
    correctIndex: 0,
    explanation: '任天堂紅白機（FC）是 80-90 年代無數台灣玩家的童年回憶，經典黃色或紅色卡匣至今仍具代表性！',
    difficulty: '普通',
    questionType: 'VISUAL_ZOOM',
    visualImageUrl: PIXEL_FAMICOM,
    timeLimit: 12
  },
  {
    id: 'elem-chi-01',
    subject: '國文',
    stage: '國小',
    question: '「三人行，必有我師焉」出自於古代哪一部儒家經典典籍？',
    options: ['論語', '孟子', '中庸', '大學'],
    correctIndex: 0,
    explanation: '出自《論語·述而篇》，孔子說明虛心向他人學習的道理。',
    difficulty: '簡單',
    timeLimit: 10
  },
  {
    id: 'elem-math-01',
    subject: '數學',
    stage: '國小',
    question: '如果一個正方形的周長是 36 公分，請問它的面積是多少平方公分？',
    options: ['36', '81', '64', '72'],
    correctIndex: 1,
    explanation: '邊長 = 36 / 4 = 9 公分，面積 = 9 × 9 = 81 平方公分。',
    difficulty: '簡單',
    timeLimit: 10
  },
  {
    id: 'elem-sci-01',
    subject: '自然',
    stage: '國小',
    question: '植物在行光合作用時，主要吸收哪種氣體並釋放出氧氣？',
    options: ['氮氣', '氫氣', '二氧化碳', '一氧化碳'],
    correctIndex: 2,
    explanation: '綠色植物吸收二氧化碳與水分，利用光能製造葡萄糖並釋放氧氣。',
    difficulty: '簡單',
    timeLimit: 10
  },
  {
    id: 'elem-soc-01',
    subject: '社會',
    stage: '國小',
    question: '台灣最高峰玉山的主峰海拔標高約為多少公尺？',
    options: ['3952 公尺', '3886 公尺', '4120 公尺', '3750 公尺'],
    correctIndex: 0,
    explanation: '玉山主峰海拔為 3,952 公尺，為台灣與東北亞第一高峰。',
    difficulty: '簡單',
    timeLimit: 10
  },
  {
    id: 'elem-pop-01',
    subject: '時事冷知識',
    stage: '國小',
    question: '在台灣小學校園福利社最受歡迎的「養樂多」，經典小紅瓶傳統容量是多少毫升？',
    options: ['100 ml', '150 ml', '250 ml', '50 ml'],
    correctIndex: 0,
    explanation: '經典養樂多瓶身容量為 100 毫升。',
    difficulty: '簡單',
    timeLimit: 10
  },
  {
    id: 'elem-music-01',
    subject: '流行音樂',
    stage: '國小',
    question: '1990 年代風靡全台、由小虎隊所演唱的經典校園歌曲是哪一首？',
    options: ['紅蜻蜓', '雙截棍', '情非得已', '對面的女孩看過來'],
    correctIndex: 0,
    explanation: '小虎隊在 1990 年發行專輯《紅蜻蜓》，成為無數國小學童傳唱的校園神曲。',
    difficulty: '簡單',
    timeLimit: 10
  },
  {
    id: 'elem-sport-01',
    subject: '體育運動',
    stage: '國小',
    question: '台灣少棒歷史上，1968 年擊敗日本關西少棒明星隊掀起全台棒球狂熱的是哪支球隊？',
    options: ['紅葉少棒隊', '金龍少棒隊', '巨人少棒隊', '七虎少棒隊'],
    correctIndex: 0,
    explanation: '來自台東延平鄉的紅葉少棒隊以 7:0 擊敗日本關西明星隊，開啟台灣三級棒球黃金時代。',
    difficulty: '簡單',
    timeLimit: 10
  },

  // ================= 國中階段 (課業加深與 90 年代文化) =================
  {
    id: 'jun-chi-01',
    subject: '國文',
    stage: '國中',
    question: '宋代蘇軾名作《水調歌頭》中「明月幾時有，把酒問青天」寫於哪個傳統節日？',
    options: ['端午節', '中秋節', '重陽節', '除夕夜'],
    correctIndex: 1,
    explanation: '詞序明確寫道：「丙辰中秋，歡飲達旦，大醉，作此篇，兼懷子由。」',
    difficulty: '普通',
    timeLimit: 10
  },
  {
    id: 'jun-math-01',
    subject: '數學',
    stage: '國中',
    question: '直角三角形兩股長分別為 3 和 4，根據畢氏定理，其斜邊長度為何？',
    options: ['5', '6', '7', '8'],
    correctIndex: 0,
    explanation: '3² + 4² = 9 + 16 = 25 = 5²，故斜邊為 5。',
    difficulty: '普通',
    timeLimit: 10
  },
  {
    id: 'jun-sci-01',
    subject: '自然',
    stage: '國中',
    question: '在化學週期表中，金屬元素「金」的化學符號是什麼？',
    options: ['Ag', 'Au', 'Fe', 'Cu'],
    correctIndex: 1,
    explanation: '金的符號為 Au (來自拉丁文 Aurum)；Ag 為銀、Fe 為鐵、Cu 為銅。',
    difficulty: '普通',
    timeLimit: 10
  },
  {
    id: 'jun-soc-01',
    subject: '社會',
    stage: '國中',
    question: '荷蘭統治台灣時期，在台南安平所建造的防禦城堡現稱為何？',
    options: ['赤崁樓', '安平古堡 (熱蘭遮城)', '億載金城', '淡水紅毛城'],
    correctIndex: 1,
    explanation: '安平古堡前身為荷蘭人興建的「熱蘭遮城 (Fort Zeelandia)」。',
    difficulty: '普通',
    timeLimit: 10
  },
  {
    id: 'jun-music-01',
    subject: '流行音樂',
    stage: '國中',
    question: '被譽為「歌神」、在 1993 年發行創下全亞洲百萬銷量紀錄專輯《吻別》的歌手是誰？',
    options: ['張學友', '劉德華', '郭富城', '黎明'],
    correctIndex: 0,
    explanation: '張學友於 1993 年發行《吻別》，年度銷量突破 400 萬張，被譽為華語流行音樂巔峰奇蹟。',
    difficulty: '普通',
    timeLimit: 10
  },
  {
    id: 'jun-pop-01',
    subject: '時事冷知識',
    stage: '國中',
    question: '90年代台灣週六晚間家喻戶曉的綜藝節目《超級星期天》，其最知名的招牌尋人單元名稱為何？',
    options: ['超級任務', '超級比一比', '超級動起來', '超級大頭家'],
    correctIndex: 0,
    explanation: '由阿亮（卜學亮）主持的「超級任務」，經典口號為「凡走過必留下痕跡，凡住過必留下鄰居」。',
    difficulty: '普通',
    timeLimit: 10
  },
  {
    id: 'jun-sport-01',
    subject: '體育運動',
    stage: '國中',
    question: '中華職棒 (CPBL) 於 1990 年在台北市立棒球場正式開打，元老四支球隊中不包含下列哪隊？',
    options: ['兄弟象', '統一獅', '味全龍', '興農牛'],
    correctIndex: 3,
    explanation: '職棒元年元老四隊為兄弟象、統一獅、味全龍、三商虎。興農牛前身為俊國熊，後來才加入。',
    difficulty: '普通',
    timeLimit: 10
  },

  // ================= 高中階段 (高中學測與進階考驗) =================
  {
    id: 'sen-chi-01',
    subject: '國文',
    stage: '高中',
    question: '司馬遷撰寫《史記》，其中記載諸侯王公家族事蹟的篇章體例稱為什麼？',
    options: ['本紀', '表', '世家', '列傳'],
    correctIndex: 2,
    explanation: '《史記》五體中，「本紀」記帝王、「世家」記諸侯、「列傳」記名臣庶人。',
    difficulty: '困難',
    timeLimit: 10
  },
  {
    id: 'sen-math-01',
    subject: '數學',
    stage: '高中',
    question: '丟擲一顆公正的六面骰子兩次，點數和為 7 的機率是多少？',
    options: ['1/6', '1/12', '7/36', '5/36'],
    correctIndex: 0,
    explanation: '兩骰點數總可能為 36 種，和為 7 之組合有 6 種，6/36 = 1/6。',
    difficulty: '困難',
    timeLimit: 10
  },
  {
    id: 'sen-sci-01',
    subject: '自然',
    stage: '高中',
    question: '愛因斯坦著名的質能等價互換公式為 E = mc²，其中字母「c」代表什麼物理量？',
    options: ['音速', '真空中的光速', '普朗克常數', '萬有引力常數'],
    correctIndex: 1,
    explanation: 'c 代表真空中的光速 (約 3 × 10⁸ m/s)。',
    difficulty: '困難',
    timeLimit: 10
  },
  {
    id: 'sen-music-01',
    subject: '流行音樂',
    stage: '高中',
    question: '1996 年被封為「天后」、發行首張同名專輯《姊妹》即在台灣狂銷 121 萬張的歌手是誰？',
    options: ['張惠妹 (A-Mei)', '李玟 (CoCo)', '王菲', '陳淑樺'],
    correctIndex: 0,
    explanation: '張惠妹在張雨生製作下推出《姊妹》專輯，震撼華語歌壇並創下全台新人銷售神話。',
    difficulty: '困難',
    timeLimit: 10
  },
  {
    id: 'sen-soc-01',
    subject: '社會',
    stage: '高中',
    question: '清朝光緒十一年（1885年）清廷決定將台灣單獨建省，首任台灣巡撫是誰？',
    options: ['劉銘傳', '沈葆楨', '丁日昌', '邵友濂'],
    correctIndex: 0,
    explanation: '劉銘傳為首任台灣巡撫，在台推動鐵路、電報與現代化建設。',
    difficulty: '困難',
    timeLimit: 10
  },
  {
    id: 'sen-pop-01',
    subject: '時事冷知識',
    stage: '高中',
    question: '早期大型電玩街機機台框體上方用來顯示遊戲標題的發光燈箱板，街機術語稱為什麼？',
    options: ['Bezel', 'Marquee', 'Control Panel', 'Cabinet'],
    correctIndex: 1,
    explanation: '街機機頂發光看板稱為 Marquee；螢幕周圍飾板稱為 Bezel。',
    difficulty: '困難',
    timeLimit: 10
  },

  // ================= 大學階段 (大學/畢業考 Boss 刁鑽題) =================
  {
    id: 'uni-chi-01',
    subject: '國文',
    stage: '大學',
    question: '清代乾嘉考據學派中，主張「六經皆史」觀點的著名歷史學家是誰？',
    options: ['戴震', '章學誠', '錢大昕', '王念孫'],
    correctIndex: 1,
    explanation: '章學誠在其巨作《文史通義》中首倡「六經皆史」之說。',
    difficulty: '困難',
    timeLimit: 10
  },
  {
    id: 'uni-math-01',
    subject: '數學',
    stage: '大學',
    question: '微積分學中，自然指數函數 f(x) = eˣ 的一階導數 f\'(x) 為何？',
    options: ['eˣ', 'x · eˣ⁻¹', 'ln(x)', '1 / eˣ'],
    correctIndex: 0,
    explanation: '自然底數 e 的指數函數其導數依舊為其自身 eˣ。',
    difficulty: '困難',
    timeLimit: 10
  },
  {
    id: 'uni-sci-01',
    subject: '自然',
    stage: '大學',
    question: '在計算機科學中，著名的圖靈機 (Turing Machine) 模型是由哪位學者在 1936 年提出？',
    options: ['馮紐曼 (John von Neumann)', '艾倫·圖靈 (Alan Turing)', '克勞德·夏農 (Claude Shannon)', '艾達·洛芙萊斯 (Ada Lovelace)'],
    correctIndex: 1,
    explanation: '由英國數學家兼電腦科學之父艾倫·圖靈在《論可計算數及其在判定問題上的應用》中提出。',
    difficulty: '困難',
    timeLimit: 10
  },
  {
    id: 'uni-soc-01',
    subject: '社會',
    stage: '大學',
    question: '亞當·斯密 (Adam Smith) 於 1776 年出版並被視為古典經濟學基石的名著為何？',
    options: ['資本論', '國富論', '道德情操論', '通論'],
    correctIndex: 1,
    explanation: '《國富論》（全名《國民財富的性質和原因的研究》）奠定了現代市場經濟學基礎。',
    difficulty: '困難',
    timeLimit: 10
  },
  {
    id: 'uni-music-01',
    subject: '流行音樂',
    stage: '大學',
    question: '台灣 90 年代搖滾天團「伍佰 & China Blue」在 1996 年發行傳唱至今的台語搖滾經典代表作是哪首？',
    options: ['樹枝孤鳥', '浪人情歌', '挪威的森林', '愛你一萬年'],
    correctIndex: 0,
    explanation: '《樹枝孤鳥》是伍佰於 1996 年發行的全台語搖滾概念專輯，並榮獲第 10 屆金曲獎最佳流行音樂演唱專輯獎。',
    difficulty: '困難',
    timeLimit: 10
  },
  {
    id: 'uni-pop-01',
    subject: '時事冷知識',
    stage: '大學',
    question: '1993 年在台灣大型機台盛行的益智問答名作《民國教育委員會》，日本原版街機名稱為何？',
    options: ['Quiz Nanairo Dreams', 'Quiz & Dragons', 'Quiz Channel Quest', 'Quiz King of Fighters'],
    correctIndex: 2,
    explanation: '《民國教育委員會》在台發行引進的原版為日本 Nakanihon 公司於 1993 年發行的《Quiz Channel Quest》。',
    difficulty: '困難',
    timeLimit: 10
  }
];
