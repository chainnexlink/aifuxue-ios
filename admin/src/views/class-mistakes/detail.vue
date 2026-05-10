<template>
  <div class="page">
    <div class="page-header">
      <el-page-header @back="$router.back()">
        <template #content>班级错题详情</template>
      </el-page-header>
    </div>

    <el-row :gutter="16">
      <el-col :span="16">
        <el-card shadow="never" header="来源信息">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="班级">高一2班数学</el-descriptions-item>
            <el-descriptions-item label="来源作业">第三章导数练习</el-descriptions-item>
            <el-descriptions-item label="科目">数学</el-descriptions-item>
            <el-descriptions-item label="汇总时间">2025-05-03 12:00</el-descriptions-item>
            <el-descriptions-item label="涉及学生">32人</el-descriptions-item>
            <el-descriptions-item label="错题总数">18题</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card shadow="never" header="错题列表（按错误率排序）" style="margin-top:16px;">
          <el-table :data="mistakes" stripe>
            <el-table-column prop="index" label="序号" width="60" align="center" />
            <el-table-column prop="content" label="题目摘要" min-width="200" show-overflow-tooltip />
            <el-table-column prop="type" label="题型" width="90" />
            <el-table-column label="错误率" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.errorRate" :stroke-width="14" :color="row.errorRate > 50 ? '#f56c6c' : row.errorRate > 30 ? '#e6a23c' : '#67c23a'" />
              </template>
            </el-table-column>
            <el-table-column prop="errorCount" label="做错人数" width="90" align="center" />
            <el-table-column prop="knowledge" label="知识点" width="140" show-overflow-tooltip />
            <el-table-column prop="correctAnswer" label="正确答案" width="100" show-overflow-tooltip />
            <el-table-column label="常见错误答案" width="160">
              <template #default="{ row }">
                <div v-for="(ans, i) in row.wrongAnswers" :key="i" class="wrong-ans">
                  <span class="wa-label">{{ ans.answer }}</span>
                  <el-progress :percentage="ans.percent" :stroke-width="10" :format="() => ans.count + '人'" style="flex:1;" color="#f56c6c" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" header="错误率分布">
          <div v-for="range in errorRanges" :key="range.label" class="range-row">
            <span class="range-label">{{ range.label }}</span>
            <el-progress :percentage="range.percent" :stroke-width="14" :format="() => range.count + '题'" :color="range.color" />
          </div>
        </el-card>

        <el-card shadow="never" header="高频知识点" style="margin-top:16px;">
          <el-tag v-for="kp in knowledgePoints" :key="kp.name" class="kp-tag" :type="kp.count > 4 ? 'danger' : kp.count > 2 ? 'warning' : 'info'">
            {{ kp.name }} ({{ kp.count }}题)
          </el-tag>
        </el-card>

        <el-card shadow="never" header="巩固卷状态" style="margin-top:16px;">
          <el-descriptions :column="1" size="small">
            <el-descriptions-item label="状态"><el-tag type="success">已生成</el-tag></el-descriptions-item>
            <el-descriptions-item label="题目数">12题</el-descriptions-item>
            <el-descriptions-item label="生成时间">2025-05-03 14:00</el-descriptions-item>
          </el-descriptions>
          <el-button type="primary" style="width:100%;margin-top:12px;">下载巩固卷</el-button>
          <el-button style="width:100%;margin-top:8px;">重新生成</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mistakes = ref([
  { index: 1, content: '求函数f(x)=x³-3x在[0,2]上的最值', type: '计算题', errorRate: 68, errorCount: 22, knowledge: '极值与最值', correctAnswer: '最大值2,最小值-2', wrongAnswers: [{ answer: '最大值8', count: 12, percent: 55 }, { answer: '最大值2,最小值0', count: 6, percent: 27 }] },
  { index: 2, content: '若f\'(x₀)=0，则x₀是f(x)的极值点', type: '选择题', errorRate: 56, errorCount: 18, knowledge: '极值判断', correctAnswer: 'B.不一定', wrongAnswers: [{ answer: 'A.一定是', count: 14, percent: 78 }, { answer: 'C.一定不是', count: 3, percent: 17 }] },
  { index: 3, content: '求y=xe^x的导数', type: '填空题', errorRate: 38, errorCount: 12, knowledge: '乘积求导', correctAnswer: '(1+x)e^x', wrongAnswers: [{ answer: 'e^x', count: 7, percent: 58 }, { answer: 'xe^x', count: 4, percent: 33 }] },
  { index: 4, content: '曲线y=lnx在x=1处的切线方程', type: '计算题', errorRate: 34, errorCount: 11, knowledge: '切线方程', correctAnswer: 'y=x-1', wrongAnswers: [{ answer: 'y=x', count: 6, percent: 55 }, { answer: 'y=x+1', count: 3, percent: 27 }] },
  { index: 5, content: '下列函数中，导数为2x的是', type: '选择题', errorRate: 12, errorCount: 4, knowledge: '基本导数', correctAnswer: 'A. x²', wrongAnswers: [{ answer: 'C. 2x²', count: 3, percent: 75 }] },
])

const errorRanges = ref([
  { label: '>50%', count: 2, percent: 11, color: '#f56c6c' },
  { label: '30-50%', count: 3, percent: 17, color: '#e6a23c' },
  { label: '10-30%', count: 8, percent: 44, color: '#409eff' },
  { label: '<10%', count: 5, percent: 28, color: '#67c23a' },
])

const knowledgePoints = ref([
  { name: '极值与最值', count: 5 },
  { name: '导数公式', count: 4 },
  { name: '切线方程', count: 3 },
  { name: '复合函数求导', count: 3 },
  { name: '导数应用', count: 2 },
  { name: '基本导数', count: 1 },
])
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.wrong-ans { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.wa-label { font-size: 12px; color: #909399; width: 60px; flex-shrink: 0; }
.range-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.range-label { width: 50px; font-size: 13px; color: #606266; flex-shrink: 0; }
.range-row .el-progress { flex: 1; }
.kp-tag { margin: 0 8px 8px 0; }
</style>
