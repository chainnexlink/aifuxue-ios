<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push('/user/list')">返回列表</el-button>
        <h2 style="margin:0;">用户详情 — {{ user.nickname }}</h2>
        <el-tag :type="user.status === 'active' ? 'success' : 'danger'" size="small">{{ user.status === 'active' ? '正常' : '封禁' }}</el-tag>
        <!-- ========== 已删除：VIP标签，待ICP许可证下发后恢复 [2026-05-04] ========== -->
      </div>
      <div style="display:flex;gap:10px;">
        <el-button type="primary" icon="Edit" @click="openEditDialog">编辑信息</el-button>
        <el-button :type="user.status === 'active' ? 'warning' : 'success'" @click="toggleBan">{{ user.status === 'active' ? '封禁' : '解封' }}</el-button>
      </div>
    </div>

    <!-- 基本信息卡片 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="profile-card">
            <el-avatar :size="80" style="background:linear-gradient(135deg,#409eff,#a78bfa);font-size:32px;">{{ user.nickname[0] }}</el-avatar>
            <h3>{{ user.nickname }}</h3>
            <p style="color:#909399;">{{ user.phone }} | {{ user.email }}</p>
            <el-descriptions :column="1" border size="small" style="margin-top:16px;">
              <el-descriptions-item label="用户ID">{{ user.id }}</el-descriptions-item>
              <el-descriptions-item label="学段"><el-tag size="small">{{ gradeMap[user.gradeLevel] }}</el-tag></el-descriptions-item>
              <el-descriptions-item label="地区">{{ user.province }}</el-descriptions-item>
              <el-descriptions-item label="角色">{{ user.role === 'student' ? '学生' : '家长' }}</el-descriptions-item>
              <el-descriptions-item label="注册时间">{{ user.createdAt }}</el-descriptions-item>
              <el-descriptions-item label="最后登录">{{ user.lastLogin }}</el-descriptions-item>
              <!-- ========== 已删除：VIP状态行，待ICP许可证下发后恢复 [2026-05-04] ========== -->
              <el-descriptions-item label="用户状态">
                <el-tag type="success" size="small">功能开放体验中</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="16" style="margin-bottom:16px;">
          <el-col :span="6"><el-card shadow="hover" class="mini-stat"><div class="mini-val">{{ user.stats.notes }}</div><div class="mini-label">笔记数</div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#67c23a;">{{ user.stats.exercises }}</div><div class="mini-label">练习次数</div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#e6a23c;">{{ user.stats.mistakes }}</div><div class="mini-label">错题数</div></el-card></el-col>
          <el-col :span="6"><el-card shadow="hover" class="mini-stat"><div class="mini-val" style="color:#a78bfa;">{{ user.stats.studyHours }}</div><div class="mini-label">学习时长(h)</div></el-card></el-col>
        </el-row>
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">近7天学习趋势</span></template>
          <v-chart :option="trendOption" style="height:230px;" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细标签页 -->
    <el-card shadow="hover" style="margin-top:20px;">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="笔记记录" name="notes">
          <el-table :data="userNotes" stripe size="small">
            <el-table-column prop="id" label="ID" width="60" />
            <el-table-column prop="title" label="笔记标题" show-overflow-tooltip min-width="200">
              <template #default="{ row }"><el-link type="primary" @click="$router.push(`/notes/detail/${row.id}`)">{{ row.title }}</el-link></template>
            </el-table-column>
            <el-table-column prop="subject" label="科目" width="80"><template #default="{ row }"><el-tag size="small">{{ row.subject }}</el-tag></template></el-table-column>
            <el-table-column prop="status" label="状态" width="80"><template #default="{ row }"><el-tag :type="row.status === 'done' ? 'success' : 'warning'" size="small">{{ row.status === 'done' ? '已完成' : '处理中' }}</el-tag></template></el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="160" />
          </el-table>
          <div style="text-align:right;margin-top:12px;"><el-button type="primary" link @click="$router.push(`/user/detail/${user.id}/notes`)">查看全部笔记 ></el-button></div>
        </el-tab-pane>

        <el-tab-pane label="练习记录" name="exercises">
          <el-table :data="userExercises" stripe size="small">
            <el-table-column prop="type" label="类型" width="100"><template #default="{ row }"><el-tag size="small">{{ row.type }}</el-tag></template></el-table-column>
            <el-table-column prop="subject" label="科目" width="80" />
            <el-table-column prop="totalQuestions" label="题数" width="60" />
            <el-table-column prop="correctCount" label="正确" width="60" />
            <el-table-column label="正确率" width="120">
              <template #default="{ row }"><el-progress :percentage="Math.round(row.correctCount / row.totalQuestions * 100)" :stroke-width="6" /></template>
            </el-table-column>
            <el-table-column prop="score" label="得分" width="60" />
            <el-table-column prop="duration" label="用时" width="80" />
            <el-table-column prop="createdAt" label="时间" width="160" />
          </el-table>
          <div style="text-align:right;margin-top:12px;"><el-button type="primary" link @click="$router.push(`/user/detail/${user.id}/exercises`)">查看全部练习 ></el-button></div>
        </el-tab-pane>

        <el-tab-pane label="错题本" name="mistakes">
          <el-table :data="userMistakes" stripe size="small">
            <el-table-column prop="ocrText" label="题目" show-overflow-tooltip min-width="250" />
            <el-table-column prop="subject" label="科目" width="80" />
            <el-table-column prop="knowledgePoint" label="知识点" width="120" />
            <el-table-column prop="errorType" label="错误类型" width="100">
              <template #default="{ row }"><el-tag :type="{'计算错误':'warning','概念不清':'danger','审题偏差':'','完全不会':'info'}[row.errorType] as any" size="small">{{ row.errorType }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="createdAt" label="录入时间" width="160" />
          </el-table>
          <div style="text-align:right;margin-top:12px;"><el-button type="primary" link @click="$router.push(`/user/detail/${user.id}/mistakes`)">查看全部错题 ></el-button></div>
        </el-tab-pane>

        <el-tab-pane label="考试记录" name="exams">
          <el-table :data="userExams" stripe size="small">
            <el-table-column prop="type" label="类型" width="100"><template #default="{ row }"><el-tag :type="row.type === '模拟考试' ? 'primary' : 'warning'" size="small">{{ row.type }}</el-tag></template></el-table-column>
            <el-table-column prop="subject" label="科目" width="80" />
            <el-table-column prop="score" label="得分" width="100"><template #default="{ row }"><span style="font-weight:600;">{{ row.score }} / {{ row.totalScore }}</span></template></el-table-column>
            <el-table-column label="得分率" width="120"><template #default="{ row }"><el-progress :percentage="Math.round(row.score / row.totalScore * 100)" :stroke-width="6" /></template></el-table-column>
            <el-table-column prop="duration" label="用时" width="80" />
            <el-table-column prop="createdAt" label="考试时间" width="160" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="操作日志" name="logs">
          <el-timeline>
            <el-timeline-item v-for="log in userLogs" :key="log.id" :timestamp="log.time" placement="top" :type="log.type as any">
              <el-card shadow="never" style="padding:8px 16px;">
                <p style="margin:0;font-weight:500;">{{ log.action }}</p>
                <p style="margin:4px 0 0;font-size:12px;color:#909399;">{{ log.detail }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editVisible" title="编辑用户信息" width="560px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="昵称"><el-input v-model="editForm.nickname" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="editForm.phone" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="editForm.email" /></el-form-item>
        <el-form-item label="学段"><el-select v-model="editForm.gradeLevel" style="width:100%;"><el-option v-for="g in grades" :key="g.value" :label="g.label" :value="g.value" /></el-select></el-form-item>
        <el-form-item label="地区"><el-select v-model="editForm.province" filterable style="width:100%;"><el-option v-for="p in provinces" :key="p" :label="p" :value="p" /></el-select></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

const route = useRoute()
const userId = Number(route.params.id)
const activeTab = ref('notes')

const gradeMap: Record<string, string> = { PRIMARY: '小学', JUNIOR: '初中', SENIOR: '高中', COLLEGE: '大学', ADULT: '成人' }
const grades = [{ label: '小学', value: 'PRIMARY' }, { label: '初中', value: 'JUNIOR' }, { label: '高中', value: 'SENIOR' }]
const provinces = ['北京','上海','广东','江苏','浙江','四川','湖北','河南']

const user = reactive({
  id: userId, nickname: `学霸同学${userId}`, phone: `138${String(10000000 + userId).slice(0, 8)}`,
  email: `user${userId}@example.com`, gradeLevel: 'SENIOR', province: '北京', role: 'student',
  isVip: userId % 3 === 0, status: 'active', createdAt: '2026-01-15 09:30', lastLogin: '2026-05-03 16:20',
  stats: { notes: 32, exercises: 128, mistakes: 24, studyHours: 86 },
})

const trendOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 20, top: 10, bottom: 30 },
  xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'], boundaryGap: false },
  yAxis: { type: 'value' },
  series: [
    { name: '学习时长(分)', type: 'line', data: [45, 60, 30, 90, 55, 120, 80], smooth: true, areaStyle: { opacity: 0.15 }, color: '#409eff' },
    { name: '练习题数', type: 'line', data: [12, 18, 8, 25, 15, 30, 20], smooth: true, areaStyle: { opacity: 0.15 }, color: '#67c23a' },
  ],
})

