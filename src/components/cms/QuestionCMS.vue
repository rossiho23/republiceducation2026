<template>
  <div class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-mono">
    <div class="w-full max-w-5xl bg-arcade-dark border-4 border-arcade-purple rounded-3xl p-5 sm:p-7 shadow-arcade-glow flex flex-col gap-5 my-auto max-h-[92vh] overflow-y-auto">
      <!-- 頂部後台標頭與頁籤切換 -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-800 pb-4 gap-3">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⚙️</span>
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-purple-300">後台控制管理中心 (CMS)</h2>
            <p class="text-xs text-gray-400">支援題庫 Excel/CSV 匯入匯出、自訂題目與名師／新聞主播形象自訂更換</p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-auto">
          <!-- 頁籤切換按鈕 -->
          <button 
            @click="activeTab = 'questions'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-black transition-all"
            :class="activeTab === 'questions' ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'"
          >
            📚 題庫資料管理
          </button>
          <button 
            @click="activeTab = 'characters'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-black transition-all"
            :class="activeTab === 'characters' ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'"
          >
            👨‍🏫 名師與主播設定
          </button>

          <button 
            @click="$emit('close')"
            class="btn-arcade bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg ml-2"
          >
            ✕ 關閉返回
          </button>
        </div>
      </div>

      <!-- 訊息提示條 (成功/錯誤) -->
      <div v-if="noticeMessage" class="p-3 rounded-xl text-xs font-bold transition-all" :class="isNoticeError ? 'bg-red-950 text-red-300 border border-red-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'">
        {{ noticeMessage }}
      </div>

      <!-- ================= 頁籤 1: 題庫資料管理 ================= -->
      <div v-if="activeTab === 'questions'" class="flex flex-col gap-5">
        <!-- 統計數據卡片 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-arcade-panel border border-slate-700 rounded-xl p-3 text-center">
            <div class="text-xs text-gray-400">總題數</div>
            <div class="text-xl font-black text-arcade-yellow font-mono">{{ questionStore.stats.total }} 題</div>
          </div>
          <div class="bg-arcade-panel border border-slate-700 rounded-xl p-3 text-center">
            <div class="text-xs text-gray-400">使用者自訂題</div>
            <div class="text-xl font-black text-arcade-cyan font-mono">{{ questionStore.stats.customCount }} 題</div>
          </div>
          <div class="bg-arcade-panel border border-slate-700 rounded-xl p-3 text-center">
            <div class="text-xs text-gray-400">學科分類數</div>
            <div class="text-xl font-black text-arcade-green font-mono">
              {{ Object.keys(questionStore.stats.subjectCounts).length }} 類
            </div>
          </div>
          <div class="bg-arcade-panel border border-slate-700 rounded-xl p-3 text-center">
            <div class="text-xs text-gray-400">學程覆蓋</div>
            <div class="text-xl font-black text-arcade-purple font-mono">國小~大學</div>
          </div>
        </div>

        <!-- 工具操作列：檔案匯入、範本下載、資料匯出、新增題目 -->
        <div class="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <!-- 檔案上傳區 (支援點擊與拖曳) -->
          <div class="flex items-center gap-3">
            <input 
              type="file" 
              ref="fileInputRef" 
              @change="handleFileUpload" 
              accept=".xlsx, .xls, .csv, .json" 
              class="hidden" 
            />
            <button 
              @click="triggerFileInput"
              class="btn-arcade bg-arcade-cyan text-black font-black text-xs py-2 px-4 rounded-lg flex items-center gap-1.5"
            >
              <span>📁 匯入題庫 (.xlsx / .csv / .json)</span>
            </button>

            <!-- 匯入模式選擇 -->
            <label class="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer select-none">
              <input type="checkbox" v-model="overwriteOnImport" class="rounded text-arcade-yellow focus:ring-0" />
              <span>匯入時覆蓋現有題庫</span>
            </label>
          </div>

          <!-- 輔助功能按鈕組 -->
          <div class="flex flex-wrap items-center gap-2">
            <button 
              @click="downloadTemplate"
              class="btn-arcade bg-slate-800 hover:bg-slate-700 text-arcade-yellow font-bold text-xs py-2 px-3 rounded-lg border-slate-600"
            >
              📥 下載 Excel 範本
            </button>
            <button 
              @click="exportExcel"
              class="btn-arcade bg-slate-800 hover:bg-slate-700 text-arcade-green font-bold text-xs py-2 px-3 rounded-lg border-slate-600"
            >
              📤 匯出 Excel
            </button>
            <button 
              @click="openAddModal"
              class="btn-arcade bg-gradient-to-r from-arcade-yellow to-orange-500 text-black font-black text-xs py-2 px-4 rounded-lg"
            >
              ➕ 線上手動新增題目
            </button>
            <button 
              @click="confirmResetQuestions"
              class="btn-arcade bg-red-950 text-red-300 hover:bg-red-900 font-bold text-xs py-2 px-3 rounded-lg border-red-700"
            >
              🔄 還原預設題庫
            </button>
          </div>
        </div>

        <!-- 篩選與搜尋列 -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-arcade-panel p-3 rounded-xl border border-slate-700 text-xs">
          <div class="flex items-center gap-2 flex-1 min-w-[200px]">
            <span class="text-gray-400">🔍 搜尋:</span>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="搜尋題幹、關鍵字、選項..." 
              class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white flex-1 focus:outline-none focus:border-arcade-yellow"
            />
          </div>

          <div class="flex items-center gap-2">
            <span class="text-gray-400">階段:</span>
            <select v-model="filterStage" class="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white focus:outline-none">
              <option value="ALL">全部階段</option>
              <option value="國小">國小</option>
              <option value="國中">國中</option>
              <option value="高中">高中</option>
              <option value="大學">大學</option>
              <option value="通用">通用</option>
            </select>

            <span class="text-gray-400 ml-2">學科:</span>
            <select v-model="filterSubject" class="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white focus:outline-none">
              <option value="ALL">全部學科</option>
              <option value="國文">國文</option>
              <option value="數學">數學</option>
              <option value="自然">自然</option>
              <option value="社會">社會</option>
              <option value="流行音樂">流行音樂</option>
              <option value="體育運動">體育運動</option>
              <option value="時事冷知識">時事冷知識</option>
              <option value="藝能">藝能</option>
              <option value="課外">課外</option>
            </select>
          </div>
        </div>

        <!-- 題目表格清單 -->
        <div class="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-900 text-gray-400 border-b border-slate-800 font-mono">
                <th class="p-3 w-16">階段</th>
                <th class="p-3 w-24">學科</th>
                <th class="p-3">題目內容</th>
                <th class="p-3 w-36">正確答案</th>
                <th class="p-3 w-16">難度</th>
                <th class="p-3 w-20 text-right">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr 
                v-for="q in filteredQuestions" 
                :key="q.id"
                class="hover:bg-slate-900/60 transition-colors"
              >
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-gray-200">
                    {{ q.stage }}
                  </span>
                </td>
                <td class="p-3 font-bold text-arcade-cyan">{{ q.subject }}</td>
                <td class="p-3 text-gray-200 font-medium">
                  <div class="line-clamp-2">{{ q.question }}</div>
                  <div v-if="q.explanation" class="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                    💡 {{ q.explanation }}
                  </div>
                </td>
                <td class="p-3 text-arcade-green font-bold font-mono">
                  {{ ['A', 'B', 'C', 'D'][q.correctIndex] }}. {{ q.options[q.correctIndex] }}
                </td>
                <td class="p-3">
                  <span :class="q.difficulty === '困難' ? 'text-arcade-red' : 'text-gray-400'">
                    {{ q.difficulty }}
                  </span>
                </td>
                <td class="p-3 text-right">
                  <button 
                    @click="deleteQuestion(q.id)"
                    class="text-red-400 hover:text-red-300 font-bold ml-2"
                    title="刪除題目"
                  >
                    刪除
                  </button>
                </td>
              </tr>
              <tr v-if="filteredQuestions.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-500 font-mono">
                  查無符合條件的題目資料
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ================= 頁籤 2: 名師與新聞主播形象設定 ================= -->
      <div v-else-if="activeTab === 'characters'" class="flex flex-col gap-6">
        <!-- 說明橫幅 -->
        <div class="p-4 bg-slate-900 border-2 border-amber-400/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="text-gray-300 leading-relaxed">
            <span class="font-bold text-amber-300 text-sm">💡 致敬大型電玩經典視覺：</span>
            課堂答題時（致敬 quiz1.jpg），左側學生固定，右側名師可由您自由更換；新聞問題時（致敬 new1.jpg），由雙主播名人即時播報！支援上傳本地圖片或填寫任何圖片連結。
          </div>
          <button
            @click="confirmResetCharacters"
            class="px-3 py-1.5 bg-red-950 text-red-300 hover:bg-red-900 font-bold rounded-lg border border-red-700 whitespace-nowrap"
          >
            🔄 還原官方角色設定
          </button>
        </div>

        <!-- 區塊 A：名師陣容管理 (致敬 quiz1.jpg 黑板右側執教老師) -->
        <div class="bg-arcade-panel border border-slate-700 rounded-2xl p-5 flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-slate-700 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">👨‍🏫</span>
              <h3 class="text-base font-black text-amber-300">課堂執教名師陣容 (右側老師可自由切換)</h3>
            </div>
            <button
              @click="isAddTeacherModalOpen = true"
              class="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs rounded-lg shadow hover:brightness-110"
            >
              ➕ 新增自訂名師
            </button>
          </div>

          <!-- 名師卡片清單 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              v-for="teacher in characterStore.teachers"
              :key="teacher.id"
              class="relative p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-2 bg-slate-900/80"
              :class="characterStore.selectedTeacherId === teacher.id ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'border-slate-700 hover:border-slate-500'"
            >
              <!-- 執教中標籤 -->
              <span 
                v-if="characterStore.selectedTeacherId === teacher.id"
                class="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-md shadow"
              >
                ★ 執教中
              </span>

              <!-- 頭像 -->
              <div class="w-20 h-20 rounded-full border-2 border-amber-300 p-1 bg-slate-800 overflow-hidden shadow">
                <img :src="teacher.avatarUrl" :alt="teacher.name" class="w-full h-full object-cover rounded-full" />
              </div>

              <!-- 姓名與頭銜 -->
              <div>
                <div class="font-bold text-sm text-yellow-200">{{ teacher.name }}</div>
                <div class="text-[11px] text-amber-400 font-mono">{{ teacher.title }}</div>
              </div>

              <p class="text-[11px] text-gray-400 leading-tight line-clamp-2 px-1">
                {{ teacher.description }}
              </p>

              <!-- 切換執教 / 刪除按鈕 -->
              <div class="w-full mt-auto pt-2 flex items-center justify-center gap-2">
                <button
                  v-if="characterStore.selectedTeacherId !== teacher.id"
                  @click="characterStore.selectTeacher(teacher.id)"
                  class="w-full py-1 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-amber-300 text-xs font-bold rounded border border-amber-400/50 transition-colors"
                >
                  任聘為主考名師
                </button>
                <button
                  v-else
                  class="w-full py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded cursor-default border border-amber-400/40"
                >
                  目前主考中
                </button>

                <!-- 自訂名師可刪除 -->
                <button
                  v-if="teacher.isCustom"
                  @click="characterStore.deleteTeacher(teacher.id)"
                  class="p-1 text-red-400 hover:text-red-300 text-xs"
                  title="刪除自訂名師"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 區塊 B：新聞雙主播名人設定 (致敬 new1.jpg 新聞問題主播台) -->
        <div class="bg-arcade-panel border border-slate-700 rounded-2xl p-5 flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-slate-700 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">📺</span>
              <h3 class="text-base font-black text-blue-300">新聞問題雙主播名人設定 (致敬 new1.jpg)</h3>
            </div>

            <!-- 立即試播按鈕 -->
            <button
              @click="isPreviewNewsOpen = true"
              class="px-3.5 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-xs rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.5)] flex items-center gap-1.5"
            >
              <span>▶ 立即試播新聞主播台！</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- 左主播 (女主播) 設定 -->
            <div class="p-4 bg-slate-900/90 border border-slate-700 rounded-xl flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <div class="w-16 h-16 rounded-full border-2 border-yellow-400 overflow-hidden bg-slate-800 flex-shrink-0">
                  <img :src="characterStore.anchorPair.leftAnchorAvatar" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <div class="text-xs text-yellow-400 font-bold">左側主播 (原版女主播)</div>
                  <div class="text-sm font-black text-white">{{ characterStore.anchorPair.leftAnchorName }}</div>
                </div>
              </div>

              <div class="flex flex-col gap-1 text-xs">
                <label class="text-gray-400 font-bold">主播姓名：</label>
                <input
                  type="text"
                  v-model="anchorForm.leftAnchorName"
                  @change="saveAnchorChanges"
                  placeholder="如: 張雅琴 主播、陶晶瑩..."
                  class="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div class="flex flex-col gap-1 text-xs">
                <label class="text-gray-400 font-bold">頭像圖片網址 (URL)：</label>
                <input
                  type="text"
                  v-model="anchorForm.leftAnchorAvatar"
                  @change="saveAnchorChanges"
                  placeholder="貼上名人照片 URL..."
                  class="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div class="flex items-center justify-between text-[11px] text-gray-400">
                <span>或直接從本機上傳相片：</span>
                <label class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-yellow-300 rounded cursor-pointer border border-slate-600">
                  <span>檔案上傳</span>
                  <input type="file" accept="image/*" class="hidden" @change="e => handleAnchorImgUpload(e, 'left')" />
                </label>
              </div>
            </div>

            <!-- 右主播 (男主播) 設定 -->
            <div class="p-4 bg-slate-900/90 border border-slate-700 rounded-xl flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <div class="w-16 h-16 rounded-full border-2 border-yellow-400 overflow-hidden bg-slate-800 flex-shrink-0">
                  <img :src="characterStore.anchorPair.rightAnchorAvatar" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <div class="text-xs text-yellow-400 font-bold">右側特派 (原版評論員)</div>
                  <div class="text-sm font-black text-white">{{ characterStore.anchorPair.rightAnchorName }}</div>
                </div>
              </div>

              <div class="flex flex-col gap-1 text-xs">
                <label class="text-gray-400 font-bold">主播姓名：</label>
                <input
                  type="text"
                  v-model="anchorForm.rightAnchorName"
                  @change="saveAnchorChanges"
                  placeholder="如: 盛竹如 評論員、吳宗憲..."
                  class="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div class="flex flex-col gap-1 text-xs">
                <label class="text-gray-400 font-bold">頭像圖片網址 (URL)：</label>
                <input
                  type="text"
                  v-model="anchorForm.rightAnchorAvatar"
                  @change="saveAnchorChanges"
                  placeholder="貼上名人照片 URL..."
                  class="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div class="flex items-center justify-between text-[11px] text-gray-400">
                <span>或直接從本機上傳相片：</span>
                <label class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-yellow-300 rounded cursor-pointer border border-slate-600">
                  <span>檔案上傳</span>
                  <input type="file" accept="image/*" class="hidden" @change="e => handleAnchorImgUpload(e, 'right')" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 線上新增題目彈窗 -->
      <div v-if="isAddModalOpen" class="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
        <div class="bg-slate-900 border-2 border-arcade-yellow rounded-2xl p-5 max-w-lg w-full flex flex-col gap-4 text-xs font-mono shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 class="text-base font-black text-arcade-yellow">手動新增題庫</h3>
            <button @click="isAddModalOpen = false" class="text-gray-400 hover:text-white">✕</button>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="text-gray-400">學程階段:</label>
              <select v-model="newForm.stage" class="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white mt-1">
                <option value="國小">國小</option>
                <option value="國中">國中</option>
                <option value="高中">高中</option>
                <option value="大學">大學</option>
                <option value="通用">通用</option>
              </select>
            </div>
            <div>
              <label class="text-gray-400">學科分類:</label>
              <select v-model="newForm.subject" class="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white mt-1">
                <option value="國文">國文</option>
                <option value="數學">數學</option>
                <option value="自然">自然</option>
                <option value="社會">社會</option>
                <option value="流行音樂">流行音樂</option>
                <option value="體育運動">體育運動</option>
                <option value="時事冷知識">時事冷知識</option>
                <option value="藝能">藝能</option>
                <option value="課外">課外</option>
              </select>
            </div>
            <div>
              <label class="text-gray-400">難度評等:</label>
              <select v-model="newForm.difficulty" class="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white mt-1">
                <option value="簡單">簡單</option>
                <option value="普通">普通</option>
                <option value="困難">困難</option>
              </select>
            </div>
          </div>

          <div>
            <label class="text-gray-400">題幹內容:</label>
            <textarea 
              v-model="newForm.question" 
              rows="3" 
              placeholder="請輸入題目內容..." 
              class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white mt-1 focus:outline-none focus:border-arcade-yellow"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div v-for="idx in [0, 1, 2, 3]" :key="idx">
              <label class="text-gray-400 flex items-center justify-between">
                <span>選項 {{ ['A', 'B', 'C', 'D'][idx] }}:</span>
                <input 
                  type="radio" 
                  name="correctChoice" 
                  :value="idx" 
                  v-model="newForm.correctIndex" 
                  title="設為正確答案"
                />
              </label>
              <input 
                type="text" 
                v-model="newForm.options[idx]" 
                class="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white mt-1" 
                :placeholder="`輸入選項 ${['A', 'B', 'C', 'D'][idx]}...`"
              />
            </div>
          </div>

          <div>
            <label class="text-gray-400">答案解析 (選填):</label>
            <input 
              type="text" 
              v-model="newForm.explanation" 
              placeholder="答對後顯示的幽默解說..." 
              class="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white mt-1"
            />
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button @click="isAddModalOpen = false" class="px-3 py-1.5 bg-slate-800 text-gray-300 rounded font-bold">取消</button>
            <button @click="saveNewQuestion" class="px-4 py-1.5 bg-arcade-yellow text-black font-black rounded">確認新增</button>
          </div>
        </div>
      </div>

      <!-- 線上新增自訂名師彈窗 -->
      <div v-if="isAddTeacherModalOpen" class="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
        <div class="bg-slate-900 border-2 border-amber-400 rounded-2xl p-5 max-w-md w-full flex flex-col gap-4 text-xs font-mono shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 class="text-base font-black text-amber-300">新增自訂主考名師</h3>
            <button @click="isAddTeacherModalOpen = false" class="text-gray-400 hover:text-white">✕</button>
          </div>

          <div>
            <label class="text-gray-400 font-bold">名師姓名：</label>
            <input
              type="text"
              v-model="newTeacherForm.name"
              placeholder="如: 江戶川柯南、沈玉琳..."
              class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white mt-1"
            />
          </div>

          <div>
            <label class="text-gray-400 font-bold">頭銜職稱：</label>
            <input
              type="text"
              v-model="newTeacherForm.title"
              placeholder="如: 名譽客座教授、荒謬大師..."
              class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white mt-1"
            />
          </div>

          <div>
            <label class="text-gray-400 font-bold">名師相片 URL 或上傳：</label>
            <input
              type="text"
              v-model="newTeacherForm.avatarUrl"
              placeholder="貼上圖片 URL 或由右方上傳..."
              class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white mt-1"
            />
            <div class="mt-1 flex items-center justify-between text-[11px] text-gray-400">
              <span>或由本機檔案選取：</span>
              <label class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded cursor-pointer border border-slate-600">
                <span>選取檔案</span>
                <input type="file" accept="image/*" class="hidden" @change="handleNewTeacherImgUpload" />
              </label>
            </div>
          </div>

          <div>
            <label class="text-gray-400 font-bold">名師語錄或簡介：</label>
            <textarea
              v-model="newTeacherForm.description"
              rows="2"
              placeholder="如: 「真相永遠只有一個！請好好作答！」"
              class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white mt-1"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button @click="isAddTeacherModalOpen = false" class="px-3 py-1.5 bg-slate-800 text-gray-300 rounded font-bold">取消</button>
            <button @click="saveNewTeacher" class="px-4 py-1.5 bg-amber-400 text-slate-950 font-black rounded">確認儲存名師</button>
          </div>
        </div>
      </div>

      <!-- 新聞問題主播台即時試播彈窗 -->
      <NewsIntroModal 
        v-if="isPreviewNewsOpen" 
        :preview="true" 
        @close-preview="isPreviewNewsOpen = false" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file QuestionCMS.vue
 * @description 題庫與人物形象管理後台 (Question & Character CMS)
 * 整合 Excel/CSV 題庫管理與自訂名師／新聞雙主播名人圖片更換。
 */

