<template>
  <div>
    <div class="page-header"><h2>错题统计</h2></div>
    <div class="stat-row">
      <el-card class="stat-card" shadow="hover"><span class="stat-value">8,420</span><span class="stat-label">总错题数</span></el-card>
      <el-card class="stat-card warning" shadow="hover"><span class="stat-value">2,150</span><span class="stat-label">计算错误</span></el-card>
      <el-card class="stat-card danger" shadow="hover"><span class="stat-value">3,280</span><span class="stat-label">概念不清</span></el-card>
      <el-card class="stat-card purple" shadow="hover"><span class="stat-value">1,890</span><span class="stat-label">审题偏差</span></el-card>
      <el-card class="stat-card" shadow="hover"><span class="stat-value">1,100</span><span class="stat-label">完全不会</span></el-card>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">各科目错题分布</span></template>
          <v-chart :option="subjectChart" style="height:300px;" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">错误类型占比</span></template>
          <v-chart :option="typeChart" style="height:300px;" autoresize />
        </el-card>
      </el-col>
    </el-row>
    <el-card shadow="hover" style="margin-top:20px;">
      <template #header><span style="font-weight:600;">高频错误知识点 TOP 10</span></template>
      <el-table :data="topPoints" stripe>
        <el-table-column prop="rank" label="排名" width="70" />
        <el-table-column prop="subject" label="科目" width="80" />
        <el-table-column prop="point" label="知识点" />
        <el-table-column prop="count" label="错题数" width="100" />
        <el-table-column label="占比" width="160">
          <template #default="{ row }"><el-progress :percentage="row.percent" :stroke-width="8" /></template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/mistakes/knowledge/${encodeURIComponent(row.point)}`)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { ref } from 'vue'

use([CanvasRenderer, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const subjectChart = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 60, right: 20, top: 10, bottom: 30 },
  xAxis: { type: 'category', data: ['数学','英语','物理','化学','语文','生物'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [2800, 1950, 1300, 980, 850, 540], color: '#409eff', barWidth: 30, itemStyle: { borderRadius: [4, 4, 0, 0] } }],
})

const typeChart = ref({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['40%', '65%'],
    data: [
      { value: 2150, name: '计算错误', itemStyle: { color: '#e6a23c' } },
      { value: 3280, name: '概念不清', itemStyle: { color: '#f56c6c' } },
      { value: 1890, name: '审题偏差', itemStyle: { color: '#a78bfa' } },
      { value: 1100, name: '完全不会', itemStyle: { color: '#909399' } },
    ],
    label: { formatter: '{b}\n{d}%' },
  }],
})

const topPoints = ref([
  { rank: 1, subject: '数学', point: '导数应用', count: 320, percent: 100 },
  { rank: 2, subject: '物理', point: '力的合成与分解', count: 285, percent: 89 },
  { rank: 3, subject: '英语', point: '虚拟语气', count: 260, percent: 81 },
  { rank: 4, subject: '数学', point: '三角函数', count: 240, percent: 75 },
  { rank: 5, subject: '化学', point: '氧化还原反应', count: 215, percent: 67 },
  { rank: 6, subject: '数学', point: '概率统计', count: 198, percent: 62 },
  { rank: 7, subject: '物理', point: '电磁感应', count: 180, percent: 56 },
  { rank: 8, subject: '英语', point: '定语从句', count: 165, percent: 52 },
  { rank: 9, subject: '语文', point: '文言文翻译', count: 150, percent: 47 },
  { rank: 10, subject: '化学', point: '离子方程式', count: 138, percent: 43 },
])
</script>
