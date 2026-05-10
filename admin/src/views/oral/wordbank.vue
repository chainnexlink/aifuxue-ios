<template>
  <div>
    <div class="page-header"><h2>词库管理</h2><el-button type="primary" icon="Plus" @click="handleAdd">添加词条</el-button></div>
    <div class="stat-row">
      <el-card class="stat-card" shadow="hover"><span class="stat-value">3,260</span><span class="stat-label">总词条数</span></el-card>
      <el-card class="stat-card success" shadow="hover"><span class="stat-value">1,820</span><span class="stat-label">单词</span></el-card>
      <el-card class="stat-card warning" shadow="hover"><span class="stat-value">980</span><span class="stat-label">短语</span></el-card>
      <el-card class="stat-card purple" shadow="hover"><span class="stat-value">460</span><span class="stat-label">句子</span></el-card>
    </div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索单词/短语" prefix-icon="Search" style="width:200px;" clearable />
      <el-select v-model="levelF" placeholder="难度等级" clearable style="width:140px;">
        <el-option label="初级" value="beginner" /><el-option label="中级" value="intermediate" /><el-option label="高级" value="advanced" />
      </el-select>
      <el-select v-model="typeF" placeholder="类型" clearable style="width:120px;">
        <el-option label="单词" value="word" /><el-option label="短语" value="phrase" /><el-option label="句子" value="sentence" />
      </el-select>
    </div>
    <el-card shadow="never">
      <el-table :data="pagedData" stripe border @selection-change="(val: any[]) => selectedRows = val">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="word" label="单词/短语" width="160" />
        <el-table-column prop="phonetic" label="音标" width="140" />
        <el-table-column prop="translation" label="释义" min-width="200" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }"><el-tag size="small">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="level" label="难度" width="80">
          <template #default="{ row }">
            <el-tag :type="row.level === '初级' ? 'success' : row.level === '中级' ? 'warning' : 'danger'" size="small">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="practicedCount" label="练习次数" width="90" />
        <el-table-column prop="avgScore" label="平均分" width="80" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="info" link size="small" @click="handleListen(row)">试听</el-button>
            <el-button type="danger" link size="small" @click="handleDeleteWord(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
        <el-button type="danger" size="small" :disabled="!selectedRows.length" @click="handleBatchDelete">批量删除 ({{ selectedRows.length }})</el-button>
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="filteredWords.length" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" />
      </div>
    </el-card>

    <!-- 编辑/添加弹窗 -->
    <el-dialog v-model="editVisible" :title="editForm.id ? '编辑词条' : '添加词条'" width="500px">
      <el-form label-width="80px">
        <el-form-item label="单词"><el-input v-model="editForm.word" /></el-form-item>
        <el-form-item label="音标"><el-input v-model="editForm.phonetic" /></el-form-item>
        <el-form-item label="释义"><el-input v-model="editForm.translation" /></el-form-item>
        <el-form-item label="类型">
          <el-select v-model="editForm.type" style="width:100%;">
            <el-option label="单词" value="单词" /><el-option label="短语" value="短语" /><el-option label="句子" value="句子" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="editForm.level" style="width:100%;">
            <el-option label="初级" value="初级" /><el-option label="中级" value="中级" /><el-option label="高级" value="高级" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const search = ref(''); const levelF = ref(''); const typeF = ref('')
const page = ref(1); const pageSize = ref(10)
const selectedRows = ref<any[]>([])
const editVisible = ref(false)
const editForm = ref<any>({})
const handleAdd = () => {
  editForm.value = { id: 0, word: '', phonetic: '', translation: '', type: '单词', level: '中级' }
  editVisible.value = true
}
const handleEdit = (row: any) => {
  editForm.value = { ...row }
  editVisible.value = true
}
const saveEdit = () => {
  if (editForm.value.id) {
    const idx = words.value.findIndex(w => w.id === editForm.value.id)
    if (idx >= 0) Object.assign(words.value[idx], editForm.value)
    ElMessage.success('词条已更新')
  } else {
    words.value.push({ ...editForm.value, id: words.value.length + 1, practicedCount: 0, avgScore: 0 })
    ElMessage.success('词条已添加')
  }
  editVisible.value = false
}
const handleListen = (row: any) => {
  ElMessage.info(`正在播放「${row.word}」的发音...`)
}
const handleDeleteWord = (row: any) => {
  ElMessageBox.confirm(`确定删除词条「${row.word}」？`, '删除确认', { type: 'warning' }).then(() => {
    words.value = words.value.filter(w => w.id !== row.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定批量删除 ${selectedRows.value.length} 个词条？`, '批量删除', { type: 'error' }).then(() => {
    const ids = new Set(selectedRows.value.map(r => r.id))
    words.value = words.value.filter(w => !ids.has(w.id))
    selectedRows.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}
const levelMap: Record<string, string> = { beginner: '初级', intermediate: '中级', advanced: '高级' }
const typeMapFilter: Record<string, string> = { word: '单词', phrase: '短语', sentence: '句子' }
const words = ref([
  { id: 1, word: 'pronunciation', phonetic: '/prəˌnʌnsiˈeɪʃn/', translation: 'n. 发音', type: '单词', level: '中级', practicedCount: 856, avgScore: 72 },
  { id: 2, word: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/', translation: 'v. 承认，确认', type: '单词', level: '高级', practicedCount: 432, avgScore: 65 },
  { id: 3, word: 'look forward to', phonetic: '-', translation: '期待', type: '短语', level: '初级', practicedCount: 1230, avgScore: 85 },
  { id: 4, word: 'environment', phonetic: '/ɪnˈvaɪrənmənt/', translation: 'n. 环境', type: '单词', level: '中级', practicedCount: 678, avgScore: 78 },
  { id: 5, word: 'take into account', phonetic: '-', translation: '考虑到', type: '短语', level: '高级', practicedCount: 345, avgScore: 60 },
  { id: 6, word: 'opportunity', phonetic: '/ˌɒpəˈtjuːnɪti/', translation: 'n. 机会', type: '单词', level: '中级', practicedCount: 920, avgScore: 82 },
  { id: 7, word: 'How are you doing?', phonetic: '-', translation: '你最近怎么样？', type: '句子', level: '初级', practicedCount: 2100, avgScore: 90 },
  { id: 8, word: 'sophisticated', phonetic: '/səˈfɪstɪkeɪtɪd/', translation: 'adj. 复杂的，精密的', type: '单词', level: '高级', practicedCount: 210, avgScore: 55 },
])
const filteredWords = computed(() => {
  return words.value.filter(w => {
    if (search.value && !w.word.toLowerCase().includes(search.value.toLowerCase()) && !w.translation.includes(search.value)) return false
    if (levelF.value && w.level !== levelMap[levelF.value]) return false
    if (typeF.value && w.type !== typeMapFilter[typeF.value]) return false
    return true
  })
})
const pagedData = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredWords.value.slice(start, start + pageSize.value)
})
</script>