import { ref, computed, onMounted } from 'vue';
import { useQuestionStore } from '../../stores/questionStore';
import { useCharacterStore } from '../../stores/characterStore';
import { QuestionItem, StageGrade, SubjectType, DifficultyType, TeacherProfile } from '../../types/quiz';
import { parseExcelFile, parseCSVText, parseJSONText, downloadExcelTemplate, exportToExcel } from '../../utils/questionParser';
import NewsIntroModal from '../game/NewsIntroModal.vue';

defineEmits<{
  (e: 'close'): void;
}>();

const questionStore = useQuestionStore();
const characterStore = useCharacterStore();

// 當前頁籤: 'questions' | 'characters'
const activeTab = ref<'questions' | 'characters'>('questions');

// 狀態控制
const searchQuery = ref<string>('');
const filterStage = ref<string>('ALL');
const filterSubject = ref<string>('ALL');
const overwriteOnImport = ref<boolean>(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const noticeMessage = ref<string>('');
const isNoticeError = ref<boolean>(false);

// 題目新增彈窗
const isAddModalOpen = ref<boolean>(false);
const newForm = ref<{
  stage: StageGrade;
  subject: SubjectType;
  difficulty: DifficultyType;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}>({
  stage: '國小',
  subject: '國文',
  difficulty: '普通',
  question: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  explanation: ''
});

// 名師新增彈窗
const isAddTeacherModalOpen = ref<boolean>(false);
const newTeacherForm = ref<{
  name: string;
  title: string;
  avatarUrl: string;
  description: string;
}>({
  name: '',
  title: '',
  avatarUrl: '',
  description: ''
});

// 新聞主播編輯表單
const anchorForm = ref({
  leftAnchorName: '',
  leftAnchorAvatar: '',
  rightAnchorName: '',
  rightAnchorAvatar: ''
});

// 新聞主播台即時試播預覽開關
const isPreviewNewsOpen = ref<boolean>(false);

onMounted(() => {
  anchorForm.value = {
    leftAnchorName: characterStore.anchorPair.leftAnchorName,
    leftAnchorAvatar: characterStore.anchorPair.leftAnchorAvatar,
    rightAnchorName: characterStore.anchorPair.rightAnchorName,
    rightAnchorAvatar: characterStore.anchorPair.rightAnchorAvatar
  };
});

/**
 * 依據搜尋詞與分類篩選題目
 */
const filteredQuestions = computed(() => {
  return questionStore.questions.filter((q) => {
    if (filterStage.value !== 'ALL' && q.stage !== filterStage.value) return false;
    if (filterSubject.value !== 'ALL' && q.subject !== filterSubject.value) return false;
    if (searchQuery.value.trim()) {
      const kw = searchQuery.value.toLowerCase().trim();
      const matchQ = q.question.toLowerCase().includes(kw);
      const matchOpt = q.options.some((opt) => opt.toLowerCase().includes(kw));
      const matchSub = q.subject.toLowerCase().includes(kw);
      if (!matchQ && !matchOpt && !matchSub) return false;
    }
    return true;
  });
});

function triggerFileInput(): void {
  fileInputRef.value?.click();
}

/**
 * 處理題庫檔案上傳
 */
async function handleFileUpload(e: Event): Promise<void> {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  const fileName = file.name.toLowerCase();

  let result;
  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    result = await parseExcelFile(file);
  } else if (fileName.endsWith('.csv')) {
    const text = await file.text();
    result = parseCSVText(text);
  } else if (fileName.endsWith('.json')) {
    const text = await file.text();
    result = parseJSONText(text);
  } else {
    showNotice('僅支援 .xlsx, .xls, .csv, .json 格式之題庫檔案', true);
    target.value = '';
    return;
  }

  if (result.success && result.data) {
    questionStore.importQuestions(result.data, overwriteOnImport.value);
    showNotice(`成功匯入 ${result.data.length} 筆題目！已即時寫入系統資料庫！`, false);
  } else {
    showNotice(`匯入失敗：${result.error}`, true);
  }

  target.value = '';
}

