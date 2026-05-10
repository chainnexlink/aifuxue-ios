<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push(`/user/detail/${$route.params.id}`)">返回用户详情</el-button>
        <h2 style="margin:0;">用户错题本 — 学霸同学{{ $route.params.id }}</h2>
      </div>
    </div>
    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">错题类型分布</span></template>
          <v-chart :option="pieOption" style="height:220px;" autoresize />
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">各科错题数</span></template>
          <v-chart :option="barOption" style="height:220px;" autoresize />
        </el-card>
      </el-col>
    </el-row>
    <el-card shadow="never">
      <el-table :data="mistakes" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="ocrText" label="题目" show-overflow-tooltip min-width="250" />
        <el-table-column prop="subject" label="科目" width="80"><template #default="{ row }"><el-tag size="small">{{ row.subject }}</el-tag></template></el-table-column>
        <el-table-column prop="knowledgePoint" label="知识点" width="120" />
        <el-table-column prop="errorType" label="错误类型" width="100"><template #default="{ row }"><el-tag :type="{'计算错误':'warning','概念不清':'danger','审题偏差':'','完全不会':'info'}[row.errorType] as any" size="small">{{ row.errorType }}</el-tag></template></el-table-column>
        <el-table-column label="已消灭" width="80"><template #default="{ row }"><el-icon :color="row.resolved ? '#67c23a' : '#c0c4cc'"><Select v-if="row.resolved" /><CloseBold v-else /></el-icon></template></el-table-column>
        <el-table-column prop="createdAt" label="录入时间" width="160" />
        <el-table-column label="操作" width="80"><template #default="{ row }"><el-button type="primary" link size="small" @click="$router.push(`/mistakes/detail/${row.id}`)">详情</el-button></template></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
use([CanvasRenderer, PieChart, BarChart, GridComponent, TooltipComponent])

const pieOption = ref({
  tooltip: { trigger: 'item' },
  series: [{ type: 'pie', radius: ['40%','65%'], data: [
    { value: 8, name: '计算错误', itemStyle: { color: '#e6a23c' } }, { value: 10, name: '概念不清', itemStyle: { color: '#f56c6c' } },
    { value: 4, name: '审题偏差', itemStyle: { color: '#a78bfa' } }, { value: 2, name: '完全不会', itemStyle: { color: '#909399' } },
  ], label: { formatter: '{b}\n{d}%' } }],
})
const barOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 10, top: 10, bottom: 30 },
  xAxis: { type: 'category', data: ['数学','英语','物理','化学','语文'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [10, 5, 4, 3, 2], color: '#409eff', barWidth: 30, itemStyle: { borderRadius: [4,4,0,0] } }],
})
const mistakes = ref(Array.from({ length: 15 }, (_, i) => ({
  id: i + 1, ocrText: ['求f(x)=x³-3x的极值','向量a·b','n³-n被6整除','化简三角恒等','解方程2x²-5x+3=0'][i % 5],
  subject: ['数学','数学','数学','物理','英语'][i % 5], knowledgePoint: ['极值','向量','归纳法','三角','语法'][i % 5],
  errorType: ['计算错误','概念不清','审题偏差','完全不会'][i % 4], resolved: i % 3 === 0,
  createdAt: `2026-0${(i % 4)+1}-${String((i%28)+1).padStart(2,'0')} ${10+(i%12)}:00`,
})))
</script>
