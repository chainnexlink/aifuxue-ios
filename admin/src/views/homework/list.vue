<template>
  <div>
    <div class="page-header">
      <h2>作业列表</h2>
      <div style="display:flex;gap:10px;">
        <el-button icon="Download" @click="handleExport">导出</el-button>
        <el-button type="danger" icon="Delete" :disabled="!selectedIds.length" @click="handleBatchDelete">批量删除({{ selectedIds.length }})</el-button>
      </div>
    </div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索作业名称" prefix-icon="Search" style="width:240px;" clearable @input="handleFilter" />
      <el-select v-model="filterType" placeholder="作业类型" clearable style="width:120px;" @change="handleFilter">
        <el-option label="在线" value="online" />
        <el-option label="离线" value="offline" />
      </el-select>
      <el-select v-model="filterStatus" placeholder="状态" clearable style="width:120px;" @change="handleFilter">
        <el-option label="收集中" value="collecting" />
        <el-option label="批改中" value="grading" />
        <el-option label="已完成" value="completed" />
      </el-select>
      <el-select v-model="filterTeacher" placeholder="教师" clearable filterable style="width:140px;" @change="handleFilter">
        <el-option v-for="t in teachers" :key="t" :label="t" :value="t" />
      </el-select>
      <el-button icon="Refresh" @click="resetFilter">重置</el-button>
    </div>

    <el-row :gutter="16" style="margin-bottom:20px;">
      <el-col :span="6"><div class="stat-card" style="border-left:4px solid #409eff;"><div class="sc-num">{{ totalCount }}</div><div class="sc-label">总作业数</div></div></el-col>
      <el-col :span="6"><div class="stat-card" style="border-left:4px solid #e6a23c;"><div class="sc-num">{{ collectingCount }}</div><div class="sc-label">收集中</div></div></el-col>
      <el-col :span="6"><div class="stat-card" style="border-left:4px solid #f56c6c;"><div class="sc-num">{{ gradingCount }}</div><div class="sc-label">批改中</div></div></el-col>
      <el-col :span="6"><div class="stat-card" style="border-left:4px solid #67c23a;"><div class="sc-num">{{ completedCount }}</div><div class="sc-label">已完成</div></div></el-col>
    </el-row>

    <el-card shadow="never">
      <el-table :data="pagedList" stripe border @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" sortable />
        <el-table-column prop="name" label="作业名称" min-width="200">
          <template #default="{ row }">
            <el-link type="primary" @click="goDetail(row.id)">{{ row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="教师" width="100" />
        <el-table-column prop="className" label="班级" width="160" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }"><el-tag :type="row.type === 'online' ? 'primary' : 'warning'" size="small">{{ row.type === 'online' ? '在线' : '离线' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="提交进度" width="160">
          <template #default="{ row }">
            <el-progress :percentage="Math.round(row.submitted / row.total * 100)" :format="() => `${row.submitted}/${row.total}`" :stroke-width="6" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止时间" width="160" sortable />
        <el-table-column prop="createdAt" label="发布时间" width="160" sortable />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="goDetail(row.id)">详情</el-button>
            <el-button type="success" link size="small" @click="goGradeReview(row.id)">批改概览</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:16px;display:flex;justify-content:flex-end;">
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="filtered.length" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next" background />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const search = ref('')
const filterType = ref('')
const filterStatus = ref('')
const filterTeacher = ref('')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref<number[]>([])

const teachers = ['张老师', '李老师', '王老师', '赵老师', '刘老师']

interface Homework {
  id: number; name: string; teacherName: string; className: string; type: 'online' | 'offline';
  submitted: number; total: number; status: 'collecting' | 'grading' | 'completed';
  deadline: string; createdAt: string;
}

const mockList: Homework[] = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  name: ['一元二次方程练习', '期中模拟试卷', '课文阅读理解', '英语语法填空', '化学反应方程式', '历史事件梳理'][i % 6],
  teacherName: teachers[i % 5],
  className: ['初三数学提高班', '初二英语基础班', '高一物理冲刺班', '初三语文强化班'][i % 4],
  type: (i % 3 === 0 ? 'offline' : 'online') as 'online' | 'offline',
  submitted: 10 + Math.floor(Math.random() * 25),
  total: 30 + Math.floor(Math.random() * 10),
  status: (['collecting', 'grading', 'completed'] as const)[i % 3],
  deadline: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 23:59`,
  createdAt: `2025-0${(i % 9) + 1}-${String((i % 25) + 1).padStart(2, '0')} 10:00`,
}))

const list = ref<Homework[]>(mockList)

const totalCount = computed(() => list.value.length)
const collectingCount = computed(() => list.value.filter(h => h.status === 'collecting').length)
const gradingCount = computed(() => list.value.filter(h => h.status === 'grading').length)
const completedCount = computed(() => list.value.filter(h => h.status === 'completed').length)

const filtered = computed(() => {
  return list.value.filter(h => {
    if (search.value && !h.name.includes(search.value)) return false
    if (filterType.value && h.type !== filterType.value) return false
    if (filterStatus.value && h.status !== filterStatus.value) return false
    if (filterTeacher.value && h.teacherName !== filterTeacher.value) return false
    return true
  })
})

const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function statusType(s: string) { return s === 'collecting' ? '' : s === 'grading' ? 'warning' : 'success' }
function statusText(s: string) { return s === 'collecting' ? '收集中' : s === 'grading' ? '批改中' : '已完成' }

function handleFilter() { page.value = 1 }
function resetFilter() { search.value = ''; filterType.value = ''; filterStatus.value = ''; filterTeacher.value = ''; page.value = 1 }
function handleSelectionChange(rows: Homework[]) { selectedIds.value = rows.map(r => r.id) }
function goDetail(id: number) { router.push(`/homework/detail/${id}`) }
function goGradeReview(id: number) { router.push(`/homework/grade-review/${id}`) }

function handleDelete(row: Homework) {
  ElMessageBox.confirm(`确定删除作业 ${row.name}？`, '删除确认', { type: 'warning' }).then(() => {
    list.value = list.value.filter(h => h.id !== row.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

function handleBatchDelete() {
  ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 份作业？`, '批量删除', { type: 'warning' }).then(() => {
    list.value = list.value.filter(h => !selectedIds.value.includes(h.id))
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
