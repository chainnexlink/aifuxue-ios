<template>
  <div>
    <div class="page-header"><h2>知识点管理</h2><el-button type="primary" icon="Plus" @click="openAdd(null)">添加知识点</el-button></div>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="never">
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;">知识点树</span>
              <el-input v-model="treeSearch" placeholder="搜索" prefix-icon="Search" style="width:180px;" size="small" clearable />
            </div>
          </template>
          <el-tree :data="knowledgeTree" node-key="id" default-expand-all :expand-on-click-node="false" :filter-node-method="filterNode" ref="treeRef" :props="{ label: 'name', children: 'children' }">
            <template #default="{ data }">
              <div style="display:flex;justify-content:space-between;align-items:center;width:100%;padding-right:8px;">
                <span>{{ data.name }} <el-tag size="small" type="info">{{ data.questionCount }}题</el-tag></span>
                <span>
                  <el-button type="primary" link size="small" @click.stop="openAdd(data)">添加子节点</el-button>
                  <el-button type="warning" link size="small" @click.stop="openEdit(data)">编辑</el-button>
                  <el-button type="danger" link size="small" @click.stop="handleDel(data)" :disabled="!!data.children?.length">删除</el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card shadow="never">
          <template #header><span style="font-weight:600;">知识点统计</span></template>
          <el-table :data="knowledgeStats" stripe>
            <el-table-column prop="name" label="知识点" width="140" />
            <el-table-column prop="subject" label="科目" width="80"><template #default="{ row }"><el-tag size="small">{{ row.subject }}</el-tag></template></el-table-column>
            <el-table-column prop="questionCount" label="关联题数" width="90" />
            <el-table-column prop="mistakeCount" label="错题数" width="80" />
            <el-table-column label="掌握率" width="120"><template #default="{ row }"><el-progress :percentage="row.masteryRate" :stroke-width="6" :color="row.masteryRate >= 80 ? '#67c23a' : row.masteryRate >= 60 ? '#e6a23c' : '#f56c6c'" /></template></el-table-column>
            <el-table-column prop="difficulty" label="平均难度" width="100"><template #default="{ row }"><el-rate :model-value="row.difficulty" disabled :max="5" /></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" :title="editing ? '编辑知识点' : '添加知识点'" width="460px">
      <el-form label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" placeholder="知识点名称" /></el-form-item>
        <el-form-item label="父节点" v-if="parentNode"><el-tag>{{ parentNode.name }}</el-tag></el-form-item>
        <el-form-item label="科目"><el-select v-model="form.subject" style="width:100%;"><el-option v-for="s in subjects" :key="s" :label="s" :value="s" /></el-select></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.desc" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="confirmSave">{{ editing ? '保存' : '添加' }}</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const subjects = ['数学','英语','物理','化学','语文','生物']
const treeSearch = ref(''); const treeRef = ref<any>(null)
watch(treeSearch, (val) => { treeRef.value?.filter(val) })
function filterNode(value: string, data: any) { if (!value) return true; return data.name.includes(value) }

const knowledgeTree = ref([
  { id: 1, name: '数学', questionCount: 1800, children: [
    { id: 11, name: '代数', questionCount: 650, children: [
      { id: 111, name: '一元二次方程', questionCount: 120, children: [] },
      { id: 112, name: '不等式', questionCount: 180, children: [] },
      { id: 113, name: '函数', questionCount: 350, children: [] },
    ]},
    { id: 12, name: '几何', questionCount: 520, children: [
      { id: 121, name: '三角形', questionCount: 160, children: [] },
      { id: 122, name: '圆', questionCount: 120, children: [] },
      { id: 123, name: '立体几何', questionCount: 240, children: [] },
    ]},
    { id: 13, name: '分析', questionCount: 630, children: [
      { id: 131, name: '导数', questionCount: 280, children: [] },
      { id: 132, name: '积分', questionCount: 200, children: [] },
      { id: 133, name: '极限', questionCount: 150, children: [] },
    ]},
  ]},
  { id: 2, name: '英语', questionCount: 1200, children: [
    { id: 21, name: '语法', questionCount: 480, children: [{ id: 211, name: '时态', questionCount: 120, children: [] }, { id: 212, name: '从句', questionCount: 200, children: [] }] },
    { id: 22, name: '词汇', questionCount: 360, children: [] },
    { id: 23, name: '阅读', questionCount: 360, children: [] },
  ]},
  { id: 3, name: '物理', questionCount: 800, children: [
    { id: 31, name: '力学', questionCount: 350, children: [] },
    { id: 32, name: '电磁学', questionCount: 280, children: [] },
    { id: 33, name: '热学', questionCount: 170, children: [] },
  ]},
])

const knowledgeStats = ref([
  { name: '导数', subject: '数学', questionCount: 280, mistakeCount: 85, masteryRate: 70, difficulty: 4 },
  { name: '三角函数', subject: '数学', questionCount: 200, mistakeCount: 60, masteryRate: 75, difficulty: 3 },
  { name: '虚拟语气', subject: '英语', questionCount: 120, mistakeCount: 52, masteryRate: 57, difficulty: 4 },
  { name: '力的合成', subject: '物理', questionCount: 150, mistakeCount: 45, masteryRate: 72, difficulty: 3 },
  { name: '氧化还原', subject: '化学', questionCount: 130, mistakeCount: 38, masteryRate: 68, difficulty: 4 },
  { name: '定语从句', subject: '英语', questionCount: 200, mistakeCount: 55, masteryRate: 65, difficulty: 3 },
])

const dialogVisible = ref(false); const editing = ref<any>(null); const parentNode = ref<any>(null)
const form = ref({ name: '', subject: '', desc: '' })
function openAdd(parent: any) { editing.value = null; parentNode.value = parent; form.value = { name: '', subject: parent?.name?.includes('数学') ? '数学' : '', desc: '' }; dialogVisible.value = true }
function openEdit(node: any) { editing.value = node; parentNode.value = null; form.value = { name: node.name, subject: '', desc: '' }; dialogVisible.value = true }
function confirmSave() { if (editing.value) { editing.value.name = form.value.name; ElMessage.success('已更新') } else { ElMessage.success('已添加') }; dialogVisible.value = false }
function handleDel(node: any) { ElMessageBox.confirm(`删除 "${node.name}"？`, '删除确认', { type: 'error' }).then(() => ElMessage.success('已删除')).catch(() => {}) }
</script>
