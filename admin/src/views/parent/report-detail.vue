<template>
  <div>
    <div class="page-header"><div style="display:flex;align-items:center;gap:12px;"><el-button icon="ArrowLeft" @click="$router.push('/parent/reports')">返回列表</el-button><h2 style="margin:0;">学习报告详情 — {{ report.student }}</h2></div>
      <el-button icon="Download" @click="ElMessage.success('报告导出中...')">导出PDF</el-button>
    </div>
    <el-row :gutter="16" style="margin-bottom:20px;">
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val">{{ report.totalStudyTime }}</div><div class="mini-label">学习时长</div></el-card></el-col>
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#67c23a;">{{ report.notesCount }}</div><div class="mini-label">笔记数</div></el-card></el-col>
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#409eff;">{{ report.exerciseCount }}</div><div class="mini-label">练习次数</div></el-card></el-col>
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#e6a23c;">{{ report.mistakesSolved }}</div><div class="mini-label">消灭错题</div></el-card></el-col>
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val" :style="{color: report.avgScore >= 80 ? '#67c23a' : '#e6a23c'}">{{ report.avgScore }}</div><div class="mini-label">平均分</div></el-card></el-col>
      <el-col :span="4"><el-card shadow="hover" class="mini-stat"><div class="mini-val" :style="{color: report.trend === 'up' ? '#67c23a' : '#f56c6c'}">{{ report.trend === 'up' ? '↑' : '↓' }}</div><div class="mini-label">趋势</div></el-card></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover"><template #header><span style="font-weight:600;">各科成绩雷达图</span></template>
          <v-chart :option="radarChart" style="height:300px;" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover"><template #header><span style="font-weight:600;">学习时长趋势</span></template>
          <v-chart :option="studyTrendChart" style="height:300px;" autoresize />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="12">
        <el-card shadow="hover"><template #header><span style="font-weight:600;">各科详细数据</span></template>
          <el-table :data="subjectDetails" stripe size="small">
            <el-table-column prop="subject" label="科目" width="80" />
            <el-table-column prop="studyTime" label="时长" width="80" />
            <el-table-column prop="exercises" label="练习" width="60" />
            <el-table-column prop="avgScore" label="平均分" width="80"><template #default="{ row }"><span :style="{fontWeight:'600',color:row.avgScore>=80?'#67c23a':'#e6a23c'}">{{ row.avgScore }}</span></template></el-table-column>
            <el-table-column label="进步" width="80"><template #default="{ row }"><span :style="{color:row.improvement>0?'#67c23a':'#f56c6c'}">{{ row.improvement > 0 ? '+' : '' }}{{ row.improvement }}</span></template></el-table-column>
            <el-table-column prop="weakPoint" label="薄弱点" min-width="120"><template #default="{ row }"><el-tag type="danger" size="small">{{ row.weakPoint }}</el-tag></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover"><template #header><span style="font-weight:600;">AI学习建议</span></template>
          <el-timeline>
            <el-timeline-item v-for="(tip, idx) in aiTips" :key="idx" :type="tip.type as any">
              <p style="font-weight:500;">{{ tip.title }}</p>
              <p style="font-size:13px;color:#909399;">{{ tip.desc }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, RadarComponent } from 'echarts/components'
import VChart from 'vue-echarts'
use([CanvasRenderer, RadarChart, LineChart, GridComponent, TooltipComponent, RadarComponent])
const route = useRoute()
const report = ref({ student: '小明', week: '2026.4.28 - 5.4', totalStudyTime: '8.5h', notesCount: 12, exerciseCount: 28, mistakesSolved: 15, avgScore: 78, trend: 'up' })
const radarChart = ref({ tooltip: {}, radar: { indicator: [{ name: '数学', max: 100 }, { name: '英语', max: 100 }, { name: '语文', max: 100 }, { name: '物理', max: 100 }, { name: '化学', max: 100 }] },
  series: [{ type: 'radar', data: [{ value: [85, 72, 78, 65, 70], name: '本周', areaStyle: { opacity: 0.2 } }, { value: [80, 68, 75, 60, 68], name: '上周', lineStyle: { type: 'dashed' } }] }] })
const studyTrendChart = ref({ tooltip: { trigger: 'axis' }, grid: { left: 40, right: 20, top: 10, bottom: 30 },
  xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'], boundaryGap: false },
  yAxis: { type: 'value', name: '分钟' }, series: [{ type: 'line', data: [45, 60, 30, 90, 55, 120, 80], smooth: true, areaStyle: { opacity: 0.15 }, color: '#409eff' }] })
const subjectDetails = ref([
  { subject: '数学', studyTime: '2.5h', exercises: 10, avgScore: 85, improvement: 5, weakPoint: '导数' },
  { subject: '英语', studyTime: '2h', exercises: 8, avgScore: 72, improvement: 4, weakPoint: '虚拟语气' },
  { subject: '语文', studyTime: '1.5h', exercises: 4, avgScore: 78, improvement: 3, weakPoint: '文言文' },
  { subject: '物理', studyTime: '1.5h', exercises: 4, avgScore: 65, improvement: -2, weakPoint: '电磁感应' },
  { subject: '化学', studyTime: '1h', exercises: 2, avgScore: 70, improvement: 2, weakPoint: '有机化学' },
])
const aiTips = ref([
  { type: 'danger', title: '重点关注：物理电磁感应', desc: '本周物理成绩下降，建议增加电磁感应相关练习，每天至少做3道相关题目。' },
  { type: 'warning', title: '英语口语需加强', desc: '虚拟语气掌握率偏低，建议结合口语练习模块强化语法应用。' },
  { type: 'success', title: '数学表现优异', desc: '数学持续进步，导数部分还可进一步巩固，推荐做综合应用题。' },
  { type: 'primary', title: '学习习惯建议', desc: '本周学习时间集中在周末，建议平日也保持至少60分钟学习。' },
])
</script>

<style scoped>
.mini-stat { text-align:center; padding:12px 0; }
.mini-val { font-size:24px; font-weight:700; color:#409eff; }
.mini-label { font-size:12px; color:#909399; margin-top:4px; }
</style>
