<template>
  <div>
    <div class="page-header"><h2>小组列表</h2></div>
    <div class="stat-row">
      <el-card class="stat-card" shadow="hover"><span class="stat-value">326</span><span class="stat-label">总小组数</span></el-card>
      <el-card class="stat-card success" shadow="hover"><span class="stat-value">1,580</span><span class="stat-label">总成员数</span></el-card>
      <el-card class="stat-card warning" shadow="hover"><span class="stat-value">892</span><span class="stat-label">总PK次数</span></el-card>
      <el-card class="stat-card purple" shadow="hover"><span class="stat-value">456</span><span class="stat-label">共享笔记</span></el-card>
    </div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索小组名/邀请码" prefix-icon="Search" style="width:240px;" clearable />
    </div>
    <el-card shadow="never">
      <el-table :data="filteredGroups" stripe border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="小组名称" width="160" />
        <el-table-column prop="owner" label="组长" width="100" />
        <el-table-column prop="memberCount" label="成员数" width="80" />
        <el-table-column prop="inviteCode" label="邀请码" width="100">
          <template #default="{ row }"><el-tag size="small" type="info">{{ row.inviteCode }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="totalPk" label="PK总数" width="80" />
        <el-table-column prop="weekActive" label="本周活跃" width="90" />
        <el-table-column prop="sharedNotes" label="共享笔记" width="90" />
        <el-table-column prop="createdAt" label="创建时间" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/group/detail/${row.id}`)">详情</el-button>
            <el-button type="warning" link size="small" @click="$router.push(`/group/detail/${row.id}/members`)">管理成员</el-button>
            <el-button type="danger" link size="small" @click="handleDissolve(row)">解散</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const search = ref('')
const handleDissolve = (row: any) => {
  ElMessageBox.confirm(`确定解散小组「${row.name}」？此操作不可恢复！`, '解散确认', { type: 'error', confirmButtonText: '确定解散' }).then(() => {
    groups.value = groups.value.filter(g => g.id !== row.id)
    ElMessage.success('小组已解散')
  }).catch(() => {})
}
const groups = ref(Array.from({ length: 8 }, (_, i) => ({
  id: i + 1, name: ['学霸冲刺组','数学攻坚队','英语口语营','物理探索者','化学实验室','全科提升班','高考冲刺营','中考备战组'][i],
  owner: ['小明','小李','小王','小赵','小陈','小孙','小周','小吴'][i],
  memberCount: Math.floor(Math.random() * 8) + 3,
  inviteCode: `GRP${String(1000 + i)}`,
  totalPk: Math.floor(Math.random() * 50) + 10,
  weekActive: Math.floor(Math.random() * 20) + 5,
  sharedNotes: Math.floor(Math.random() * 15) + 2,
  createdAt: `2026-0${(i % 4) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
})))
const filteredGroups = computed(() => {
  if (!search.value) return groups.value
  return groups.value.filter(g => g.name.includes(search.value) || g.inviteCode.includes(search.value) || g.owner.includes(search.value))
})
</script>
