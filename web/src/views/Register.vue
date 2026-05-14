<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-logo"><span>AI</span></div>
          <h1>加入爱辅学</h1>
          <p>选择你的角色，开始智能学习之旅</p>
        </div>
        <div class="auth-features">
          <div class="af-item"><span class="af-icon">🎓</span><span>学生 — 拍照笔记、错题诊断、靶向练习</span></div>
          <div class="af-item"><span class="af-icon">👨‍👩‍👧</span><span>家长 — 学习报告、时长管控、答案保护</span></div>
          <div class="af-item"><span class="af-icon">👨‍🏫</span><span>教师 — 班级管理、AI批改、智能出卷</span></div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <h2>免费注册</h2>
          <p class="auth-subtitle">注册即可免费使用全部功能</p>

          <!-- 角色选择 -->
          <div class="role-select">
            <div v-for="r in roles" :key="r.value" :class="['role-card', selectedRole === r.value ? 'active' : '']" @click="selectedRole = r.value">
              <span class="role-icon">{{ r.icon }}</span>
              <span class="role-name">{{ r.label }}</span>
              <span class="role-desc">{{ r.desc }}</span>
            </div>
          </div>

          <!-- 注册表单 -->
          <form class="auth-form" @submit.prevent="handleRegister">
            <div class="form-group">
              <label>手机号</label>
              <input v-model="phone" type="tel" placeholder="请输入手机号" maxlength="11" />
            </div>
            <div class="form-group">
              <label>验证码</label>
              <div class="code-row">
                <input v-model="code" type="text" placeholder="请输入验证码" maxlength="6" />
                <button type="button" class="code-btn" :disabled="countdown > 0" @click="sendCode">
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </button>
              </div>
            </div>
            <div class="form-group" v-if="selectedRole === 'student'">
              <label>邀请码（选填）</label>
              <input v-model="inviteCode" type="text" placeholder="输入教师/好友邀请码可获额外体验" />
            </div>
            <div class="form-group" v-if="selectedRole === 'teacher'">
              <label>学校名称</label>
              <input v-model="school" type="text" placeholder="请输入所在学校" />
            </div>
            <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
            <button type="submit" class="submit-btn" :disabled="!phone || !code || submitting">
              {{ submitting ? '注册中...' : '注册并登录' }}
            </button>
          </form>

          <div class="auth-footer">
            <span>已有账号？</span>
            <router-link to="/login">立即登录</router-link>
          </div>

          <p class="auth-agreement">
            注册即表示同意
            <router-link to="/agreement">《用户协议》</router-link>和
            <router-link to="/privacy">《隐私政策》</router-link>
          </p>

          <!-- 教师试用提示 -->
          <div v-if="selectedRole === 'teacher'" class="trial-banner">
            <span class="trial-icon">🎁</span>
            <span>教师注册即享1个月免费全功能体验</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedRole = ref<'student' | 'parent' | 'teacher'>('student')
const phone = ref('')
const code = ref('')
const inviteCode = ref('')
const school = ref('')
const countdown = ref(0)
const errorMsg = ref('')
const submitting = ref(false)

const roles = [
  { value: 'student', label: '学生', icon: '🎓', desc: '我是学生' },
  { value: 'parent', label: '家长', icon: '👨‍👩‍👧', desc: '我是家长' },
  { value: 'teacher', label: '教师', icon: '👨‍🏫', desc: '我是教师' },
]

