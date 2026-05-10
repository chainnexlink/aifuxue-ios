<template>
  <div>
    <div class="page-header"><h2>考试记录</h2></div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索用户" prefix-icon="Search" style="width:200px;" clearable />
      <el-select v-model="typeF" placeholder="考试类型" clearable style="width:140px;">
        <el-option label="模拟考试" value="exam" /><el-option label="押题卷" value="push" />
      </el-select>
      <el-select v-model="subjectF" placeholder="科目" clearable style="width:120px;">
        <el-option v-for="s in ['数学','语文','英语','物理','化学','生物']" :key="s" :label="s" :value="s" />
      </el-select>
    </div>
    <el-card shadow="never">
      <el-table :data="filteredRecords" stripe border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="user" label="用户" width="100" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }"><el-tag :type="row.type === '模拟考试' ? 'primary' : 'warning'" size="small">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="grade" label="学段" width="80" />
        <el-table-column prop="subject" label="科目" width="80" />
        <el-table-column prop="region" label="地区" width="80" />
        <el-table-column prop="score" label="得分" width="100">
          <template #default="{ row }"><span style="font-weight:600;">{{ row.score }} / {{ row.totalScore }}</span></template>
        </el-table-column>
        <el-table-column label="得分率" width="100">
          <template #default="{ row }">
            <el-progress :percentage="Math.round(row.score / row.totalScore * 100)" :stroke-width="6" />
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="用时" width="80" />
        <el-table-column prop="createdAt" label="考试时间" width="160" />
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/exam/records/${row.id}`)">详情</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const search = ref(''); const typeF = ref(''); const subjectF = ref('')
const typeMapFilter: Record<string, string> = { exam: '模拟考试', push: '押题卷' }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定删除 ${row.user} 的考试记录？`, '删除确认', { type: 'warning' }).then(() => {
    records.value = records.value.filter(r => r.id !== row.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}
const records = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, user: ['小明','小李','小王','小赵','小陈'][i % 5],
  type: i % 3 === 0 ? '押题卷' : '模拟考试',
  grade: ['高中','初中','高中'][i % 3], subject: ['数学','英语','语文','物理','化学'][i % 5],
  region: ['北京','上海','江苏','广东','四川'][i % 5],
  score: Math.floor(Math.random() * 60) + 60,
  totalScore: [150, 150, 150, 100, 100][i % 5],
  duration: `${Math.floor(Math.random() * 40) + 60}分钟`,
  createdAt: `2026-05-0${(i % 3) + 1} ${9 + (i % 10)}:${String(i * 11 % 60).padStart(2, '0')}`,
})))
const filteredRecords = computed(() => {
  return records.value.filter(r => {
    if (search.value && !r.user.includes(search.value)) return false
    if (typeF.value && r.type !== typeMapFilter[typeF.value]) return false
    if (subjectF.value && r.subject !== subjectF.value) return false
    return true
  })
})
</script>
