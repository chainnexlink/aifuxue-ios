<template>
  <div>
    <div class="page-header">
      <h2>教师认证列表</h2>
      <div style="display:flex;gap:10px;">
        <el-button icon="Download" @click="handleExport">导出</el-button>
        <el-button type="danger" icon="Delete" :disabled="!selectedIds.length" @click="handleBatchDelete">批量删除({{ selectedIds.length }})</el-button>
      </div>
    </div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索教师姓名/手机号" prefix-icon="Search" style="width:240px;" clearable @input="handleFilter" />
      <el-select v-model="filterStatus" placeholder="认证状态" clearable style="width:140px;" @change="handleFilter">
        <el-option label="待审核" value="pending" />
        <el-option label="已通过" value="approved" />
        <el-option label="已拒绝" value="rejected" />
      </el-select>
      <el-select v-model="filterSubject" placeholder="学科" clearable style="width:120px;" @change="handleFilter">
        <el-option v-for="s in subjects" :key="s" :label="s" :value="s" />
      </el-select>
      <el-button icon="Refresh" @click="resetFilter">重置</el-button>
    </div>
    <el-card shadow="never">
      <el-table :data="pagedList" stripe border @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" sortable />
        <el-table-column prop="teacherName" label="教师姓名" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="goDetail(row.id)">{{ row.teacherName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="school" label="学校" width="160" />
        <el-table-column prop="subject" label="学科" width="100">
          <template #default="{ row }"><el-tag size="small">{{ row.subject }}</el-tag></template>
        </el-table-column>
        <el-table-column label="认证状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="班级数" width="80">
          <template #default="{ row }">{{ row.classCount }}</template>
        </el-table-column>
        <el-table-column label="学生数" width="80">
          <template #default="{ row }">{{ row.studentCount }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="160" sortable />
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="goDetail(row.id)">详情</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleApprove(row)">通过</el-button>
            <el-button v-if="row.status === 'pending'" type="danger" link size="small" @click="handleReject(row)">拒绝</el-button>
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
const filterStatus = ref('')
const filterSubject = ref('')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref<number[]>([])

const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理']

interface Teacher {
  id: number; teacherName: string; phone: string; school: string; subject: string;
  status: 'pending' | 'approved' | 'rejected'; classCount: number; studentCount: number;
  createdAt: string; certificateUrl: string;
}

const mockTeachers: Teacher[] = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  teacherName: ['张老师', '李老师', '王老师', '赵老师', '刘老师', '陈老师'][i % 6],
  phone: `138${String(10000000 + i).slice(0, 8)}`,
  school: ['北京市第一中学', '上海市实验中学', '广州市育才中学', '深圳市外国语学校'][i % 4],
  subject: subjects[i % 9],
  status: (['pending', 'approved', 'rejected'] as const)[i % 3],
  classCount: Math.floor(Math.random() * 5),
  studentCount: Math.floor(Math.random() * 120),
  createdAt: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:30`,
  certificateUrl: '',
}))

const list = ref<Teacher[]>(mockTeachers)

const filtered = computed(() => {
  return list.value.filter(t => {
    if (search.value && !t.teacherName.includes(search.value) && !t.phone.includes(search.value)) return false
    if (filterStatus.value && t.status !== filterStatus.value) return false
    if (filterSubject.value && t.subject !== filterSubject.value) return false
    return true
  })
})

const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function statusType(s: string) { return s === 'approved' ? 'success' : s === 'rejected' ? 'danger' : 'warning' }
function statusText(s: string) { return s === 'approved' ? '已通过' : s === 'rejected' ? '已拒绝' : '待审核' }

function handleFilter() { page.value = 1 }
function resetFilter() { search.value = ''; filterStatus.value = ''; filterSubject.value = ''; page.value = 1 }
function handleSelectionChange(rows: Teacher[]) { selectedIds.value = rows.map(r => r.id) }
function goDetail(id: number) { router.push(`/teacher/detail/${id}`) }

function handleApprove(row: Teacher) {
  ElMessageBox.confirm(`确定通过 ${row.teacherName} 的教师认证？`, '审核确认', { type: 'success' }).then(() => {
    row.status = 'approved'
    ElMessage.success('已通过认证')
  }).catch(() => {})
}

function handleReject(row: Teacher) {
  ElMessageBox.prompt('请输入拒绝原因', '拒绝认证', { type: 'warning', inputPattern: /.+/, inputErrorMessage: '请输入拒绝原因' }).then(() => {
    row.status = 'rejected'
    ElMessage.info('已拒绝认证')
  }).catch(() => {})
}

function handleDelete(row: Teacher) {
  ElMessageBox.confirm(`确定删除教师 ${row.teacherName}？`, '删除确认', { type: 'warning' }).then(() => {
    list.value = list.value.filter(t => t.id !== row.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

function handleBatchDelete() {
  ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 条记录？`, '批量删除', { type: 'warning' }).then(() => {
    list.value = list.value.filter(t => !selectedIds.value.includes(t.id))
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
</style>