function downloadTemplate(): void {
  downloadExcelTemplate();
  showNotice('官方標準 Excel 題庫範本已開始下載！請依照格式填寫。', false);
}

function exportExcel(): void {
  exportToExcel(questionStore.questions);
  showNotice('當前題庫已成功匯出至 Excel 檔案！', false);
}

function deleteQuestion(id: string): void {
  if (confirm('確定要從題庫中刪除這道題目嗎？')) {
    questionStore.deleteQuestion(id);
    showNotice('題目已成功刪除。', false);
  }
}

function confirmResetQuestions(): void {
  if (confirm('確定要將題庫還原為官方經典預設資料嗎？自訂題庫將會被重設！')) {
    questionStore.resetToDefault();
    showNotice('題庫已成功重設還原為內建經典題庫！', false);
  }
}

function confirmResetCharacters(): void {
  if (confirm('確定要將名師陣容與主播設定還原為官方預設值嗎？')) {
    characterStore.resetToDefault();
    anchorForm.value = {
      leftAnchorName: characterStore.anchorPair.leftAnchorName,
      leftAnchorAvatar: characterStore.anchorPair.leftAnchorAvatar,
      rightAnchorName: characterStore.anchorPair.rightAnchorName,
      rightAnchorAvatar: characterStore.anchorPair.rightAnchorAvatar
    };
    showNotice('名師與新聞主播形象已成功還原為官方預設設定！', false);
  }
}

