<template>
  <div>
    <div class="page-header"><h2>错题列表</h2></div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索题目/用户" prefix-icon="Search" style="width:200px;" clearable />
      <el-select v-model="subjectF" placeholder="科目" clearable style="width:120px;">
        <el-option v-for="s in subjects" :key="s" :label="s" :value="s" />
      </el-select>
      <el-select v-model="errTypeF" placeholder="错误类型" clearable style="width:140px;">
        <el-option label="计算错误" value="计算错误" /><el-option label="概念不清" value="概念不清" />
        <el-option label="审题偏差" value="审题偏差" /><el-option label="完全不会" value="完全不会" />
      </el-select>
    </div>
    <el-card shadow="never">
      <el-table :data="pagedData" stripe border @selection-change="(val: any[]) => selectedRows = val">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="user" label="用户" width="100" />
        <el-table-column prop="ocrText" label="题目内容" show-overflow-tooltip min-width="260" />
        <el-table-column prop="subject" label="科目" width="80">
          <template #default="{ row }"><el-tag size="small">{{ row.subject }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="knowledgePoint" label="知识点" width="120" />
        <el-table-column prop="errorType" label="错误类型" width="100">
          <template #default="{ row }">
            <el-tag :type="{ '计算错误': 'warning', '概念不清': 'danger', '审题偏差': '', '完全不会': 'info' }[row.errorType] as any" size="small">{{ row.errorType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="录入时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/mistakes/detail/${row.id}`)">查看</el-button>
            <el-button type="warning" link size="small" @click="handleVariant(row)">生成变式</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
        <div>
          <el-button type="danger" size="small" :disabled="!selectedRows.length" @click="handleBatchDelete">批量删除 ({{ selectedRows.length }})</el-button>
        </div>
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="filteredMistakes.length" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const search = ref(''); const subjectF = ref(''); const errTypeF = ref('')
const page = ref(1); const pageSize = ref(10)
const selectedRows = ref<any[]>([])
const subjects = ['语文','数学','英语','物理','化学','生物']
const handleVariant = (row: any) => {
  ElMessage.success(`已为「${row.ocrText.slice(0, 10)}...」生成变式题`)
}
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定删除此错题记录？', '删除确认', { type: 'warning' }).then(() => {
    mistakes.value = mistakes.value.filter(m => m.id !== row.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定批量删除 ${selectedRows.value.length} 条错题？`, '批量删除', { type: 'error' }).then(() => {
    const ids = new Set(selectedRows.value.map(r => r.id))
    mistakes.value = mistakes.value.filter(m => !ids.has(m.id))
    selectedRows.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}
const mistakes = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, user: ['小明','小李','小王','小赵','小陈'][i % 5],
  ocrText: ['求函数f(x)=x³-3x的极值','已知向量a=(1,2),b=(3,-1),求a·b','证明:对任意正整数n,n³-n能被6整除','化简: (sin²θ+cos²θ)/sinθ','解方程: 2x²-5x+3=0'][i % 5],
  subject: subjects[i % subjects.length],
  knowledgePoint: ['极值','向量点积','数学归纳法','三角恒等','一元二次方程'][i % 5],
  errorType: ['计算错误','概念不清','审题偏差','完全不会'][i % 4],
  createdAt: `2026-05-0${(i % 3) + 1} ${10 + (i % 10)}:${String(i * 13 % 60).padStart(2, '0')}`,
})))
const filteredMistakes = computed(() => {
  return mistakes.value.filter(m => {
    if (search.value && !m.ocrText.includes(search.value) && !m.user.includes(search.value)) return false
    if (subjectF.value && m.subject !== subjectF.value) return false
    if (errTypeF.value && m.errorType !== errTypeF.value) return false
    return true
  })
})
const pagedData = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredMistakes.value.slice(start, start + pageSize.value)
})
</script>
