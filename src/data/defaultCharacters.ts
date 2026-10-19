/**
 * @file defaultCharacters.ts
 * @description 預設名師角色與新聞主播資料庫 (100% 依據 pic/quiz1.jpg 與 pic/new1.jpg 16-Bit 像素重製)
 * 提供忠實復刻之名師像素頭像與主播搭檔，支援在題庫管理後台自由切換或自訂上傳。
 */

import { TeacherProfile, AnchorProfile } from '../types/quiz';
import { 
  PIXEL_STRICT_TEACHER, 
  PIXEL_CONFUCIUS, 
  PIXEL_EINSTEIN, 
  PIXEL_MILITARY, 
  PIXEL_FEMALE_ANCHOR, 
  PIXEL_MALE_ANCHOR 
} from '../assets/pixelArt';

/** 預設老師清單 (全數採用 16-Bit 大型街機手繪像素點陣畫) */
export const DEFAULT_TEACHERS: TeacherProfile[] = [
  {
    id: 'strict-master',
    name: '嚴師 督學官',
    title: '教導主任',
    avatarUrl: PIXEL_STRICT_TEACHER,
    description: '1993 大型電玩原版嚴師！手持教鞭，犀利黑框眼鏡，緊盯每位學生的答題表現！'
  },
  {
    id: 'confucius',
    name: '孔夫子 先師',
    title: '國學大師',
    avatarUrl: PIXEL_CONFUCIUS,
    description: '「學而時習之，不亦說乎？」傳道授業，博古通今。'
  },
  {
    id: 'einstein',
    name: '愛因斯坦 博士',
    title: '科學院士',
    avatarUrl: PIXEL_EINSTEIN,
    description: '「想像力比知識更重要。」以俏皮幽默引導理化大冒險。'
  },
  {
    id: 'drillmaster',
    name: '鐵血教官 趙長官',
    title: '生輔組長',
    avatarUrl: PIXEL_MILITARY,
    description: '服裝儀容與校規鐵腕管束！答錯可是要罰站背誦守則的！'
  }
];

/** 預設新聞雙主播設定 (100% 還原 pic/new1.jpg) */
export const DEFAULT_ANCHOR_PAIR: AnchorProfile = {
  id: 'standard-news',
  title: '九點現場新聞主播台',
  leftAnchorName: '張雅琴 主播',
  leftAnchorAvatar: PIXEL_FEMALE_ANCHOR,
  rightAnchorName: '盛竹如 評論員',
  rightAnchorAvatar: PIXEL_MALE_ANCHOR
};
