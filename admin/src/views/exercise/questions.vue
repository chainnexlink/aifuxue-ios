<template>
  <div>
    <div class="page-header"><h2>题库管理</h2><el-button type="primary" icon="Plus">添加题目</el-button></div>
    <div class="stat-row">
      <el-card class="stat-card" shadow="hover"><span class="stat-value">5,680</span><span class="stat-label">总题数</span></el-card>
      <el-card class="stat-card success" shadow="hover"><span class="stat-value">3,210</span><span class="stat-label">选择题</span></el-card>
      <el-card class="stat-card warning" shadow="hover"><span class="stat-value">1,450</span><span class="stat-label">填空题</span></el-card>
      <el-card class="stat-card purple" shadow="hover"><span class="stat-value">1,020</span><span class="stat-label">解答题</span></el-card>
    </div>
    <div class="filter-bar">
      <el-select v-model="subjectF" placeholder="科目" clearable style="width:120px;">
        <el-option v-for="s in subjects" :key="s" :label="s" :value="s" />
      </el-select>
      <el-select v-model="typeF" placeholder="题型" clearable style="width:120px;">
        <el-option label="选择题" value="choice" /><el-option label="填空题" value="fill" /><el-option label="判断题" value="judge" /><el-option label="解答题" value="essay" />
      </el-select>
      <el-select v-model="diffF" placeholder="难度" clearable style="width:120px;">
        <el-option label="简单" value="easy" /><el-option label="中等" value="medium" /><el-option label="困难" value="hard" />
      </el-select>
      <el-select v-model="gradeF" placeholder="学段" clearable style="width:120px;">
        <el-option label="小学" value="PRIMARY" /><el-option label="初中" value="JUNIOR" /><el-option label="高中" value="SENIOR" />
      </el-select>
      <el-input v-model="searchQ" placeholder="搜索题目" prefix-icon="Search" style="width:200px;" clearable />
    </div>
    <el-card shadow="never">
      <el-table :data="pagedData" stripe border @selection-change="(val: any[]) => selectedRows = val">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="question" label="题目内容" show-overflow-tooltip min-width="260" />
        <el-table-column prop="type" label="题型" width="80">
          <template #default="{ row }"><el-tag size="small">{{ typeMap[row.type] }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="subject" label="科目" width="80" />
        <el-table-column prop="difficulty" label="难度" width="80">
          <template #default="{ row }">
            <el-tag :type="row.difficulty === 'easy' ? 'success' : row.difficulty === 'medium' ? 'warning' : 'danger'" size="small">{{ diffMap[row.difficulty] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="学段" width="80" />
        <el-table-column prop="usedCount" label="使用次数" width="90" />
        <el-table-column prop="correctRate" label="正确率" width="90">
          <template #default="{ row }"><span>{{ row.correctRate }}%</span></template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/exercise/questions/${row.id}`)">详情</el-button>
            <el-button type="info" link size="small" @click="$router.push(`/exercise/questions/${row.id}`)">预览</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
        <div>
          <el-button type="danger" size="small" :disabled="!selectedRows.length" @click="handleBatchDelete">批量删除 ({{ selectedRows.length }})</el-button>
        </div>
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="filteredQuestions.length" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const subjectF = ref(''); const typeF = ref(''); const diffF = ref(''); const gradeF = ref(''); const searchQ = ref('')
const page = ref(1); const pageSize = ref(10)
const selectedRows = ref<any[]>([])
const subjects = ['语文','数学','英语','物理','化学','生物','历史','地理','政治']
const typeMap: Record<string, string> = { choice: '选择题', fill: '填空题', judge: '判断题', essay: '解答题' }
const diffMap: Record<string, string> = { easy: '简单', medium: '中等', hard: '困难' }
const levelMap: Record<string, string> = { beginner: '初级', intermediate: '中级', advanced: '高级' }
const gradeMap: Record<string, string> = { PRIMARY: '小学', JUNIOR: '初中', SENIOR: '高中' }
const questions = ref(Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  question: ['下列哪个是方程x²-5x+6=0的解？','三角形内角和等于？','圆的面积公式是？','sin(30°)的值？','集合{1,2,3}的子集个数？','She ___ to school every day.','床前明月光的作者？','牛顿第一定律描述的是？','氧化还原反应中什么发生转移？','DNA双螺旋结构由谁发现？'][i % 10],
  type: ['choice','choice','choice','fill','choice','choice','choice','judge','fill','choice'][i % 10],
  subject: subjects[i % subjects.length], difficulty: ['easy','medium','hard'][i % 3],
  grade: ['初中','高中','高中','高中','高中','初中','初中','高中','高中','高中'][i % 10],
  usedCount: Math.floor(Math.random() * 500) + 50, correctRate: Math.floor(Math.random() * 40) + 50,
})))
const filteredQuestions = computed(() => {
  return questions.value.filter(q => {
    if (searchQ.value && !q.question.includes(searchQ.value)) return false
    if (subjectF.value && q.subject !== subjectF.value) return false
    if (typeF.value && q.type !== typeF.value) return false
    if (diffF.value && q.difficulty !== diffF.value) return false
    if (gradeF.value && q.grade !== gradeMap[gradeF.value]) return false
    return true
  })
})
const pagedData = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredQuestions.value.slice(start, start + pageSize.value)
})
function handleDelete(row: any) { ElMessageBox.confirm(`删除题目 #${row.id}？`, '删除', { type: 'error' }).then(() => { questions.value = questions.value.filter(q => q.id !== row.id); ElMessage.success('已删除') }).catch(() => {}) }
function handleBatchDelete() {
  ElMessageBox.confirm(`确定批量删除 ${selectedRows.value.length} 道题目？`, '批量删除', { type: 'error' }).then(() => {
    const ids = new Set(selectedRows.value.map(r => r.id))
    questions.value = questions.value.filter(q => !ids.has(q.id))
    selectedRows.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}
</script>
