<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.back()">返回</el-button>
        <h2>批改概览</h2>
        <el-tag>{{ hw.name }}</el-tag>
      </div>
    </div>

    <el-row :gutter="16" style="margin-bottom:20px;">
      <el-col :span="5"><div class="stat-card"><div class="sc-num" style="color:#409eff;">{{ hw.total }}</div><div class="sc-label">应交人数</div></div></el-col>
      <el-col :span="5"><div class="stat-card"><div class="sc-num" style="color:#67c23a;">{{ hw.submitted }}</div><div class="sc-label">已提交</div></div></el-col>
      <el-col :span="5"><div class="stat-card"><div class="sc-num" style="color:#e6a23c;">{{ hw.graded }}</div><div class="sc-label">已批改</div></div></el-col>
      <el-col :span="5"><div class="stat-card"><div class="sc-num" style="color:#a78bfa;">{{ hw.avgScore }}</div><div class="sc-label">平均分</div></div></el-col>
      <el-col :span="4"><div class="stat-card"><div class="sc-num" style="color:#f56c6c;">{{ hw.submitted - hw.graded }}</div><div class="sc-label">待批改</div></div></el-col>
    </el-row>

    <el-card shadow="never" style="margin-bottom:20px;">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:600;">批改进度</span>
          <div style="display:flex;gap:8px;">
            <el-tag>AI批改: {{ hw.aiGradedCount }} 份</el-tag>
            <el-tag type="info">手动批改: {{ hw.manualGradedCount }} 份</el-tag>
          </div>
        </div>
      </template>
      <el-progress :percentage="Math.round(hw.graded / hw.submitted * 100)" :stroke-width="20" :format="() => `${hw.graded}/${hw.submitted} (${Math.round(hw.graded / hw.submitted * 100)}%)`" status="success" />
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:600;">学生批改详情</span>
          <div style="display:flex;gap:8px;">
            <el-select v-model="gradeFilter" placeholder="筛选" clearable style="width:120px;" size="small">
              <el-option label="已批改" value="graded" />
              <el-option label="待批改" value="submitted" />
            </el-select>
          </div>
        </div>
      </template>
      <el-table :data="filteredSubmissions" stripe border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="nickname" label="学生" width="120" />
        <el-table-column label="成绩" width="100">
          <template #default="{ row }">
            <span v-if="row.score !== null" style="font-size:18px;font-weight:700;" :style="{ color: row.score >= 80 ? '#67c23a' : row.score >= 60 ? '#e6a23c' : '#f56c6c' }">{{ row.score }}</span>
            <el-tag v-else type="warning" size="small">待批改</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="批改方式" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.gradeMethod" :type="row.gradeMethod === 'ai' ? 'primary' : ''" size="small">{{ row.gradeMethod === 'ai' ? 'AI' : '手动' }}</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="评语" min-width="250">
          <template #default="{ row }"><span style="font-size:13px;">{{ row.comment || '-' }}</span></template>
        </el-table-column>
        <el-table-column prop="submittedAt" label="提交时间" width="160" />
        <el-table-column prop="gradedAt" label="批改时间" width="160" />
        <el-table-column label="答题详情" width="100">
          <template #default="{ row }">
            <el-button v-if="row.score !== null" type="primary" link size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const gradeFilter = ref('')

const hw = ref({
  id: 1, name: '第三章一元二次方程练习',
  total: 32, submitted: 28, graded: 18,
  aiGradedCount: 15, manualGradedCount: 3, avgScore: 76,
})

const submissions = ref(Array.from({ length: 28 }, (_, i) => ({
  id: i + 1, nickname: `学生${i + 1}`,
  score: i < 18 ? 50 + Math.floor(Math.random() * 50) : null,
  gradeMethod: i < 15 ? 'ai' : i < 18 ? 'manual' : null,
  comment: i < 18 ? ['解题思路清晰，继续保持', '注意计算过程的规范性', '基础知识掌握较好', '需要加强对公式的理解'][i % 4] : '',
  submittedAt: `2025-04-2${8 - Math.floor(i / 7)} ${10 + (i % 10)}:00`,
  gradedAt: i < 18 ? `2025-04-29 ${10 + (i % 8)}:00` : '-',
})))

const filteredSubmissions = computed(() => {
  if (!gradeFilter.value) return submissions.value
  if (gradeFilter.value === 'graded') return submissions.value.filter(s => s.score !== null)
  return submissions.value.filter(s => s.score === null)
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 700; margin: 0; }
.stat-card { background: #fff; padding: 20px; border-radius: 8px; text-align: center; }
.sc-num { font-size: 28px; font-weight: 700; }
.sc-label { font-size: 13px; color: #909399; margin-top: 4px; }
</style>
