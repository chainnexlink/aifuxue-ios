<template>
  <div>
    <div class="page-header"><h2>分类管理</h2><el-button type="primary" icon="Plus" @click="openAddDialog(null)">添加分类</el-button></div>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="never">
          <template #header><span style="font-weight:600;">笔记分类树</span></template>
          <el-tree :data="categoryTree" node-key="id" default-expand-all :expand-on-click-node="false" :props="{ label: 'name', children: 'children' }">
            <template #default="{ node, data }">
              <div style="display:flex;justify-content:space-between;align-items:center;width:100%;padding-right:8px;">
                <span>
                  <el-icon v-if="data.children?.length" style="margin-right:4px;"><Folder /></el-icon>
                  <el-icon v-else style="margin-right:4px;"><Document /></el-icon>
                  {{ data.name }}
                  <el-tag size="small" type="info" style="margin-left:8px;">{{ data.count }}篇</el-tag>
                </span>
                <span>
                  <el-button type="primary" link size="small" @click.stop="openAddDialog(data)">添加子分类</el-button>
                  <el-button type="warning" link size="small" @click.stop="openEditDialog(data)">编辑</el-button>
                  <el-button type="danger" link size="small" @click.stop="handleDelete(data)" :disabled="data.children?.length > 0">删除</el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card shadow="never">
          <template #header><span style="font-weight:600;">分类统计</span></template>
          <el-table :data="flatCategories" stripe border>
            <el-table-column prop="name" label="分类名称" width="160" />
            <el-table-column prop="parent" label="父分类" width="120" />
            <el-table-column prop="count" label="笔记数" width="80" />
            <el-table-column label="占比" width="140"><template #default="{ row }"><el-progress :percentage="row.percent" :stroke-width="6" /></template></el-table-column>
            <el-table-column prop="sort" label="排序" width="80" />
            <el-table-column prop="createdAt" label="创建时间" width="140" />
          </el-table>
        </el-card>
        <el-card shadow="never" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">科目-分类对应关系</span></template>
          <el-table :data="subjectCategoryMap" stripe>
            <el-table-column prop="subject" label="科目" width="80" />
            <el-table-column label="可用分类">
              <template #default="{ row }"><el-tag v-for="c in row.categories" :key="c" size="small" style="margin:2px;">{{ c }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="80"><template #default><el-button type="primary" link size="small">编辑</el-button></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" :title="editingCategory ? '编辑分类' : '添加分类'" width="460px">
      <el-form label-width="80px">
        <el-form-item label="分类名称"><el-input v-model="form.name" placeholder="请输入分类名称" /></el-form-item>
        <el-form-item label="父分类" v-if="parentCategory"><el-tag>{{ parentCategory.name }}</el-tag></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" :max="100" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.desc" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSave">{{ editingCategory ? '保存' : '添加' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Document } from '@element-plus/icons-vue'
const categoryTree = ref([
  { id: 1, name: '课堂笔记', count: 1280, children: [
    { id: 11, name: '预习笔记', count: 320, children: [] },
    { id: 12, name: '听课笔记', count: 580, children: [] },
    { id: 13, name: '复习笔记', count: 380, children: [] },
  ]},
  { id: 2, name: '知识总结', count: 960, children: [
    { id: 21, name: '章节总结', count: 420, children: [] },
    { id: 22, name: '专题总结', count: 340, children: [] },
    { id: 23, name: '思维导图', count: 200, children: [] },
  ]},
  { id: 3, name: '公式大全', count: 560, children: [
    { id: 31, name: '基础公式', count: 280, children: [] },
    { id: 32, name: '高级公式', count: 180, children: [] },
    { id: 33, name: '推导过程', count: 100, children: [] },
  ]},
  { id: 4, name: '错题整理', count: 780, children: [
    { id: 41, name: '按知识点', count: 450, children: [] },
    { id: 42, name: '按错误类型', count: 330, children: [] },
  ]},
  { id: 5, name: '考前复习', count: 420, children: [
    { id: 51, name: '重点知识', count: 240, children: [] },
    { id: 52, name: '易错点', count: 180, children: [] },
  ]},
])

const flatCategories = ref([
  { name: '课堂笔记', parent: '-', count: 1280, percent: 100, sort: 1, createdAt: '2026-01-01' },
  { name: '知识总结', parent: '-', count: 960, percent: 75, sort: 2, createdAt: '2026-01-01' },
  { name: '错题整理', parent: '-', count: 780, percent: 61, sort: 3, createdAt: '2026-01-01' },
  { name: '公式大全', parent: '-', count: 560, percent: 44, sort: 4, createdAt: '2026-01-01' },
  { name: '考前复习', parent: '-', count: 420, percent: 33, sort: 5, createdAt: '2026-01-01' },
  { name: '听课笔记', parent: '课堂笔记', count: 580, percent: 45, sort: 1, createdAt: '2026-01-05' },
  { name: '章节总结', parent: '知识总结', count: 420, percent: 33, sort: 1, createdAt: '2026-01-05' },
])

const subjectCategoryMap = ref([
  { subject: '数学', categories: ['课堂笔记','知识总结','公式大全','错题整理','考前复习'] },
  { subject: '英语', categories: ['课堂笔记','知识总结','错题整理','考前复习'] },
  { subject: '语文', categories: ['课堂笔记','知识总结','考前复习'] },
  { subject: '物理', categories: ['课堂笔记','知识总结','公式大全','错题整理'] },
  { subject: '化学', categories: ['课堂笔记','知识总结','公式大全','错题整理'] },
])

const dialogVisible = ref(false); const editingCategory = ref<any>(null); const parentCategory = ref<any>(null)
const form = ref({ name: '', sort: 0, desc: '' })
function openAddDialog(parent: any) { editingCategory.value = null; parentCategory.value = parent; form.value = { name: '', sort: 0, desc: '' }; dialogVisible.value = true }
function openEditDialog(cat: any) { editingCategory.value = cat; parentCategory.value = null; form.value = { name: cat.name, sort: 0, desc: '' }; dialogVisible.value = true }
function confirmSave() {
  if (editingCategory.value) { editingCategory.value.name = form.value.name; ElMessage.success('分类已更新') }
  else { ElMessage.success('分类已添加') }
  dialogVisible.value = false
}
function handleDelete(cat: any) {
  ElMessageBox.confirm(`确定删除分类 "${cat.name}" 吗？`, '删除确认', { type: 'error' }).then(() => {
    ElMessage.success('分类已删除')
  }).catch(() => {})
}
</script>
