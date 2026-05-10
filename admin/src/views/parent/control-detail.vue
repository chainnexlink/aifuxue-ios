<template>
  <div>
    <div class="page-header"><div style="display:flex;align-items:center;gap:12px;"><el-button icon="ArrowLeft" @click="$router.push('/parent/control')">返回列表</el-button><h2 style="margin:0;">家长控制详情 — {{ control.student }}</h2></div>
      <div style="display:flex;gap:10px;"><el-button type="warning" @click="resetPassword">重置密码</el-button><el-button type="danger" @click="removeLimit">解除所有限制</el-button></div>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover"><template #header><span style="font-weight:600;">控制信息</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="学生"><el-link type="primary" @click="$router.push(`/user/detail/${control.studentId}`)">{{ control.student }}</el-link></el-descriptions-item>
            <el-descriptions-item label="年级">{{ control.grade }}</el-descriptions-item>
            <el-descriptions-item label="密码状态"><el-tag :type="control.hasPassword ? 'success' : 'danger'" size="small">{{ control.hasPassword ? '已设置' : '未设置' }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="每日限时">{{ control.dailyLimit ? control.dailyLimit + '分钟' : '无限制' }}</el-descriptions-item>
            <el-descriptions-item label="今日已用">{{ control.todayUsage }}分钟</el-descriptions-item>
            <el-descriptions-item label="科目设置"><el-tag v-for="s in control.subjects" :key="s" size="small" style="margin:2px;">{{ s }}</el-tag></el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card shadow="hover" style="margin-top:20px;"><template #header><span style="font-weight:600;">调整限制</span></template>
          <el-form label-width="80px">
            <el-form-item label="每日限时"><el-input-number v-model="control.dailyLimit" :min="0" :max="480" :step="30" /> 分钟</el-form-item>
            <el-form-item label="科目"><el-checkbox-group v-model="control.subjects"><el-checkbox v-for="s in allSubjects" :key="s" :value="s">{{ s }}</el-checkbox></el-checkbox-group></el-form-item>
            <el-form-item><el-button type="primary" @click="saveLimit">保存设置</el-button></el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover"><template #header><span style="font-weight:600;">近7天使用时长</span></template>
          <v-chart :option="usageChart" style="height:280px;" autoresize />
        </el-card>
        <el-card shadow="hover" style="margin-top:20px;"><template #header><span style="font-weight:600;">使用记录</span></template>
          <el-table :data="usageLogs" stripe size="small">
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="startTime" label="开始" width="100" />
            <el-table-column prop="endTime" label="结束" width="100" />
            <el-table-column prop="duration" label="时长" width="80" />
            <el-table-column prop="module" label="使用模块" min-width="200"><template #default="{ row }"><el-tag v-for="m in row.modules" :key="m" size="small" style="margin:2px;">{{ m }}</el-tag></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])
const route = useRoute()
const allSubjects = ['语文','数学','英语','物理','化学','生物']
const control = reactive({ studentId: Number(route.params.id), student: '小明', grade: '高一', hasPassword: true, dailyLimit: 120, todayUsage: 45, subjects: ['语文','数学','英语'] as string[] })
const usageChart = ref({ tooltip: { trigger: 'axis' }, grid: { left: 50, right: 20, top: 10, bottom: 30 },
  xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'] },
  yAxis: { type: 'value', name: '分钟' },
  series: [{ type: 'bar', data: [85, 60, 95, 45, 78, 120, 45], color: '#409eff', barWidth: 30, itemStyle: { borderRadius: [4,4,0,0] },
    markLine: { data: [{ yAxis: 120, name: '限制', lineStyle: { color: '#f56c6c', type: 'dashed' } }] } }] })
const usageLogs = ref(Array.from({ length: 7 }, (_, i) => ({
  date: `2026-05-0${7 - i}`, startTime: `${8 + (i % 3)}:00`, endTime: `${10 + (i % 3)}:${[30,45,15][i%3]}`,
  duration: `${[85,60,95,45,78,120,45][i]}分钟`, modules: [['笔记','练习'],['口语','笔记'],['考试','练习','错题'],['笔记'],['练习','口语'],['笔记','练习','考试'],['口语']][i],
})))
function resetPassword() { ElMessageBox.confirm('确定重置家长密码？', '重置', { type: 'warning' }).then(() => ElMessage.success('密码已重置')).catch(() => {}) }
function removeLimit() { ElMessageBox.confirm('解除所有限制？', '确认', { type: 'warning' }).then(() => { control.dailyLimit = 0; ElMessage.success('已解除') }).catch(() => {}) }
function saveLimit() { ElMessage.success('设置已保存') }
</script>
