<template>
  <div>
    <div class="page-header"><div style="display:flex;align-items:center;gap:12px;"><el-button icon="ArrowLeft" @click="$router.push('/group/list')">返回列表</el-button><h2 style="margin:0;">小组详情 — {{ group.name }}</h2></div>
      <el-button type="danger" @click="handleDissolve">解散小组</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span style="font-weight:600;">小组信息</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="小组ID">{{ group.id }}</el-descriptions-item>
            <el-descriptions-item label="小组名称">{{ group.name }}</el-descriptions-item>
            <el-descriptions-item label="组长"><el-link type="primary" @click="$router.push(`/user/detail/${group.ownerId}`)">{{ group.owner }}</el-link></el-descriptions-item>
            <el-descriptions-item label="邀请码"><el-tag type="info">{{ group.inviteCode }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="成员数">{{ group.memberCount }}/10</el-descriptions-item>
            <el-descriptions-item label="PK总数">{{ group.totalPk }}</el-descriptions-item>
            <el-descriptions-item label="共享笔记">{{ group.sharedNotes }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ group.createdAt }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">活跃度趋势</span></template>
          <v-chart :option="activityChart" style="height:200px;" autoresize />
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header><div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-weight:600;">成员列表</span><el-button type="primary" size="small" @click="$router.push(`/group/detail/${group.id}/members`)">管理成员</el-button></div></template>
          <el-table :data="members" stripe size="small">
            <el-table-column prop="nickname" label="昵称" width="120"><template #default="{ row }"><el-link type="primary" @click="$router.push(`/user/detail/${row.id}`)">{{ row.nickname }}</el-link></template></el-table-column>
            <el-table-column prop="role" label="角色" width="80"><template #default="{ row }"><el-tag :type="row.role === '组长' ? 'warning' : 'info'" size="small">{{ row.role }}</el-tag></template></el-table-column>
            <el-table-column prop="pkWins" label="PK胜场" width="80" />
            <el-table-column prop="sharedNotes" label="分享笔记" width="80" />
            <el-table-column prop="weekActive" label="本周活跃" width="80" />
            <el-table-column prop="joinDate" label="加入时间" width="120" />
            <el-table-column label="操作" width="120"><template #default="{ row }"><el-button v-if="row.role !== '组长'" type="danger" link size="small" @click="removeMember(row)">移除</el-button></template></el-table-column>
          </el-table>
        </el-card>
        <el-card shadow="hover" style="margin-top:20px;">
          <template #header><span style="font-weight:600;">最近PK记录</span></template>
          <el-table :data="recentPk" stripe size="small">
            <el-table-column prop="player1" label="选手1" width="100" />
            <el-table-column prop="score1" label="得分" width="60" />
            <el-table-column label="VS" width="40"><template #default><span style="font-weight:600;color:#909399;">VS</span></template></el-table-column>
            <el-table-column prop="player2" label="选手2" width="100" />
            <el-table-column prop="score2" label="得分" width="60" />
            <el-table-column prop="subject" label="科目" width="80" />
            <el-table-column label="胜者" width="100"><template #default="{ row }"><el-tag :type="row.score1 > row.score2 ? 'success' : 'danger'" size="small">{{ row.score1 > row.score2 ? row.player1 : row.player2 }}</el-tag></template></el-table-column>
            <el-table-column prop="createdAt" label="时间" width="140" />
            <el-table-column label="操作" width="80"><template #default="{ row }"><el-button type="primary" link size="small" @click="$router.push(`/group/pk/${row.id}`)">详情</el-button></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])
const route = useRoute(); const router = useRouter()
const groupId = Number(route.params.id)
const group = reactive({ id: groupId, name: '学霸冲刺组', owner: '小明', ownerId: 1, inviteCode: 'GRP1001', memberCount: 8, totalPk: 45, sharedNotes: 12, createdAt: '2026-02-15' })
const members = ref(Array.from({ length: 8 }, (_, i) => ({
  id: i + 1, nickname: ['小明','小李','小王','小赵','小陈','小孙','小周','小吴'][i], role: i === 0 ? '组长' : '成员',
  pkWins: Math.floor(Math.random() * 10) + 2, sharedNotes: Math.floor(Math.random() * 5),
  weekActive: Math.floor(Math.random() * 10) + 1, joinDate: `2026-0${(i % 4) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
})))
const recentPk = ref(Array.from({ length: 5 }, (_, i) => ({
  id: i + 1, player1: ['小明','小李','小王','小赵','小陈'][i], score1: Math.floor(Math.random() * 3) + 3,
  player2: ['小张','小刘','小林','小黄','小杨'][i], score2: Math.floor(Math.random() * 3) + 3,
  subject: ['数学','英语','物理'][i % 3], createdAt: `2026-05-0${(i % 3) + 1} ${10 + i}:00`,
})))
const activityChart = ref({ tooltip: { trigger: 'axis' }, grid: { left: 30, right: 10, top: 10, bottom: 25 },
  xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'], boundaryGap: false },
  yAxis: { type: 'value' }, series: [{ type: 'line', data: [5, 8, 6, 12, 9, 15, 10], smooth: true, areaStyle: { opacity: 0.15 }, color: '#409eff' }] })
function removeMember(row: any) { ElMessageBox.confirm(`移除成员 ${row.nickname}？`, '确认', { type: 'warning' }).then(() => { members.value = members.value.filter(m => m.id !== row.id); group.memberCount--; ElMessage.success('已移除') }).catch(() => {}) }
function handleDissolve() { ElMessageBox.confirm('确定解散此小组？所有成员将被移除。', '解散小组', { type: 'error' }).then(() => { ElMessage.success('小组已解散'); router.push('/group/list') }).catch(() => {}) }
</script>
