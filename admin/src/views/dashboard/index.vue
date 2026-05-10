<template>
  <div>
    <div class="stat-row">
      <el-card class="stat-card clickable" shadow="hover" @click="$router.push('/user/list')"><span class="stat-value">12,856</span><span class="stat-label">注册用户</span></el-card>
      <el-card class="stat-card success clickable" shadow="hover" @click="$router.push('/user/list')"><span class="stat-value">3,421</span><span class="stat-label">今日活跃</span></el-card>
      <!-- ========== 已删除：VIP用户统计卡片，待ICP许可证下发后恢复 [2026-05-04] ========== -->
      <el-card class="stat-card warning clickable" shadow="hover" @click="$router.push('/user/list')"><span class="stat-value">856</span><span class="stat-label">广告解锁用户</span></el-card>
      <el-card class="stat-card danger clickable" shadow="hover" @click="$router.push('/notes/list')"><span class="stat-value">48,920</span><span class="stat-label">总笔记数</span></el-card>
      <el-card class="stat-card purple clickable" shadow="hover" @click="$router.push('/exercise/records')"><span class="stat-value">126,340</span><span class="stat-label">练习次数</span></el-card>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">近7天用户活跃趋势</span>
              <el-radio-group v-model="trendRange" size="small">
                <el-radio-button label="7天" /><el-radio-button label="30天" /><el-radio-button label="90天" />
              </el-radio-group>
            </div>
          </template>
          <v-chart :option="trendOption" style="height:320px;" autoresize />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">科目分布</span></template>
          <v-chart :option="pieOption" style="height:320px;" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">错题类型分布</span></template>
          <v-chart :option="mistakeTypeOption" style="height:260px;" autoresize />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">考试成绩分布</span></template>
          <v-chart :option="scoreDistOption" style="height:260px;" autoresize />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">今日数据概览</span></template>
          <div class="today-stats">
            <div class="today-item"><span class="today-num" style="color:#409eff;">128</span><span class="today-label">新增用户</span></div>
            <div class="today-item"><span class="today-num" style="color:#67c23a;">356</span><span class="today-label">新增笔记</span></div>
            <div class="today-item"><span class="today-num" style="color:#e6a23c;">1,280</span><span class="today-label">练习完成</span></div>
            <div class="today-item"><span class="today-num" style="color:#f56c6c;">89</span><span class="today-label">错题录入</span></div>
            <div class="today-item"><span class="today-num" style="color:#a78bfa;">42</span><span class="today-label">考试完成</span></div>
            <div class="today-item"><span class="today-num" style="color:#0ea5e9;">15</span><span class="today-label">待审核</span></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">最近注册用户</span>
              <el-button type="primary" link size="small" @click="$router.push('/user/list')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentUsers" size="small" stripe>
            <el-table-column prop="name" label="昵称" />
            <el-table-column prop="grade" label="学段" width="80" />
            <el-table-column prop="region" label="地区" width="100" />
            <el-table-column prop="time" label="注册时间" width="160" />
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="$router.push(`/user/detail/${row.id}`)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">今日待审核笔记</span>
              <el-button type="primary" link size="small" @click="$router.push('/notes/review')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="pendingNotes" size="small" stripe>
            <el-table-column prop="title" label="笔记标题" show-overflow-tooltip />
            <el-table-column prop="user" label="用户" width="80" />
            <el-table-column prop="subject" label="科目" width="60" />
            <el-table-column prop="time" label="提交时间" width="160" />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="$router.push(`/notes/review/${row.id}`)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">最近操作日志</span>
              <el-button type="primary" link size="small" @click="$router.push('/system/logs')">查看全部</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item v-for="log in recentLogs" :key="log.id" :timestamp="log.time" placement="top" :type="log.type">
              <span style="font-size:13px;">{{ log.content }}</span>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">高频错误知识点 TOP 5</span>
              <el-button type="primary" link size="small" @click="$router.push('/mistakes/stats')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="topMistakes" size="small" stripe>
            <el-table-column prop="rank" label="#" width="40" />
            <el-table-column prop="subject" label="科目" width="60" />
            <el-table-column prop="point" label="知识点" />
            <el-table-column prop="count" label="错题数" width="70" />
            <el-table-column label="占比" width="120">
              <template #default="{ row }"><el-progress :percentage="row.percent" :stroke-width="6" /></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { ref } from 'vue'

use([CanvasRenderer, LineChart, PieChart, BarChart, GridComponent, TooltipComponent, LegendComponent])

const trendRange = ref('7天')

