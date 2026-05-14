<template>
  <nav v-if="!isNativeIOS" class="navbar">
    <div class="nav-inner">
      <router-link to="/" class="nav-logo">
        <span class="logo-icon">AI</span>
        <span>爱辅学</span>
      </router-link>
      <div class="nav-links">
        <router-link to="/" :class="{ active: $route.path === '/' }">首页</router-link>
        <router-link to="/features" :class="{ active: $route.path.startsWith('/features') }">功能介绍</router-link>
        <router-link to="/pricing" :class="{ active: $route.path === '/pricing' }">功能方案</router-link>
        <router-link to="/download" :class="{ active: $route.path === '/download' }">下载</router-link>
        <router-link to="/about" :class="{ active: $route.path === '/about' }">关于我们</router-link>
        <router-link to="/help" :class="{ active: $route.path.startsWith('/help') }">帮助中心</router-link>
      </div>
      <div class="nav-actions" v-if="!isLoggedIn">
        <router-link to="/login" class="btn btn-outline btn-sm">登录</router-link>
        <router-link to="/register" class="btn btn-primary btn-sm">免费注册</router-link>
      </div>
      <div class="nav-actions" v-else>
        <router-link to="/app" class="btn btn-primary btn-sm">进入工作台</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const isLoggedIn = computed(() => !!localStorage.getItem('aifuxue_token'))
const isNativeIOS = computed(() => !!(window as any).__NATIVE_IOS__ || !!(window as any).__NATIVE_ANDROID__)
</script>
