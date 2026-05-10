<template>
  <div>
    <div class="page-header">
      <h2>班级列表</h2>
      <div style="display:flex;gap:10px;">
        <el-button icon="Download" @click="handleExport">导出</el-button>
        <el-button type="danger" icon="Delete" :disabled="!selectedIds.length" @click="handleBatchDelete">批量删除({{ selectedIds.length }})</el-button>
      </div>
    </div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索班级名称/邀请码" prefix-icon="Search" style="width:240px;" clearable @input="handleFilter" />
      <el-select v-model="filterGrade" placeholder="年级" clearable style="width:120px;" @change="handleFilter">
        <el-option v-for="g in grades" :key="g" :label="g" :value="g" />
      </el-select>
      <el-select v-model="filterSubject" placeholder="科目" clearable style="width:120px;" @change="handleFilter">
        <el-option v-for="s in subjects" :key="s" :label="s" :value="s" />
      </el-select>
      <el-select v-model="filterStatus" placeholder="状态" clearable style="width:120px;" @change="handleFilter">
        <el-option label="活跃" value="active" />
        <el-option label="已归档" value="archived" />
      </el-select>
      <el-button icon="Refresh" @click="resetFilter">重置</el-button>
    </div>
    <el-card shadow="never">
      <el-table :data="pagedList" stripe border @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" sortable />
        <el-table-column prop="name" label="班级名称" width="180">
          <template #default="{ row }">
            <el-link type="primary" @click="goDetail(row.id)">{{ row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="教师" width="100" />
        <el-table-column prop="grade" label="年级" width="100">
          <template #default="{ row }"><el-tag size="small" type="info">{{ row.grade }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="subject" label="科目" width="80">
          <template #default="{ row }"><el-tag size="small">{{ row.subject }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="inviteCode" label="邀请码" width="150">
          <template #default="{ row }"><code style="color:#409eff;font-weight:600;">{{ row.inviteCode }}</code></template>
        </el-table-column>
        <el-table-column prop="studentCount" label="学生数" width="80" sortable />
        <el-table-column prop="homeworkCount" label="作业数" width="80" sortable />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '活跃' : '归档' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" sortable />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="goDetail(row.id)">详情</el-button>
            <el-button type="primary" link size="small" @click="goMembers(row.id)">成员</el-button>
            <el-button v-if="row.status === 'active'" type="warning" link size="small" @click="handleArchive(row)">归档</el-button>
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
const filterGrade = ref('')
const filterSubject = ref('')
const filterStatus = ref('')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref<number[]>([])

const grades = ['小一', '小二', '小三', '小四', '小五', '小六', '初一', '初二', '初三', '高一', '高二', '高三']
const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理']

interface ClassItem {
  id: number; name: string; teacherName: string; grade: string; subject: string;
  inviteCode: string; studentCount: number; homeworkCount: number;
  status: 'active' | 'archived'; createdAt: string;
}

const mockClasses: ClassItem[] = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  name: `${grades[i % 12]}${subjects[i % 9]}${['基础班', '提高班', '冲刺班'][i % 3]}`,
  teacherName: ['张老师', '李老师', '王老师', '赵老师'][i % 4],
  grade: grades[i % 12],
  subject: subjects[i % 9],
  inviteCode: `CLASS-${String.fromCharCode(65 + (i % 26))}${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
  studentCount: 15 + Math.floor(Math.random() * 30),
  homeworkCount: Math.floor(Math.random() * 20),
  status: (i % 5 === 0 ? 'archived' : 'active') as 'active' | 'archived',
  createdAt: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 14:00`,
}))

const list = ref<ClassItem[]>(mockClasses)

const filtered = computed(() => {
  return list.value.filter(c => {
    if (search.value && !c.name.includes(search.value) && !c.inviteCode.includes(search.value)) return false
    if (filterGrade.value && c.grade !== filterGrade.value) return false
    if (filterSubject.value && c.subject !== filterSubject.value) return false
    if (filterStatus.value && c.status !== filterStatus.value) return false
    return true
  })
})

const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function handleFilter() { page.value = 1 }
function resetFilter() { search.value = ''; filterGrade.value = ''; filterSubject.value = ''; filterStatus.value = ''; page.value = 1 }
function handleSelectionChange(rows: ClassItem[]) { selectedIds.value = rows.map(r => r.id) }
function goDetail(id: number) { router.push(`/class/detail/${id}`) }
function goMembers(id: number) { router.push(`/class/detail/${id}/members`) }

function handleArchive(row: ClassItem) {
  ElMessageBox.confirm(`确定归档班级 ${row.name}？`, '归档确认', { type: 'warning' }).then(() => {
    row.status = 'archived'
    ElMessage.success('已归档')
  }).catch(() => {})
}

function handleDelete(row: ClassItem) {
  ElMessageBox.confirm(`确定删除班级 ${row.name}？此操作不可撤销`, '删除确认', { type: 'warning' }).then(() => {
    list.value = list.value.filter(c => c.id !== row.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

function handleBatchDelete() {
  ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 个班级？`, '批量删除', { type: 'warning' }).then(() => {
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
</style>
