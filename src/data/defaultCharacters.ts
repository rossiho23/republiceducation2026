/**
 * @file defaultCharacters.ts
 * @description 預設名師角色與新聞主播資料庫 (致敬 quiz1.jpg 與 new1.jpg)
 * 提供可替換之名師頭像與主播搭檔，支援在題庫管理後台自由切換或自訂上傳。
 */

import { TeacherProfile, AnchorProfile } from '../types/quiz';

/** 嚴肅眼鏡教鞭名師 (SVG Data URI，致敬 quiz1.jpg 右側老師) */
const SVG_STRICT_TEACHER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23fef08a" stroke="%230f172a" stroke-width="3"/><rect x="25" y="8" width="50" height="24" rx="10" fill="%230f172a"/><circle cx="35" cy="48" r="14" fill="none" stroke="%230f172a" stroke-width="4"/><circle cx="65" cy="48" r="14" fill="none" stroke="%230f172a" stroke-width="4"/><line x1="49" y1="48" x2="51" y2="48" stroke="%230f172a" stroke-width="4"/><circle cx="35" cy="48" r="4" fill="%230f172a"/><circle cx="65" cy="48" r="4" fill="%230f172a"/><path d="M42 66 L50 63 L58 66" stroke="%230f172a" stroke-width="3" fill="none"/><line x1="38" y1="78" x2="62" y2="78" stroke="%23b91c1c" stroke-width="4"/><line x1="72" y1="62" x2="92" y2="30" stroke="%23854d0e" stroke-width="5" stroke-linecap="round"/></svg>`;

/** 至聖先師孔子 (SVG Data URI) */
const SVG_CONFUCIUS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23ffedd5" stroke="%2378350f" stroke-width="3"/><rect x="28" y="10" width="44" height="20" rx="3" fill="%231e293b"/><line x1="32" y1="46" x2="44" y2="48" stroke="%230f172a" stroke-width="3"/><line x1="68" y1="46" x2="56" y2="48" stroke="%230f172a" stroke-width="3"/><path d="M42 70 Q50 95 58 70 Z" fill="%2394a3b8"/><path d="M45 62 Q50 66 55 62" stroke="%230f172a" stroke-width="2" fill="none"/></svg>`;

/** 愛因斯坦博士 (SVG Data URI) */
const SVG_EINSTEIN = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23fce7f3" stroke="%230f172a" stroke-width="3"/><path d="M10 40 Q25 15 50 15 Q75 15 90 40 Q85 60 90 80 Q50 70 10 80 Z" fill="%23cbd5e1" opacity="0.9"/><circle cx="50" cy="52" r="32" fill="%23ffedd5"/><circle cx="38" cy="46" r="3.5" fill="%230f172a"/><circle cx="62" cy="46" r="3.5" fill="%230f172a"/><path d="M35 60 Q50 68 65 60" fill="%2394a3b8" stroke="%23475569" stroke-width="2"/><path d="M46 66 C46 75 54 75 54 66 Z" fill="%23ef4444"/></svg>`;

/** 嚴厲教官 (SVG Data URI) */
const SVG_MILITARY = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23ecfccb" stroke="%23365314" stroke-width="3"/><polygon points="20 28 80 28 86 36 14 36" fill="%233f6212"/><rect x="25" y="16" width="50" height="14" fill="%234d7c0f"/><circle cx="50" cy="22" r="4" fill="%23eab308"/><circle cx="38" cy="50" r="3" fill="%23000"/><circle cx="62" cy="50" r="3" fill="%23000"/><line x1="40" y1="70" x2="60" y2="70" stroke="%23000" stroke-width="3"/></svg>`;

/** 女主播頭像 (SVG Data URI，致敬 new1.jpg 左主播) */
const SVG_FEMALE_ANCHOR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23e0e7ff" stroke="%23312e81" stroke-width="3"/><circle cx="50" cy="52" r="30" fill="%23ffedd5"/><path d="M20 50 Q22 18 50 18 Q78 18 80 50 Q75 40 70 30 Q50 24 30 30 Z" fill="%23451a03"/><circle cx="18" cy="56" r="5" fill="%23facc15" stroke="%23ca8a04" stroke-width="1.5"/><circle cx="82" cy="56" r="5" fill="%23facc15" stroke="%23ca8a04" stroke-width="1.5"/><circle cx="38" cy="50" r="3.5" fill="%230f172a"/><circle cx="62" cy="50" r="3.5" fill="%230f172a"/><path d="M42 66 Q50 72 58 66" stroke="%23e11d48" stroke-width="3" fill="none"/></svg>`;

/** 滑稽名嘴男主播頭像 (SVG Data URI，致敬 new1.jpg 右主播) */
const SVG_MALE_ANCHOR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23fef3c7" stroke="%2378350f" stroke-width="3"/><rect x="25" y="16" width="50" height="20" rx="4" fill="%231c1917"/><circle cx="50" cy="56" r="32" fill="%23fed7aa"/><circle cx="36" cy="50" r="10" fill="none" stroke="%230f172a" stroke-width="2.5"/><circle cx="64" cy="50" r="10" fill="none" stroke="%230f172a" stroke-width="2.5"/><ellipse cx="50" cy="58" rx="8" ry="7" fill="%23fb923c"/><path d="M34 72 Q50 86 66 72 Z" fill="%23dc2626" stroke="%23000" stroke-width="2"/></svg>`;

/** 預設老師清單 */
export const DEFAULT_TEACHERS: TeacherProfile[] = [
  {
    id: 'strict-master',
    name: '嚴師 督學官',
    title: '教導主任',
    avatarUrl: SVG_STRICT_TEACHER,
    description: '經典大型電玩原版嚴師！手持教鞭，緊盯每位學生的答題表現！'
  },
  {
    id: 'confucius',
    name: '孔夫子 先師',
    title: '國學大師',
    avatarUrl: SVG_CONFUCIUS,
    description: '「學而時習之，不亦說乎？」傳道授業，博古通今。'
  },
  {
    id: 'einstein',
    name: '愛因斯坦 博士',
    title: '科學院士',
    avatarUrl: SVG_EINSTEIN,
    description: '「想像力比知識更重要。」以俏皮幽默引導理化大冒險。'
  },
  {
    id: 'drillmaster',
    name: '鐵血教官 趙長官',
    title: '生輔組長',
    avatarUrl: SVG_MILITARY,
    description: '服裝儀容與校規鐵腕管束！答錯可是要罰站背誦守則的！'
  }
];

/** 預設新聞雙主播設定 */
export const DEFAULT_ANCHOR_PAIR: AnchorProfile = {
  id: 'standard-news',
  title: '九點現場新聞主播台',
  leftAnchorName: '張雅琴 主播',
  leftAnchorAvatar: SVG_FEMALE_ANCHOR,
  rightAnchorName: '盛竹如 評論員',
  rightAnchorAvatar: SVG_MALE_ANCHOR
};
