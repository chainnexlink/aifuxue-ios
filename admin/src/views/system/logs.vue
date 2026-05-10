<template>
  <div>
    <div class="page-header"><h2>操作日志</h2></div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索操作者/内容" prefix-icon="Search" style="width:240px;" clearable />
      <el-select v-model="moduleF" placeholder="模块" clearable style="width:140px;">
        <el-option label="用户管理" value="user" /><el-option label="笔记管理" value="notes" />
        <el-option label="练习管理" value="exercise" /><el-option label="考试管理" value="exam" />
        <el-option label="错题管理" value="mistakes" /><el-option label="系统配置" value="system" />
      </el-select>
      <el-select v-model="typeF" placeholder="操作类型" clearable style="width:120px;">
        <el-option label="创建" value="create" /><el-option label="更新" value="update" />
        <el-option label="删除" value="delete" /><el-option label="登录" value="login" />
      </el-select>
      <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width:260px;" />
    </div>
    <el-card shadow="never">
      <el-table :data="pagedData" stripe border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="operator" label="操作者" width="120" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }"><el-tag size="small">{{ row.role }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="100" />
        <el-table-column prop="action" label="操作类型" width="80">
          <template #default="{ row }">
            <el-tag :type="{ '创建': 'success', '更新': 'warning', '删除': 'danger', '登录': 'primary', '导出': 'info' }[row.action] as any" size="small">{{ row.action }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作内容" show-overflow-tooltip min-width="260" />
        <el-table-column prop="ip" label="IP地址" width="130" />
        <el-table-column prop="createdAt" label="操作时间" width="170" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/system/logs/${row.id}`)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:flex-end;margin-top:16px;">
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="filteredLogs.length" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const search = ref(''); const moduleF = ref(''); const typeF = ref(''); const dateRange = ref(null)
const page = ref(1); const pageSize = ref(10)
const moduleMap: Record<string, string> = { user: '用户管理', notes: '笔记管理', exercise: '题库管理', exam: '考试配置', mistakes: '错题管理', system: '系统配置' }
const actionMap: Record<string, string> = { create: '创建', update: '更新', delete: '删除', login: '登录' }
const logs = ref(Array.from({ length: 15 }, (_, i) => ({
  id: 200 - i,
  operator: ['超级管理员', '运营小张', '管理员李', '运营小王'][i % 4],
  role: ['超级管理员', '运营人员', '管理员', '运营人员'][i % 4],
  module: ['用户管理', '笔记管理', '题库管理', '考试配置', '系统配置', '错题管理'][i % 6],
  action: ['创建', '更新', '删除', '登录', '导出'][i % 5],
  content: [
    '新增用户: 小明同学 (ID: 1025)',
    '审核通过笔记: 高一数学·导数与极值 (ID: 482)',
    '删除违规笔记: 广告内容 (ID: 381)',
    '管理员登录系统',
    '导出本周学习报告 (共32份)',
    '更新考试配置: 高中数学(江苏) 总分150→120',
    '封禁用户: 违规用户123 (ID: 892)',
    '新增题目: 数学选择题 (共15题)',
    '重置家长密码: 用户小明 (ID: 56)',
    '更新广告解锁配置: 免费次数 3→5',
    '解散小组: 测试小组 (ID: 15)',
    '新增口语词条: pronunciation (ID: 3261)',
    '更新系统配置: 启用邀请码注册',
    '审核拒绝笔记: 内容不完整 (ID: 490)',
    '批量导出错题统计数据',
  ][i],
  ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  createdAt: `2026-05-03 ${String(23 - i).padStart(2, '0')}:${String(i * 4 % 60).padStart(2, '0')}:${String(i * 7 % 60).padStart(2, '0')}`,
})))
const filteredLogs = computed(() => {
  return logs.value.filter(l => {
    if (search.value && !l.operator.includes(search.value) && !l.content.includes(search.value)) return false
    if (moduleF.value && l.module !== moduleMap[moduleF.value]) return false
    if (typeF.value && l.action !== actionMap[typeF.value]) return false
    return true
  })
})
const pagedData = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredLogs.value.slice(start, start + pageSize.value)
})
</script>
