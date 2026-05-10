<template>
  <div>
    <div class="page-header"><h2>数据备份</h2><el-button type="primary" icon="Upload" @click="createBackup">立即备份</el-button></div>
    <div class="stat-row">
      <el-card class="stat-card success" shadow="hover"><span class="stat-value">28</span><span class="stat-label">备份总数</span></el-card>
      <el-card class="stat-card" shadow="hover"><span class="stat-value">2.4GB</span><span class="stat-label">总占用空间</span></el-card>
      <el-card class="stat-card warning" shadow="hover"><span class="stat-value">每日 3:00</span><span class="stat-label">自动备份时间</span></el-card>
      <el-card class="stat-card purple" shadow="hover"><span class="stat-value">7天</span><span class="stat-label">保留周期</span></el-card>
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never"><template #header><span style="font-weight:600;">备份列表</span></template>
          <el-table :data="backups" stripe border>
            <el-table-column prop="id" label="ID" width="60" />
            <el-table-column prop="name" label="备份名称" min-width="200" />
            <el-table-column prop="type" label="类型" width="100"><template #default="{ row }"><el-tag :type="row.type === '自动' ? 'info' : 'primary'" size="small">{{ row.type }}</el-tag></template></el-table-column>
            <el-table-column prop="size" label="大小" width="100" />
            <el-table-column prop="status" label="状态" width="80"><template #default="{ row }"><el-tag :type="row.status === '完成' ? 'success' : 'warning'" size="small">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="createdAt" label="备份时间" width="160" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="downloadBackup(row)">下载</el-button>
                <el-button type="success" link size="small" @click="restoreBackup(row)">恢复</el-button>
                <el-button type="danger" link size="small" @click="deleteBackup(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never"><template #header><span style="font-weight:600;">备份设置</span></template>
          <el-form label-width="100px">
            <el-form-item label="自动备份"><el-switch v-model="autoBackup" /></el-form-item>
            <el-form-item label="备份时间"><el-time-picker v-model="backupTime" placeholder="选择时间" style="width:100%;" /></el-form-item>
            <el-form-item label="保留周期"><el-select v-model="retainDays" style="width:100%;"><el-option label="7天" :value="7" /><el-option label="14天" :value="14" /><el-option label="30天" :value="30" /></el-select></el-form-item>
            <el-form-item label="备份内容"><el-checkbox-group v-model="backupContent"><el-checkbox value="database">数据库</el-checkbox><el-checkbox value="files">文件资源</el-checkbox><el-checkbox value="config">系统配置</el-checkbox></el-checkbox-group></el-form-item>
            <el-form-item><el-button type="primary" @click="ElMessage.success('设置已保存')">保存设置</el-button></el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const autoBackup = ref(true); const backupTime = ref(new Date(2026, 0, 1, 3, 0)); const retainDays = ref(7)
const backupContent = ref(['database', 'files', 'config'])
const backups = ref(Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, name: `backup_2026050${(i % 3) + 1}_${String(3 + i).padStart(2, '0')}00`,
  type: i % 3 === 0 ? '手动' : '自动', size: `${(Math.random() * 200 + 80).toFixed(1)}MB`,
  status: '完成', createdAt: `2026-05-0${(i % 3) + 1} 0${3 + (i % 4)}:00`,
})))
function createBackup() { ElMessage.success('备份任务已创建，正在执行...') }
function downloadBackup(row: any) { ElMessage.success(`正在下载 ${row.name}`) }
function restoreBackup(row: any) { ElMessageBox.confirm(`确定从 ${row.name} 恢复数据？当前数据将被覆盖！`, '数据恢复', { type: 'error' }).then(() => ElMessage.success('恢复中...')).catch(() => {}) }
function deleteBackup(row: any) { ElMessageBox.confirm(`删除备份 ${row.name}？`, '删除', { type: 'warning' }).then(() => { backups.value = backups.value.filter(b => b.id !== row.id); ElMessage.success('已删除') }).catch(() => {}) }
</script>
