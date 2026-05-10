<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push('/notes/list')">返回列表</el-button>
        <h2 style="margin:0;">笔记详情</h2>
        <el-tag :type="note.isLocked ? 'danger' : 'success'" size="small">{{ note.isLocked ? '已锁定' : '开放' }}</el-tag>
        <el-tag :type="note.status === 'done' ? 'success' : 'warning'" size="small">{{ note.status === 'done' ? '已完成' : '处理中' }}</el-tag>
      </div>
      <div style="display:flex;gap:10px;">
        <el-button type="primary" icon="Edit" @click="editVisible = true">编辑</el-button>
        <el-button :type="note.isLocked ? 'success' : 'warning'" @click="note.isLocked = !note.isLocked">{{ note.isLocked ? '解锁' : '锁定' }}</el-button>
        <el-dropdown trigger="click">
          <el-button>导出 <el-icon><ArrowDown /></el-icon></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="exportAs('pdf')">导出PDF</el-dropdown-item>
              <el-dropdown-item @click="exportAs('md')">导出Markdown</el-dropdown-item>
              <el-dropdown-item @click="exportAs('docx')">导出Word</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;font-size:18px;">{{ note.title }}</span></template>
          <div class="note-meta">
            <el-tag size="small">{{ note.subject }}</el-tag>
            <el-tag type="info" size="small">{{ note.category }}</el-tag>
            <span style="color:#909399;font-size:13px;">{{ note.wordCount }}字 | 浏览{{ note.viewCount }}次 | 创建于 {{ note.createdAt }}</span>
          </div>
          <el-divider />
          <div class="note-content" v-html="renderedContent"></div>
        </el-card>

        <!-- AI生成信息 -->
        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">AI生成信息</span></template>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="AI模型">GPT-4</el-descriptions-item>
            <el-descriptions-item label="生成时间">2.3秒</el-descriptions-item>
            <el-descriptions-item label="Token消耗">1,856</el-descriptions-item>
            <el-descriptions-item label="OCR来源">拍照识别</el-descriptions-item>
            <el-descriptions-item label="知识点提取">导数定义、极值判定、最值求解</el-descriptions-item>
            <el-descriptions-item label="难度评估"><el-tag type="warning" size="small">中等</el-tag></el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">基本信息</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="笔记ID">{{ note.id }}</el-descriptions-item>
            <el-descriptions-item label="所属用户">
              <el-link type="primary" @click="$router.push(`/user/detail/${note.userId}`)">{{ note.user }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="科目">{{ note.subject }}</el-descriptions-item>
            <el-descriptions-item label="分类">{{ note.category }}</el-descriptions-item>
            <el-descriptions-item label="字数">{{ note.wordCount }}</el-descriptions-item>
            <el-descriptions-item label="浏览数">{{ note.viewCount }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ note.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ note.updatedAt }}</el-descriptions-item>
            <el-descriptions-item label="审核状态"><el-tag type="success" size="small">已通过</el-tag></el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">关联知识点</span></template>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <el-tag v-for="kp in note.knowledgePoints" :key="kp" closable @close="removeKP(kp)">{{ kp }}</el-tag>
            <el-button size="small" type="primary" text icon="Plus" @click="addKPVisible = true">添加</el-button>
          </div>
        </el-card>

        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">操作记录</span></template>
          <el-timeline>
            <el-timeline-item v-for="log in logs" :key="log.id" :timestamp="log.time" placement="top" size="small">
              {{ log.action }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editVisible" title="编辑笔记" width="700px">
      <el-form label-width="80px">
        <el-form-item label="标题"><el-input v-model="note.title" /></el-form-item>
        <el-form-item label="科目"><el-select v-model="note.subject" style="width:100%;"><el-option v-for="s in subjects" :key="s" :label="s" :value="s" /></el-select></el-form-item>
        <el-form-item label="分类"><el-select v-model="note.category" style="width:100%;"><el-option v-for="c in categories" :key="c" :label="c" :value="c" /></el-select></el-form-item>
        <el-form-item label="内容"><el-input v-model="note.rawContent" type="textarea" :rows="12" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加知识点 -->
    <el-dialog v-model="addKPVisible" title="添加知识点" width="400px">
      <el-input v-model="newKP" placeholder="输入知识点名称" />
      <template #footer>
        <el-button @click="addKPVisible = false">取消</el-button>
        <el-button type="primary" @click="addKP">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
const route = useRoute(); const router = useRouter()
const noteId = Number(route.params.id)
const subjects = ['语文','数学','英语','物理','化学','生物']
const categories = ['课堂笔记','知识总结','公式大全','错题整理','考前复习']

const note = reactive({
  id: noteId, userId: 1, title: '高一数学 · 导数与极值课堂笔记', user: '小明同学',
  subject: '数学', category: '课堂笔记', status: 'done', isLocked: false,
  wordCount: 1856, viewCount: 342, createdAt: '2026-05-01 14:30', updatedAt: '2026-05-03 10:15',
  knowledgePoints: ['导数定义', '极值判定', '最值求解', '单调区间'],
  rawContent: `# 导数与极值\n\n## 一、导数的定义\n\n函数 f(x) 在 x₀ 处的导数定义为：\n\nf'(x₀) = lim[Δx→0] [f(x₀+Δx) - f(x₀)] / Δx\n\n## 二、极值的判定\n\n### 第一充分条件\n- 若 f'(x) 在 x₀ 左侧为正，右侧为负，则 x₀ 是极大值点\n- 若 f'(x) 在 x₀ 左侧为负，右侧为正，则 x₀ 是极小值点\n\n### 第二充分条件\n- 若 f'(x₀)=0 且 f''(x₀)<0，则 x₀ 为极大值点\n- 若 f'(x₀)=0 且 f''(x₀)>0，则 x₀ 为极小值点\n\n## 三、求解步骤\n1. 求 f'(x)\n2. 令 f'(x)=0，求驻点\n3. 判断驻点左右两侧 f'(x) 的符号\n4. 确定极值类型和极值\n\n## 四、例题\n\n求 f(x) = x³ - 3x 的极值\n\n**解：**\n- f'(x) = 3x² - 3 = 3(x+1)(x-1)\n- 令 f'(x)=0，得 x=-1, x=1\n- x=-1 为极大值点，f(-1)=2\n- x=1 为极小值点，f(1)=-2`,
})

const renderedContent = computed(() => {
  return note.rawContent
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br>')
})

const logs = ref([
  { id: 1, time: '2026-05-03 10:15', action: '管理员编辑了笔记标题' },
  { id: 2, time: '2026-05-02 16:00', action: '审核通过' },
  { id: 3, time: '2026-05-01 14:35', action: 'AI生成笔记完成' },
  { id: 4, time: '2026-05-01 14:30', action: '用户拍照上传' },
])

const editVisible = ref(false)
function saveEdit() { editVisible.value = false; ElMessage.success('笔记已更新') }

const addKPVisible = ref(false); const newKP = ref('')
function addKP() {
  if (newKP.value) { note.knowledgePoints.push(newKP.value); newKP.value = ''; addKPVisible.value = false; ElMessage.success('知识点已添加') }
}
function removeKP(kp: string) { note.knowledgePoints = note.knowledgePoints.filter(k => k !== kp) }

function exportAs(format: string) { ElMessage.success(`正在导出${format.toUpperCase()}...`) }
function handleDelete() {
  ElMessageBox.confirm('确定删除此笔记吗？', '删除确认', { type: 'error' }).then(() => {
    ElMessage.success('笔记已删除'); router.push('/notes/list')
  }).catch(() => {})
}
</script>

<style scoped>
.note-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.note-content { font-size: 15px; line-height: 1.8; color: #303133; }
.note-content h1 { font-size: 22px; margin: 20px 0 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
.note-content h2 { font-size: 18px; margin: 16px 0 10px; }
.note-content h3 { font-size: 16px; margin: 12px 0 8px; }
.note-content li { margin: 4px 0; padding-left: 16px; }
</style>
