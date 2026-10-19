/**
 * @file questionParser.ts
 * @description 題庫試算表與檔案解析工具模組
 * 支援 Excel (.xlsx/.xls)、CSV 與 JSON 檔案的讀取、防呆驗證、範本產生與匯出功能。
 */

import * as XLSX from 'xlsx';
import { QuestionItem, SubjectType, StageGrade, DifficultyType } from '../types/quiz';

/** 有效學科清單 */
const VALID_SUBJECTS: SubjectType[] = ['國文', '數學', '自然', '社會', '藝能', '時事冷知識'];

/** 有效學程清單 */
const VALID_STAGES: StageGrade[] = ['國小', '國中', '高中', '大學', '通用'];

/** 有效難易度清單 */
const VALID_DIFFICULTIES: DifficultyType[] = ['簡單', '普通', '困難'];

/** 解析結果介面 */
export interface ParseResult {
  success: boolean;
  data?: QuestionItem[];
  error?: string;
  totalParsed?: number;
}

/**
 * 驗證並格式化單筆題目資料
 * @param {Record<string, unknown>} raw 原始行資料物件
 * @param {number} rowNum 行號 (提示錯誤用)
 * @returns {{ item?: QuestionItem; error?: string }}
 */
function validateAndTransformRow(raw: Record<string, unknown>, rowNum: number): { item?: QuestionItem; error?: string } {
  // 欄位名稱對照 (支援中英文表頭相容)
  const subjectStr = String(raw['學科'] || raw['subject'] || '').trim();
  const stageStr = String(raw['適用階段'] || raw['階段'] || raw['stage'] || '通用').trim();
  const questionStr = String(raw['題目內容'] || raw['題目'] || raw['question'] || '').trim();
  const opt1 = String(raw['選項一'] || raw['選項1'] || raw['option1'] || raw['A'] || '').trim();
  const opt2 = String(raw['選項二'] || raw['選項2'] || raw['option2'] || raw['B'] || '').trim();
  const opt3 = String(raw['選項三'] || raw['選項3'] || raw['option3'] || raw['C'] || '').trim();
  const opt4 = String(raw['選項四'] || raw['選項4'] || raw['option4'] || raw['D'] || '').trim();
  const answerRaw = String(raw['正確答案'] || raw['答案'] || raw['answer'] || '').trim().toUpperCase();
  const explanation = String(raw['詳解說明'] || raw['解析'] || raw['explanation'] || '').trim();
  const difficultyStr = String(raw['難度'] || raw['difficulty'] || '普通').trim();

  if (!questionStr) {
    return { error: `第 ${rowNum} 行：題目內容不可為空` };
  }
  if (!opt1 || !opt2 || !opt3 || !opt4) {
    return { error: `第 ${rowNum} 行：四個選項 (A, B, C, D) 必須填寫齊全` };
  }

  // 解析正確解答索引 (支援 0~3、1~4、A~D)
  let correctIndex = -1;
  if (['0', '1', '2', '3'].includes(answerRaw)) {
    correctIndex = parseInt(answerRaw, 10);
  } else if (['1', '2', '3', '4'].includes(answerRaw)) {
    // 假設 1~4 對應 0~3
    correctIndex = parseInt(answerRaw, 10) - 1;
  } else if (answerRaw === 'A') correctIndex = 0;
  else if (answerRaw === 'B') correctIndex = 1;
  else if (answerRaw === 'C') correctIndex = 2;
  else if (answerRaw === 'D') correctIndex = 3;

  if (correctIndex < 0 || correctIndex > 3) {
    return { error: `第 ${rowNum} 行：正確答案格式不正確 (請填 1~4 或 A~D)，當前填寫為「${answerRaw}」` };
  }

  const subject: SubjectType = VALID_SUBJECTS.includes(subjectStr as SubjectType)
    ? (subjectStr as SubjectType)
    : '時事冷知識';

  const stage: StageGrade = VALID_STAGES.includes(stageStr as StageGrade)
    ? (stageStr as StageGrade)
    : '通用';

  const difficulty: DifficultyType = VALID_DIFFICULTIES.includes(difficultyStr as DifficultyType)
    ? (difficultyStr as DifficultyType)
    : '普通';

  const item: QuestionItem = {
    id: `custom-${Date.now()}-${rowNum}-${Math.random().toString(36).substring(2, 6)}`,
    subject,
    stage,
    question: questionStr,
    options: [opt1, opt2, opt3, opt4],
    correctIndex,
    explanation: explanation || undefined,
    difficulty,
    isCustom: true
  };

  return { item };
}

/**
 * 解析 Excel 檔案 (.xlsx, .xls)
 * @param {File} file 使用者選取或拖曳之檔案
 * @returns {Promise<ParseResult>}
 */
export async function parseExcelFile(file: File): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return { success: false, error: 'Excel 活頁簿中找不到任何工作表' };
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

    if (rawRows.length === 0) {
      return { success: false, error: 'Excel 工作表內容為空' };
    }

    const questions: QuestionItem[] = [];
    for (let i = 0; i < rawRows.length; i++) {
      const { item, error } = validateAndTransformRow(rawRows[i], i + 2); // Excel 第1行為標頭，資料自第2行起算
      if (error) {
        return { success: false, error };
      }
      if (item) questions.push(item);
    }

    return {
      success: true,
      data: questions,
      totalParsed: questions.length
    };
  } catch (err) {
    return { success: false, error: `解析 Excel 失敗：${(err as Error).message}` };
  }
}

