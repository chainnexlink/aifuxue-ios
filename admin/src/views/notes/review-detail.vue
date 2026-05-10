<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push('/notes/review')">返回审核列表</el-button>
        <h2 style="margin:0;">审核详情 #{{ noteId }}</h2>
        <el-tag :type="{pending:'warning',approved:'success',rejected:'danger'}[note.reviewStatus] as any">{{ {pending:'待审核',approved:'已通过',rejected:'已拒绝'}[note.reviewStatus] }}</el-tag>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;font-size:16px;">{{ note.title }}</span></template>
          <div class="note-meta">
            <el-tag size="small">{{ note.subject }}</el-tag>
            <span style="color:#909399;font-size:13px;">提交者: {{ note.user }} | 提交于 {{ note.submitTime }}</span>
          </div>
          <el-divider />
          <div style="font-size:15px;line-height:1.8;color:#303133;white-space:pre-wrap;">{{ note.content }}</div>
        </el-card>

        <!-- OCR原图 -->
        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">原始拍照/上传内容</span></template>
          <div style="background:#f5f5f5;padding:40px;text-align:center;border-radius:8px;color:#909399;">
            <el-icon style="font-size:48px;"><Picture /></el-icon>
            <p>OCR原始图片</p>
            <p style="font-size:12px;">识别准确率: 98.5%</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">审核信息</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="笔记ID">{{ note.id }}</el-descriptions-item>
            <el-descriptions-item label="提交者"><el-link type="primary" @click="$router.push(`/user/detail/${note.userId}`)">{{ note.user }}</el-link></el-descriptions-item>
            <el-descriptions-item label="科目">{{ note.subject }}</el-descriptions-item>
            <el-descriptions-item label="提交时间">{{ note.submitTime }}</el-descriptions-item>
            <el-descriptions-item label="字数">{{ note.content?.length || 0 }}</el-descriptions-item>
            <el-descriptions-item label="审核状态">
              <el-tag :type="{pending:'warning',approved:'success',rejected:'danger'}[note.reviewStatus] as any" size="small">{{ {pending:'待审核',approved:'已通过',rejected:'已拒绝'}[note.reviewStatus] }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="审核人" v-if="note.reviewStatus !== 'pending'">{{ note.reviewer || '-' }}</el-descriptions-item>
            <el-descriptions-item label="审核时间" v-if="note.reviewStatus !== 'pending'">{{ note.reviewTime || '-' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 审核操作 -->
        <el-card shadow="hover" style="margin-top:20px;" v-if="note.reviewStatus === 'pending'">
          <template #header><span style="font-weight:600;">审核操作</span></template>
          <el-form label-width="80px">
            <el-form-item label="审核意见"><el-input v-model="reviewComment" type="textarea" :rows="3" placeholder="请输入审核意见（拒绝时必填）" /></el-form-item>
            <el-form-item>
              <div style="display:flex;gap:12px;width:100%;">
                <el-button type="success" style="flex:1;" @click="handleApprove">通过</el-button>
                <el-button type="danger" style="flex:1;" @click="handleReject">拒绝</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 审核结果 -->
        <el-card shadow="hover" style="margin-top:20px;" v-if="note.reviewStatus !== 'pending'">
          <template #header><span style="font-weight:600;">审核结果</span></template>
          <el-result :icon="note.reviewStatus === 'approved' ? 'success' : 'error'" :title="note.reviewStatus === 'approved' ? '审核已通过' : '审核已拒绝'" :sub-title="note.reviewComment || '无审核意见'" />
        </el-card>

        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">AI内容分析</span></template>
          <el-descriptions :column="1" size="small">
            <el-descriptions-item label="敏感词检测"><el-tag type="success" size="small">未检测到</el-tag></el-descriptions-item>
            <el-descriptions-item label="内容质量"><el-rate :model-value="4" disabled /></el-descriptions-item>
            <el-descriptions-item label="知识准确性"><el-progress :percentage="95" :stroke-width="6" style="width:120px;" /></el-descriptions-item>
            <el-descriptions-item label="原创度"><el-progress :percentage="88" :stroke-width="6" style="width:120px;" /></el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const route = useRoute(); const router = useRouter()
const noteId = Number(route.params.id)
const reviewComment = ref('')

const note = reactive({
  id: noteId, userId: noteId, title: `笔记审核 #${noteId} — 高一数学三角函数公式推导`, user: ['小明','小李','小王'][noteId % 3],
  subject: ['数学','英语','语文','物理'][noteId % 4], submitTime: `2026-05-0${(noteId % 3) + 1} ${10 + (noteId % 12)}:00`,
  reviewStatus: 'pending' as string, reviewer: '', reviewTime: '', reviewComment: '',
  content: `一、三角函数基本公式\n\n1. 同角三角函数基本关系\n   sin²α + cos²α = 1\n   tanα = sinα/cosα\n   1 + tan²α = sec²α\n\n2. 诱导公式\n   sin(π/2 - α) = cosα\n   cos(π/2 - α) = sinα\n   sin(π - α) = sinα\n   cos(π - α) = -cosα\n\n3. 二倍角公式\n   sin2α = 2sinαcosα\n   cos2α = cos²α - sin²α = 2cos²α - 1 = 1 - 2sin²α\n   tan2α = 2tanα/(1 - tan²α)\n\n4. 和差化积\n   sinA + sinB = 2sin((A+B)/2)cos((A-B)/2)\n   cosA + cosB = 2cos((A+B)/2)cos((A-B)/2)`,
})

function handleApprove() {
  note.reviewStatus = 'approved'; note.reviewer = '管理员'; note.reviewTime = new Date().toLocaleString(); note.reviewComment = reviewComment.value || '审核通过'
  ElMessage.success('已通过审核')
}
function handleReject() {
  if (!reviewComment.value) { ElMessage.warning('拒绝时必须填写审核意见'); return }
  note.reviewStatus = 'rejected'; note.reviewer = '管理员'; note.reviewTime = new Date().toLocaleString(); note.reviewComment = reviewComment.value
  ElMessage.success('已拒绝')
}
</script>

<style scoped>
.note-meta { display: flex; align-items: center; gap: 12px; }
</style>