const userNotes = ref(Array.from({ length: 5 }, (_, i) => ({
  id: i + 1, title: ['高一数学·导数与极值','英语语法·虚拟语气','物理力学·自由落体','化学·氧化还原','语文·劝学翻译'][i],
  subject: ['数学','英语','物理','化学','语文'][i], status: i % 3 === 0 ? 'processing' : 'done', createdAt: `2026-05-0${i + 1} ${10 + i}:00`,
})))

const userExercises = ref(Array.from({ length: 5 }, (_, i) => ({
  type: i % 2 === 0 ? '靶向练习' : '巩固卷', subject: ['数学','英语','物理','化学','语文'][i],
  totalQuestions: [10, 15, 5, 10, 20][i], correctCount: [8, 12, 3, 7, 16][i], score: [85, 80, 60, 70, 80][i],
  duration: `${10 + i * 3}分钟`, createdAt: `2026-05-0${i + 1} ${9 + i}:30`,
})))

const userMistakes = ref(Array.from({ length: 5 }, (_, i) => ({
  ocrText: ['求f(x)=x³-3x的极值','向量a·b的值','n³-n能被6整除','化简三角恒等式','解方程2x²-5x+3=0'][i],
  subject: ['数学','数学','数学','物理','数学'][i], knowledgePoint: ['极值','向量','归纳法','三角','方程'][i],
  errorType: ['计算错误','概念不清','审题偏差','完全不会','计算错误'][i], createdAt: `2026-05-0${i + 1} ${11 + i}:00`,
})))

