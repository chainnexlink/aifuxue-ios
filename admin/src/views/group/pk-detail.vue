<template>
  <div>
    <div class="page-header"><div style="display:flex;align-items:center;gap:12px;"><el-button icon="ArrowLeft" @click="$router.push('/group/pk')">返回PK列表</el-button><h2 style="margin:0;">PK详情 #{{ pkId }}</h2></div></div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="player-card" style="text-align:center;">
          <el-avatar :size="64" style="background:#409eff;font-size:24px;">{{ pk.player1[0] }}</el-avatar>
          <h3>{{ pk.player1 }}</h3>
          <div class="big-score" :style="{color: pk.score1 > pk.score2 ? '#67c23a' : '#f56c6c'}">{{ pk.score1 }}</div>
          <el-tag :type="pk.score1 > pk.score2 ? 'success' : 'danger'" size="large">{{ pk.score1 > pk.score2 ? '胜利' : '失败' }}</el-tag>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" style="text-align:center;padding:30px 0;">
          <div style="font-size:36px;font-weight:700;color:#909399;">VS</div>
          <el-descriptions :column="1" border size="small" style="margin-top:20px;">
            <el-descriptions-item label="科目"><el-tag>{{ pk.subject }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="题数">{{ pk.questions }}题</el-descriptions-item>
            <el-descriptions-item label="小组">{{ pk.group }}</el-descriptions-item>
            <el-descriptions-item label="用时">{{ pk.duration }}</el-descriptions-item>
            <el-descriptions-item label="时间">{{ pk.createdAt }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="player-card" style="text-align:center;">
          <el-avatar :size="64" style="background:#a78bfa;font-size:24px;">{{ pk.player2[0] }}</el-avatar>
          <h3>{{ pk.player2 }}</h3>
          <div class="big-score" :style="{color: pk.score2 > pk.score1 ? '#67c23a' : '#f56c6c'}">{{ pk.score2 }}</div>
          <el-tag :type="pk.score2 > pk.score1 ? 'success' : 'danger'" size="large">{{ pk.score2 > pk.score1 ? '胜利' : '失败' }}</el-tag>
        </el-card>
      </el-col>
    </el-row>
    <el-card shadow="hover" style="margin-top:20px;">
      <template #header><span style="font-weight:600;">逐题对比</span></template>
      <el-table :data="questionResults" stripe border>
        <el-table-column label="题号" width="70"><template #default="{ $index }">{{ $index + 1 }}</template></el-table-column>
        <el-table-column prop="content" label="题目" min-width="250" show-overflow-tooltip />
        <el-table-column :label="pk.player1" width="120">
          <template #default="{ row }"><el-tag :type="row.p1Correct ? 'success' : 'danger'" size="small">{{ row.p1Correct ? '正确' : '错误' }} ({{ row.p1Time }}s)</el-tag></template>
        </el-table-column>
        <el-table-column :label="pk.player2" width="120">
          <template #default="{ row }"><el-tag :type="row.p2Correct ? 'success' : 'danger'" size="small">{{ row.p2Correct ? '正确' : '错误' }} ({{ row.p2Time }}s)</el-tag></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute(); const pkId = Number(route.params.id)
const pk = ref({ player1: '小明', score1: 4, player2: '小张', score2: 3, group: '学霸冲刺组', subject: '数学', questions: 5, duration: '2分30秒', createdAt: '2026-05-03 14:00' })
const questionResults = ref(Array.from({ length: 5 }, (_, i) => ({
  content: ['x²-5x+6=0的解？','sin(30°)=？','集合{1,2}∪{2,3}=？','(-2)³=？','C(5,2)=？'][i],
  p1Correct: [true, true, false, true, true][i], p1Time: [12, 8, 15, 6, 10][i],
  p2Correct: [true, false, true, true, true][i], p2Time: [15, 20, 10, 8, 12][i],
})))
</script>

<style scoped>
.big-score { font-size:48px; font-weight:700; margin:16px 0; }
</style>