const trendOption = ref({
  tooltip: { trigger: 'axis' },
  legend: { data: ['活跃用户', '新增笔记', '练习完成'], bottom: 0 },
  grid: { left: 40, right: 20, top: 20, bottom: 40 },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], boundaryGap: false },
  yAxis: { type: 'value' },
  series: [
    { name: '活跃用户', type: 'line', data: [2800, 3100, 2950, 3421, 3200, 3650, 3421], smooth: true, areaStyle: { opacity: 0.15 }, lineStyle: { width: 3 }, color: '#409eff' },
    { name: '新增笔记', type: 'line', data: [850, 920, 780, 1050, 890, 1200, 980], smooth: true, areaStyle: { opacity: 0.15 }, lineStyle: { width: 3 }, color: '#67c23a' },
    { name: '练习完成', type: 'line', data: [1200, 1350, 1100, 1500, 1280, 1600, 1400], smooth: true, areaStyle: { opacity: 0.15 }, lineStyle: { width: 3 }, color: '#e6a23c' },
  ],
})

const pieOption = ref({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['40%', '65%'],
    data: [
      { value: 32, name: '数学', itemStyle: { color: '#409eff' } },
      { value: 24, name: '英语', itemStyle: { color: '#67c23a' } },
      { value: 20, name: '语文', itemStyle: { color: '#e6a23c' } },
      { value: 10, name: '物理', itemStyle: { color: '#f56c6c' } },
      { value: 8, name: '化学', itemStyle: { color: '#a78bfa' } },
      { value: 6, name: '其他', itemStyle: { color: '#909399' } },
    ],
    label: { formatter: '{b} {d}%' },
  }],
})

const mistakeTypeOption = ref({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['35%', '60%'],
    data: [
      { value: 2150, name: '计算错误', itemStyle: { color: '#e6a23c' } },
      { value: 3280, name: '概念不清', itemStyle: { color: '#f56c6c' } },
      { value: 1890, name: '审题偏差', itemStyle: { color: '#a78bfa' } },
      { value: 1100, name: '完全不会', itemStyle: { color: '#909399' } },
    ],
    label: { formatter: '{b}\n{d}%', fontSize: 11 },
  }],
})

const scoreDistOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 10, top: 10, bottom: 30 },
  xAxis: { type: 'category', data: ['0-40', '40-60', '60-70', '70-80', '80-90', '90-100'] },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar', data: [12, 45, 120, 280, 350, 180],
    itemStyle: { borderRadius: [4, 4, 0, 0], color: '#409eff' }, barWidth: 24,
  }],
})

const recentUsers = ref([
  { id: 1, name: '小明同学', grade: '高中', region: '北京', time: '2026-05-03 14:30' },
  { id: 2, name: '学霸小李', grade: '初中', region: '上海', time: '2026-05-03 13:22' },
  { id: 3, name: '英语达人', grade: '高中', region: '广东', time: '2026-05-03 12:15' },
  { id: 4, name: '数学爱好者', grade: '初中', region: '江苏', time: '2026-05-03 11:40' },
  { id: 5, name: '物理迷', grade: '高中', region: '浙江', time: '2026-05-03 10:55' },
])

const pendingNotes = ref([
  { id: 101, title: '高一数学 · 三角函数公式推导', user: '小明', subject: '数学', time: '2026-05-03 14:20' },
  { id: 102, title: '英语作文 · 常用句型总结', user: '小李', subject: '英语', time: '2026-05-03 13:50' },
  { id: 103, title: '语文古文 · 劝学翻译注释', user: '小王', subject: '语文', time: '2026-05-03 12:30' },
  { id: 104, title: '物理 · 牛顿三大定律笔记', user: '小赵', subject: '物理', time: '2026-05-03 11:10' },
])

const recentLogs = ref([
  { id: 1, time: '2026-05-03 14:30', content: '管理员审核通过笔记: 三角函数公式推导', type: 'primary' as const },
  { id: 2, time: '2026-05-03 14:10', content: '新用户注册: 小明同学 (北京)', type: 'success' as const },
  { id: 3, time: '2026-05-03 13:45', content: '更新考试配置: 高中数学全国卷', type: 'warning' as const },
  { id: 4, time: '2026-05-03 13:20', content: '封禁违规用户: ID 892', type: 'danger' as const },
  { id: 5, time: '2026-05-03 12:50', content: '导出本周学习报告 (共32份)', type: 'info' as const },
])

const topMistakes = ref([
  { rank: 1, subject: '数学', point: '导数应用', count: 320, percent: 100 },
  { rank: 2, subject: '物理', point: '力的合成与分解', count: 285, percent: 89 },
  { rank: 3, subject: '英语', point: '虚拟语气', count: 260, percent: 81 },
  { rank: 4, subject: '数学', point: '三角函数', count: 240, percent: 75 },
  { rank: 5, subject: '化学', point: '氧化还原反应', count: 215, percent: 67 },
])
</script>

<style scoped>
.clickable { cursor: pointer; transition: transform 0.2s; }
.clickable:hover { transform: translateY(-2px); }
.today-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 8px 0; }
.today-item { text-align: center; padding: 12px 0; border-radius: 8px; background: #f5f7fa; }
.today-num { display: block; font-size: 24px; font-weight: 700; line-height: 1.4; }
.today-label { font-size: 12px; color: #909399; }
</style>
