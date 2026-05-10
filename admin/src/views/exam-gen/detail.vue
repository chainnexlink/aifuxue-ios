<template>
  <div class="page">
    <div class="page-header">
      <el-page-header @back="$router.back()">
        <template #content>试卷详情</template>
      </el-page-header>
    </div>

    <el-row :gutter="16">
      <el-col :span="16">
        <el-card shadow="never" header="基本信息">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="试卷名称">第三章导数综合练习</el-descriptions-item>
            <el-descriptions-item label="出卷教师">张老师</el-descriptions-item>
            <el-descriptions-item label="科目">数学</el-descriptions-item>
            <el-descriptions-item label="试卷类型">课时练习</el-descriptions-item>
            <el-descriptions-item label="生成份数">3 (A/B/C卷)</el-descriptions-item>
            <el-descriptions-item label="题目数量">20题</el-descriptions-item>
            <el-descriptions-item label="总分">100分</el-descriptions-item>
            <el-descriptions-item label="创建时间">2025-05-03 10:30</el-descriptions-item>
            <el-descriptions-item label="章节范围">3.1-3.4 导数的概念与计算</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag type="success">已发布</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card shadow="never" header="难度分布" style="margin-top: 16px;">
          <el-table :data="paperDifficulty" stripe>
            <el-table-column prop="paper" label="试卷" width="100" />
            <el-table-column prop="name" label="类型" width="120" />
            <el-table-column label="简单" width="100">
              <template #default="{ row }">
                <el-progress :percentage="row.easy" :stroke-width="14" :format="() => row.easy + '%'" color="#67c23a" />
              </template>
            </el-table-column>
            <el-table-column label="中等" width="100">
              <template #default="{ row }">
                <el-progress :percentage="row.medium" :stroke-width="14" :format="() => row.medium + '%'" color="#e6a23c" />
              </template>
            </el-table-column>
            <el-table-column label="困难" width="100">
              <template #default="{ row }">
                <el-progress :percentage="row.hard" :stroke-width="14" :format="() => row.hard + '%'" color="#f56c6c" />
              </template>
            </el-table-column>
            <el-table-column prop="questionCount" label="题目数" width="80" align="center" />
          </el-table>
        </el-card>

        <el-card shadow="never" header="题目列表 - A卷" style="margin-top: 16px;">
          <el-table :data="questions" stripe>
            <el-table-column prop="index" label="序号" width="60" align="center" />
            <el-table-column prop="type" label="题型" width="100" />
            <el-table-column prop="content" label="题目摘要" min-width="200" show-overflow-tooltip />
            <el-table-column prop="score" label="分值" width="70" align="center" />
            <el-table-column label="难度" width="90" align="center">
              <template #default="{ row }">
                <el-tag :type="row.difficulty === '简单' ? 'success' : row.difficulty === '中等' ? 'warning' : 'danger'" size="small">{{ row.difficulty }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="knowledge" label="知识点" width="140" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" header="发布信息">
          <el-descriptions :column="1" size="small">
            <el-descriptions-item label="发布班级">高一2班数学</el-descriptions-item>
            <el-descriptions-item label="发布时间">2025-05-03 10:35</el-descriptions-item>
            <el-descriptions-item label="关联作业">第三章导数练习</el-descriptions-item>
            <el-descriptions-item label="提交进度">32/45</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card shadow="never" header="题型分布" style="margin-top: 16px;">
          <div v-for="qt in questionTypes" :key="qt.type" class="qt-row">
            <span class="qt-label">{{ qt.type }}</span>
            <el-progress :percentage="qt.percent" :stroke-width="14" :format="() => qt.count + '题'" />
          </div>
        </el-card>

        <el-card shadow="never" header="操作" style="margin-top: 16px;">
          <el-button type="primary" style="width:100%;margin-bottom:8px;">下载试卷PDF</el-button>
          <el-button style="width:100%;margin-bottom:8px;">重新生成</el-button>
          <el-button type="danger" style="width:100%;">删除试卷</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const paperDifficulty = ref([
  { paper: 'A卷', name: '基础巩固', easy: 70, medium: 20, hard: 10, questionCount: 20 },
  { paper: 'B卷', name: '能力提升', easy: 40, medium: 40, hard: 20, questionCount: 20 },
  { paper: 'C卷', name: '综合运用', easy: 30, medium: 40, hard: 30, questionCount: 20 },
])

const questions = ref([
  { index: 1, type: '选择题', content: '已知函数f(x)=x³-3x²+2，求f\'(x)的值...', score: 5, difficulty: '简单', knowledge: '导数公式' },
  { index: 2, type: '选择题', content: '下列关于导数的描述，正确的是...', score: 5, difficulty: '简单', knowledge: '导数概念' },
  { index: 3, type: '填空题', content: '若y=sin(2x+π/3)，则y\'=___', score: 5, difficulty: '中等', knowledge: '复合函数求导' },
  { index: 4, type: '计算题', content: '求函数f(x)=x·e^x在x=1处的切线方程', score: 10, difficulty: '中等', knowledge: '切线方程' },
  { index: 5, type: '应用题', content: '某工厂的利润函数为P(x)=...求最大利润', score: 15, difficulty: '困难', knowledge: '导数应用' },
])

const questionTypes = ref([
  { type: '选择题', count: 8, percent: 40 },
  { type: '填空题', count: 4, percent: 20 },
  { type: '计算题', count: 5, percent: 25 },
  { type: '应用题', count: 3, percent: 15 },
])
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.qt-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.qt-label { width: 60px; font-size: 13px; color: #606266; flex-shrink: 0; }
.qt-row .el-progress { flex: 1; }
</style>
