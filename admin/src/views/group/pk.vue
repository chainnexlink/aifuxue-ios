<template>
  <div>
    <div class="page-header"><h2>PK记录</h2></div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索用户/小组" prefix-icon="Search" style="width:200px;" clearable />
      <el-select v-model="subjectF" placeholder="科目" clearable style="width:120px;">
        <el-option v-for="s in ['数学','英语','语文','物理','化学']" :key="s" :label="s" :value="s" />
      </el-select>
    </div>
    <el-card shadow="never">
      <el-table :data="filteredPk" stripe border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="group" label="所属小组" width="140" />
        <el-table-column prop="player1" label="选手1" width="100" />
        <el-table-column prop="score1" label="得分1" width="70" />
        <el-table-column label="VS" width="50"><template #default><span style="color:#909399;font-weight:600;">VS</span></template></el-table-column>
        <el-table-column prop="player2" label="选手2" width="100" />
        <el-table-column prop="score2" label="得分2" width="70" />
        <el-table-column prop="subject" label="科目" width="80" />
        <el-table-column prop="questions" label="题数" width="60" />
        <el-table-column label="胜者" width="100">
          <template #default="{ row }">
            <el-tag :type="row.score1 > row.score2 ? 'success' : row.score1 < row.score2 ? 'danger' : 'info'" size="small">
              {{ row.score1 > row.score2 ? row.player1 : row.score1 < row.score2 ? row.player2 : '平局' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="用时" width="80" />
        <el-table-column prop="createdAt" label="PK时间" width="160" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/group/pk/${row.id}`)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const search = ref(''); const subjectF = ref('')
const pkRecords = ref(Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, group: ['学霸冲刺组','数学攻坚队','英语口语营','物理探索者','化学实验室'][i % 5],
  player1: ['小明','小李','小王','小赵','小陈'][i % 5], score1: Math.floor(Math.random() * 4) + 3,
  player2: ['小张','小刘','小林','小黄','小杨'][i % 5], score2: Math.floor(Math.random() * 4) + 3,
  subject: ['数学','英语','物理','化学','语文'][i % 5], questions: 5,
  duration: `${Math.floor(Math.random() * 3) + 1}分${Math.floor(Math.random() * 50) + 10}秒`,
  createdAt: `2026-05-0${(i % 3) + 1} ${10 + i}:${String(i * 7 % 60).padStart(2, '0')}`,
})))
const filteredPk = computed(() => {
  return pkRecords.value.filter(r => {
    if (search.value && !r.player1.includes(search.value) && !r.player2.includes(search.value) && !r.group.includes(search.value)) return false
    if (subjectF.value && r.subject !== subjectF.value) return false
    return true
  })
})
</script>
