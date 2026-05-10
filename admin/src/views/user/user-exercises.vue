<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push(`/user/detail/${$route.params.id}`)">返回用户详情</el-button>
        <h2 style="margin:0;">用户练习记录 — 学霸同学{{ $route.params.id }}</h2>
      </div>
    </div>
    <div class="stat-row">
      <el-card class="stat-card" shadow="hover"><span class="stat-value">128</span><span class="stat-label">总练习次数</span></el-card>
      <el-card class="stat-card success" shadow="hover"><span class="stat-value">76%</span><span class="stat-label">平均正确率</span></el-card>
      <el-card class="stat-card warning" shadow="hover"><span class="stat-value">1,280</span><span class="stat-label">累计答题</span></el-card>
      <el-card class="stat-card purple" shadow="hover"><span class="stat-value">42h</span><span class="stat-label">累计时长</span></el-card>
    </div>
    <el-card shadow="never">
      <el-table :data="records" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="type" label="类型" width="100"><template #default="{ row }"><el-tag size="small">{{ row.type }}</el-tag></template></el-table-column>
        <el-table-column prop="subject" label="科目" width="80" />
        <el-table-column prop="totalQuestions" label="题数" width="60" />
        <el-table-column prop="correctCount" label="正确" width="60" />
        <el-table-column label="正确率" width="120"><template #default="{ row }"><el-progress :percentage="Math.round(row.correctCount / row.totalQuestions * 100)" :stroke-width="6" /></template></el-table-column>
        <el-table-column prop="score" label="得分" width="60" />
        <el-table-column prop="duration" label="用时" width="80" />
        <el-table-column prop="createdAt" label="练习时间" width="160" />
        <el-table-column label="操作" width="80"><template #default="{ row }"><el-button type="primary" link size="small" @click="$router.push(`/exercise/records/${row.id}`)">详情</el-button></template></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const records = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, type: i % 2 === 0 ? '靶向练习' : '巩固卷', subject: ['数学','英语','物理','化学','语文'][i % 5],
  totalQuestions: [5,10,15,10,20][i % 5], correctCount: Math.floor(Math.random() * 10) + 3, score: Math.floor(Math.random() * 50) + 50,
  duration: `${Math.floor(Math.random() * 20) + 5}分钟`, createdAt: `2026-0${(i % 4) + 1}-${String((i % 28) + 1).padStart(2, '0')} ${10 + (i % 12)}:00`,
})))
</script>