const userExams = ref(Array.from({ length: 3 }, (_, i) => ({
  type: i === 0 ? '模拟考试' : '押题卷', subject: ['数学','英语','物理'][i],
  score: [120, 132, 78][i], totalScore: [150, 150, 100][i], duration: `${90 + i * 10}分钟`, createdAt: `2026-04-${25 + i} 09:00`,
})))

const userLogs = ref([
  { id: 1, time: '2026-05-03 16:20', action: '用户登录', detail: 'IP: 192.168.1.100, 设备: iPhone 15', type: 'primary' },
  { id: 2, time: '2026-05-03 14:30', action: '完成练习', detail: '数学靶向练习 - 10题/正确8题', type: 'success' },
  { id: 3, time: '2026-05-03 12:00', action: '拍照添加错题', detail: '数学 - 导数应用 - OCR识别成功', type: 'warning' },
  { id: 4, time: '2026-05-02 20:15', action: '生成笔记', detail: '高一数学·导数与极值 - AI生成完成', type: 'success' },
  { id: 5, time: '2026-05-02 18:00', action: '口语练习', detail: '美式口音 - 练习15词 - 平均分88', type: 'primary' },
  { id: 6, time: '2026-05-01 09:30', action: '注册账号', detail: '手机号注册 138xxxx0001', type: '' },
])

// 编辑
const editVisible = ref(false)
const editForm = ref({ nickname: '', phone: '', email: '', gradeLevel: '', province: '' })
function openEditDialog() {
  editForm.value = { nickname: user.nickname, phone: user.phone, email: user.email, gradeLevel: user.gradeLevel, province: user.province }
  editVisible.value = true
}
function saveEdit() {
  Object.assign(user, editForm.value)
  editVisible.value = false
  ElMessage.success('用户信息已更新')
}
function toggleBan() {
  const action = user.status === 'active' ? '封禁' : '解封'
  ElMessageBox.confirm(`确定要${action}该用户吗？`, `${action}确认`, { type: 'warning' }).then(() => {
    user.status = user.status === 'active' ? 'banned' : 'active'
    ElMessage.success(`已${action}`)
  }).catch(() => {})
}
</script>

<style scoped>
.profile-card { text-align: center; padding: 16px 0; }
.profile-card h3 { margin: 12px 0 4px; }
.mini-stat { text-align: center; padding: 16px 0; }
.mini-val { font-size: 28px; font-weight: 700; color: #409eff; }
.mini-label { font-size: 13px; color: #909399; margin-top: 4px; }
</style>