/**
 * 解析 CSV 文字字串
 * @param {string} csvText CSV 內容文字
 * @returns {ParseResult}
 */
export function parseCSVText(csvText: string): ParseResult {
  try {
    const workbook = XLSX.read(csvText, { type: 'string' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' });

    if (rawRows.length === 0) {
      return { success: false, error: 'CSV 內容為空' };
    }

    const questions: QuestionItem[] = [];
    for (let i = 0; i < rawRows.length; i++) {
      const { item, error } = validateAndTransformRow(rawRows[i], i + 2);
      if (error) {
        return { success: false, error };
      }
      if (item) questions.push(item);
    }

    return { success: true, data: questions, totalParsed: questions.length };
  } catch (err) {
    return { success: false, error: `解析 CSV 失敗：${(err as Error).message}` };
  }
}

/**
 * 解析 JSON 格式字串
 * @param {string} jsonText JSON 字串
 * @returns {ParseResult}
 */
export function parseJSONText(jsonText: string): ParseResult {
  try {
    const parsed = JSON.parse(jsonText);
    const arr = Array.isArray(parsed) ? parsed : parsed.questions || parsed.data;
    if (!Array.isArray(arr) || arr.length === 0) {
      return { success: false, error: 'JSON 格式需為題目物件陣列' };
    }

    const questions: QuestionItem[] = [];
    for (let i = 0; i < arr.length; i++) {
      const row = arr[i];
      // 支援既有 QuestionItem 格式或中文格式
      if (row.question && Array.isArray(row.options) && row.options.length === 4 && typeof row.correctIndex === 'number') {
        questions.push({
          id: row.id || `custom-${Date.now()}-${i}`,
          subject: row.subject || '時事冷知識',
          stage: row.stage || '通用',
          question: row.question,
          options: [row.options[0], row.options[1], row.options[2], row.options[3]],
          correctIndex: row.correctIndex,
          explanation: row.explanation,
          difficulty: row.difficulty || '普通',
          isCustom: true
        });
      } else {
        const { item, error } = validateAndTransformRow(row, i + 1);
        if (error) return { success: false, error };
        if (item) questions.push(item);
      }
    }

    return { success: true, data: questions, totalParsed: questions.length };
  } catch (err) {
    return { success: false, error: `解析 JSON 失敗：${(err as Error).message}` };
  }
}

/**
 * 下載題庫 Excel 範本檔案
 */
export function downloadExcelTemplate(): void {
  const sampleData = [
    {
      '學科': '國文',
      '適用階段': '國小',
      '題目內容': '「三人行，必有我師焉」出自於哪一部古代儒家經典？',
      '選項一': '論語',
      '選項二': '孟子',
      '選項三': '中庸',
      '選項四': '大學',
      '正確答案': '1',
      '詳解說明': '出自《論語·述而篇》，說明孔子虛心向人學習之哲理。',
      '難度': '簡單'
    },
    {
      '學科': '數學',
      '適用階段': '國中',
      '題目內容': '直角三角形兩股分別為 3 與 4，斜邊長度為何？',
      '選項一': '5',
      '選項二': '6',
      '選項三': '7',
      '選項四': '8',
      '正確答案': 'A',
      '詳解說明': '根據畢氏定理 3² + 4² = 25 = 5²。',
      '難度': '普通'
    },
    {
      '學科': '時事冷知識',
      '適用階段': '通用',
      '題目內容': '1993年推出的街機益智名作《民國教育委員會》在台灣以哪種模式升學？',
      '選項一': '九年義務教育制',
      '選項二': '大富翁棋盤升學考試',
      '選項三': '賽車競速制',
      '選項四': '抽籤決定制',
      '正確答案': '2',
      '詳解說明': '結合了棋盤擲骰前進與各學科限時考驗。',
      '難度': '簡單'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  // 設定欄位寬度以利閱讀
  ws['!cols'] = [
    { wch: 12 }, // 學科
    { wch: 12 }, // 適用階段
    { wch: 45 }, // 題目內容
    { wch: 18 }, // 選項一
    { wch: 18 }, // 選項二
    { wch: 18 }, // 選項三
    { wch: 18 }, // 選項四
    { wch: 12 }, // 正確答案
    { wch: 35 }, // 詳解說明
    { wch: 10 }, // 難度
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '題庫範本');
  XLSX.writeFile(wb, '民國教育委員會_題庫範本.xlsx');
}

/**
 * 匯出題庫清單至 Excel 檔案
 * @param {QuestionItem[]} questions 題目清單
 * @param {string} [filename='民國教育委員會_題庫匯出.xlsx'] 匯出檔名
 */
export function exportToExcel(questions: QuestionItem[], filename = '民國教育委員會_題庫匯出.xlsx'): void {
  const exportRows = questions.map(q => ({
    '學科': q.subject,
    '適用階段': q.stage,
    '題目內容': q.question,
    '選項一': q.options[0],
    '選項二': q.options[1],
    '選項三': q.options[2],
    '選項四': q.options[3],
    '正確答案': q.correctIndex + 1, // 轉成 1~4 人性化顯示
    '詳解說明': q.explanation || '',
    '難度': q.difficulty
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '題庫');
  XLSX.writeFile(wb, filename);
}

/**
 * 匯出題庫為 JSON 檔案
 * @param {QuestionItem[]} questions 題目清單
 * @param {string} [filename='民國教育委員會_題庫.json'] 匯出檔名
 */
export function exportToJSON(questions: QuestionItem[], filename = '民國教育委員會_題庫.json'): void {
  const jsonStr = JSON.stringify(questions, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
