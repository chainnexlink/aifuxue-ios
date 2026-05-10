<template>
  <div class="page">
    <div class="page-header">
      <h2>班级错题集管理</h2>
      <p>查看各班级作业批改后的自动错题汇总与分析</p>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="错题总数" :value="stats.totalMistakes" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="涉及班级" :value="stats.classCount" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="高频错题" :value="stats.hotMistakes" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="已生成巩固卷" :value="stats.consolidationCount" /></el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <div class="filter-bar">
        <el-input v-model="search" placeholder="搜索班级/作业名称" clearable style="width:240px" />
        <el-select v-model="filterSubject" placeholder="科目" clearable style="width:120px">
          <el-option label="数学" value="数学" />
          <el-option label="英语" value="英语" />
          <el-option label="语文" value="语文" />
          <el-option label="物理" value="物理" />
        </el-select>
        <el-select v-model="filterGrade" placeholder="年级" clearable style="width:120px">
          <el-option label="高一" value="高一" />
          <el-option label="高二" value="高二" />
          <el-option label="高三" value="高三" />
        </el-select>
      </div>

      <el-table :data="filteredList" stripe style="width:100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="className" label="班级" width="130" />
        <el-table-column prop="homeworkName" label="来源作业" min-width="180">
          <template #default="{ row }">
            <router-link :to="`/class-mistakes/detail/${row.id}`" class="link">{{ row.homeworkName }}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="subject" label="科目" width="80" />
        <el-table-column prop="mistakeCount" label="错题数" width="80" align="center" />
        <el-table-column label="平均错误率" width="130">
          <template #default="{ row }">
            <el-progress :percentage="row.avgErrorRate" :stroke-width="14" :color="row.avgErrorRate > 50 ? '#f56c6c' : row.avgErrorRate > 30 ? '#e6a23c' : '#67c23a'" />
          </template>
        </el-table-column>
        <el-table-column prop="hotCount" label="高频错题" width="90" align="center">
          <template #default="{ row }">
            <el-tag type="danger" size="small">{{ row.hotCount }}题</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="studentCount" label="涉及学生" width="90" align="center" />
        <el-table-column label="巩固卷" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.hasConsolidation ? 'success' : 'info'" size="small">{{ row.hasConsolidation ? '已生成' : '未生成' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="汇总时间" width="160" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="$router.push(`/class-mistakes/detail/${row.id}`)">详情</el-button>
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
const filterGrade = ref('')

const stats = ref({ totalMistakes: 832, classCount: 12, hotMistakes: 45, consolidationCount: 28 })

const mistakeList = ref([
  { id: 1, className: '高一2班数学', homeworkName: '第三章导数练习', subject: '数学', mistakeCount: 18, avgErrorRate: 42, hotCount: 5, studentCount: 32, hasConsolidation: true, createdAt: '2025-05-03 12:00' },
  { id: 2, className: '高一2班英语', homeworkName: '虚拟语气专项', subject: '英语', mistakeCount: 12, avgErrorRate: 28, hotCount: 3, studentCount: 40, hasConsolidation: true, createdAt: '2025-05-02 18:00' },
  { id: 3, className: '高一1班语文', homeworkName: '古诗词默写', subject: '语文', mistakeCount: 8, avgErrorRate: 22, hotCount: 2, studentCount: 28, hasConsolidation: false, createdAt: '2025-05-02 15:30' },
  { id: 4, className: '高一1班物理', homeworkName: '牛顿第二定律练习', subject: '物理', mistakeCount: 25, avgErrorRate: 56, hotCount: 8, studentCount: 35, hasConsolidation: true, createdAt: '2025-05-01 20:00' },
  { id: 5, className: '高二1班数学', homeworkName: '圆锥曲线单元测试', subject: '数学', mistakeCount: 30, avgErrorRate: 48, hotCount: 10, studentCount: 38, hasConsolidation: false, createdAt: '2025-04-30 16:00' },
])

const filteredList = computed(() => {
  return mistakeList.value.filter(item => {
    if (search.value && !item.className.includes(search.value) && !item.homeworkName.includes(search.value)) return false
    if (filterSubject.value && item.subject !== filterSubject.value) return false
    if (filterGrade.value && !item.className.includes(filterGrade.value)) return false
    return true
  })
})
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