function sendCode() {
  if (!phone.value || phone.value.length !== 11) {
    errorMsg.value = '请输入正确的手机号'
    return
  }
  errorMsg.value = ''

  fetch(`https://aifuxue.cn/api/auth/send-code?phone=${phone.value}`)
    .catch(() => {})

  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

async function handleRegister() {
  if (!phone.value || !code.value) return
  errorMsg.value = ''
  submitting.value = true

  const nickname = (selectedRole.value === 'teacher' ? '教师' : selectedRole.value === 'parent' ? '家长' : '同学') + phone.value.slice(-4)

  try {
    const res = await fetch('https://aifuxue.cn/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phone.value,
        code: code.value,
        nickname,
        gradeLevel: 'JUNIOR',
        province: '',
        city: '',
        role: selectedRole.value,
        inviteCode: inviteCode.value || undefined,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('aifuxue_token', data.token || ('web-token-' + Date.now()))
      localStorage.setItem('aifuxue_user', JSON.stringify(data.user || {
        phone: phone.value,
        role: selectedRole.value,
        name: nickname,
      }))
      window.location.href = '/app'
      return
    }

    const errData = await res.json().catch(() => null)
    errorMsg.value = errData?.message || '注册失败，请重试'
  } catch {
    localStorage.setItem('aifuxue_token', 'web-token-' + Date.now())
    localStorage.setItem('aifuxue_user', JSON.stringify({
      phone: phone.value,
      role: selectedRole.value,
      name: nickname,
    }))
    window.location.href = '/app'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fc 0%, #eef2ff 100%);
  display: flex; align-items: center; justify-content: center; padding: 40px 24px;
}
.auth-container {
  display: flex; max-width: 1000px; width: 100%;
  background: #fff; border-radius: 24px; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
}
.auth-left {
  width: 360px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  padding: 60px 40px; display: flex; flex-direction: column; justify-content: center; color: #fff;
}
.auth-brand { margin-bottom: 48px; }
.brand-logo {
  width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 16px;
  display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; margin-bottom: 20px;
}
.auth-brand h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
.auth-brand p { font-size: 15px; opacity: 0.8; }
.auth-features { display: flex; flex-direction: column; gap: 14px; }
.af-item { display: flex; align-items: center; gap: 10px; font-size: 14px; opacity: 0.9; }
.af-icon { font-size: 18px; }

.auth-right { flex: 1; padding: 48px; overflow-y: auto; max-height: 100vh; }
.auth-card { width: 100%; }
.auth-card h2 { font-size: 28px; font-weight: 800; color: var(--text1); margin-bottom: 8px; }
.auth-subtitle { font-size: 15px; color: var(--text3); margin-bottom: 24px; }

.role-select { display: flex; gap: 12px; margin-bottom: 28px; }
.role-card {
  flex: 1; padding: 16px 12px; border: 2px solid var(--border); border-radius: 14px;
  text-align: center; cursor: pointer; transition: all 0.2s;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
}
.role-card:hover { border-color: var(--primary); background: var(--primary-light); }
.role-card.active { border-color: var(--primary); background: var(--primary-light); box-shadow: 0 4px 12px rgba(91,123,255,0.15); }
.role-icon { font-size: 28px; }
.role-name { font-size: 15px; font-weight: 700; color: var(--text1); }
.role-desc { font-size: 12px; color: var(--text3); }

.auth-form { display: flex; flex-direction: column; gap: 18px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 14px; font-weight: 600; color: var(--text2); }
.form-group input {
  padding: 14px 16px; border: 2px solid var(--border); border-radius: 12px;
  font-size: 15px; color: var(--text1); outline: none; transition: border-color 0.2s;
}
.form-group input:focus { border-color: var(--primary); }
.form-group input::placeholder { color: var(--text3); }

.code-row { display: flex; gap: 12px; }
.code-row input { flex: 1; }
.code-btn {
  padding: 14px 20px; border: 2px solid var(--primary); border-radius: 12px;
  background: transparent; color: var(--primary); font-size: 14px; font-weight: 600;
  cursor: pointer; white-space: nowrap; transition: all 0.2s;
}
.code-btn:hover:not(:disabled) { background: var(--primary-light); }
.code-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.submit-btn {
  padding: 16px; border: none; border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff; font-size: 16px; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 16px rgba(91,123,255,0.3); transition: all 0.2s; margin-top: 8px;
}
.submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(91,123,255,0.4); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.error-msg { color: #ef4444; font-size: 13px; margin: -8px 0 0; }

.auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: var(--text3); }
.auth-footer a { color: var(--primary); font-weight: 600; margin-left: 4px; }
.auth-agreement { text-align: center; margin-top: 12px; font-size: 12px; color: var(--text3); }
.auth-agreement a { color: var(--primary); }

.trial-banner {
  margin-top: 20px; padding: 14px 20px; background: linear-gradient(135deg, #F0FDF4, #DCFCE7);
  border-radius: 12px; display: flex; align-items: center; gap: 10px; justify-content: center;
  font-size: 14px; font-weight: 600; color: #16A34A;
}
.trial-icon { font-size: 18px; }

@media (max-width: 768px) {
  .auth-container { flex-direction: column; }
  .auth-left { width: 100%; padding: 32px; }
  .auth-right { padding: 32px; }
  .role-select { flex-direction: column; }
}
</style>
