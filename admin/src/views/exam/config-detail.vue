<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push('/exam/config')">返回配置</el-button>
        <h2 style="margin:0;">考试配置详情 — {{ config.grade }}{{ config.subject }}</h2>
      </div>
      <el-button type="primary" icon="Edit" @click="editVisible = true">编辑配置</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">基本信息</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="学段">{{ config.grade }}</el-descriptions-item>
            <el-descriptions-item label="科目"><el-tag>{{ config.subject }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="适用地区">{{ config.region }}</el-descriptions-item>
            <el-descriptions-item label="总分"><el-tag type="primary" size="large">{{ config.total }}分</el-tag></el-descriptions-item>
            <el-descriptions-item label="考试时长">{{ config.duration }}分钟</el-descriptions-item>
            <el-descriptions-item label="使用次数">{{ config.usedCount }}次</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ config.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ config.updatedAt }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">试卷结构</span></template>
          <el-table :data="config.sections" stripe border>
            <el-table-column prop="name" label="题型" width="120" />
            <el-table-column prop="count" label="题数" width="80" />
            <el-table-column prop="score" label="每题分值" width="100" />
            <el-table-column label="小计" width="80"><template #default="{ row }"><span style="font-weight:600;">{{ row.count * row.score }}分</span></template></el-table-column>
            <el-table-column label="占比" width="140"><template #default="{ row }"><el-progress :percentage="Math.round(row.count * row.score / config.total * 100)" :stroke-width="6" /></template></el-table-column>
            <el-table-column prop="difficulty" label="难度分布" min-width="200">
              <template #default="{ row }">
                <span style="font-size:12px;">简单{{ row.diffDist?.[0] || 30 }}% 中等{{ row.diffDist?.[1] || 50 }}% 困难{{ row.diffDist?.[2] || 20 }}%</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:16px;text-align:right;"><el-tag type="primary" size="large">总计：{{ config.total }}分 / {{ config.sections.reduce((a: number, s: any) => a + s.count, 0) }}题</el-tag></div>
        </el-card>
        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">分值分布</span></template>
          <v-chart :option="pieOption" style="height:260px;" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editVisible" title="编辑考试配置" width="700px">
      <el-form label-width="100px">
        <el-form-item label="学段"><el-select v-model="config.grade" style="width:100%;"><el-option label="小学" value="小学" /><el-option label="初中" value="初中" /><el-option label="高中" value="高中" /></el-select></el-form-item>
        <el-form-item label="科目"><el-select v-model="config.subject" style="width:100%;"><el-option v-for="s in ['数学','语文','英语','物理','化学','生物']" :key="s" :label="s" :value="s" /></el-select></el-form-item>
        <el-form-item label="适用地区"><el-input v-model="config.region" /></el-form-item>
        <el-form-item label="时长(分钟)"><el-input-number v-model="config.duration" :min="30" :max="180" /></el-form-item>
        <el-divider>试卷结构</el-divider>
        <div v-for="(s, idx) in config.sections" :key="idx" style="display:flex;gap:12px;margin-bottom:12px;align-items:center;">
          <el-input v-model="s.name" placeholder="题型" style="width:120px;" />
          <el-input-number v-model="s.count" :min="1" placeholder="题数" />
          <el-input-number v-model="s.score" :min="1" :step="0.5" placeholder="分值" />
          <span style="color:#909399;">={{ s.count * s.score }}分</span>
          <el-button type="danger" link icon="Delete" @click="config.sections.splice(idx, 1)" />
        </div>
        <el-button type="primary" text icon="Plus" @click="config.sections.push({ name: '', count: 5, score: 2, diffDist: [30,50,20] })">添加题型</el-button>
      </el-form>
      <template #footer><el-button @click="editVisible = false">取消</el-button><el-button type="primary" @click="saveConfig">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
use([CanvasRenderer, PieChart, TooltipComponent])

const route = useRoute()
const editVisible = ref(false)
const config = reactive({
  id: Number(route.params.id), grade: '高中', subject: '数学', region: '全国通用', total: 150, duration: 120,
  usedCount: 342, createdAt: '2026-01-15', updatedAt: '2026-05-01',
  sections: [
    { name: '选择题', count: 12, score: 5, diffDist: [30, 50, 20] },
    { name: '填空题', count: 4, score: 5, diffDist: [20, 50, 30] },
    { name: '解答题', count: 6, score: 12, diffDist: [10, 40, 50] },
  ],
})

const pieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{ type: 'pie', radius: ['35%','60%'],
    data: config.sections.map((s, i) => ({ value: s.count * s.score, name: s.name, itemStyle: { color: ['#409eff','#67c23a','#e6a23c','#f56c6c','#a78bfa'][i % 5] } })),
    label: { formatter: '{b}\n{c}分 ({d}%)' },
  }],
}))

function saveConfig() { config.total = config.sections.reduce((a, s) => a + s.count * s.score, 0); editVisible.value = false; ElMessage.success('配置已保存') }
</script>
