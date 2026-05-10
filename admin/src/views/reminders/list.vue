<template>
  <div class="page">
    <div class="page-header">
      <h2>催交提醒日志</h2>
      <p>查看所有作业催交提醒的发送记录与状态</p>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="今日发送" :value="stats.todaySent" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="总发送量" :value="stats.totalSent" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="催交后提交率" :value="stats.submitRate + '%'" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never"><el-statistic title="活跃教师" :value="stats.activeTeachers" /></el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <div class="filter-bar">
        <el-input v-model="search" placeholder="搜索作业/教师/班级" clearable style="width:240px" />
        <el-select v-model="filterType" placeholder="提醒类型" clearable style="width:140px">
          <el-option label="截止前提醒" value="before" />
          <el-option label="截止时提醒" value="ontime" />
          <el-option label="超时催交" value="overdue" />
          <el-option label="手动催交" value="manual" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width:120px">
          <el-option label="已发送" value="sent" />
          <el-option label="已读" value="read" />
          <el-option label="已提交" value="submitted" />
        </el-select>
      </div>

      <el-table :data="filteredList" stripe style="width:100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="homeworkName" label="作业名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="className" label="班级" width="120" />
        <el-table-column prop="teacher" label="教师" width="80" />
        <el-table-column label="提醒类型" width="110">
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.type]" size="small">{{ typeTextMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="targetCount" label="发送人数" width="90" align="center" />
        <el-table-column label="状态分布" width="200">
          <template #default="{ row }">
            <div class="status-bar">
              <el-tooltip content="已提交">
                <div class="sb-seg submitted" :style="{ width: (row.submittedCount / row.targetCount * 100) + '%' }"></div>
              </el-tooltip>
              <el-tooltip content="已读未交">
                <div class="sb-seg read" :style="{ width: (row.readCount / row.targetCount * 100) + '%' }"></div>
              </el-tooltip>
              <el-tooltip content="未读">
                <div class="sb-seg unread" :style="{ width: ((row.targetCount - row.readCount - row.submittedCount) / row.targetCount * 100) + '%' }"></div>
              </el-tooltip>
            </div>
            <div class="status-text">{{ row.submittedCount }}提交 / {{ row.readCount }}已读 / {{ row.targetCount - row.readCount - row.submittedCount }}未读</div>
          </template>
        </el-table-column>
        <el-table-column prop="sentAt" label="发送时间" width="160" />
      </el-table>

      <div class="pagination-wrap">
        <el-pagination background layout="total, prev, pager, next" :total="filteredList.length" :page-size="20" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const search = ref('')
const filterType = ref('')
const filterStatus = ref('')

const stats = ref({ todaySent: 24, totalSent: 1256, submitRate: 67, activeTeachers: 18 })

const typeTagMap: Record<string, string> = { before: 'warning', ontime: '', overdue: 'danger', manual: 'info' }
const typeTextMap: Record<string, string> = { before: '截止前提醒', ontime: '截止时提醒', overdue: '超时催交', manual: '手动催交' }

const reminderList = ref([
  { id: 1, homeworkName: '第三章导数练习', className: '高一2班数学', teacher: '张老师', type: 'manual', targetCount: 13, readCount: 8, submittedCount: 5, sentAt: '2025-05-03 15:30' },
  { id: 2, homeworkName: '古诗词默写', className: '高一1班语文', teacher: '赵老师', type: 'before', targetCount: 14, readCount: 10, submittedCount: 6, sentAt: '2025-05-03 12:00' },
  { id: 3, homeworkName: '虚拟语气专项', className: '高一2班英语', teacher: '李老师', type: 'ontime', targetCount: 5, readCount: 4, submittedCount: 3, sentAt: '2025-05-02 23:59' },
  { id: 4, homeworkName: '物理实验报告', className: '高一1班物理', type: 'overdue', teacher: '钱老师', targetCount: 27, readCount: 15, submittedCount: 8, sentAt: '2025-05-03 06:00' },
  { id: 5, homeworkName: '化学方程式', className: '高一2班化学', teacher: '孙老师', type: 'before', targetCount: 8, readCount: 6, submittedCount: 4, sentAt: '2025-05-01 21:00' },
])

const filteredList = computed(() => {
  return reminderList.value.filter(item => {
    if (search.value && !item.homeworkName.includes(search.value) && !item.teacher.includes(search.value) && !item.className.includes(search.value)) return false
    if (filterType.value && item.type !== filterType.value) return false
    return true
  })
})
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-header h2 { margin: 0 0 4px; font-size: 20px; }
.page-header p { margin: 0; color: #909399; font-size: 14px; }
.stat-row { margin-bottom: 16px; }
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
.status-bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; background: #f0f2f5; margin-bottom: 4px; }
.sb-seg { height: 100%; min-width: 2px; }
.sb-seg.submitted { background: #67c23a; }
.sb-seg.read { background: #e6a23c; }
.sb-seg.unread { background: #dcdfe6; }
.status-text { font-size: 11px; color: #909399; }
</style>
