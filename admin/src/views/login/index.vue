<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="logo"><span>AI</span></div>
        <h1>爱辅学 管理后台</h1>
        <p>AI Learning Assistant Admin</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="User" placeholder="管理员账号" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" prefix-icon="Lock" type="password" placeholder="登录密码" size="large" show-password @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" style="width:100%;" :loading="loading" @click="handleLogin">登 录</el-button>
        </el-form-item>
      </el-form>
      <div v-if="errorMsg" class="login-error">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/store/admin'
import { authApi } from '@/utils/api'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const adminStore = useAdminStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const errorMsg = ref('')

const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  await formRef.value?.validate()
  loading.value = true
  errorMsg.value = ''

  try {
    const res = await authApi.login({ username: form.username, password: form.password })
    adminStore.login(res.user, res.token)
    router.push('/dashboard')
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || e?.message || '登录失败，请检查网络'
  } finally {
    loading.value = false
  }
}
</script>

<script lang="ts">
export default {}
</script>

<style scoped>
.login-page { height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.login-card { width: 400px; background: #fff; border-radius: 12px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
.login-header { text-align: center; margin-bottom: 32px; }
.logo { width: 56px; height: 56px; background: linear-gradient(135deg, #409eff, #a78bfa); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.logo span { color: #fff; font-weight: 700; font-size: 20px; }
.login-header h1 { font-size: 22px; color: #303133; margin-bottom: 4px; }
.login-header p { font-size: 13px; color: #909399; }
.login-error { text-align: center; color: #f56c6c; font-size: 14px; margin-top: 12px; }
</style>
