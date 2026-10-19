/**
 * @file characterStore.ts
 * @description 人物角色與名師／新聞主播狀態庫 (Character Store)
 * 負責管理課堂右側可替換老師、新聞雙主播頭像，並支援 LocalStorage 持久化儲存。
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TeacherProfile, AnchorProfile } from '../types/quiz';
import { DEFAULT_TEACHERS, DEFAULT_ANCHOR_PAIR } from '../data/defaultCharacters';

const TEACHER_STORAGE_KEY = 'REPUBLIC_QUIZ_TEACHERS_V2_PIXEL';
const SELECTED_TEACHER_KEY = 'REPUBLIC_QUIZ_SELECTED_TEACHER_V2_PIXEL';
const ANCHOR_STORAGE_KEY = 'REPUBLIC_QUIZ_ANCHORS_V2_PIXEL';

export const useCharacterStore = defineStore('characterStore', () => {
  const teachers = ref<TeacherProfile[]>([...DEFAULT_TEACHERS]);
  const selectedTeacherId = ref<string>('strict-master');
  const anchorPair = ref<AnchorProfile>({ ...DEFAULT_ANCHOR_PAIR });

  /**
   * 初始化載入角色資料 (自動升級為 16-Bit 大型街機手繪像素點陣頭像)
   */
  function initCharacters(): void {
    try {
      const storedTeachers = localStorage.getItem(TEACHER_STORAGE_KEY);
      if (storedTeachers) {
        const parsed = JSON.parse(storedTeachers) as TeacherProfile[];
        // 若為系統預設名師，同步更新為最新手繪像素美術
        teachers.value = parsed.map(t => {
          const defaultMatch = DEFAULT_TEACHERS.find(d => d.id === t.id);
          return defaultMatch ? { ...t, avatarUrl: defaultMatch.avatarUrl } : t;
        });
      } else {
        teachers.value = [...DEFAULT_TEACHERS];
      }
      const storedSelected = localStorage.getItem(SELECTED_TEACHER_KEY);
      if (storedSelected && teachers.value.some(t => t.id === storedSelected)) {
        selectedTeacherId.value = storedSelected;
      }
      const storedAnchors = localStorage.getItem(ANCHOR_STORAGE_KEY);
      if (storedAnchors) {
        anchorPair.value = {
          ...DEFAULT_ANCHOR_PAIR,
          ...JSON.parse(storedAnchors),
          leftAnchorAvatar: DEFAULT_ANCHOR_PAIR.leftAnchorAvatar,
          rightAnchorAvatar: DEFAULT_ANCHOR_PAIR.rightAnchorAvatar
        };
      } else {
        anchorPair.value = { ...DEFAULT_ANCHOR_PAIR };
      }
    } catch (e) {
      console.warn('載入角色設定失敗，採用預設像素資產:', e);
      teachers.value = [...DEFAULT_TEACHERS];
      anchorPair.value = { ...DEFAULT_ANCHOR_PAIR };
    }
  }

  function saveTeachers(): void {
    localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(teachers.value));
    localStorage.setItem(SELECTED_TEACHER_KEY, selectedTeacherId.value);
  }

  function saveAnchors(): void {
    localStorage.setItem(ANCHOR_STORAGE_KEY, JSON.stringify(anchorPair.value));
  }

  /**
   * 切換當前執教老師
   * @param {string} id 老師 ID
   */
  function selectTeacher(id: string): void {
    if (teachers.value.some(t => t.id === id)) {
      selectedTeacherId.value = id;
      saveTeachers();
    }
  }

  /**
   * 新增或更新自訂老師
   * @param {TeacherProfile} teacher 老師設定
   */
  function addOrUpdateTeacher(teacher: TeacherProfile): void {
    const idx = teachers.value.findIndex(t => t.id === teacher.id);
    if (idx !== -1) {
      teachers.value[idx] = teacher;
    } else {
      teachers.value.push(teacher);
    }
    selectedTeacherId.value = teacher.id;
    saveTeachers();
  }

  /**
   * 刪除自訂老師
   * @param {string} id 老師 ID
   */
  function deleteTeacher(id: string): void {
    // 預設名師不可刪除
    if (DEFAULT_TEACHERS.some(t => t.id === id)) return;
    teachers.value = teachers.value.filter(t => t.id !== id);
    if (selectedTeacherId.value === id) {
      selectedTeacherId.value = 'strict-master';
    }
    saveTeachers();
  }

  /**
   * 更新新聞主播資料
   * @param {Partial<AnchorProfile>} updated 主播資料
   */
  function updateAnchorPair(updated: Partial<AnchorProfile>): void {
    anchorPair.value = { ...anchorPair.value, ...updated };
    saveAnchors();
  }

  /**
   * 重設為官方預設人物設定
   */
  function resetToDefault(): void {
    teachers.value = [...DEFAULT_TEACHERS];
    selectedTeacherId.value = 'strict-master';
    anchorPair.value = { ...DEFAULT_ANCHOR_PAIR };
    saveTeachers();
    saveAnchors();
  }

  /** 目前正在執教的老師物件 */
  const activeTeacher = computed(() => {
    return teachers.value.find(t => t.id === selectedTeacherId.value) || teachers.value[0];
  });

  return {
    teachers,
    selectedTeacherId,
    activeTeacher,
    anchorPair,
    initCharacters,
    selectTeacher,
    addOrUpdateTeacher,
    deleteTeacher,
    updateAnchorPair,
    resetToDefault
  };
});
