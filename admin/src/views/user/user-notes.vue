<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <el-button icon="ArrowLeft" @click="$router.push(`/user/detail/${$route.params.id}`)">返回用户详情</el-button>
        <h2 style="margin:0;">用户笔记 — 学霸同学{{ $route.params.id }}</h2>
      </div>
    </div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索笔记" prefix-icon="Search" style="width:200px;" clearable />
      <el-select v-model="subjectF" placeholder="科目" clearable style="width:120px;">
        <el-option v-for="s in subjects" :key="s" :label="s" :value="s" />
      </el-select>
    </div>
    <el-card shadow="never">
      <el-table :data="filteredNotes" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="笔记标题" show-overflow-tooltip min-width="220">
          <template #default="{ row }"><el-link type="primary" @click="$router.push(`/notes/detail/${row.id}`)">{{ row.title }}</el-link></template>
        </el-table-column>
        <el-table-column prop="subject" label="科目" width="80"><template #default="{ row }"><el-tag size="small">{{ row.subject }}</el-tag></template></el-table-column>
        <el-table-column prop="status" label="状态" width="80"><template #default="{ row }"><el-tag :type="row.status === 'done' ? 'success' : 'warning'" size="small">{{ row.status === 'done' ? '已完成' : '处理中' }}</el-tag></template></el-table-column>
        <el-table-column label="锁定" width="80"><template #default="{ row }"><el-tag :type="row.isLocked ? 'danger' : 'success'" size="small">{{ row.isLocked ? '锁定' : '开放' }}</el-tag></template></el-table-column>
        <el-table-column prop="wordCount" label="字数" width="80" />
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/notes/detail/${row.id}`)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const search = ref(''); const subjectF = ref('')
const subjects = ['语文','数学','英语','物理','化学','生物']
const notes = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, title: ['高一数学·导数与极值','英语语法·虚拟语气','物理力学·自由落体','化学·氧化还原','语文·劝学翻译','数学·三角函数','英语·定语从句','物理·电磁感应','化学·离子方程式','语文·古文阅读'][i % 10],
  subject: subjects[i % subjects.length], status: i % 3 === 0 ? 'processing' : 'done', isLocked: i % 4 === 0, wordCount: Math.floor(Math.random() * 2000) + 500,
  createdAt: `2026-0${(i % 4) + 1}-${String((i % 28) + 1).padStart(2, '0')} ${10 + (i % 12)}:00`,
})))
const filteredNotes = computed(() => {
  let list = notes.value
  if (search.value) list = list.filter(n => n.title.includes(search.value))
  if (subjectF.value) list = list.filter(n => n.subject === subjectF.value)
  return list
})
</script>
