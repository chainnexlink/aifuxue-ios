<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push('/mistakes/stats')">返回统计</el-button>
        <h2 style="margin:0;">知识点错题 — {{ knowledgePoint }}</h2>
      </div>
    </div>
    <div class="stat-row">
      <el-card class="stat-card danger" shadow="hover"><span class="stat-value">{{ stats.totalMistakes }}</span><span class="stat-label">总错题数</span></el-card>
      <el-card class="stat-card" shadow="hover"><span class="stat-value">{{ stats.totalUsers }}</span><span class="stat-label">涉及用户</span></el-card>
      <el-card class="stat-card success" shadow="hover"><span class="stat-value">{{ stats.resolvedRate }}%</span><span class="stat-label">消灭率</span></el-card>
      <el-card class="stat-card warning" shadow="hover"><span class="stat-value">{{ stats.avgRetry }}</span><span class="stat-label">平均重做</span></el-card>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">错误类型分布</span></template>
          <v-chart :option="typeChart" style="height:260px;" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">每月新增错题趋势</span></template>
          <v-chart :option="trendChart" style="height:260px;" autoresize />
        </el-card>
      </el-col>
    </el-row>
    <el-card shadow="never" style="margin-top:20px;">
      <template #header><span style="font-weight:600;">该知识点所有错题</span></template>
      <el-table :data="mistakes" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="user" label="用户" width="100"><template #default="{ row }"><el-link type="primary" @click="$router.push(`/user/detail/${row.userId}`)">{{ row.user }}</el-link></template></el-table-column>
        <el-table-column prop="ocrText" label="题目" show-overflow-tooltip min-width="250" />
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
import { useRoute } from 'vue-router'
import { Select, CloseBold } from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
use([CanvasRenderer, PieChart, LineChart, GridComponent, TooltipComponent])
const route = useRoute()
const knowledgePoint = decodeURIComponent(route.params.point as string)
const stats = ref({ totalMistakes: 320, totalUsers: 185, resolvedRate: 42, avgRetry: 2.3 })
const typeChart = ref({ tooltip: { trigger: 'item' }, series: [{ type: 'pie', radius: ['35%','60%'], data: [
  { value: 120, name: '计算错误', itemStyle: { color: '#e6a23c' } }, { value: 105, name: '概念不清', itemStyle: { color: '#f56c6c' } },
  { value: 60, name: '审题偏差', itemStyle: { color: '#a78bfa' } }, { value: 35, name: '完全不会', itemStyle: { color: '#909399' } },
], label: { formatter: '{b}\n{d}%' } }] })
const trendChart = ref({ tooltip: { trigger: 'axis' }, grid: { left: 40, right: 20, top: 10, bottom: 30 },
  xAxis: { type: 'category', data: ['1月','2月','3月','4月','5月'], boundaryGap: false }, yAxis: { type: 'value' },
  series: [{ type: 'line', data: [42, 55, 68, 75, 80], smooth: true, areaStyle: { opacity: 0.15 }, color: '#f56c6c' }] })
const mistakes = ref(Array.from({ length: 15 }, (_, i) => ({
  id: i + 1, userId: (i % 5) + 1, user: ['小明','小李','小王','小赵','小陈'][i % 5],
  ocrText: ['求f(x)=x³-3x的极值','求f(x)=2x³-6x+1在[-1,3]的最值','函数f(x)=x⁴-2x²的单调区间','求曲线y=x³在x=1处的切线','f(x)=xe^(-x)的极值'][i % 5],
  errorType: ['计算错误','概念不清','审题偏差','完全不会'][i % 4], resolved: i % 3 === 0,
  createdAt: `2026-0${(i % 4)+1}-${String((i%28)+1).padStart(2,'0')} ${10+(i%12)}:00`,
})))
</script>
