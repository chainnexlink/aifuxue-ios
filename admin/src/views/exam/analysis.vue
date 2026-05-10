<template>
  <div>
    <div class="page-header"><h2>成绩分析</h2></div>
    <div class="filter-bar">
      <el-select v-model="gradeF" placeholder="学段" style="width:120px;"><el-option label="小学" value="小学" /><el-option label="初中" value="初中" /><el-option label="高中" value="高中" /></el-select>
      <el-select v-model="subjectF" placeholder="科目" style="width:120px;"><el-option v-for="s in subjects" :key="s" :label="s" :value="s" /></el-select>
      <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width:280px;" />
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">分数段分布</span></template>
          <v-chart :option="scoreDistChart" style="height:300px;" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">平均分趋势</span></template>
          <v-chart :option="avgTrendChart" style="height:300px;" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">科目对比</span></template>
          <v-chart :option="subjectCompareChart" style="height:300px;" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">难度通过率</span></template>
          <v-chart :option="difficultyChart" style="height:300px;" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" style="margin-top:20px;">
      <template #header><span style="font-weight:600;">成绩排行榜 TOP 20</span></template>
      <el-table :data="rankList" stripe>
        <el-table-column label="排名" width="70"><template #default="{ $index }"><el-tag :type="$index < 3 ? 'warning' : 'info'" size="small">{{ $index + 1 }}</el-tag></template></el-table-column>
        <el-table-column prop="user" label="用户" width="120"><template #default="{ row }"><el-link type="primary" @click="$router.push(`/user/detail/${row.userId}`)">{{ row.user }}</el-link></template></el-table-column>
        <el-table-column prop="grade" label="学段" width="80" />
        <el-table-column prop="totalExams" label="考试次数" width="90" />
        <el-table-column prop="avgScore" label="平均分" width="90"><template #default="{ row }"><span style="font-weight:600;color:#409eff;">{{ row.avgScore }}</span></template></el-table-column>
        <el-table-column prop="highScore" label="最高分" width="90"><template #default="{ row }"><span style="color:#67c23a;">{{ row.highScore }}</span></template></el-table-column>
        <el-table-column label="平均得分率" width="140"><template #default="{ row }"><el-progress :percentage="row.avgRate" :stroke-width="6" /></template></el-table-column>
        <el-table-column prop="improvement" label="提升" width="80"><template #default="{ row }"><span :style="{color: row.improvement > 0 ? '#67c23a' : '#f56c6c'}">{{ row.improvement > 0 ? '+' : '' }}{{ row.improvement }}%</span></template></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, RadarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, RadarComponent } from 'echarts/components'
import VChart from 'vue-echarts'
use([CanvasRenderer, BarChart, LineChart, RadarChart, GridComponent, TooltipComponent, LegendComponent, RadarComponent])

const gradeF = ref('高中'); const subjectF = ref('数学'); const dateRange = ref(null)
const subjects = ['数学','语文','英语','物理','化学','生物']

const scoreDistChart = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 50, right: 20, top: 10, bottom: 30 },
  xAxis: { type: 'category', data: ['0-60','60-70','70-80','80-90','90-100','100+'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [15, 28, 45, 68, 52, 34], color: '#409eff', barWidth: 35, itemStyle: { borderRadius: [4,4,0,0] } }],
})

const avgTrendChart = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 50, right: 20, top: 30, bottom: 30 },
  legend: { data: ['平均分','最高分','最低分'] },
  xAxis: { type: 'category', data: ['1月','2月','3月','4月','5月'], boundaryGap: false },
  yAxis: { type: 'value', min: 40 },
  series: [
    { name: '平均分', type: 'line', data: [78, 80, 82, 85, 83], smooth: true, color: '#409eff' },
    { name: '最高分', type: 'line', data: [142, 145, 148, 146, 149], smooth: true, color: '#67c23a', lineStyle: { type: 'dashed' } },
    { name: '最低分', type: 'line', data: [32, 38, 42, 45, 40], smooth: true, color: '#f56c6c', lineStyle: { type: 'dashed' } },
  ],
})

const subjectCompareChart = ref({
  tooltip: {},
  radar: { indicator: [{ name: '数学', max: 100 }, { name: '语文', max: 100 }, { name: '英语', max: 100 }, { name: '物理', max: 100 }, { name: '化学', max: 100 }] },
  series: [{ type: 'radar', data: [
    { value: [82, 75, 88, 68, 72], name: '平均得分率', areaStyle: { opacity: 0.2 } },
  ]}],
})

const difficultyChart = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 50, right: 20, top: 10, bottom: 30 },
  xAxis: { type: 'category', data: ['简单题','中等题','困难题'] },
  yAxis: { type: 'value', max: 100 },
  series: [{ type: 'bar', data: [92, 72, 45], color: ['#67c23a','#e6a23c','#f56c6c'], barWidth: 50, itemStyle: { borderRadius: [4,4,0,0] } }],
})

const rankList = ref(Array.from({ length: 20 }, (_, i) => ({
  userId: i + 1, user: ['小明','学霸','英语达人','数学王','物理迷','化学家','历史通','地理控','小张','小刘','小林','小黄','小杨','小胡','小彭','小唐','小曹','小邓','小冯','小蒋'][i],
  grade: ['高中','初中','高中'][i % 3], totalExams: Math.floor(Math.random() * 15) + 5,
  avgScore: (95 - i * 2.5).toFixed(1), highScore: 148 - i * 3, avgRate: 95 - i * 3,
  improvement: [8, 5, 3, 12, -2, 6, 0, -1, 4, 7, 2, -3, 5, 1, 8, -2, 3, 6, 4, 1][i],
})))
</script>
