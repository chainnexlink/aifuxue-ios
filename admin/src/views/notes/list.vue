<template>
  <div>
    <div class="page-header"><h2>笔记列表</h2>
      <div style="display:flex;gap:10px;">
        <el-button type="primary" icon="Plus" @click="openCreateDialog">创建笔记</el-button>
        <el-button icon="Download" :disabled="!selectedIds.length" @click="handleBatchExport">批量导出({{ selectedIds.length }})</el-button>
        <el-button type="danger" icon="Delete" :disabled="!selectedIds.length" @click="handleBatchDelete">批量删除</el-button>
      </div>
    </div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索笔记标题" prefix-icon="Search" style="width:240px;" clearable @input="handleFilter" />
      <el-select v-model="subjectFilter" placeholder="科目" clearable style="width:120px;" @change="handleFilter">
        <el-option v-for="s in subjects" :key="s" :label="s" :value="s" />
      </el-select>
      <el-select v-model="statusFilter" placeholder="状态" clearable style="width:120px;" @change="handleFilter">
        <el-option label="已完成" value="done" /><el-option label="处理中" value="processing" />
      </el-select>
      <el-select v-model="lockFilter" placeholder="锁定状态" clearable style="width:120px;" @change="handleFilter">
        <el-option label="已锁定" value="locked" /><el-option label="已解锁" value="unlocked" />
      </el-select>
      <el-button icon="Refresh" @click="resetFilter">重置</el-button>
    </div>
    <el-card shadow="never">
      <el-table :data="pagedNotes" stripe border @selection-change="handleSelChange" v-loading="loading">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" sortable />
        <el-table-column prop="title" label="笔记标题" show-overflow-tooltip min-width="200">
          <template #default="{ row }"><el-link type="primary" @click="$router.push(`/notes/detail/${row.id}`)">{{ row.title }}</el-link></template>
        </el-table-column>
        <el-table-column prop="user" label="用户" width="100">
          <template #default="{ row }"><el-link type="primary" @click="$router.push(`/user/detail/${row.userId}`)">{{ row.user }}</el-link></template>
        </el-table-column>
        <el-table-column prop="subject" label="科目" width="80"><template #default="{ row }"><el-tag size="small">{{ row.subject }}</el-tag></template></el-table-column>
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }"><el-tag :type="row.status === 'done' ? 'success' : 'warning'" size="small">{{ row.status === 'done' ? '已完成' : '处理中' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="锁定" width="80">
          <template #default="{ row }"><el-switch v-model="row.isLocked" size="small" @change="toggleLock(row)" /></template>
        </el-table-column>
        <el-table-column prop="wordCount" label="字数" width="80" />
        <el-table-column prop="viewCount" label="浏览" width="70" />
        <el-table-column prop="createdAt" label="创建时间" width="160" sortable />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/notes/detail/${row.id}`)">查看</el-button>
            <el-button type="success" link size="small" @click="handleExport(row)">导出</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:flex-end;margin-top:16px;">
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10,20,50]" :total="filteredNotes.length" layout="total, sizes, prev, pager, next" />
      </div>
    </el-card>

    <!-- 创建笔记弹窗 -->
    <el-dialog v-model="createVisible" title="创建笔记" width="600px">
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="标题"><el-input v-model="createForm.title" placeholder="笔记标题" /></el-form-item>
        <el-form-item label="科目"><el-select v-model="createForm.subject" style="width:100%;"><el-option v-for="s in subjects" :key="s" :label="s" :value="s" /></el-select></el-form-item>
        <el-form-item label="分类"><el-select v-model="createForm.category" style="width:100%;"><el-option v-for="c in categories" :key="c" :label="c" :value="c" /></el-select></el-form-item>
        <el-form-item label="指定用户"><el-input v-model="createForm.user" placeholder="用户昵称" /></el-form-item>
        <el-form-item label="内容"><el-input v-model="createForm.content" type="textarea" :rows="6" placeholder="支持Markdown格式" /></el-form-item>
        <el-form-item label="锁定"><el-switch v-model="createForm.isLocked" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreate">创建</el-button>
      </template>
    </el-dialog>

    <!-- 导出弹窗 -->
    <el-dialog v-model="exportVisible" title="导出笔记" width="420px">
      <el-form label-width="80px">
        <el-form-item label="笔记"><el-tag>{{ exportTarget?.title }}</el-tag></el-form-item>
        <el-form-item label="格式">
          <el-radio-group v-model="exportFormat">
            <el-radio-button value="pdf">PDF</el-radio-button>
            <el-radio-button value="md">Markdown</el-radio-button>
            <el-radio-button value="docx">Word</el-radio-button>
            <el-radio-button value="html">HTML</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="包含图片"><el-switch v-model="exportWithImages" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmExport">开始导出</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const loading = ref(false); const search = ref(''); const subjectFilter = ref(''); const statusFilter = ref(''); const lockFilter = ref('')
const page = ref(1); const pageSize = ref(10); const selectedIds = ref<number[]>([])
const subjects = ['语文','数学','英语','物理','化学','生物','历史','地理','政治']
const categories = ['课堂笔记','知识总结','公式大全','错题整理','考前复习']
const notes = ref(Array.from({ length: 50 }, (_, i) => ({
  id: i + 1, userId: (i % 10) + 1,
  title: ['高一数学·导数与极值','英语语法·虚拟语气','物理力学·自由落体','化学·氧化还原','语文·劝学翻译','数学·三角函数','英语·定语从句','物理·电磁感应','化学·离子方程式','语文·古文阅读'][i % 10],
  user: ['小明','小李','小王','小赵','小陈','小孙','小周','小吴','小郑','小钱'][i % 10],
  subject: subjects[i % subjects.length], category: categories[i % categories.length],
  status: i % 3 === 0 ? 'processing' : 'done' as string, isLocked: i % 4 === 0,
  wordCount: Math.floor(Math.random() * 2000) + 500, viewCount: Math.floor(Math.random() * 200) + 10,
  createdAt: `2026-0${(i % 4) + 1}-${String((i % 28) + 1).padStart(2, '0')} ${10 + (i % 12)}:${String(i * 7 % 60).padStart(2, '0')}`,
})))
const filteredNotes = computed(() => {
  let list = notes.value
  if (search.value) list = list.filter(n => n.title.includes(search.value))
  if (subjectFilter.value) list = list.filter(n => n.subject === subjectFilter.value)
  if (statusFilter.value) list = list.filter(n => n.status === statusFilter.value)
  if (lockFilter.value) list = list.filter(n => lockFilter.value === 'locked' ? n.isLocked : !n.isLocked)
  return list
})
const pagedNotes = computed(() => filteredNotes.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
function handleFilter() { page.value = 1 }
function resetFilter() { search.value = ''; subjectFilter.value = ''; statusFilter.value = ''; lockFilter.value = '' }
function handleSelChange(rows: any[]) { selectedIds.value = rows.map(r => r.id) }
function toggleLock(row: any) { ElMessage.success(`${row.title} 已${row.isLocked ? '锁定' : '解锁'}`) }

// 创建
const createVisible = ref(false)
const createForm = ref({ title: '', subject: '', category: '', user: '', content: '', isLocked: false })
function openCreateDialog() { createForm.value = { title: '', subject: '', category: '', user: '', content: '', isLocked: false }; createVisible.value = true }
function confirmCreate() {
  const newId = Math.max(...notes.value.map(n => n.id)) + 1
  notes.value.unshift({ id: newId, userId: 1, title: createForm.value.title, user: createForm.value.user || '管理员', subject: createForm.value.subject, category: createForm.value.category, status: 'done', isLocked: createForm.value.isLocked, wordCount: createForm.value.content.length, viewCount: 0, createdAt: new Date().toLocaleString() })
  createVisible.value = false; ElMessage.success('笔记创建成功')
}

// 导出
const exportVisible = ref(false); const exportTarget = ref<any>(null); const exportFormat = ref('pdf'); const exportWithImages = ref(true)
function handleExport(row: any) { exportTarget.value = row; exportFormat.value = 'pdf'; exportVisible.value = true }
function confirmExport() { exportVisible.value = false; ElMessage.success(`${exportTarget.value.title} 导出${exportFormat.value.toUpperCase()}成功`) }
function handleBatchExport() { ElMessage.success(`正在导出 ${selectedIds.value.length} 篇笔记...`) }

// 删除
function handleDelete(row: any) {
  ElMessageBox.confirm(`确定删除笔记 "${row.title}" 吗？`, '删除确认', { type: 'error' }).then(() => {
    notes.value = notes.value.filter(n => n.id !== row.id); ElMessage.success('删除成功')
  }).catch(() => {})
}
function handleBatchDelete() {
  ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 篇笔记吗？`, '批量删除', { type: 'error' }).then(() => {
    notes.value = notes.value.filter(n => !selectedIds.value.includes(n.id)); selectedIds.value = []; ElMessage.success('批量删除成功')
  }).catch(() => {})
}
</script>
