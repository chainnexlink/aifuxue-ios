<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push('/exam/records')">返回记录</el-button>
        <h2 style="margin:0;">考试详情 #{{ recordId }}</h2>
      </div>
    </div>
    <el-row :gutter="16" style="margin-bottom:20px;">
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val">{{ record.score }}</div><div class="mini-label">得分</div></el-card></el-col>
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#909399;">/{{ record.totalScore }}</div><div class="mini-label">总分</div></el-card></el-col>
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val" :style="{color: record.score/record.totalScore >= 0.8 ? '#67c23a' : '#e6a23c'}">{{ Math.round(record.score/record.totalScore*100) }}%</div><div class="mini-label">得分率</div></el-card></el-col>
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#a78bfa;">{{ record.duration }}</div><div class="mini-label">用时</div></el-card></el-col>
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val">{{ record.rank }}</div><div class="mini-label">排名</div></el-card></el-col>
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#67c23a;">{{ record.beatRate }}%</div><div class="mini-label">超越</div></el-card></el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">各题型得分</span></template>
          <el-table :data="sectionScores" stripe border>
            <el-table-column prop="name" label="题型" width="120" />
            <el-table-column prop="totalQ" label="题数" width="70" />
            <el-table-column prop="correct" label="正确" width="70" />
            <el-table-column prop="wrong" label="错误" width="70" />
            <el-table-column prop="score" label="得分" width="80"><template #default="{ row }"><span style="font-weight:600;">{{ row.score }}</span></template></el-table-column>
            <el-table-column prop="fullScore" label="满分" width="70" />
            <el-table-column label="得分率" width="140"><template #default="{ row }"><el-progress :percentage="Math.round(row.score/row.fullScore*100)" :stroke-width="6" /></template></el-table-column>
          </el-table>
        </el-card>
        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">错题分析</span></template>
          <div v-for="(q, idx) in wrongQuestions" :key="q.id" style="padding:12px;margin-bottom:12px;border:1px solid #fde2e2;border-radius:8px;border-left:4px solid #f56c6c;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span><el-tag type="danger" size="small">第{{ q.num }}题</el-tag> <el-tag size="small">{{ q.type }}</el-tag> <el-tag type="info" size="small">{{ q.knowledgePoint }}</el-tag></span>
              <span style="color:#f56c6c;font-weight:600;">-{{ q.lostScore }}分</span>
            </div>
            <p style="margin:8px 0;color:#606266;">{{ q.content }}</p>
            <p style="font-size:13px;color:#909399;">你的答案: <span style="color:#f56c6c;">{{ q.userAnswer }}</span> | 正确答案: <span style="color:#67c23a;">{{ q.correctAnswer }}</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">考试信息</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="考试类型"><el-tag :type="record.type === '模拟考试' ? 'primary' : 'warning'">{{ record.type }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="科目">{{ record.subject }}</el-descriptions-item>
            <el-descriptions-item label="学段">{{ record.grade }}</el-descriptions-item>
            <el-descriptions-item label="地区">{{ record.region }}</el-descriptions-item>
            <el-descriptions-item label="用户"><el-link type="primary" @click="$router.push(`/user/detail/${record.userId}`)">{{ record.user }}</el-link></el-descriptions-item>
            <el-descriptions-item label="考试时间">{{ record.createdAt }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">知识点掌握</span></template>
          <div v-for="kp in knowledgeMastery" :key="kp.name" style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
              <span style="font-size:13px;">{{ kp.name }}</span>
              <span style="font-size:13px;color:#909399;">{{ kp.rate }}%</span>
            </div>
            <el-progress :percentage="kp.rate" :stroke-width="8" :color="kp.rate >= 80 ? '#67c23a' : kp.rate >= 60 ? '#e6a23c' : '#f56c6c'" :show-text="false" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute(); const recordId = Number(route.params.id)
const record = ref({ userId: 1, user: '小明', type: '模拟考试', subject: '数学', grade: '高中', region: '北京', score: 120, totalScore: 150, duration: '95分钟', rank: '28/342', beatRate: 92, createdAt: '2026-05-03 09:00' })
const sectionScores = ref([
  { name: '选择题', totalQ: 12, correct: 10, wrong: 2, score: 50, fullScore: 60 },
  { name: '填空题', totalQ: 4, correct: 3, wrong: 1, score: 15, fullScore: 20 },
  { name: '解答题', totalQ: 6, correct: 4, wrong: 2, score: 55, fullScore: 72 },
])
const wrongQuestions = ref([
  { id: 1, num: 5, type: '选择题', knowledgePoint: '导数应用', content: '函数f(x)=x³-3x在区间[-2,2]上的最大值是？', userAnswer: 'A. 2', correctAnswer: 'B. 4', lostScore: 5 },
  { id: 2, num: 11, type: '选择题', knowledgePoint: '三角函数', content: 'sin²α+cos²α的值等于？', userAnswer: 'C', correctAnswer: 'A. 1', lostScore: 5 },
  { id: 3, num: 14, type: '填空题', knowledgePoint: '向量', content: '向量a=(1,2), b=(3,-1), a·b=___', userAnswer: '5', correctAnswer: '1', lostScore: 5 },
  { id: 4, num: 17, type: '解答题', knowledgePoint: '极值', content: '求f(x)=x³-6x²+9x-2的极值', userAnswer: '过程不完整', correctAnswer: '极大值2,极小值-2', lostScore: 8 },
  { id: 5, num: 20, type: '解答题', knowledgePoint: '概率统计', content: '10个球中取3个的组合数', userAnswer: 'C(10,3)=100', correctAnswer: 'C(10,3)=120', lostScore: 7 },
])
const knowledgeMastery = ref([
  { name: '导数应用', rate: 60 }, { name: '三角函数', rate: 75 }, { name: '向量', rate: 55 },
  { name: '极值', rate: 50 }, { name: '概率统计', rate: 65 }, { name: '方程', rate: 90 }, { name: '集合', rate: 85 },
])
</script>

<style scoped>
.mini-stat { text-align:center; padding:12px 0; }
.mini-val { font-size:26px; font-weight:700; color:#409eff; }
.mini-label { font-size:12px; color:#909399; margin-top:4px; }
</style>
