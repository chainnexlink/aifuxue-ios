<template>
  <div>
    <div class="page-header">
      <h2>邀请码列表</h2>
      <div style="display:flex;gap:10px;">
        <el-button type="primary" icon="Plus" @click="showGenerateDialog = true">批量生成</el-button>
        <el-button icon="Download" @click="handleExport">导出</el-button>
        <el-button type="danger" icon="Delete" :disabled="!selectedIds.length" @click="handleBatchDelete">批量删除({{ selectedIds.length }})</el-button>
      </div>
    </div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索邀请码" prefix-icon="Search" style="width:240px;" clearable @input="handleFilter" />
      <el-select v-model="filterType" placeholder="类型" clearable style="width:140px;" @change="handleFilter">
        <el-option label="教师码" value="teacher" />
        <el-option label="用户码" value="user" />
      </el-select>
      <el-select v-model="filterStatus" placeholder="状态" clearable style="width:120px;" @change="handleFilter">
        <el-option label="未使用" value="unused" />
        <el-option label="已使用" value="used" />
        <el-option label="已过期" value="expired" />
      </el-select>
      <el-button icon="Refresh" @click="resetFilter">重置</el-button>
    </div>

    <el-row :gutter="16" style="margin-bottom:20px;">
      <el-col :span="6"><div class="stat-card" style="border-left:4px solid #409eff;"><div class="sc-num">{{ totalCount }}</div><div class="sc-label">总邀请码</div></div></el-col>
      <el-col :span="6"><div class="stat-card" style="border-left:4px solid #67c23a;"><div class="sc-num">{{ usedCount }}</div><div class="sc-label">已使用</div></div></el-col>
      <el-col :span="6"><div class="stat-card" style="border-left:4px solid #e6a23c;"><div class="sc-num">{{ unusedCount }}</div><div class="sc-label">未使用</div></div></el-col>
      <el-col :span="6"><div class="stat-card" style="border-left:4px solid #f56c6c;"><div class="sc-num">{{ expiredCount }}</div><div class="sc-label">已过期</div></div></el-col>
    </el-row>

    <el-card shadow="never">
      <el-table :data="pagedList" stripe border @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" sortable />
        <el-table-column prop="code" label="邀请码" width="180">
          <template #default="{ row }">
            <code style="font-weight:600;letter-spacing:1px;" :style="{ color: row.type === 'teacher' ? '#409eff' : '#a78bfa' }">{{ row.code }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }"><el-tag :type="row.type === 'teacher' ? 'primary' : ''" size="small">{{ row.type === 'teacher' ? '教师码' : '用户码' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="赠送天数" width="100">
          <template #default="{ row }"><el-tag type="warning" size="small">{{ row.vipDays }}天体验</el-tag></template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'used' ? 'success' : row.status === 'expired' ? 'danger' : 'info'" size="small">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建者" width="100" />
        <el-table-column prop="usedByName" label="使用者" width="100">
          <template #default="{ row }">
            <el-link v-if="row.usedByName" type="primary" @click="$router.push(`/user/detail/${row.usedById}`)">{{ row.usedByName }}</el-link>
            <span v-else style="color:#c0c4cc;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" sortable />
        <el-table-column prop="usedAt" label="使用时间" width="160">
          <template #default="{ row }"><span>{{ row.usedAt || '-' }}</span></template>
        </el-table-column>
        <el-table-column prop="expireAt" label="过期时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'unused'" type="warning" link size="small" @click="handleDisable(row)">禁用</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:16px;display:flex;justify-content:flex-end;">
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="filtered.length" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next" background />
      </div>
    </el-card>

    <el-dialog v-model="showGenerateDialog" title="批量生成邀请码" width="480px">
      <el-form label-width="100px">
        <el-form-item label="邀请码类型">
          <el-radio-group v-model="genForm.type">
            <el-radio value="teacher">教师码 (TEACHER-XXXXXX)</el-radio>
            <el-radio value="user">用户码 (USER-XXXXXX)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生成数量">
          <el-input-number v-model="genForm.count" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="赠送体验天数">
          <el-input-number v-model="genForm.vipDays" :min="1" :max="365" />
          <span style="margin-left:8px;color:#909399;font-size:13px;">教师码默认30天，用户码默认7天</span>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker v-model="genForm.expireAt" type="date" placeholder="选择过期日期" style="width:100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showGenerateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleGenerate">生成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const search = ref('')
