<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push('/exercise/records')">返回记录</el-button>
        <h2 style="margin:0;">练习详情 #{{ recordId }}</h2>
        <el-tag :type="record.correctRate >= 80 ? 'success' : record.correctRate >= 60 ? 'warning' : 'danger'">正确率 {{ record.correctRate }}%</el-tag>
      </div>
    </div>
    <el-row :gutter="16" style="margin-bottom:20px;">
      <el-col :span="5"><el-card shadow="hover" class="mini-stat"><div class="mini-val">{{ record.totalQuestions }}</div><div class="mini-label">总题数</div></el-card></el-col>
      <el-col :span="5"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#67c23a;">{{ record.correctCount }}</div><div class="mini-label">正确数</div></el-card></el-col>
      <el-col :span="5"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#f56c6c;">{{ record.wrongCount }}</div><div class="mini-label">错误数</div></el-card></el-col>
      <el-col :span="5"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#e6a23c;">{{ record.score }}</div><div class="mini-label">得分</div></el-card></el-col>
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#a78bfa;">{{ record.duration }}</div><div class="mini-label">用时</div></el-card></el-col>
    </el-row>

    <el-card shadow="hover">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:600;">逐题详情</span>
          <el-radio-group v-model="showFilter" size="small">
            <el-radio-button value="all">全部</el-radio-button>
            <el-radio-button value="correct">正确</el-radio-button>
            <el-radio-button value="wrong">错误</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div v-for="(q, idx) in filteredQuestions" :key="q.id" :class="['question-card', q.isCorrect ? 'correct' : 'wrong']">
        <div class="q-header">
          <span class="q-num">{{ idx + 1 }}</span>
          <el-tag :type="q.isCorrect ? 'success' : 'danger'" size="small">{{ q.isCorrect ? '正确' : '错误' }}</el-tag>
          <el-tag size="small" type="info">{{ q.type }}</el-tag>
          <el-tag size="small">{{ q.knowledgePoint }}</el-tag>
          <span style="color:#909399;font-size:12px;margin-left:auto;">用时 {{ q.timeSpent }}秒</span>
        </div>
        <p class="q-content">{{ q.content }}</p>
        <div v-if="q.options" class="q-options">
          <div v-for="(opt, oidx) in q.options" :key="oidx" :class="['opt', opt.isCorrect ? 'is-answer' : '', q.userAnswer === oidx && !opt.isCorrect ? 'is-user-wrong' : '']">
            {{ ['A','B','C','D'][oidx] }}. {{ opt.text }}
            <el-tag v-if="opt.isCorrect" type="success" size="small" style="margin-left:4px;">正确答案</el-tag>
            <el-tag v-if="q.userAnswer === oidx && !opt.isCorrect" type="danger" size="small" style="margin-left:4px;">你的选择</el-tag>
          </div>
        </div>
        <div v-if="!q.isCorrect" class="q-explanation">
          <el-icon style="color:#e6a23c;"><WarningFilled /></el-icon>
          <span>{{ q.explanation }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { WarningFilled } from '@element-plus/icons-vue'
const route = useRoute()
const recordId = Number(route.params.id)
const showFilter = ref('all')
const record = ref({
  totalQuestions: 10, correctCount: 7, wrongCount: 3, score: 85, duration: '15分钟',
  correctRate: 70, user: '小明', subject: '数学', type: '靶向练习', createdAt: '2026-05-03 14:30',
})
const questions = ref(Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, content: ['x²-5x+6=0的解是？','sin(30°)=？','lim(x→0) sinx/x=？','向量(1,2)·(3,-1)=？','log₂8=？','集合{1,2}∪{2,3}=？','(-2)³=？','√(16)=？','3!=？','C(5,2)=？'][i],
  type: ['选择题','选择题','填空题','选择题','填空题','选择题','选择题','填空题','填空题','选择题'][i],
  knowledgePoint: ['方程','三角函数','极限','向量','对数','集合','幂运算','根式','阶乘','组合'][i],
  isCorrect: ![2, 5, 8].includes(i),
  userAnswer: [1, 0, null, 1, null, 2, 0, null, null, 1][i],
  options: i % 3 !== 2 ? [{ text: '选项一', isCorrect: false }, { text: '选项二(正确)', isCorrect: true }, { text: '选项三', isCorrect: false }, { text: '选项四', isCorrect: false }] : null,
  explanation: `这道题考查的是${['方程','三角函数','极限','向量','对数','集合','幂运算','根式','阶乘','组合'][i]}的基本概念，正确答案应通过公式直接计算得出。`,
  timeSpent: Math.floor(Math.random() * 60) + 15,
})))
const filteredQuestions = computed(() => {
  if (showFilter.value === 'correct') return questions.value.filter(q => q.isCorrect)
  if (showFilter.value === 'wrong') return questions.value.filter(q => !q.isCorrect)
  return questions.value
})
</script>

<style scoped>
.mini-stat { text-align:center; padding:12px 0; }
.mini-val { font-size:26px; font-weight:700; color:#409eff; }
.mini-label { font-size:12px; color:#909399; margin-top:4px; }
.question-card { border:1px solid #ebeef5; border-radius:8px; padding:16px; margin-bottom:16px; }
.question-card.correct { border-left:4px solid #67c23a; }
.question-card.wrong { border-left:4px solid #f56c6c; background:#fff5f5; }
.q-header { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.q-num { width:28px; height:28px; border-radius:50%; background:#409eff; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:13px; }
.q-content { font-size:15px; line-height:1.6; margin:8px 0; }
.q-options .opt { padding:6px 12px; margin:4px 0; border-radius:4px; background:#f5f7fa; font-size:14px; }
.q-options .opt.is-answer { background:#f0f9eb; color:#67c23a; font-weight:500; }
.q-options .opt.is-user-wrong { background:#fef0f0; color:#f56c6c; }
.q-explanation { display:flex; align-items:flex-start; gap:8px; margin-top:12px; padding:10px; background:#fdf6ec; border-radius:4px; font-size:13px; color:#e6a23c; }
</style>
