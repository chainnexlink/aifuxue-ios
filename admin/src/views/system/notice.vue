<template>
  <div>
    <div class="page-header"><h2>公告管理</h2><el-button type="primary" icon="Plus" @click="openAdd">发布公告</el-button></div>
    <el-card shadow="never">
      <el-table :data="notices" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="type" label="类型" width="100"><template #default="{ row }"><el-tag :type="{system:'primary',update:'success',activity:'warning',maintenance:'danger'}[row.type] as any" size="small">{{ {system:'系统通知',update:'版本更新',activity:'活动公告',maintenance:'维护通知'}[row.type] }}</el-tag></template></el-table-column>
        <el-table-column prop="target" label="推送对象" width="100" />
        <el-table-column prop="status" label="状态" width="80"><template #default="{ row }"><el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">{{ row.status === 'published' ? '已发布' : '草稿' }}</el-tag></template></el-table-column>
        <el-table-column prop="readCount" label="阅读数" width="80" />
        <el-table-column prop="createdAt" label="发布时间" width="160" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
            <el-button :type="row.status === 'published' ? 'warning' : 'success'" link size="small" @click="togglePublish(row)">{{ row.status === 'published' ? '下架' : '发布' }}</el-button>
            <el-button type="info" link size="small" @click="openPreview(row)">预览</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editing ? '编辑公告' : '发布公告'" width="700px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="类型"><el-select v-model="form.type" style="width:100%;"><el-option label="系统通知" value="system" /><el-option label="版本更新" value="update" /><el-option label="活动公告" value="activity" /><el-option label="维护通知" value="maintenance" /></el-select></el-form-item>
        <el-form-item label="推送对象"><el-select v-model="form.target" style="width:100%;"><el-option label="全部用户" value="全部用户" /><el-option label="活跃用户" value="活跃用户" /><el-option label="管理员" value="管理员" /></el-select></el-form-item>
        <el-form-item label="内容"><el-input v-model="form.content" type="textarea" :rows="8" placeholder="支持Markdown格式" /></el-form-item>
        <el-form-item label="置顶"><el-switch v-model="form.isTop" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button @click="saveDraft">保存草稿</el-button><el-button type="primary" @click="publish">发布</el-button></template>
    </el-dialog>

    <el-drawer v-model="previewVisible" title="公告预览" size="500px">
      <template v-if="previewNotice">
        <el-tag :type="{system:'primary',update:'success',activity:'warning',maintenance:'danger'}[previewNotice.type] as any" size="small" style="margin-bottom:12px;">{{ {system:'系统通知',update:'版本更新',activity:'活动公告',maintenance:'维护通知'}[previewNotice.type] }}</el-tag>
        <h2>{{ previewNotice.title }}</h2>
        <p style="color:#909399;margin-bottom:16px;">{{ previewNotice.createdAt }} | 阅读 {{ previewNotice.readCount }}</p>
        <el-divider />
        <div style="line-height:1.8;white-space:pre-wrap;">{{ previewNotice.content || '公告内容预览...\n\n这里是公告的详细内容，支持富文本格式展示。' }}</div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const notices = ref([
  { id: 1, title: '系统升级通知 - v2.0发布', type: 'update', target: '全部用户', status: 'published', readCount: 5680, createdAt: '2026-05-01 09:00', content: '' },
  { id: 2, title: '五一学习活动开始', type: 'activity', target: '全部用户', status: 'published', readCount: 3420, createdAt: '2026-04-30 18:00', content: '' },
  { id: 3, title: '服务器维护公告', type: 'maintenance', target: '全部用户', status: 'published', readCount: 2100, createdAt: '2026-04-28 10:00', content: '' },
  { id: 4, title: '全功能体验活动开启', type: 'activity', target: '全部用户', status: 'published', readCount: 856, createdAt: '2026-04-25 14:00', content: '' },
  { id: 5, title: '新功能上线：AI作文批改', type: 'system', target: '全部用户', status: 'draft', readCount: 0, createdAt: '2026-05-03 10:00', content: '' },
])
const dialogVisible = ref(false); const editing = ref<any>(null)
const form = ref({ title: '', type: 'system', target: '全部用户', content: '', isTop: false })
const previewVisible = ref(false); const previewNotice = ref<any>(null)
function openAdd() { editing.value = null; form.value = { title: '', type: 'system', target: '全部用户', content: '', isTop: false }; dialogVisible.value = true }
function openEdit(row: any) { editing.value = row; form.value = { title: row.title, type: row.type, target: row.target, content: row.content, isTop: false }; dialogVisible.value = true }
function saveDraft() { ElMessage.success('已保存草稿'); dialogVisible.value = false }
function publish() { ElMessage.success('公告已发布'); dialogVisible.value = false }
function togglePublish(row: any) { row.status = row.status === 'published' ? 'draft' : 'published'; ElMessage.success(row.status === 'published' ? '已发布' : '已下架') }
function openPreview(row: any) { previewNotice.value = row; previewVisible.value = true }
function handleDelete(row: any) { ElMessageBox.confirm(`删除公告 "${row.title}"？`, '删除', { type: 'error' }).then(() => { notices.value = notices.value.filter(n => n.id !== row.id); ElMessage.success('已删除') }).catch(() => {}) }
</script>