function openAddModal(): void {
  newForm.value = {
    stage: '國小',
    subject: '國文',
    difficulty: '普通',
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: ''
  };
  isAddModalOpen.value = true;
}

function saveNewQuestion(): void {
  const f = newForm.value;
  if (!f.question.trim()) {
    alert('請填寫題目內容！');
    return;
  }
  if (!f.options[0].trim() || !f.options[1].trim() || !f.options[2].trim() || !f.options[3].trim()) {
    alert('四個選項必須填寫完整！');
    return;
  }

  const newItem: QuestionItem = {
    id: `custom-manual-${Date.now()}`,
    stage: f.stage,
    subject: f.subject,
    difficulty: f.difficulty,
    question: f.question.trim(),
    options: [f.options[0].trim(), f.options[1].trim(), f.options[2].trim(), f.options[3].trim()],
    correctIndex: f.correctIndex,
    explanation: f.explanation.trim() || undefined,
    isCustom: true
  };

  questionStore.addQuestion(newItem);
  isAddModalOpen.value = false;
  showNotice('自訂題目新增成功！立即生效！', false);
}

/**
 * 儲存主播資料變更
 */
function saveAnchorChanges(): void {
  characterStore.updateAnchorPair({
    leftAnchorName: anchorForm.value.leftAnchorName.trim() || '張雅琴 主播',
    leftAnchorAvatar: anchorForm.value.leftAnchorAvatar.trim() || characterStore.anchorPair.leftAnchorAvatar,
    rightAnchorName: anchorForm.value.rightAnchorName.trim() || '盛竹如 評論員',
    rightAnchorAvatar: anchorForm.value.rightAnchorAvatar.trim() || characterStore.anchorPair.rightAnchorAvatar
  });
  showNotice('新聞主播名人設定已即時更新保存！', false);
}

