<template>
  <div>
    <div class="page-header"><h2>课程管理</h2><el-button type="primary" icon="Plus" @click="openAddDialog">添加课程</el-button></div>
    <el-card shadow="never">
      <el-table :data="courses" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="课程名称" min-width="180" />
        <el-table-column prop="level" label="难度" width="80"><template #default="{ row }"><el-tag :type="{beginner:'success',intermediate:'warning',advanced:'danger'}[row.level] as any" size="small">{{ {beginner:'初级',intermediate:'中级',advanced:'高级'}[row.level] }}</el-tag></template></el-table-column>
        <el-table-column prop="wordCount" label="词汇数" width="80" />
        <el-table-column prop="lessonCount" label="课时数" width="80" />
        <el-table-column prop="enrollCount" label="学习人数" width="90" />
        <el-table-column label="完成率" width="120"><template #default="{ row }"><el-progress :percentage="row.completionRate" :stroke-width="6" /></template></el-table-column>
        <el-table-column prop="status" label="状态" width="80"><template #default="{ row }"><el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">{{ row.status === 'published' ? '已发布' : '草稿' }}</el-tag></template></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEditDialog(row)">编辑</el-button>
            <el-button :type="row.status === 'published' ? 'warning' : 'success'" link size="small" @click="togglePublish(row)">{{ row.status === 'published' ? '下架' : '发布' }}</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editing ? '编辑课程' : '添加课程'" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="课程名"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="难度"><el-select v-model="form.level" style="width:100%;"><el-option label="初级" value="beginner" /><el-option label="中级" value="intermediate" /><el-option label="高级" value="advanced" /></el-select></el-form-item>
        <el-form-item label="课时数"><el-input-number v-model="form.lessonCount" :min="1" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.desc" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="关联词库"><el-select v-model="form.wordBanks" multiple style="width:100%;"><el-option label="日常对话" value="daily" /><el-option label="学术词汇" value="academic" /><el-option label="商务英语" value="business" /></el-select></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="confirmSave">{{ editing ? '保存' : '添加' }}</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const courses = ref([
  { id: 1, title: '英语日常对话入门', level: 'beginner', wordCount: 200, lessonCount: 10, enrollCount: 856, completionRate: 65, status: 'published' },
  { id: 2, title: '旅游英语实用口语', level: 'beginner', wordCount: 150, lessonCount: 8, enrollCount: 620, completionRate: 72, status: 'published' },
  { id: 3, title: '商务英语会话', level: 'intermediate', wordCount: 300, lessonCount: 15, enrollCount: 340, completionRate: 45, status: 'published' },
  { id: 4, title: '学术英语演讲', level: 'advanced', wordCount: 400, lessonCount: 12, enrollCount: 120, completionRate: 30, status: 'published' },
  { id: 5, title: '四六级口语突破', level: 'intermediate', wordCount: 350, lessonCount: 20, enrollCount: 480, completionRate: 55, status: 'published' },
  { id: 6, title: '雅思口语备考', level: 'advanced', wordCount: 500, lessonCount: 25, enrollCount: 210, completionRate: 28, status: 'draft' },
])
const dialogVisible = ref(false); const editing = ref<any>(null)
const form = ref({ title: '', level: 'beginner', lessonCount: 10, desc: '', wordBanks: [] as string[] })
function openAddDialog() { editing.value = null; form.value = { title: '', level: 'beginner', lessonCount: 10, desc: '', wordBanks: [] }; dialogVisible.value = true }
function openEditDialog(row: any) { editing.value = row; form.value = { title: row.title, level: row.level, lessonCount: row.lessonCount, desc: '', wordBanks: [] }; dialogVisible.value = true }
function confirmSave() { ElMessage.success(editing.value ? '课程已更新' : '课程已添加'); dialogVisible.value = false }
function togglePublish(row: any) { row.status = row.status === 'published' ? 'draft' : 'published'; ElMessage.success(row.status === 'published' ? '已发布' : '已下架') }
function handleDelete(row: any) { ElMessageBox.confirm(`删除课程 "${row.title}"？`, '确认', { type: 'error' }).then(() => { courses.value = courses.value.filter(c => c.id !== row.id); ElMessage.success('已删除') }).catch(() => {}) }
</script>
