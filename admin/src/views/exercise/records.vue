<template>
  <div>
    <div class="page-header"><h2>练习记录</h2></div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索用户" prefix-icon="Search" style="width:200px;" clearable />
      <el-select v-model="typeF" placeholder="练习类型" clearable style="width:140px;">
        <el-option label="靶向练习" value="target" /><el-option label="巩固卷" value="consolidation" />
      </el-select>
      <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:280px;" />
    </div>
    <el-card shadow="never">
      <el-table :data="filteredRecords" stripe border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="user" label="用户" width="100" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }"><el-tag size="small">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="subject" label="科目" width="80" />
        <el-table-column prop="totalQuestions" label="题目数" width="80" />
        <el-table-column prop="correctCount" label="正确数" width="80" />
        <el-table-column label="正确率" width="100">
          <template #default="{ row }">
            <el-progress :percentage="Math.round(row.correctCount / row.totalQuestions * 100)" :stroke-width="6" :color="row.correctCount / row.totalQuestions >= 0.8 ? '#67c23a' : row.correctCount / row.totalQuestions >= 0.6 ? '#e6a23c' : '#f56c6c'" />
          </template>
        </el-table-column>
        <el-table-column prop="score" label="得分" width="80" />
        <el-table-column prop="duration" label="用时" width="80" />
        <el-table-column prop="createdAt" label="练习时间" width="160" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }"><el-button type="primary" link size="small" @click="$router.push(`/exercise/records/${row.id}`)">详情</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const search = ref(''); const typeF = ref(''); const dateRange = ref(null)
const typeMap: Record<string, string> = { target: '靶向练习', consolidation: '巩固卷' }
const records = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, user: ['小明','小李','小王','小赵','小陈','小张','小刘','小黄'][i % 8], type: i % 2 === 0 ? '靶向练习' : '巩固卷',
  subject: ['数学','英语','语文','物理','化学'][i % 5], totalQuestions: [5,10,15][i % 3],
  correctCount: Math.floor(Math.random() * 10) + 3, score: Math.floor(Math.random() * 50) + 50,
  duration: `${Math.floor(Math.random() * 20) + 5}分钟`, createdAt: `2026-05-0${(i % 9) + 1} ${10 + (i % 12)}:00`,
})))
const filteredRecords = computed(() => {
  return records.value.filter(r => {
    if (search.value && !r.user.includes(search.value)) return false
    if (typeF.value && r.type !== typeMap[typeF.value]) return false
    return true
  })
})
</script>
