<template>
  <div>
    <div class="page-header"><h2>学习报告</h2></div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索用户" prefix-icon="Search" style="width:200px;" clearable />
      <el-select v-model="weekF" placeholder="周次" clearable style="width:160px;">
        <el-option label="本周 (5.1-5.7)" value="current" /><el-option label="上周 (4.24-4.30)" value="last" /><el-option label="上上周 (4.17-4.23)" value="last2" />
      </el-select>
    </div>
    <el-card shadow="never">
      <el-table :data="filteredReports" stripe border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="student" label="学生" width="100" />
        <el-table-column prop="week" label="周次" width="140" />
        <el-table-column prop="totalStudyTime" label="学习时长" width="100" />
        <el-table-column prop="notesCount" label="笔记数" width="80" />
        <el-table-column prop="exerciseCount" label="练习次数" width="90" />
        <el-table-column prop="mistakesSolved" label="消灭错题" width="90" />
        <el-table-column prop="avgScore" label="平均分" width="80">
          <template #default="{ row }">
            <span :style="{ color: row.avgScore >= 80 ? '#67c23a' : row.avgScore >= 60 ? '#e6a23c' : '#f56c6c', fontWeight: '600' }">{{ row.avgScore }}</span>
          </template>
        </el-table-column>
        <el-table-column label="趋势" width="80">
          <template #default="{ row }">
            <span :style="{ color: row.trend === 'up' ? '#67c23a' : row.trend === 'down' ? '#f56c6c' : '#909399' }">{{ row.trend === 'up' ? '↑ 上升' : row.trend === 'down' ? '↓ 下降' : '→ 持平' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="weakSubject" label="薄弱科目" width="100">
          <template #default="{ row }"><el-tag type="danger" size="small">{{ row.weakSubject }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/parent/reports/${row.id}`)">查看详情</el-button>
            <el-button type="success" link size="small" @click="handleExport(row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
const search = ref(''); const weekF = ref('')
const handleExport = (row: any) => {
  ElMessage.success(`正在导出 ${row.student} 的学习报告...`)
}
const reports = ref(Array.from({ length: 8 }, (_, i) => ({
  id: i + 1, student: ['小明','小李','小王','小赵','小陈','小孙','小周','小吴'][i],
  week: '2026.4.28 - 5.4', totalStudyTime: `${Math.floor(Math.random() * 10) + 5}小时`,
  notesCount: Math.floor(Math.random() * 10) + 2, exerciseCount: Math.floor(Math.random() * 20) + 5,
  mistakesSolved: Math.floor(Math.random() * 15) + 3, avgScore: Math.floor(Math.random() * 30) + 60,
  trend: ['up', 'down', 'flat'][i % 3], weakSubject: ['物理','数学','英语','化学','语文'][i % 5],
})))
const filteredReports = computed(() => {
  if (!search.value) return reports.value
  return reports.value.filter(r => r.student.includes(search.value))
})
</script>
