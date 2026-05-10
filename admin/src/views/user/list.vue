<template>
  <div>
    <div class="page-header">
      <h2>用户列表</h2>
      <div style="display:flex;gap:10px;">
        <el-button type="primary" icon="Plus" @click="openAddDialog">添加用户</el-button>
        <el-button icon="Download" @click="handleExport">导出</el-button>
        <el-button type="danger" icon="Delete" :disabled="!selectedIds.length" @click="handleBatchDelete">批量删除({{ selectedIds.length }})</el-button>
      </div>
    </div>
    <div class="filter-bar">
      <el-input v-model="search" placeholder="搜索昵称/手机号" prefix-icon="Search" style="width:240px;" clearable @input="handleFilter" />
      <el-select v-model="filterGrade" placeholder="学段" clearable style="width:120px;" @change="handleFilter">
        <el-option v-for="g in grades" :key="g.value" :label="g.label" :value="g.value" />
      </el-select>
      <el-select v-model="filterRole" placeholder="角色" clearable style="width:120px;" @change="handleFilter">
        <el-option label="学生" value="student" /><el-option label="家长" value="parent" />
      </el-select>
      <!-- ========== 已删除：VIP状态筛选，待ICP许可证下发后恢复 [2026-05-04] ========== -->
      <el-select v-model="filterRegion" placeholder="地区" clearable filterable style="width:140px;" @change="handleFilter">
        <el-option v-for="p in provinces" :key="p" :label="p" :value="p" />
      </el-select>
      <el-button icon="Refresh" @click="resetFilter">重置</el-button>
    </div>
    <el-card shadow="never">
      <el-table :data="pagedUsers" stripe border @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" sortable />
        <el-table-column prop="nickname" label="昵称" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="goDetail(row.id)">{{ row.nickname }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="gradeLevel" label="学段" width="80">
          <template #default="{ row }"><el-tag size="small">{{ gradeMap[row.gradeLevel] || row.gradeLevel }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="province" label="地区" width="100" />
        <!-- ========== 已删除：VIP状态列，待ICP许可证下发后恢复 [2026-05-04] ========== -->
        <el-table-column label="统计" width="200">
          <template #default="{ row }">
            <span style="font-size:12px;color:#909399;">笔记:{{ row.stats.notes }} 练习:{{ row.stats.exercises }} 错题:{{ row.stats.mistakes }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="160" sortable />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">{{ row.status === 'active' ? '正常' : '封禁' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="goDetail(row.id)">详情</el-button>
            <el-button type="primary" link size="small" @click="openEditDialog(row)">编辑</el-button>
            <el-button :type="row.status === 'active' ? 'warning' : 'success'" link size="small" @click="toggleBan(row)">{{ row.status === 'active' ? '封禁' : '解封' }}</el-button>
            <!-- ========== 已删除：开通VIP按钮，待ICP许可证下发后恢复 [2026-05-04] ========== -->
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:flex-end;margin-top:16px;">
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]" :total="filteredUsers.length" layout="total, sizes, prev, pager, next, jumper" />
      </div>
    </el-card>

    <!-- 添加/编辑用户弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editingUser ? '编辑用户' : '添加用户'" width="600px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="昵称" prop="nickname"><el-input v-model="form.nickname" placeholder="请输入用户昵称" /></el-form-item>
        <el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" /></el-form-item>
        <el-form-item label="学段" prop="gradeLevel">
          <el-select v-model="form.gradeLevel" placeholder="请选择学段" style="width:100%;">
            <el-option v-for="g in grades" :key="g.value" :label="g.label" :value="g.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="地区" prop="province">
          <el-select v-model="form.province" placeholder="请选择地区" filterable style="width:100%;">
            <el-option v-for="p in provinces" :key="p" :label="p" :value="p" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色"><el-radio-group v-model="form.role"><el-radio value="student">学生</el-radio><el-radio value="parent">家长</el-radio></el-radio-group></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.isActive" active-text="正常" inactive-text="封禁" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">{{ editingUser ? '保存修改' : '确认添加' }}</el-button>
      </template>
    </el-dialog>

    <!-- ========== 已删除：开通VIP弹窗，待ICP许可证下发后恢复 [2026-05-04] ========== -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const search = ref('')
const filterGrade = ref('')
const filterRole = ref('')
const filterVip = ref('')
const filterRegion = ref('')
const selectedIds = ref<number[]>([])

const grades = [
  { label: '小学', value: 'PRIMARY' }, { label: '初中', value: 'JUNIOR' },
  { label: '高中', value: 'SENIOR' }, { label: '大学', value: 'COLLEGE' }, { label: '成人', value: 'ADULT' },
]
const gradeMap: Record<string, string> = { PRIMARY: '小学', JUNIOR: '初中', SENIOR: '高中', COLLEGE: '大学', ADULT: '成人' }
const provinces = ['北京','上海','广东','江苏','浙江','四川','湖北','河南','山东','福建','安徽','湖南','重庆','天津','陕西','辽宁']

const mockUsers = ref(Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  nickname: ['小明','学霸','英语达人','数学王','物理迷','化学家','历史通','地理控'][i % 8] + (i + 1),
  phone: `138${String(10000000 + i).slice(0, 8)}`,
  gradeLevel: ['PRIMARY','JUNIOR','SENIOR','COLLEGE'][i % 4],
  province: provinces[i % provinces.length],
  role: i % 7 === 0 ? 'parent' : 'student',
  isVip: i % 5 === 0,
  status: i % 12 === 0 ? 'banned' : 'active' as string,
  stats: { notes: Math.floor(Math.random() * 50), exercises: Math.floor(Math.random() * 100), mistakes: Math.floor(Math.random() * 30) },
  createdAt: `2026-0${(i % 4) + 1}-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
  email: `user${i + 1}@example.com`,
  avatar: '',
  lastLogin: `2026-05-0${(i % 3) + 1} ${String(8 + (i % 14)).padStart(2, '0')}:${String(i * 7 % 60).padStart(2, '0')}`,
})))

const filteredUsers = computed(() => {
  let list = mockUsers.value
  if (search.value) list = list.filter(u => u.nickname.includes(search.value) || u.phone.includes(search.value))
  if (filterGrade.value) list = list.filter(u => u.gradeLevel === filterGrade.value)
  if (filterRole.value) list = list.filter(u => u.role === filterRole.value)
  if (filterVip.value) {} // ========== 已禁用：VIP筛选，待ICP许可证下发后恢复 [2026-05-04] ==========
  if (filterRegion.value) list = list.filter(u => u.province === filterRegion.value)
  return list
})

const pagedUsers = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredUsers.value.slice(start, start + pageSize.value)
})

function handleFilter() { page.value = 1 }
function resetFilter() { search.value = ''; filterGrade.value = ''; filterRole.value = ''; filterVip.value = ''; filterRegion.value = ''; page.value = 1 }
function handleSelectionChange(rows: any[]) { selectedIds.value = rows.map(r => r.id) }
function goDetail(id: number) { router.push(`/user/detail/${id}`) }

// 添加/编辑
const dialogVisible = ref(false)
const editingUser = ref<any>(null)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const form = ref({ nickname: '', phone: '', gradeLevel: '', province: '', role: 'student', isActive: true })
const formRules: FormRules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^1\d{10}$/, message: '手机号格式不正确', trigger: 'blur' }],
  gradeLevel: [{ required: true, message: '请选择学段', trigger: 'change' }],
  province: [{ required: true, message: '请选择地区', trigger: 'change' }],
}
function openAddDialog() {
  editingUser.value = null
  form.value = { nickname: '', phone: '', gradeLevel: '', province: '', role: 'student', isActive: true }
  dialogVisible.value = true
}
function openEditDialog(row: any) {
  editingUser.value = row
  form.value = { nickname: row.nickname, phone: row.phone, gradeLevel: row.gradeLevel, province: row.province, role: row.role, isActive: row.status === 'active' }
  dialogVisible.value = true
}
async function submitForm() {
  if (!formRef.value) return
  await formRef.value.validate()
  submitting.value = true
  setTimeout(() => {
    if (editingUser.value) {
      Object.assign(editingUser.value, { nickname: form.value.nickname, phone: form.value.phone, gradeLevel: form.value.gradeLevel, province: form.value.province, role: form.value.role, status: form.value.isActive ? 'active' : 'banned' })
      ElMessage.success('用户信息已更新')
    } else {
      const newId = Math.max(...mockUsers.value.map(u => u.id)) + 1
      mockUsers.value.unshift({
        id: newId, nickname: form.value.nickname, phone: form.value.phone, gradeLevel: form.value.gradeLevel,
        province: form.value.province, role: form.value.role, isVip: false, status: form.value.isActive ? 'active' : 'banned',
        stats: { notes: 0, exercises: 0, mistakes: 0 }, createdAt: new Date().toLocaleString(),
        email: '', avatar: '', lastLogin: '-',
      })
      ElMessage.success('用户添加成功')
    }
    submitting.value = false
    dialogVisible.value = false
  }, 500)
}

// 封禁/解封
function toggleBan(row: any) {
  const action = row.status === 'active' ? '封禁' : '解封'
  ElMessageBox.confirm(`确定要${action}用户 "${row.nickname}" 吗？`, `${action}确认`, {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
  }).then(() => {
    row.status = row.status === 'active' ? 'banned' : 'active'
    ElMessage.success(`已${action}用户 ${row.nickname}`)
  }).catch(() => {})
}

// 删除
function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除用户 "${row.nickname}" 吗？此操作不可恢复。`, '删除确认', {
    confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'error', confirmButtonClass: 'el-button--danger',
  }).then(() => {
    mockUsers.value = mockUsers.value.filter(u => u.id !== row.id)
    ElMessage.success('用户已删除')
  }).catch(() => {})
}

function handleBatchDelete() {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个用户吗？`, '批量删除', {
    confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'error',
  }).then(() => {
    mockUsers.value = mockUsers.value.filter(u => !selectedIds.value.includes(u.id))
    selectedIds.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}

// ========== 已删除：VIP开通功能，待ICP许可证下发后恢复 [2026-05-04] ==========

function handleExport() { ElMessage.success('用户数据导出中...') }
</script>
