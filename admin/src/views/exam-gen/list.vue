<template>
  <div class="page">
    <div class="page-header">
      <h2>AI出卷管理</h2>
      <p>管理教师通过AI智能出卷生成的所有试卷</p>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="总出卷数" :value="stats.total" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="今日出卷" :value="stats.today" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="已发布" :value="stats.published" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="消耗AI额度" :value="stats.quotaUsed" /></el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <div class="filter-bar">
        <el-input v-model="search" placeholder="搜索试卷名称/教师" clearable style="width:240px" />
        <el-select v-model="filterSubject" placeholder="科目" clearable style="width:120px">
          <el-option label="数学" value="数学" />
          <el-option label="英语" value="英语" />
          <el-option label="语文" value="语文" />
          <el-option label="物理" value="物理" />
        </el-select>
        <el-select v-model="filterType" placeholder="试卷类型" clearable style="width:140px">
          <el-option label="课时练习" value="课时练习" />
          <el-option label="单元测试" value="单元测试" />
          <el-option label="期中模拟" value="期中模拟" />
          <el-option label="期末模拟" value="期末模拟" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width:120px">
          <el-option label="已发布" value="published" />
          <el-option label="未发布" value="draft" />
        </el-select>
      </div>

      <el-table :data="filteredList" stripe style="width:100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="试卷名称" min-width="180">
          <template #default="{ row }">
            <router-link :to="`/exam-gen/detail/${row.id}`" class="link">{{ row.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="teacher" label="出卷教师" width="100" />
        <el-table-column prop="subject" label="科目" width="80" />
        <el-table-column prop="type" label="试卷类型" width="100" />
        <el-table-column prop="paperCount" label="生成份数" width="90" align="center" />
        <el-table-column prop="questionCount" label="题目数" width="80" align="center" />
        <el-table-column prop="totalScore" label="总分" width="70" align="center" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">{{ row.status === 'published' ? '已发布' : '未发布' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="$router.push(`/exam-gen/detail/${row.id}`)">查看</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination background layout="total, prev, pager, next" :total="filteredList.length" :page-size="20" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const search = ref('')
const filterSubject = ref('')
const filterType = ref('')
const filterStatus = ref('')

const stats = ref({ total: 156, today: 8, published: 112, quotaUsed: 4680 })

const examList = ref([
  { id: 1, name: '第三章导数综合练习A/B/C卷', teacher: '张老师', subject: '数学', type: '课时练习', paperCount: 3, questionCount: 20, totalScore: 100, status: 'published', createdAt: '2025-05-03 10:30' },
  { id: 2, name: '虚拟语气专项测试A/B/C卷', teacher: '李老师', subject: '英语', type: '单元测试', paperCount: 3, questionCount: 25, totalScore: 100, status: 'published', createdAt: '2025-05-03 09:15' },
  { id: 3, name: '期中模拟试卷A/B/C卷', teacher: '王老师', subject: '数学', type: '期中模拟', paperCount: 3, questionCount: 30, totalScore: 150, status: 'draft', createdAt: '2025-05-02 16:40' },
  { id: 4, name: '古诗词鉴赏专题A/B/C卷', teacher: '赵老师', subject: '语文', type: '课时练习', paperCount: 3, questionCount: 15, totalScore: 100, status: 'published', createdAt: '2025-05-02 14:20' },
  { id: 5, name: '力学综合练习A/B/C卷', teacher: '钱老师', subject: '物理', type: '单元测试', paperCount: 3, questionCount: 20, totalScore: 100, status: 'draft', createdAt: '2025-05-01 11:00' },
])

const filteredList = computed(() => {
  return examList.value.filter(item => {
    if (search.value && !item.name.includes(search.value) && !item.teacher.includes(search.value)) return false
    if (filterSubject.value && item.subject !== filterSubject.value) return false
    if (filterType.value && item.type !== filterType.value) return false
    if (filterStatus.value && item.status !== filterStatus.value) return false
    return true
  })
})

function handleDelete(row: any) {
  console.log('delete', row.id)
}
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-header h2 { margin: 0 0 4px; font-size: 20px; }
.page-header p { margin: 0; color: #909399; font-size: 14px; }
.stat-row { margin-bottom: 16px; }
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
.link { color: #409eff; text-decoration: none; }
.link:hover { text-decoration: underline; }
</style>
