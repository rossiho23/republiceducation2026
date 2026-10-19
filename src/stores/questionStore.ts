/**
 * @file questionStore.ts
 * @description Pinia 題庫狀態管理庫
 * 負責所有題目的讀取、新增、修改、刪除、匯入、匯出及持久化儲存 (LocalStorage)。
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { QuestionItem, StageGrade, SubjectType } from '../types/quiz';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';

const STORAGE_KEY = 'REPUBLIC_QUIZ_CUSTOM_QUESTIONS_V1';

export const useQuestionStore = defineStore('questionStore', () => {
  /** 題庫集合 */
  const questions = ref<QuestionItem[]>([]);
  /** 已出過題目 ID 集合 (防止一局遊戲中重複出題) */
  const usedQuestionIds = ref<Set<string>>(new Set());

  /**
   * 初始化題庫資料，從 LocalStorage 讀取，若無則載入預設題庫
   */
  function initQuestions(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          questions.value = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('讀取本地題庫失敗，恢復預設題庫:', e);
    }
    // 預設載入種子題庫
    questions.value = [...DEFAULT_QUESTIONS];
    saveToStorage();
  }

  /**
   * 將當前題庫持久化寫入瀏覽器 LocalStorage
   */
  function saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions.value));
    } catch (e) {
      console.error('寫入 LocalStorage 失敗:', e);
    }
  }

  /**
   * 匯入題目清單
   * @param {QuestionItem[]} newQuestions 新解析之題目陣列
   * @param {boolean} [overwrite=false] 是否覆蓋現有題庫 (true: 覆蓋, false: 追加合併)
   */
  function importQuestions(newQuestions: QuestionItem[], overwrite = false): void {
    if (overwrite) {
      questions.value = [...newQuestions];
    } else {
      // 避免重複 ID
      const existingIds = new Set(questions.value.map(q => q.id));
      const filteredNew = newQuestions.map(q => {
        if (existingIds.has(q.id)) {
          return { ...q, id: `imported-${Date.now()}-${Math.random().toString(36).substring(2, 7)}` };
        }
        return q;
      });
      questions.value = [...questions.value, ...filteredNew];
    }
    saveToStorage();
  }

  /**
   * 手動新增單筆題目
   * @param {QuestionItem} question 題目物件
   */
  function addQuestion(question: QuestionItem): void {
    questions.value.unshift(question);
    saveToStorage();
  }

  /**
   * 修改既有題目內容
   * @param {string} id 題目 ID
   * @param {Partial<QuestionItem>} updated 修改之欄位資料
   */
  function updateQuestion(id: string, updated: Partial<QuestionItem>): void {
    const idx = questions.value.findIndex(q => q.id === id);
    if (idx !== -1) {
      questions.value[idx] = { ...questions.value[idx], ...updated };
      saveToStorage();
    }
  }

  /**
   * 刪除指定題目
   * @param {string} id 題目 ID
   */
  function deleteQuestion(id: string): void {
    questions.value = questions.value.filter(q => q.id !== id);
    saveToStorage();
  }

  /**
   * 重設題庫回內建經典種子資料
   */
  function resetToDefault(): void {
    questions.value = [...DEFAULT_QUESTIONS];
    saveToStorage();
    usedQuestionIds.value.clear();
  }

  /**
   * 清除已出題記錄 (新局開始時呼叫)
   */
  function clearUsedQuestions(): void {
    usedQuestionIds.value.clear();
  }

  /**
   * 依據學程階段與指定學科抽取一題題目
   * @param {StageGrade} stage 當前學程 (國小/國中/高中/大學)
   * @param {SubjectType} [subject] 指定學科 (可選)
   * @returns {QuestionItem | null} 隨機挑選之題目
   */
  function pickQuestion(stage: StageGrade, subject?: SubjectType): QuestionItem | null {
    // 優先挑選符合階段 (或通用) 且未被抽過的題目
    let pool = questions.value.filter(q => {
      const matchStage = q.stage === stage || q.stage === '通用';
      const matchSubject = subject ? q.subject === subject : true;
      const notUsed = !usedQuestionIds.value.has(q.id);
      return matchStage && matchSubject && notUsed;
    });

    // 若未抽過的題目耗盡，則放寬「未抽過」條件
    if (pool.length === 0) {
      pool = questions.value.filter(q => {
        const matchStage = q.stage === stage || q.stage === '通用';
        const matchSubject = subject ? q.subject === subject : true;
        return matchStage && matchSubject;
      });
    }

    // 若依然沒有題目，則放寬學程限制
    if (pool.length === 0) {
      pool = questions.value;
    }

    if (pool.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    usedQuestionIds.value.add(chosen.id);

    return chosen;
  }

  /**
   * 題庫統計資訊計算
   */
  const stats = computed(() => {
    const total = questions.value.length;
    const stageCounts: Record<string, number> = {};
    const subjectCounts: Record<string, number> = {};

    questions.value.forEach(q => {
      stageCounts[q.stage] = (stageCounts[q.stage] || 0) + 1;
      subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
    });

    return {
      total,
      stageCounts,
      subjectCounts,
      customCount: questions.value.filter(q => q.isCustom).length,
    };
  });

  return {
    questions,
    initQuestions,
    importQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    resetToDefault,
    clearUsedQuestions,
    pickQuestion,
    stats
  };
});
