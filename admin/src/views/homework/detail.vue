<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.back()">返回</el-button>
        <h2>作业详情</h2>
      </div>
      <div style="display:flex;gap:10px;">
        <el-button type="primary" icon="Edit" @click="showEditDialog = true">编辑</el-button>
        <el-button type="danger" icon="Delete" @click="handleDelete">删除</el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">作业信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="作业名称">{{ hw.name }}</el-descriptions-item>
            <el-descriptions-item label="教师">
              <el-link type="primary" @click="$router.push(`/teacher/detail/${hw.teacherId}`)">{{ hw.teacherName }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="班级">
              <el-link type="primary" @click="$router.push(`/class/detail/${hw.classId}`)">{{ hw.className }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="作业类型">
              <el-tag :type="hw.type === 'online' ? 'primary' : 'warning'">{{ hw.type === 'online' ? '在线作业' : '离线作业' }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="statusType(hw.status)">{{ statusText(hw.status) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="截止时间">{{ hw.deadline }}</el-descriptions-item>
            <el-descriptions-item label="发布时间">{{ hw.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="提交进度">
              <el-progress :percentage="Math.round(hw.submitted / hw.total * 100)" :format="() => `${hw.submitted}/${hw.total}`" style="width:200px;" />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card shadow="never" style="margin-bottom:20px;" v-if="hw.type === 'offline'">
          <template #header><span style="font-weight:600;">离线作业要求</span></template>
          <div style="display:flex;gap:12px;">
            <el-tag v-for="req in hw.requirements" :key="req" size="large">{{ req }}</el-tag>
          </div>
        </el-card>

        <el-card shadow="never">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">学生提交列表</span>
              <div style="display:flex;gap:8px;">
                <el-select v-model="subFilter" placeholder="筛选" clearable style="width:120px;" size="small">
                  <el-option label="未提交" value="pending" />
                  <el-option label="已提交" value="submitted" />
                  <el-option label="已批改" value="graded" />
                </el-select>
              </div>
            </div>
          </template>
          <el-table :data="filteredSubmissions" stripe border>
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="nickname" label="学生" width="120">
              <template #default="{ row }">
                <el-link type="primary" @click="$router.push(`/user/detail/${row.userId}`)">{{ row.nickname }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.subStatus === 'graded' ? 'success' : row.subStatus === 'submitted' ? 'warning' : 'info'" size="small">
                  {{ row.subStatus === 'graded' ? '已批改' : row.subStatus === 'submitted' ? '已提交' : '未提交' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="成绩" width="80">
              <template #default="{ row }">
                <span v-if="row.score !== null" style="font-weight:600;" :style="{ color: row.score >= 80 ? '#67c23a' : row.score >= 60 ? '#e6a23c' : '#f56c6c' }">{{ row.score }}</span>
                <span v-else style="color:#c0c4cc;">-</span>
              </template>
            </el-table-column>
            <el-table-column label="批改方式" width="100">
              <template #default="{ row }">
                <el-tag v-if="row.gradeMethod" :type="row.gradeMethod === 'ai' ? 'primary' : ''" size="small">{{ row.gradeMethod === 'ai' ? 'AI批改' : '手动批改' }}</el-tag>
                <span v-else style="color:#c0c4cc;">-</span>
              </template>
            </el-table-column>
            <el-table-column prop="submittedAt" label="提交时间" width="160" />
            <el-table-column prop="gradedAt" label="批改时间" width="160" />
            <el-table-column prop="comment" label="教师评语" min-width="200">
              <template #default="{ row }"><span style="font-size:13px;color:#606266;">{{ row.comment || '-' }}</span></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">提交统计</span></template>
          <div class="stat-grid">
            <div class="stat-box"><div class="stat-num" style="color:#409eff;">{{ hw.total }}</div><div class="stat-label">应交</div></div>
            <div class="stat-box"><div class="stat-num" style="color:#67c23a;">{{ hw.submitted }}</div><div class="stat-label">已交</div></div>
            <div class="stat-box"><div class="stat-num" style="color:#e6a23c;">{{ hw.graded }}</div><div class="stat-label">已批</div></div>
            <div class="stat-box"><div class="stat-num" style="color:#f56c6c;">{{ hw.total - hw.submitted }}</div><div class="stat-label">未交</div></div>
          </div>
        </el-card>

        <el-card shadow="never" style="margin-bottom:20px;">
          <template #header><span style="font-weight:600;">成绩分布</span></template>
          <div class="score-dist">
            <div v-for="s in scoreDistribution" :key="s.label" class="dist-row">
              <span class="dist-label">{{ s.label }}</span>
              <el-progress :percentage="s.percentage" :stroke-width="12" :color="s.color" style="flex:1;" />
              <span class="dist-count">{{ s.count }}人</span>
            </div>
          </div>
        </el-card>

        <el-card shadow="never">
          <template #header><span style="font-weight:600;">AI批改信息</span></template>
          <div class="ai-info">
            <div class="ai-row"><span>AI批改数</span><span style="font-weight:600;">{{ hw.aiGradedCount }} 份</span></div>
            <div class="ai-row"><span>手动批改数</span><span style="font-weight:600;">{{ hw.manualGradedCount }} 份</span></div>
            <div class="ai-row"><span>平均分</span><span style="font-weight:600;color:#409eff;">{{ hw.avgScore }}</span></div>
            <div class="ai-row"><span>最高分</span><span style="font-weight:600;color:#67c23a;">{{ hw.maxScore }}</span></div>
            <div class="ai-row"><span>最低分</span><span style="font-weight:600;color:#f56c6c;">{{ hw.minScore }}</span></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="showEditDialog" title="编辑作业" width="480px">
      <el-form label-width="80px">
        <el-form-item label="作业名称"><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="截止时间"><el-date-picker v-model="editForm.deadline" type="datetime" style="width:100%;" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const subFilter = ref('')

const hw = ref({
  id: 1, name: '第三章一元二次方程练习', teacherId: 1, teacherName: '张老师',
  classId: 1, className: '初三数学提高班', type: 'online' as 'online' | 'offline',
  status: 'grading' as 'collecting' | 'grading' | 'completed',
  deadline: '2025-04-30 23:59', createdAt: '2025-04-25 10:00',
  submitted: 28, total: 32, graded: 18, aiGradedCount: 15, manualGradedCount: 3,
  avgScore: 76, maxScore: 98, minScore: 42,
  requirements: ['拍照', '录音', '家长签字'],
})

const submissions = ref(Array.from({ length: 32 }, (_, i) => ({
  id: i + 1, userId: 100 + i, nickname: `学生${i + 1}`,
  subStatus: i < 18 ? 'graded' : i < 28 ? 'submitted' : 'pending',
  score: i < 18 ? 50 + Math.floor(Math.random() * 50) : null,
  gradeMethod: i < 15 ? 'ai' : i < 18 ? 'manual' : null,
  submittedAt: i < 28 ? `2025-04-2${8 - Math.floor(i / 5)} ${10 + (i % 12)}:00` : '-',
  gradedAt: i < 18 ? `2025-04-29 ${10 + (i % 8)}:00` : '-',
  comment: i < 18 ? ['解题思路清晰', '注意计算步骤', '知识点掌握较好', '需加强基础练习'][i % 4] : '',
})))

const filteredSubmissions = computed(() => {
  if (!subFilter.value) return submissions.value
  return submissions.value.filter(s => s.subStatus === subFilter.value)
})

const scoreDistribution = computed(() => {
  const graded = submissions.value.filter(s => s.score !== null)
  const ranges = [
    { label: '90-100', color: '#67c23a', min: 90, max: 100 },
    { label: '80-89', color: '#409eff', min: 80, max: 89 },
    { label: '70-79', color: '#e6a23c', min: 70, max: 79 },
    { label: '60-69', color: '#f56c6c', min: 60, max: 69 },
    { label: '<60', color: '#909399', min: 0, max: 59 },
  ]
  return ranges.map(r => {
    const count = graded.filter(s => s.score! >= r.min && s.score! <= r.max).length
    return { ...r, count, percentage: graded.length ? Math.round(count / graded.length * 100) : 0 }
  })
})

function statusType(s: string) { return s === 'collecting' ? '' : s === 'grading' ? 'warning' : 'success' }
function statusText(s: string) { return s === 'collecting' ? '收集中' : s === 'grading' ? '批改中' : '已完成' }

const showEditDialog = ref(false)
const editForm = ref({ name: hw.value.name, deadline: hw.value.deadline })

function handleSaveEdit() {
  hw.value.name = editForm.value.name
  showEditDialog.value = false
  ElMessage.success('保存成功')
}

function handleDelete() {
  ElMessageBox.confirm('确定删除此作业？', '删除确认', { type: 'warning' }).then(() => {
    ElMessage.success('已删除')
  }).catch(() => {})
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 700; margin: 0; }
.stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stat-box { text-align: center; padding: 16px; background: #f5f7fa; border-radius: 12px; }
.stat-num { font-size: 28px; font-weight: 700; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.score-dist { display: flex; flex-direction: column; gap: 12px; }
.dist-row { display: flex; align-items: center; gap: 12px; }
.dist-label { width: 60px; font-size: 13px; color: #606266; text-align: right; }
.dist-count { width: 40px; font-size: 13px; color: #909399; }
.ai-info { display: flex; flex-direction: column; gap: 14px; }
.ai-row { display: flex; justify-content: space-between; font-size: 14px; color: #606266; }
</style>
