<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push('/exercise/questions')">返回题库</el-button>
        <h2 style="margin:0;">题目详情 #{{ questionId }}</h2>
        <el-tag :type="{easy:'success',medium:'warning',hard:'danger'}[question.difficulty] as any">{{ {easy:'简单',medium:'中等',hard:'困难'}[question.difficulty] }}</el-tag>
      </div>
      <div style="display:flex;gap:10px;">
        <el-button type="primary" icon="Edit" @click="editVisible = true">编辑题目</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">题目内容</span></template>
          <div class="question-content">
            <p style="font-size:16px;font-weight:500;line-height:1.8;">{{ question.content }}</p>
            <div v-if="question.type === 'choice'" style="margin-top:16px;">
              <div v-for="(opt, idx) in question.options" :key="idx" :class="['option-item', opt.isCorrect ? 'correct' : '']">
                <span class="option-label">{{ ['A','B','C','D'][idx] }}.</span>
                <span>{{ opt.text }}</span>
                <el-tag v-if="opt.isCorrect" type="success" size="small" style="margin-left:8px;">正确答案</el-tag>
              </div>
            </div>
            <div v-else-if="question.type === 'fill'" style="margin-top:16px;">
              <el-tag type="success" size="large">答案：{{ question.answer }}</el-tag>
            </div>
          </div>
          <el-divider />
          <div>
            <h4>解题思路</h4>
            <p style="color:#606266;line-height:1.8;">{{ question.explanation }}</p>
          </div>
        </el-card>

        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">答题统计</span></template>
          <el-row :gutter="20">
            <el-col :span="12"><v-chart :option="answerDistChart" style="height:250px;" autoresize /></el-col>
            <el-col :span="12"><v-chart :option="correctTrendChart" style="height:250px;" autoresize /></el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">基本信息</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="题目ID">{{ question.id }}</el-descriptions-item>
            <el-descriptions-item label="科目"><el-tag size="small">{{ question.subject }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="题型">{{ {choice:'选择题',fill:'填空题',judge:'判断题',essay:'解答题'}[question.type] }}</el-descriptions-item>
            <el-descriptions-item label="难度"><el-tag :type="{easy:'success',medium:'warning',hard:'danger'}[question.difficulty] as any" size="small">{{ {easy:'简单',medium:'中等',hard:'困难'}[question.difficulty] }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="学段">{{ question.grade }}</el-descriptions-item>
            <el-descriptions-item label="使用次数">{{ question.usedCount }}</el-descriptions-item>
            <el-descriptions-item label="正确率"><el-progress :percentage="question.correctRate" :stroke-width="6" style="width:100px;" /></el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ question.createdAt }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">关联知识点</span></template>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <el-tag v-for="kp in question.knowledgePoints" :key="kp" closable @close="removeKP(kp)">{{ kp }}</el-tag>
            <el-button size="small" type="primary" text icon="Plus" @click="addKPVisible = true">添加</el-button>
          </div>
        </el-card>

        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">相似题目</span></template>
          <div v-for="q in similarQuestions" :key="q.id" style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <el-link type="primary" @click="$router.push(`/exercise/questions/${q.id}`)">{{ q.content }}</el-link>
            <div style="font-size:12px;color:#909399;margin-top:4px;">
              <el-tag size="small" type="info">{{ q.subject }}</el-tag>
              正确率 {{ q.correctRate }}%
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editVisible" title="编辑题目" width="700px">
      <el-form label-width="80px">
        <el-form-item label="题目"><el-input v-model="question.content" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="科目"><el-select v-model="question.subject" style="width:100%;"><el-option v-for="s in subjects" :key="s" :label="s" :value="s" /></el-select></el-form-item>
        <el-form-item label="题型"><el-select v-model="question.type" style="width:100%;"><el-option label="选择题" value="choice" /><el-option label="填空题" value="fill" /><el-option label="判断题" value="judge" /><el-option label="解答题" value="essay" /></el-select></el-form-item>
        <el-form-item label="难度"><el-select v-model="question.difficulty" style="width:100%;"><el-option label="简单" value="easy" /><el-option label="中等" value="medium" /><el-option label="困难" value="hard" /></el-select></el-form-item>
        <template v-if="question.type === 'choice'">
          <el-form-item v-for="(opt, idx) in question.options" :key="idx" :label="`选项${['A','B','C','D'][idx]}`">
            <div style="display:flex;gap:8px;width:100%;">
              <el-input v-model="opt.text" style="flex:1;" />
              <el-checkbox v-model="opt.isCorrect">正确</el-checkbox>
            </div>
          </el-form-item>
        </template>
        <el-form-item v-else label="答案"><el-input v-model="question.answer" /></el-form-item>
        <el-form-item label="解析"><el-input v-model="question.explanation" type="textarea" :rows="4" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editVisible = false; ElMessage.success('题目已更新')">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="addKPVisible" title="添加知识点" width="400px">
      <el-input v-model="newKP" placeholder="输入知识点" />
      <template #footer><el-button @click="addKPVisible = false">取消</el-button><el-button type="primary" @click="addKP">添加</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
use([CanvasRenderer, PieChart, LineChart, GridComponent, TooltipComponent])

const route = useRoute(); const router = useRouter()
const questionId = Number(route.params.id)
const subjects = ['语文','数学','英语','物理','化学','生物']
const editVisible = ref(false); const addKPVisible = ref(false); const newKP = ref('')

const question = reactive({
  id: questionId, content: '下列哪个是方程 x²-5x+6=0 的解？', subject: '数学', type: 'choice', difficulty: 'medium', grade: '高中',
  usedCount: 342, correctRate: 68, createdAt: '2026-03-15 10:00', answer: 'x=2 或 x=3',
  knowledgePoints: ['一元二次方程', '因式分解', '求根公式'],
  explanation: '将方程 x²-5x+6=0 因式分解：(x-2)(x-3)=0，所以 x=2 或 x=3。也可以用求根公式：x = (5±√(25-24))/2 = (5±1)/2，得 x=3 或 x=2。',
  options: [
    { text: 'x=1 和 x=6', isCorrect: false }, { text: 'x=2 和 x=3', isCorrect: true },
    { text: 'x=-2 和 x=-3', isCorrect: false }, { text: 'x=5 和 x=1', isCorrect: false },
  ],
})

const similarQuestions = ref([
  { id: 2, content: '解方程 x²-7x+12=0', subject: '数学', correctRate: 72 },
  { id: 3, content: '方程 2x²-5x+3=0 的两根之和', subject: '数学', correctRate: 55 },
  { id: 4, content: '若方程 x²+bx+c=0 有根 x=3', subject: '数学', correctRate: 48 },
])

const answerDistChart = ref({
  tooltip: { trigger: 'item' },
  series: [{ type: 'pie', radius: ['35%','60%'], data: [
    { value: 12, name: 'A', itemStyle: { color: '#909399' } }, { value: 68, name: 'B (正确)', itemStyle: { color: '#67c23a' } },
    { value: 15, name: 'C', itemStyle: { color: '#e6a23c' } }, { value: 5, name: 'D', itemStyle: { color: '#f56c6c' } },
  ], label: { formatter: '{b}\n{d}%' } }],
})
const correctTrendChart = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 10, top: 10, bottom: 30 },
  xAxis: { type: 'category', data: ['1月','2月','3月','4月','5月'], boundaryGap: false },
  yAxis: { type: 'value', max: 100 },
  series: [{ type: 'line', data: [62, 65, 68, 70, 68], smooth: true, areaStyle: { opacity: 0.15 }, color: '#409eff' }],
})

function removeKP(kp: string) { question.knowledgePoints = question.knowledgePoints.filter(k => k !== kp) }
function addKP() { if (newKP.value) { question.knowledgePoints.push(newKP.value); newKP.value = ''; addKPVisible.value = false } }
function handleDelete() {
  ElMessageBox.confirm('确定删除此题目吗？', '删除确认', { type: 'error' }).then(() => {
    ElMessage.success('题目已删除'); router.push('/exercise/questions')
  }).catch(() => {})
}
</script>

<style scoped>
.option-item { padding: 10px 16px; margin: 8px 0; border-radius: 8px; background: #f5f7fa; display: flex; align-items: center; gap: 8px; }
.option-item.correct { background: #f0f9eb; border: 1px solid #67c23a; }
.option-label { font-weight: 600; color: #409eff; }
</style>
