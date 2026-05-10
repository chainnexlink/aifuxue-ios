<template>
  <div>
    <div class="page-header"><h2>家长控制管理</h2></div>
    <div class="stat-row">
      <el-card class="stat-card" shadow="hover"><span class="stat-value">4,230</span><span class="stat-label">已设置密码</span></el-card>
      <el-card class="stat-card success" shadow="hover"><span class="stat-value">3,180</span><span class="stat-label">正常使用</span></el-card>
      <el-card class="stat-card warning" shadow="hover"><span class="stat-value">680</span><span class="stat-label">设置时长限制</span></el-card>
      <el-card class="stat-card danger" shadow="hover"><span class="stat-value">45</span><span class="stat-label">密码重置请求</span></el-card>
    </div>
    <el-card shadow="never">
      <template #header><span style="font-weight:600;">家长控制列表</span></template>
      <el-table :data="filteredControls" stripe border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="student" label="学生" width="100" />
        <el-table-column label="家长密码" width="100">
          <template #default="{ row }">
            <el-tag :type="row.hasPassword ? 'success' : 'info'" size="small">{{ row.hasPassword ? '已设置' : '未设置' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dailyLimit" label="每日限时" width="100">
          <template #default="{ row }"><span>{{ row.dailyLimit ? row.dailyLimit + '分钟' : '无限制' }}</span></template>
        </el-table-column>
        <el-table-column prop="todayUsage" label="今日已用" width="100">
          <template #default="{ row }"><span>{{ row.todayUsage }}分钟</span></template>
        </el-table-column>
        <el-table-column label="使用占比" width="140">
          <template #default="{ row }">
            <el-progress v-if="row.dailyLimit" :percentage="Math.min(100, Math.round(row.todayUsage / row.dailyLimit * 100))" :stroke-width="6" />
            <span v-else style="color:#909399;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="年级设置" width="100" />
        <el-table-column prop="subjects" label="科目设置" min-width="200">
          <template #default="{ row }">
            <el-tag v-for="s in row.subjects" :key="s" size="small" style="margin:2px;">{{ s }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/parent/control/${row.id}`)">查看</el-button>
            <el-button type="warning" link size="small" @click="handleResetPwd(row)">重置密码</el-button>
            <el-button type="danger" link size="small" @click="handleRemoveLimit(row)">解除限制</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const handleResetPwd = (row: any) => {
  ElMessageBox.confirm(`确定重置 ${row.student} 的家长密码？`, '重置确认', { type: 'warning' }).then(() => {
    ElMessage.success('密码已重置为默认密码: 123456')
  }).catch(() => {})
}
const handleRemoveLimit = (row: any) => {
  ElMessageBox.confirm(`确定解除 ${row.student} 的所有使用限制？`, '解除确认', { type: 'warning' }).then(() => {
    const item = controls.value.find(c => c.id === row.id)
    if (item) { item.dailyLimit = 0 }
    ElMessage.success('已解除限制')
  }).catch(() => {})
}
const controls = ref(Array.from({ length: 8 }, (_, i) => ({
  id: i + 1, student: ['小明','小李','小王','小赵','小陈','小孙','小周','小吴'][i],
  hasPassword: i % 3 !== 2, dailyLimit: i % 4 === 0 ? 0 : [60, 90, 120, 180][i % 4],
  todayUsage: Math.floor(Math.random() * 80) + 10,
  grade: ['高一','初二','高三','初三','高二','初一','高一','初二'][i],
  subjects: [['语文','数学','英语'],['数学','物理','化学'],['语文','英语'],['全科']][i % 4],
})))
const filteredControls = computed(() => controls.value)
</script>
