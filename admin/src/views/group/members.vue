<template>
  <div>
    <div class="page-header"><div style="display:flex;align-items:center;gap:12px;"><el-button icon="ArrowLeft" @click="$router.push(`/group/detail/${$route.params.id}`)">返回小组</el-button><h2 style="margin:0;">成员管理 — 学霸冲刺组</h2></div>
      <el-button type="primary" icon="Plus" @click="addVisible = true">添加成员</el-button>
    </div>
    <el-card shadow="never">
      <el-table :data="members" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="nickname" label="昵称" width="120"><template #default="{ row }"><el-link type="primary" @click="$router.push(`/user/detail/${row.id}`)">{{ row.nickname }}</el-link></template></el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="role" label="角色" width="100"><template #default="{ row }">
          <el-select v-model="row.role" size="small" style="width:80px;" @change="changeRole(row)"><el-option label="组长" value="组长" /><el-option label="成员" value="成员" /></el-select>
        </template></el-table-column>
        <el-table-column prop="pkWins" label="PK胜场" width="80" />
        <el-table-column prop="weekActive" label="本周活跃" width="90" />
        <el-table-column prop="joinDate" label="加入时间" width="120" />
        <el-table-column label="操作" width="120"><template #default="{ row }"><el-button v-if="row.role !== '组长'" type="danger" link size="small" @click="remove(row)">移除</el-button></template></el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="addVisible" title="添加成员" width="420px">
      <el-form label-width="80px"><el-form-item label="用户搜索"><el-input v-model="addSearch" placeholder="输入昵称或手机号" /></el-form-item></el-form>
      <template #footer><el-button @click="addVisible = false">取消</el-button><el-button type="primary" @click="confirmAdd">添加</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const members = ref(Array.from({ length: 8 }, (_, i) => ({
  id: i + 1, nickname: ['小明','小李','小王','小赵','小陈','小孙','小周','小吴'][i], phone: `138${String(10000000 + i).slice(0, 8)}`,
  role: i === 0 ? '组长' : '成员', pkWins: Math.floor(Math.random() * 10) + 2, weekActive: Math.floor(Math.random() * 10) + 1,
  joinDate: `2026-0${(i % 4) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
})))
const addVisible = ref(false); const addSearch = ref('')
function changeRole(row: any) { ElMessage.success(`${row.nickname} 角色已更新为 ${row.role}`) }
function remove(row: any) { ElMessageBox.confirm(`移除 ${row.nickname}？`, '确认', { type: 'warning' }).then(() => { members.value = members.value.filter(m => m.id !== row.id); ElMessage.success('已移除') }).catch(() => {}) }
function confirmAdd() { addVisible.value = false; ElMessage.success('成员已添加') }
</script>
