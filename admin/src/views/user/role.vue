<template>
  <div>
    <div class="page-header"><h2>角色权限管理</h2><el-button type="primary" icon="Plus">添加角色</el-button></div>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="never">
          <template #header><span style="font-weight:600;">角色列表</span></template>
          <el-table :data="roles" stripe highlight-current-row @current-change="selectRole">
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="code" label="角色标识" width="120" />
            <el-table-column prop="userCount" label="用户数" width="80" />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="primary" link size="small" :disabled="row.code === 'super_admin'">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card shadow="never">
          <template #header><span style="font-weight:600;">权限配置 — {{ currentRole?.name || '请选择角色' }}</span></template>
          <el-tree v-if="currentRole" :data="permissionTree" show-checkbox node-key="id" default-expand-all :default-checked-keys="currentRole.permissions" :props="{ label: 'label', children: 'children' }" />
          <el-empty v-else description="请在左侧选择一个角色" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const roles = ref([
  { name: '超级管理员', code: 'super_admin', userCount: 1, permissions: ['d','u','u1','u2','u3','n','n1','n2','e','e1','e2','ex','ex1','ex2','m','m1','m2','o','o1','o2','g','g1','g2','p','p1','p2','s','s1','s2'] },
  { name: '管理员', code: 'admin', userCount: 3, permissions: ['d','u','u1','u2','n','n1','n2','e','e1','e2','ex','ex1','ex2','m','m1','m2','o','o1','o2','g','g1','g2','p','p1','p2'] },
  { name: '运营人员', code: 'operator', userCount: 5, permissions: ['d','n','n1','n2','e','e1','ex','ex1','m','m1','o','o1','g','g1','p','p1'] },
  { name: '只读用户', code: 'viewer', userCount: 2, permissions: ['d','u1','n1','e1','ex1','m1','o1','g1','p1'] },
])
const currentRole = ref<any>(null)
function selectRole(row: any) { currentRole.value = row }
const permissionTree = [
  { id: 'd', label: '仪表盘' },
  { id: 'u', label: '用户管理', children: [{ id: 'u1', label: '查看用户' }, { id: 'u2', label: '编辑用户' }, { id: 'u3', label: '管理权限' }] },
  { id: 'n', label: '笔记管理', children: [{ id: 'n1', label: '查看笔记' }, { id: 'n2', label: '审核笔记' }] },
  { id: 'e', label: '练习管理', children: [{ id: 'e1', label: '查看题库' }, { id: 'e2', label: '编辑题库' }] },
  { id: 'ex', label: '考试管理', children: [{ id: 'ex1', label: '查看配置' }, { id: 'ex2', label: '编辑配置' }] },
  { id: 'm', label: '错题管理', children: [{ id: 'm1', label: '查看错题' }, { id: 'm2', label: '管理错题' }] },
  { id: 'o', label: '口语管理', children: [{ id: 'o1', label: '查看词库' }, { id: 'o2', label: '编辑词库' }] },
  { id: 'g', label: '小组管理', children: [{ id: 'g1', label: '查看小组' }, { id: 'g2', label: '管理小组' }] },
  { id: 'p', label: '家长管理', children: [{ id: 'p1', label: '查看报告' }, { id: 'p2', label: '管理设置' }] },
  { id: 's', label: '系统管理', children: [{ id: 's1', label: '系统配置' }, { id: 's2', label: '操作日志' }] },
]
</script>
