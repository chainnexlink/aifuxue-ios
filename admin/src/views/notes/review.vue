<template>
  <div>
    <div class="page-header"><h2>内容审核</h2></div>
    <div class="stat-row">
      <el-card class="stat-card warning" shadow="hover"><span class="stat-value">{{ pendingCount }}</span><span class="stat-label">待审核</span></el-card>
      <el-card class="stat-card success" shadow="hover"><span class="stat-value">{{ approvedCount }}</span><span class="stat-label">已通过</span></el-card>
      <el-card class="stat-card danger" shadow="hover"><span class="stat-value">{{ rejectedCount }}</span><span class="stat-label">已拒绝</span></el-card>
    </div>
    <el-card shadow="never">
      <el-tabs v-model="tab">
        <el-tab-pane :label="`待审核 (${pendingCount})`" name="pending" />
        <el-tab-pane :label="`已通过 (${approvedCount})`" name="approved" />
        <el-tab-pane :label="`已拒绝 (${rejectedCount})`" name="rejected" />
      </el-tabs>
      <el-table :data="filteredNotes" stripe border>
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="title" label="标题" show-overflow-tooltip min-width="200">
          <template #default="{ row }"><el-link type="primary" @click="$router.push(`/notes/review/${row.id}`)">{{ row.title }}</el-link></template>
        </el-table-column>
        <el-table-column prop="user" label="提交者" width="100">
          <template #default="{ row }"><el-link type="primary" @click="$router.push(`/user/detail/${row.userId}`)">{{ row.user }}</el-link></template>
        </el-table-column>
        <el-table-column prop="subject" label="科目" width="80"><template #default="{ row }"><el-tag size="small">{{ row.subject }}</el-tag></template></el-table-column>
        <el-table-column prop="contentPreview" label="内容预览" show-overflow-tooltip min-width="200" />
        <el-table-column prop="wordCount" label="字数" width="70" />
        <el-table-column prop="submitTime" label="提交时间" width="160" />
        <el-table-column label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag :type="{pending:'warning',approved:'success',rejected:'danger'}[row.reviewStatus] as any" size="small">{{ {pending:'待审核',approved:'已通过',rejected:'已拒绝'}[row.reviewStatus] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/notes/review/${row.id}`)">详情</el-button>
            <template v-if="row.reviewStatus === 'pending'">
              <el-button type="success" link size="small" @click="quickApprove(row)">通过</el-button>
              <el-button type="danger" link size="small" @click="quickReject(row)">拒绝</el-button>
            </template>
            <el-button v-if="row.reviewStatus === 'rejected'" type="success" link size="small" @click="quickApprove(row)">重新通过</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="tab === 'pending' && pendingCount > 0" style="margin-top:16px;display:flex;gap:12px;">
        <el-button type="success" @click="batchApprove">批量通过</el-button>
        <el-button type="danger" @click="batchReject">批量拒绝</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const tab = ref('pending')
const allNotes = ref(Array.from({ length: 30 }, (_, i) => ({
  id: i + 1, userId: (i % 5) + 1, title: ['高一数学·三角函数公式推导','英语作文·常用句型总结','语文古文·劝学翻译注释','物理·牛顿三大定律','化学·元素周期律'][i % 5] + ` #${i + 1}`,
  user: ['小明','小李','小王','小赵','小陈'][i % 5], subject: ['数学','英语','语文','物理','化学'][i % 5],
  contentPreview: '这是笔记内容的预览文字，包含公式、知识点总结、解题步骤等学习内容...',
  wordCount: Math.floor(Math.random() * 2000) + 300,
  submitTime: `2026-05-0${(i % 3) + 1} ${10 + (i % 12)}:00`,
  reviewStatus: i < 12 ? 'pending' : i < 24 ? 'approved' : 'rejected' as string,
})))
const filteredNotes = computed(() => allNotes.value.filter(n => n.reviewStatus === tab.value))
const pendingCount = computed(() => allNotes.value.filter(n => n.reviewStatus === 'pending').length)
const approvedCount = computed(() => allNotes.value.filter(n => n.reviewStatus === 'approved').length)
const rejectedCount = computed(() => allNotes.value.filter(n => n.reviewStatus === 'rejected').length)

function quickApprove(row: any) {
  ElMessageBox.confirm(`确定通过 "${row.title}" 的审核？`, '审核确认', { type: 'info' }).then(() => {
    row.reviewStatus = 'approved'; ElMessage.success('审核已通过')
  }).catch(() => {})
}
function quickReject(row: any) {
  ElMessageBox.prompt('请输入拒绝原因', '拒绝审核', { confirmButtonText: '拒绝', cancelButtonText: '取消', inputType: 'textarea' }).then(({ value }) => {
    row.reviewStatus = 'rejected'; ElMessage.success('已拒绝')
  }).catch(() => {})
}
function batchApprove() {
  const count = allNotes.value.filter(n => n.reviewStatus === 'pending').length
  ElMessageBox.confirm(`确定批量通过 ${count} 条待审核内容？`, '批量操作', { type: 'info' }).then(() => {
    allNotes.value.forEach(n => { if (n.reviewStatus === 'pending') n.reviewStatus = 'approved' })
    ElMessage.success('批量审核通过')
  }).catch(() => {})
}
function batchReject() { ElMessage.info('请选择需要拒绝的笔记') }
</script>
