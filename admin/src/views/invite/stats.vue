<template>
  <div>
    <div class="page-header">
      <h2>邀请码统计</h2>
    </div>

    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="6">
        <el-card shadow="never" class="overview-card">
          <div class="oc-icon" style="background:linear-gradient(135deg,#409eff,#79bbff);">
            <el-icon style="font-size:28px;color:#fff;"><Ticket /></el-icon>
          </div>
          <div class="oc-info"><div class="oc-num">{{ stats.totalCodes }}</div><div class="oc-label">总邀请码数</div></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="overview-card">
          <div class="oc-icon" style="background:linear-gradient(135deg,#67c23a,#95d475);">
            <el-icon style="font-size:28px;color:#fff;"><Check /></el-icon>
          </div>
          <div class="oc-info"><div class="oc-num">{{ stats.usedCodes }}</div><div class="oc-label">已使用</div></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="overview-card">
          <div class="oc-icon" style="background:linear-gradient(135deg,#e6a23c,#eebe77);">
            <el-icon style="font-size:28px;color:#fff;"><UserFilled /></el-icon>
          </div>
          <div class="oc-info"><div class="oc-num">{{ stats.invitedUsers }}</div><div class="oc-label">邀请注册用户</div></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="overview-card">
          <div class="oc-icon" style="background:linear-gradient(135deg,#a78bfa,#c4b5fd);">
            <el-icon style="font-size:28px;color:#fff;"><TrendCharts /></el-icon>
          </div>
          <div class="oc-info"><div class="oc-num">{{ stats.conversionRate }}%</div><div class="oc-label">转化率(试用→活跃)</div></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span style="font-weight:600;">教师码 vs 用户码</span></template>
          <div class="type-compare">
            <div class="tc-item">
              <div class="tc-header"><el-tag type="primary">教师码</el-tag><span class="tc-prefix">TEACHER-XXXXXX</span></div>
              <div class="tc-stats">
                <div class="tc-stat"><span>总数</span><span>{{ stats.teacherTotal }}</span></div>
                <div class="tc-stat"><span>已用</span><span>{{ stats.teacherUsed }}</span></div>
                <div class="tc-stat"><span>使用率</span><span>{{ Math.round(stats.teacherUsed / stats.teacherTotal * 100) }}%</span></div>
                <div class="tc-stat"><span>赠送天数</span><span>30天</span></div>
              </div>
              <el-progress :percentage="Math.round(stats.teacherUsed / stats.teacherTotal * 100)" :stroke-width="10" color="#409eff" />
            </div>
            <div class="tc-item">
              <div class="tc-header"><el-tag>用户码</el-tag><span class="tc-prefix">USER-XXXXXX</span></div>
              <div class="tc-stats">
                <div class="tc-stat"><span>总数</span><span>{{ stats.userTotal }}</span></div>
                <div class="tc-stat"><span>已用</span><span>{{ stats.userUsed }}</span></div>
                <div class="tc-stat"><span>使用率</span><span>{{ Math.round(stats.userUsed / stats.userTotal * 100) }}%</span></div>
                <div class="tc-stat"><span>赠送天数</span><span>7天</span></div>
              </div>
              <el-progress :percentage="Math.round(stats.userUsed / stats.userTotal * 100)" :stroke-width="10" color="#a78bfa" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span style="font-weight:600;">获客漏斗</span></template>
          <div class="funnel">
            <div class="funnel-step" style="background:linear-gradient(90deg,#409eff20,transparent);">
              <div class="fs-bar" style="width:100%;background:#409eff;"></div>
              <div class="fs-info"><span>邀请码发放</span><span>{{ stats.totalCodes }}</span></div>
            </div>
            <div class="funnel-step" style="background:linear-gradient(90deg,#67c23a20,transparent);">
              <div class="fs-bar" :style="{ width: Math.round(stats.usedCodes / stats.totalCodes * 100) + '%', background: '#67c23a' }"></div>
              <div class="fs-info"><span>成功注册</span><span>{{ stats.invitedUsers }}</span></div>
            </div>
            <div class="funnel-step" style="background:linear-gradient(90deg,#e6a23c20,transparent);">
              <div class="fs-bar" :style="{ width: Math.round(stats.activeUsers / stats.totalCodes * 100) + '%', background: '#e6a23c' }"></div>
              <div class="fs-info"><span>活跃使用(7天内)</span><span>{{ stats.activeUsers }}</span></div>
            </div>
            <div class="funnel-step" style="background:linear-gradient(90deg,#a78bfa20,transparent);">
              <div class="fs-bar" :style="{ width: Math.round(stats.paidUsers / stats.totalCodes * 100) + '%', background: '#a78bfa' }"></div>
              <div class="fs-info"><span>活跃转化</span><span>{{ stats.paidUsers }}</span></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <template #header><span style="font-weight:600;">邀请排行榜（教师）</span></template>
      <el-table :data="teacherRanking" stripe border>
        <el-table-column label="排名" width="70">
          <template #default="{ $index }">
            <span :style="{ color: $index < 3 ? '#e6a23c' : '#909399', fontWeight: $index < 3 ? 700 : 400 }">{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="教师" width="120" />
        <el-table-column prop="school" label="学校" width="200" />
        <el-table-column prop="inviteCount" label="邀请人数" width="100" sortable />
        <el-table-column prop="activeCount" label="活跃人数" width="100" />
        <el-table-column prop="paidCount" label="活跃转化" width="100" />
        <el-table-column label="转化率" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.inviteCount ? Math.round(row.paidCount / row.inviteCount * 100) : 0" :stroke-width="6" />
          </template>
        </el-table-column>
        <!-- ========== 已删除：贡献收入列，待ICP许可证下发后恢复 [2026-05-04] ========== -->
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const stats = ref({
  totalCodes: 580, usedCodes: 342, invitedUsers: 316, conversionRate: 18,
  teacherTotal: 200, teacherUsed: 156, userTotal: 380, userUsed: 186,
  activeUsers: 198, paidUsers: 57,
})

const teacherRanking = ref([
  { name: '张老师', school: '北京市第一中学', inviteCount: 48, activeCount: 36, paidCount: 12, revenue: 3588 },
  { name: '李老师', school: '上海市实验中学', inviteCount: 35, activeCount: 28, paidCount: 9, revenue: 2691 },
  { name: '王老师', school: '广州市育才中学', inviteCount: 28, activeCount: 20, paidCount: 7, revenue: 2093 },
  { name: '赵老师', school: '深圳市外国语学校', inviteCount: 22, activeCount: 15, paidCount: 5, revenue: 1495 },
  { name: '刘老师', school: '成都七中', inviteCount: 18, activeCount: 12, paidCount: 4, revenue: 1196 },
  { name: '陈老师', school: '杭州学军中学', inviteCount: 15, activeCount: 10, paidCount: 3, revenue: 897 },
])
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 700; }
.overview-card { display: flex; align-items: center; gap: 16px; }
.overview-card :deep(.el-card__body) { display: flex; align-items: center; gap: 16px; }
.oc-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.oc-num { font-size: 28px; font-weight: 700; color: #303133; }
.oc-label { font-size: 13px; color: #909399; }
.type-compare { display: flex; flex-direction: column; gap: 24px; }
.tc-item { padding: 20px; background: #f5f7fa; border-radius: 12px; }
.tc-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.tc-prefix { font-size: 13px; color: #909399; font-family: monospace; }
.tc-stats { display: flex; gap: 24px; margin-bottom: 12px; }
.tc-stat { display: flex; flex-direction: column; font-size: 13px; }
.tc-stat span:first-child { color: #909399; }
.tc-stat span:last-child { font-weight: 600; color: #303133; font-size: 16px; }
.funnel { display: flex; flex-direction: column; gap: 16px; }
.funnel-step { padding: 16px; border-radius: 8px; position: relative; overflow: hidden; }
.fs-bar { height: 4px; border-radius: 2px; margin-bottom: 8px; }
.fs-info { display: flex; justify-content: space-between; font-size: 14px; }
.fs-info span:first-child { color: #606266; }
.fs-info span:last-child { font-weight: 600; color: #303133; }
</style>
