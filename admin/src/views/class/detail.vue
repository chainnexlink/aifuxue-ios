<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.back()">返回</el-button>
        <h2>班级详情</h2>
      </div>
      <div style="display:flex;gap:10px;">
        <el-button type="primary" icon="Edit" @click="showEditDialog = true">编辑</el-button>
        <el-button type="warning" icon="Folder" @click="handleArchive">归档</el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">班级信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="班级名称">{{ cls.name }}</el-descriptions-item>
            <el-descriptions-item label="教师">
              <el-link type="primary" @click="$router.push(`/teacher/detail/${cls.teacherId}`)">{{ cls.teacherName }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="年级"><el-tag type="info" size="small">{{ cls.grade }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="科目"><el-tag size="small">{{ cls.subject }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="邀请码">
              <code style="font-size:18px;font-weight:700;color:#409eff;letter-spacing:2px;">{{ cls.inviteCode }}</code>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="cls.status === 'active' ? 'success' : 'info'">{{ cls.status === 'active' ? '活跃' : '已归档' }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ cls.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="最近活跃">{{ cls.lastActiveAt }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">学生列表 ({{ students.length }})</span>
              <el-button type="primary" size="small" icon="Plus" @click="$router.push(`/class/detail/${cls.id}/members`)">管理成员</el-button>
            </div>
          </template>
          <el-table :data="students" stripe border>
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="nickname" label="学生昵称" width="120">
              <template #default="{ row }">
                <el-link type="primary" @click="$router.push(`/user/detail/${row.userId}`)">{{ row.nickname }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="130" />
            <el-table-column label="作业完成率" width="140">
              <template #default="{ row }">
                <el-progress :percentage="row.completionRate" :stroke-width="6" />
              </template>
            </el-table-column>
            <el-table-column label="平均分" width="80">
              <template #default="{ row }"><span :style="{ color: row.avgScore >= 80 ? '#67c23a' : row.avgScore >= 60 ? '#e6a23c' : '#f56c6c', fontWeight: 600 }">{{ row.avgScore }}</span></template>
            </el-table-column>
            <el-table-column prop="joinedAt" label="加入时间" width="160" />
          </el-table>
        </el-card>

        <el-card shadow="never">
          <template #header><span style="font-weight:600;">近期作业</span></template>
          <el-table :data="recentHomework" stripe border>
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="name" label="作业名称" width="200">
              <template #default="{ row }">
                <el-link type="primary" @click="$router.push(`/homework/detail/${row.id}`)">{{ row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }"><el-tag :type="row.type === 'online' ? 'primary' : 'warning'" size="small">{{ row.type === 'online' ? '在线' : '离线' }}</el-tag></template>
            </el-table-column>
            <el-table-column label="提交进度" width="160">
              <template #default="{ row }">
                <el-progress :percentage="Math.round(row.submitted / row.total * 100)" :format="() => `${row.submitted}/${row.total}`" :stroke-width="6" />
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="截止时间" width="160" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'collecting' ? '' : row.status === 'grading' ? 'warning' : 'success'" size="small">
                  {{ row.status === 'collecting' ? '收集中' : row.status === 'grading' ? '批改中' : '已完成' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">班级统计</span></template>
          <div class="stat-grid">
            <div class="stat-box"><div class="stat-num" style="color:#409eff;">{{ cls.studentCount }}</div><div class="stat-label">学生数</div></div>
            <div class="stat-box"><div class="stat-num" style="color:#67c23a;">{{ cls.homeworkCount }}</div><div class="stat-label">作业数</div></div>
            <div class="stat-box"><div class="stat-num" style="color:#e6a23c;">{{ cls.avgScore }}</div><div class="stat-label">平均分</div></div>
            <div class="stat-box"><div class="stat-num" style="color:#a78bfa;">{{ cls.completionRate }}%</div><div class="stat-label">完成率</div></div>
          </div>
        </el-card>

        <el-card shadow="never">
          <template #header><span style="font-weight:600;">邀请码二维码</span></template>
          <div style="text-align:center;padding:20px 0;">
            <div style="width:160px;height:160px;margin:0 auto;background:#f5f7fa;border-radius:12px;display:flex;align-items:center;justify-content:center;border:2px dashed #dcdfe6;">
              <span style="color:#909399;font-size:14px;">QR Code</span>
            </div>
            <div style="margin-top:16px;font-size:20px;font-weight:700;color:#409eff;letter-spacing:2px;">{{ cls.inviteCode }}</div>
            <el-button type="primary" style="margin-top:12px;" @click="handleCopyCode">复制邀请码</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="showEditDialog" title="编辑班级" width="480px">
      <el-form label-width="80px">
        <el-form-item label="班级名称"><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="年级"><el-select v-model="editForm.grade" style="width:100%;">
          <el-option v-for="g in grades" :key="g" :label="g" :value="g" />
        </el-select></el-form-item>
        <el-form-item label="科目"><el-select v-model="editForm.subject" style="width:100%;">
          <el-option v-for="s in subjects" :key="s" :label="s" :value="s" />
        </el-select></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const grades = ['小一', '小二', '小三', '小四', '小五', '小六', '初一', '初二', '初三', '高一', '高二', '高三']
const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理']

const cls = ref({
  id: 1, name: '初三数学提高班', teacherId: 1, teacherName: '张老师',
  grade: '初三', subject: '数学', inviteCode: 'CLASS-A1B2C3',
  status: 'active' as 'active' | 'archived',
  studentCount: 32, homeworkCount: 12, avgScore: 78, completionRate: 85,
  createdAt: '2025-03-20 14:00', lastActiveAt: '2025-04-28 16:30',
})

const students = ref(Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, userId: 100 + i, nickname: `学生${i + 1}`, phone: `139${String(10000000 + i).slice(0, 8)}`,
  completionRate: 60 + Math.floor(Math.random() * 40),
  avgScore: 55 + Math.floor(Math.random() * 40),
  joinedAt: `2025-03-2${i % 9 + 1} 10:00`,
})))

const recentHomework = ref([
  { id: 1, name: '第三章一元二次方程', type: 'online', submitted: 28, total: 32, deadline: '2025-04-30 23:59', status: 'collecting' },
  { id: 2, name: '期中模拟试卷', type: 'offline', submitted: 32, total: 32, deadline: '2025-04-25 23:59', status: 'grading' },
  { id: 3, name: '二次函数练习', type: 'online', submitted: 30, total: 32, deadline: '2025-04-20 23:59', status: 'completed' },
])

const showEditDialog = ref(false)
const editForm = ref({ name: cls.value.name, grade: cls.value.grade, subject: cls.value.subject })

function handleSaveEdit() {
  cls.value.name = editForm.value.name
  cls.value.grade = editForm.value.grade
  cls.value.subject = editForm.value.subject
  showEditDialog.value = false
  ElMessage.success('保存成功')
}

function handleArchive() {
  ElMessageBox.confirm('确定归档此班级？归档后学生将无法通过邀请码加入', '归档确认', { type: 'warning' }).then(() => {
    cls.value.status = 'archived'
    ElMessage.success('已归档')
  }).catch(() => {})
}

function handleCopyCode() { ElMessage.success('邀请码已复制') }
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 700; margin: 0; }
.stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stat-box { text-align: center; padding: 16px; background: #f5f7fa; border-radius: 12px; }
.stat-num { font-size: 28px; font-weight: 700; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
</style>
