<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.back()">返回</el-button>
        <h2>成员管理</h2>
        <el-tag>{{ className }} - 共 {{ students.length }} 名学生</el-tag>
      </div>
      <div style="display:flex;gap:10px;">
        <el-button type="danger" icon="Delete" :disabled="!selectedIds.length" @click="handleBatchRemove">批量移除({{ selectedIds.length }})</el-button>
      </div>
    </div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索学生昵称/手机号" prefix-icon="Search" style="width:240px;" clearable @input="handleFilter" />
      <el-button icon="Refresh" @click="search = ''">重置</el-button>
    </div>
    <el-card shadow="never">
      <el-table :data="pagedList" stripe border @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" sortable />
        <el-table-column prop="nickname" label="学生昵称" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="$router.push(`/user/detail/${row.userId}`)">{{ row.nickname }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="gradeLevel" label="学段" width="80">
          <template #default="{ row }"><el-tag size="small" type="info">{{ row.gradeLevel }}</el-tag></template>
        </el-table-column>
        <el-table-column label="作业完成率" width="160">
          <template #default="{ row }">
            <el-progress :percentage="row.completionRate" :stroke-width="6" :color="row.completionRate >= 80 ? '#67c23a' : row.completionRate >= 60 ? '#e6a23c' : '#f56c6c'" />
          </template>
        </el-table-column>
        <el-table-column label="平均分" width="80">
          <template #default="{ row }"><span style="font-weight:600;">{{ row.avgScore }}</span></template>
        </el-table-column>
        <el-table-column prop="submittedCount" label="已提交" width="80" />
        <el-table-column prop="joinedAt" label="加入时间" width="160" sortable />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link size="small" @click="handleRemove(row)">移除</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref<number[]>([])
const className = ref('初三数学提高班')

interface Student {
  id: number; userId: number; nickname: string; phone: string; gradeLevel: string;
  completionRate: number; avgScore: number; submittedCount: number; joinedAt: string;
}

const students = ref<Student[]>(Array.from({ length: 32 }, (_, i) => ({
  id: i + 1, userId: 100 + i, nickname: `学生${i + 1}`, phone: `139${String(10000000 + i).slice(0, 8)}`,
  gradeLevel: '初三', completionRate: 40 + Math.floor(Math.random() * 60),
  avgScore: 50 + Math.floor(Math.random() * 45), submittedCount: 5 + Math.floor(Math.random() * 8),
  joinedAt: `2025-03-${String(15 + (i % 15)).padStart(2, '0')} ${10 + (i % 12)}:00`,
})))

const filtered = computed(() => {
  if (!search.value) return students.value
  return students.value.filter(s => s.nickname.includes(search.value) || s.phone.includes(search.value))
})

const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function handleFilter() { page.value = 1 }
function handleSelectionChange(rows: Student[]) { selectedIds.value = rows.map(r => r.id) }

function handleRemove(row: Student) {
  ElMessageBox.confirm(`确定将 ${row.nickname} 移出班级？`, '移除确认', { type: 'warning' }).then(() => {
    students.value = students.value.filter(s => s.id !== row.id)
    ElMessage.success('已移除')
  }).catch(() => {})
}

function handleBatchRemove() {
  ElMessageBox.confirm(`确定移除选中的 ${selectedIds.value.length} 名学生？`, '批量移除', { type: 'warning' }).then(() => {
    students.value = students.value.filter(s => !selectedIds.value.includes(s.id))
    selectedIds.value = []
    ElMessage.success('批量移除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 700; margin: 0; }
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; }
</style>