/**
 * 上傳主播相片檔案轉換為 Data URL
 */
function handleAnchorImgUpload(e: Event, side: 'left' | 'right'): void {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      if (side === 'left') {
        anchorForm.value.leftAnchorAvatar = reader.result;
      } else {
        anchorForm.value.rightAnchorAvatar = reader.result;
      }
      saveAnchorChanges();
    }
  };
  reader.readAsDataURL(file);
  target.value = '';
}

/**
 * 上傳新名師相片檔案
 */
function handleNewTeacherImgUpload(e: Event): void {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      newTeacherForm.value.avatarUrl = reader.result;
    }
  };
  reader.readAsDataURL(file);
  target.value = '';
}

/**
 * 儲存新自訂名師
 */
function saveNewTeacher(): void {
  const f = newTeacherForm.value;
  if (!f.name.trim()) {
    alert('請填寫名師姓名！');
    return;
  }
  const newTeacher: TeacherProfile = {
    id: `custom-teacher-${Date.now()}`,
    name: f.name.trim(),
    title: f.title.trim() || '客座名師',
    avatarUrl: f.avatarUrl.trim() || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(f.name),
    description: f.description.trim() || '新加入的執教名師，將帶領大家衝破各大學程！',
    isCustom: true
  };

  characterStore.addOrUpdateTeacher(newTeacher);
  isAddTeacherModalOpen.value = false;
  newTeacherForm.value = { name: '', title: '', avatarUrl: '', description: '' };
  showNotice(`成功新增名師【${newTeacher.name}】並已設為執教名師！`, false);
}

function showNotice(msg: string, isError: boolean): void {
  noticeMessage.value = msg;
  isNoticeError.value = isError;
  setTimeout(() => {
    noticeMessage.value = '';
  }, 4000);
}
</script>
