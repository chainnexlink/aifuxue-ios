<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.back()">返回</el-button>
        <h2>教师详情</h2>
      </div>
      <div style="display:flex;gap:10px;">
        <el-button v-if="teacher.status === 'pending'" type="success" icon="Check" @click="handleApprove">通过认证</el-button>
        <el-button v-if="teacher.status === 'pending'" type="danger" icon="Close" @click="handleReject">拒绝认证</el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">基本信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="教师姓名">{{ teacher.teacherName }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ teacher.phone }}</el-descriptions-item>
            <el-descriptions-item label="学校">{{ teacher.school }}</el-descriptions-item>
            <el-descriptions-item label="学科">
              <el-tag>{{ teacher.subject }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="认证状态">
              <el-tag :type="statusType(teacher.status)">{{ statusText(teacher.status) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="申请时间">{{ teacher.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="审核时间">{{ teacher.reviewedAt || '-' }}</el-descriptions-item>
            <el-descriptions-item label="拒绝原因" v-if="teacher.status === 'rejected'">{{ teacher.rejectReason || '-' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">认证材料</span></template>
          <div class="cert-area">
            <div class="cert-placeholder">
              <el-icon style="font-size:48px;color:#c0c4cc;"><Picture /></el-icon>
              <span style="color:#909399;font-size:14px;">教师资格证照片</span>
            </div>
          </div>
        </el-card>

        <el-card shadow="never">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">管理的班级</span>
              <el-tag>共 {{ classes.length }} 个班级</el-tag>
            </div>
          </template>
          <el-table :data="classes" stripe border>
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="name" label="班级名称" width="180">
              <template #default="{ row }">
                <el-link type="primary" @click="$router.push(`/class/detail/${row.id}`)">{{ row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="grade" label="年级" width="100" />
            <el-table-column prop="subject" label="科目" width="100" />
            <el-table-column prop="inviteCode" label="邀请码" width="150">
              <template #default="{ row }"><el-tag type="info" size="small">{{ row.inviteCode }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="studentCount" label="学生数" width="80" />
            <el-table-column prop="createdAt" label="创建时间" width="160" />
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">教学统计</span></template>
          <div class="stat-list">
            <div class="stat-item"><span class="stat-label">管理班级</span><span class="stat-value">{{ teacher.classCount }} 个</span></div>
            <div class="stat-item"><span class="stat-label">总学生数</span><span class="stat-value">{{ teacher.studentCount }} 人</span></div>
            <div class="stat-item"><span class="stat-label">发布作业</span><span class="stat-value">{{ teacher.homeworkCount }} 份</span></div>
            <div class="stat-item"><span class="stat-label">AI批改次数</span><span class="stat-value">{{ teacher.gradeCount }} 次</span></div>
            <div class="stat-item"><span class="stat-label">邀请注册</span><span class="stat-value">{{ teacher.inviteCount }} 人</span></div>
          </div>
        </el-card>

        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">AI批改配额</span></template>
          <div class="quota-section">
            <div class="quota-row">
              <span>在线批改</span>
              <el-progress :percentage="Math.round(teacher.onlineUsed / teacher.onlineQuota * 100)" :format="() => `${teacher.onlineUsed}/${teacher.onlineQuota}`" />
            </div>
            <div class="quota-row" style="margin-top:16px;">
              <span>离线批改</span>
              <el-progress :percentage="Math.round(teacher.offlineUsed / teacher.offlineQuota * 100)" :format="() => `${teacher.offlineUsed}/${teacher.offlineQuota}`" />
            </div>
          </div>
        </el-card>

        <el-card shadow="never">
          <template #header><span style="font-weight:600;">邀请码</span></template>
          <div class="invite-code-area">
            <div class="invite-code">{{ teacher.inviteCode }}</div>
            <div style="display:flex;justify-content:space-between;font-size:13px;color:#909399;margin-top:8px;">
              <span>已邀请 {{ teacher.inviteCount }} 人</span>
              <span>赠送30天全功能体验</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const _id = route.params.id

const teacher = ref({
  id: 1, teacherName: '张老师', phone: '13812345678', school: '北京市第一中学',
  subject: '数学', status: 'pending' as 'pending' | 'approved' | 'rejected',
  createdAt: '2025-03-15 10:30', reviewedAt: '', rejectReason: '',
  classCount: 3, studentCount: 86, homeworkCount: 24, gradeCount: 156, inviteCount: 12,
  onlineQuota: 50, onlineUsed: 32, offlineQuota: 50, offlineUsed: 18,
  inviteCode: 'TEACHER-A3BX9K',
})

const classes = ref([
  { id: 1, name: '初三数学提高班', grade: '初三', subject: '数学', inviteCode: 'CLASS-A1B2C3', studentCount: 32, createdAt: '2025-03-20 14:00' },
  { id: 2, name: '初三数学基础班', grade: '初三', subject: '数学', inviteCode: 'CLASS-D4E5F6', studentCount: 28, createdAt: '2025-03-22 09:00' },
  { id: 3, name: '初二数学思维班', grade: '初二', subject: '数学', inviteCode: 'CLASS-G7H8I9', studentCount: 26, createdAt: '2025-04-01 16:00' },
])

function statusType(s: string) { return s === 'approved' ? 'success' : s === 'rejected' ? 'danger' : 'warning' }
function statusText(s: string) { return s === 'approved' ? '已通过' : s === 'rejected' ? '已拒绝' : '待审核' }

function handleApprove() {
  ElMessageBox.confirm('确定通过该教师的认证申请？', '审核确认', { type: 'success' }).then(() => {
    teacher.value.status = 'approved'
    teacher.value.reviewedAt = new Date().toLocaleString()
    ElMessage.success('已通过认证')
  }).catch(() => {})
}

function handleReject() {
  ElMessageBox.prompt('请输入拒绝原因', '拒绝认证', { type: 'warning', inputPattern: /.+/, inputErrorMessage: '请输入拒绝原因' }).then(({ value }) => {
    teacher.value.status = 'rejected'
    teacher.value.rejectReason = value
    teacher.value.reviewedAt = new Date().toLocaleString()
    ElMessage.info('已拒绝认证')
  }).catch(() => {})
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 700; margin: 0; }
.cert-area { display: flex; gap: 16px; }
.cert-placeholder { width: 240px; height: 160px; border: 2px dashed #dcdfe6; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
.stat-list { display: flex; flex-direction: column; gap: 16px; }
.stat-item { display: flex; justify-content: space-between; align-items: center; }
.stat-label { font-size: 14px; color: #909399; }
.stat-value { font-size: 16px; font-weight: 600; color: #303133; }
.quota-row { display: flex; flex-direction: column; gap: 4px; }
.quota-row span { font-size: 13px; color: #606266; }
.invite-code-area { text-align: center; }
.invite-code { font-size: 24px; font-weight: 700; color: #409eff; letter-spacing: 2px; padding: 16px; background: #f0f7ff; border-radius: 12px; }
</style>