const filterType = ref('')
const filterStatus = ref('')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref<number[]>([])

interface InviteCode {
  id: number; code: string; type: 'teacher' | 'user'; vipDays: number;
  status: 'unused' | 'used' | 'expired'; creatorName: string;
  usedByName: string; usedById: number | null; createdAt: string; usedAt: string; expireAt: string;
}

const mockList: InviteCode[] = Array.from({ length: 50 }, (_, i) => {
  const isTeacher = i % 3 === 0
  const status = (['unused', 'used', 'expired'] as const)[i % 3]
  return {
    id: i + 1,
    code: isTeacher ? `TEACHER-${String.fromCharCode(65 + (i % 26))}${Math.random().toString(36).slice(2, 7).toUpperCase()}` : `USER-${String.fromCharCode(65 + (i % 26))}${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    type: isTeacher ? 'teacher' : 'user',
    vipDays: isTeacher ? 30 : 7,
    status,
    creatorName: isTeacher ? ['张老师', '李老师', '王老师'][i % 3] : '系统',
    usedByName: status === 'used' ? `学生${i}` : '',
    usedById: status === 'used' ? 100 + i : null,
    createdAt: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:00`,
    usedAt: status === 'used' ? `2025-0${(i % 9) + 1}-${String((i % 28) + 2).padStart(2, '0')} 14:00` : '',
    expireAt: `2025-12-31 23:59`,
  }
})

const list = ref<InviteCode[]>(mockList)

const totalCount = computed(() => list.value.length)
const usedCount = computed(() => list.value.filter(c => c.status === 'used').length)
const unusedCount = computed(() => list.value.filter(c => c.status === 'unused').length)
const expiredCount = computed(() => list.value.filter(c => c.status === 'expired').length)

const filtered = computed(() => {
  return list.value.filter(c => {
    if (search.value && !c.code.includes(search.value.toUpperCase())) return false
    if (filterType.value && c.type !== filterType.value) return false
    if (filterStatus.value && c.status !== filterStatus.value) return false
    return true
  })
})

const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function statusText(s: string) { return s === 'used' ? '已使用' : s === 'expired' ? '已过期' : '未使用' }

function handleFilter() { page.value = 1 }
function resetFilter() { search.value = ''; filterType.value = ''; filterStatus.value = ''; page.value = 1 }
function handleSelectionChange(rows: InviteCode[]) { selectedIds.value = rows.map(r => r.id) }

const showGenerateDialog = ref(false)
const genForm = ref({ type: 'teacher' as 'teacher' | 'user', count: 10, vipDays: 30, expireAt: '' })

function handleGenerate() {
  const prefix = genForm.value.type === 'teacher' ? 'TEACHER-' : 'USER-'
  for (let i = 0; i < genForm.value.count; i++) {
    list.value.unshift({
      id: list.value.length + i + 1,
      code: `${prefix}${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      type: genForm.value.type,
      vipDays: genForm.value.vipDays,
      status: 'unused',
      creatorName: '管理员',
      usedByName: '', usedById: null,
      createdAt: new Date().toLocaleString(),
      usedAt: '', expireAt: genForm.value.expireAt || '2025-12-31 23:59',
    })
  }
  showGenerateDialog.value = false
  ElMessage.success(`已生成 ${genForm.value.count} 个邀请码`)
}

function handleDisable(row: InviteCode) {
  ElMessageBox.confirm(`确定禁用邀请码 ${row.code}？`, '禁用确认', { type: 'warning' }).then(() => {
    row.status = 'expired'
    ElMessage.success('已禁用')
  }).catch(() => {})
}

function handleDelete(row: InviteCode) {
  ElMessageBox.confirm(`确定删除邀请码 ${row.code}？`, '删除确认', { type: 'warning' }).then(() => {
    list.value = list.value.filter(c => c.id !== row.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

function handleBatchDelete() {
  ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 个邀请码？`, '批量删除', { type: 'warning' }).then(() => {
    list.value = list.value.filter(c => !selectedIds.value.includes(c.id))
    selectedIds.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}

function handleExport() { ElMessage.success('导出成功') }
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 700; }
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.stat-card { background: #fff; padding: 20px; border-radius: 8px; }
.sc-num { font-size: 28px; font-weight: 700; color: #303133; }
.sc-label { font-size: 13px; color: #909399; margin-top: 4px; }
</style>
