<template>
  <el-container class="admin-layout">
    <el-aside :width="adminStore.collapsed ? '64px' : '220px'" class="aside">
      <div class="logo-area">
        <span class="logo-icon">AI</span>
        <span v-show="!adminStore.collapsed" class="logo-text">爱辅学管理后台</span>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="route.path"
          :collapse="adminStore.collapsed"
          router
          background-color="#001529"
          text-color="#ffffffb3"
          active-text-color="#409eff"
          :collapse-transition="false"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataBoard /></el-icon>
            <template #title>仪表盘</template>
          </el-menu-item>

          <el-sub-menu index="group-users">
            <template #title><el-icon><User /></el-icon><span>用户与教师</span></template>
            <el-menu-item index="/user/list">用户列表</el-menu-item>
            <el-menu-item index="/user/role">角色权限</el-menu-item>
            <el-menu-item index="/teacher/list">教师列表</el-menu-item>
            <el-menu-item index="/parent/control">家长控制</el-menu-item>
            <el-menu-item index="/parent/reports">学习报告</el-menu-item>
            <el-menu-item index="/group/list">小组列表</el-menu-item>
            <el-menu-item index="/group/pk">PK记录</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="group-learning">
            <template #title><el-icon><Reading /></el-icon><span>学习功能</span></template>
            <el-menu-item index="/notes/list">笔记列表</el-menu-item>
            <el-menu-item index="/notes/review">内容审核</el-menu-item>
            <el-menu-item index="/notes/category">分类管理</el-menu-item>
            <el-menu-item index="/exercise/questions">题库管理</el-menu-item>
            <el-menu-item index="/exercise/records">练习记录</el-menu-item>
            <el-menu-item index="/exercise/knowledge">知识点管理</el-menu-item>
            <el-menu-item index="/exam/config">考试配置</el-menu-item>
            <el-menu-item index="/exam/records">考试记录</el-menu-item>
            <el-menu-item index="/exam/analysis">成绩分析</el-menu-item>
            <el-menu-item index="/mistakes/list">错题列表</el-menu-item>
            <el-menu-item index="/mistakes/stats">错题统计</el-menu-item>
            <el-menu-item index="/oral/wordbank">词库管理</el-menu-item>
            <el-menu-item index="/oral/course">课程管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="group-teaching">
            <template #title><el-icon><School /></el-icon><span>教学管理</span></template>
            <el-menu-item index="/class/list">班级列表</el-menu-item>
            <el-menu-item index="/homework/list">作业列表</el-menu-item>
            <el-menu-item index="/exam-gen/list">AI出卷</el-menu-item>
            <el-menu-item index="/class-mistakes/list">班级错题集</el-menu-item>
            <el-menu-item index="/reminders/list">催交提醒</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="group-growth">
            <template #title><el-icon><TrendCharts /></el-icon><span>运营增长</span></template>
            <el-menu-item index="/invite/list">邀请码列表</el-menu-item>
            <el-menu-item index="/invite/stats">邀请统计</el-menu-item>
            <el-menu-item index="/invite/settings">邀请设置</el-menu-item>
            <el-menu-item index="/website/content">官网内容</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="/system">
            <template #title><el-icon><Setting /></el-icon><span>系统设置</span></template>
            <el-menu-item index="/system/config">系统配置</el-menu-item>
            <el-menu-item index="/system/logs">操作日志</el-menu-item>
            <el-menu-item index="/system/backup">数据备份</el-menu-item>
            <el-menu-item index="/system/notice">公告管理</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="adminStore.toggleCollapse">
            <Fold v-if="!adminStore.collapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, idx) in breadcrumbs" :key="idx" :to="item.path ? { path: item.path } : undefined">{{ item.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-badge :value="12" :max="99" class="notify-badge">
            <el-icon style="font-size:18px;cursor:pointer;color:#606266;"><Bell /></el-icon>
          </el-badge>
          <el-dropdown trigger="click">
            <div class="user-info">
              <el-avatar :size="32" style="background: #409eff;">{{ adminStore.user?.name?.[0] || 'A' }}</el-avatar>
              <span class="user-name">{{ adminStore.user?.name || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item><el-icon><User /></el-icon>个人信息</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout"><el-icon><SwitchButton /></el-icon>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/store/admin'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

onMounted(() => { adminStore.init() })

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(r => r.meta?.title)
  return matched.map(r => ({ title: r.meta.title as string, path: r.redirect ? String(r.redirect) : r.path }))
})

function handleLogout() {
  adminStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout { height: 100vh; }
.aside { background: #001529; overflow: hidden; transition: width 0.3s; display: flex; flex-direction: column; }
.logo-area { height: 56px; display: flex; align-items: center; justify-content: center; gap: 8px; border-bottom: 1px solid #ffffff15; flex-shrink: 0; }
.logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, #409eff, #a78bfa); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 13px; flex-shrink: 0; }
.logo-text { color: #fff; font-size: 15px; font-weight: 600; white-space: nowrap; }
.header { background: #fff; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 4px rgba(0,0,0,0.08); padding: 0 20px; height: 56px; }
.header-left { display: flex; align-items: center; gap: 16px; }
.collapse-btn { font-size: 20px; cursor: pointer; color: #606266; }
.header-right { display: flex; align-items: center; gap: 20px; }
.notify-badge { margin-top: 4px; }
.user-info { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.user-name { font-size: 14px; color: #303133; }
.main-content { background: #f0f2f5; padding: 20px; overflow-y: auto; }
.el-menu { border-right: none; }
</style>
