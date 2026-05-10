<template>
  <div>
    <div class="page-header">
      <h2>官网内容管理</h2>
      <div style="display:flex;gap:12px;">
        <el-button type="success" icon="Refresh" @click="initContent">初始化默认内容</el-button>
        <el-button type="primary" icon="Plus" @click="openAdd">新增内容</el-button>
      </div>
    </div>

    <!-- Section 筛选 -->
    <el-card shadow="never" style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <span style="font-size:14px;color:#606266;">版块筛选：</span>
        <el-radio-group v-model="activeSection" @change="filterData">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button v-for="s in sectionOptions" :key="s.value" :label="s.value">{{ s.label }}</el-radio-button>
        </el-radio-group>
      </div>
    </el-card>

    <!-- 内容列表 -->
    <el-card shadow="never">
      <el-table :data="filteredData" stripe border>
        <el-table-column prop="section" label="版块" width="120">
          <template #default="{ row }">
            <el-tag size="small" :type="sectionTagType(row.section)">{{ sectionLabel(row.section) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="key" label="标识" width="150" />
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="{ row }">{{ row.title || '-' }}</template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="80" align="center" />
        <el-table-column prop="isActive" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'" size="small">{{ row.isActive ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="170">
          <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
            <el-button :type="row.isActive ? 'warning' : 'success'" link size="small" @click="toggleStatus(row)">{{ row.isActive ? '禁用' : '启用' }}</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="editing ? '编辑内容' : '新增内容'" width="700px" :close-on-click-modal="false">
      <el-form :model="form" label-width="80px">
        <el-form-item label="版块">
          <el-select v-model="form.section" style="width:100%;" :disabled="!!editing">
            <el-option v-for="s in sectionOptions" :key="s.value" :label="s.label" :value="s.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="标识Key">
          <el-input v-model="form.key" placeholder="英文标识，如 main, student1" :disabled="!!editing" />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="内容标题（可选）" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="内容JSON">
          <el-input v-model="form.contentStr" type="textarea" :rows="12" placeholder="输入JSON格式的内容数据" />
          <div v-if="jsonError" style="color:#f56c6c;font-size:12px;margin-top:4px;">{{ jsonError }}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const API_BASE = '/api/website'

const sectionOptions = [
  { value: 'hero', label: '首页Banner' },
  { value: 'stats', label: '数据统计' },
  { value: 'testimonials', label: '用户评价' },
  { value: 'features', label: '功能介绍' },
  { value: 'about', label: '关于我们' },
  { value: 'faq', label: '常见问题' },
  { value: 'help', label: '帮助文章' },
  { value: 'privacy', label: '隐私政策' },
  { value: 'agreement', label: '用户协议' },
]

function sectionLabel(section: string) {
  return sectionOptions.find(s => s.value === section)?.label || section
}

function sectionTagType(section: string): any {
  const map: Record<string, string> = { hero: 'primary', stats: 'success', testimonials: 'warning', features: '', about: 'info', faq: 'danger', help: '', privacy: 'info', agreement: 'info' }
  return map[section] || ''
}

const allData = ref<any[]>([])
const activeSection = ref('all')
const dialogVisible = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const jsonError = ref('')

const form = ref({
  section: 'hero',
  key: '',
  title: '',
  sortOrder: 0,
  contentStr: '{}',
})

const filteredData = computed(() => {
  if (activeSection.value === 'all') return allData.value
  return allData.value.filter(d => d.section === activeSection.value)
})

function formatTime(t: string) {
  if (!t) return '-'
  return new Date(t).toLocaleString('zh-CN')
}

async function loadData() {
  try {
    const res = await fetch(`${API_BASE}/admin/all`)
    const data = await res.json()
    // data 是按 section 分组的对象，展平为数组
    const flat: any[] = []
    for (const section in data) {
      for (const item of data[section]) {
        flat.push(item)
      }
    }
    allData.value = flat
  } catch (e) {
    console.error('加载失败', e)
  }
}

function openAdd() {
  editing.value = null
  form.value = { section: 'hero', key: '', title: '', sortOrder: 0, contentStr: '{}' }
  jsonError.value = ''
  dialogVisible.value = true
}

function openEdit(row: any) {
  editing.value = row
  form.value = {
    section: row.section,
    key: row.key,
    title: row.title || '',
    sortOrder: row.sortOrder,
    contentStr: JSON.stringify(row.content, null, 2),
  }
  jsonError.value = ''
  dialogVisible.value = true
}

async function handleSave() {
  // 验证 JSON
  let contentJson: any
  try {
    contentJson = JSON.parse(form.value.contentStr)
    jsonError.value = ''
  } catch {
    jsonError.value = 'JSON 格式错误，请检查'
    return
  }

  if (!form.value.section || !form.value.key) {
    ElMessage.warning('版块和标识不能为空')
    return
  }

  saving.value = true
  try {
    const res = await fetch(`${API_BASE}/admin/upsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: form.value.section,
        key: form.value.key,
        title: form.value.title || null,
        content: contentJson,
        sortOrder: form.value.sortOrder,
      }),
    })
    if (res.ok) {
      ElMessage.success('保存成功')
      dialogVisible.value = false
      await loadData()
    } else {
      ElMessage.error('保存失败')
    }
  } catch {
    ElMessage.error('网络错误')
  }
  saving.value = false
}

async function toggleStatus(row: any) {
  try {
    const res = await fetch(`${API_BASE}/admin/${row.id}/toggle`, { method: 'PUT' })
    if (res.ok) {
      row.isActive = !row.isActive
      ElMessage.success(row.isActive ? '已启用' : '已禁用')
    }
  } catch {
    ElMessage.error('操作失败')
  }
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(`确定删除 "${row.title || row.key}" ？`, '删除', { type: 'error' })
    const res = await fetch(`${API_BASE}/admin/${row.id}`, { method: 'DELETE' })
    if (res.ok) {
      allData.value = allData.value.filter(d => d.id !== row.id)
      ElMessage.success('已删除')
    }
  } catch { /* cancelled */ }
}

async function initContent() {
  try {
    await ElMessageBox.confirm('确定初始化默认内容？如果已有内容将跳过。', '初始化', { type: 'info' })
    const res = await fetch(`${API_BASE}/admin/init`, { method: 'POST' })
    const data = await res.json()
    ElMessage.success(data.message || '初始化完成')
    await loadData()
  } catch { /* cancelled */ }
}

function filterData() { /* 由 computed 自动处理 */ }

// 初始加载
loadData()
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  h2 { font-size: 20px; font-weight: 700; color: #303133; }
}
</style>
