<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-logo"><span>AI</span></div>
          <h1>爱辅学</h1>
          <p>AI驱动的智能学习助手</p>
        </div>
        <div class="auth-features">
          <div class="af-item"><span class="af-icon">📷</span><span>拍照整理笔记，AI自动排版</span></div>
          <div class="af-item"><span class="af-icon">🔍</span><span>AI错题诊断，精准定位薄弱点</span></div>
          <div class="af-item"><span class="af-icon">🎯</span><span>靶向练习，高效提分</span></div>
          <div class="af-item"><span class="af-icon">👨‍🏫</span><span>教师智能助教，AI批改出卷</span></div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <h2>登录爱辅学</h2>
          <p class="auth-subtitle">登录后即可使用全部功能</p>

          <div class="auth-tabs">
            <button :class="['tab', loginMode === 'phone' ? 'active' : '']" @click="loginMode = 'phone'">手机号登录</button>
            <button :class="['tab', loginMode === 'wechat' ? 'active' : '']" @click="loginMode = 'wechat'">微信登录</button>
          </div>

          <!-- 手机号登录 -->
          <form v-if="loginMode === 'phone'" class="auth-form" @submit.prevent="handlePhoneLogin">
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
            <button type="submit" class="submit-btn" :disabled="!phone || !code">登录</button>
          </form>

          <!-- 微信登录 -->
          <div v-else class="wechat-login">
            <div class="qr-box">
              <div class="qr-placeholder">
                <span class="qr-icon">💬</span>
                <span class="qr-text">微信扫码登录</span>
              </div>
            </div>
            <p class="wechat-hint">请使用微信扫描二维码登录</p>
          </div>

          <div class="auth-divider"><span>其他方式</span></div>

          <div class="social-login">
            <button class="social-btn qq" title="QQ登录"><span>Q</span></button>
            <button class="social-btn apple" title="Apple登录"><span>&#xF8FF;</span></button>
          </div>

          <div class="auth-footer">
            <span>还没有账号？</span>
            <router-link to="/register">免费注册</router-link>
          </div>

          <p class="auth-agreement">
            登录即表示同意
            <router-link to="/agreement">《用户协议》</router-link>和
            <router-link to="/privacy">《隐私政策》</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loginMode = ref<'phone' | 'wechat'>('phone')
const phone = ref('')
const code = ref('')
const countdown = ref(0)

function sendCode() {
  if (!phone.value || phone.value.length !== 11) {
    alert('请输入正确的手机号')
    return
  }
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

function handlePhoneLogin() {
  if (!phone.value || !code.value) return
  // 模拟登录
  localStorage.setItem('aifuxue_token', 'web-token-' + Date.now())
  localStorage.setItem('aifuxue_user', JSON.stringify({
    phone: phone.value,
    role: 'student',
    name: '用户' + phone.value.slice(-4),
  }))
  window.location.href = '/app'
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fc 0%, #eef2ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}
.auth-container {
  display: flex;
  max-width: 960px;
  width: 100%;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
}
.auth-left {
  flex: 1;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  padding: 60px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}
.auth-brand { margin-bottom: 48px; }
.brand-logo {
  width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 16px;
  display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; margin-bottom: 20px;
}
.auth-brand h1 { font-size: 36px; font-weight: 800; margin-bottom: 8px; }
.auth-brand p { font-size: 16px; opacity: 0.8; }
.auth-features { display: flex; flex-direction: column; gap: 16px; }
.af-item { display: flex; align-items: center; gap: 12px; font-size: 15px; opacity: 0.9; }
.af-icon { font-size: 20px; }

.auth-right { flex: 1; padding: 48px; display: flex; align-items: center; }
.auth-card { width: 100%; }
.auth-card h2 { font-size: 28px; font-weight: 800; color: var(--text1); margin-bottom: 8px; }
.auth-subtitle { font-size: 15px; color: var(--text3); margin-bottom: 32px; }

.auth-tabs { display: flex; gap: 0; margin-bottom: 28px; border: 2px solid var(--border); border-radius: 12px; overflow: hidden; }
.tab { flex: 1; padding: 12px; border: none; background: #fff; font-size: 14px; font-weight: 600; color: var(--text3); cursor: pointer; transition: all 0.2s; }
.tab.active { background: var(--primary); color: #fff; }

.auth-form { display: flex; flex-direction: column; gap: 20px; }
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

.wechat-login { text-align: center; padding: 20px 0; }
.qr-box { display: flex; justify-content: center; margin-bottom: 16px; }
.qr-placeholder {
  width: 200px; height: 200px; border: 2px dashed var(--border); border-radius: 16px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
}
.qr-icon { font-size: 48px; }
.qr-text { font-size: 14px; color: var(--text3); }
.wechat-hint { font-size: 13px; color: var(--text3); }

.auth-divider { display: flex; align-items: center; gap: 16px; margin: 24px 0; }
.auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.auth-divider span { font-size: 13px; color: var(--text3); }

.social-login { display: flex; gap: 16px; justify-content: center; }
.social-btn {
  width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--border);
  background: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.social-btn:hover { border-color: var(--primary); background: var(--primary-light); }
.social-btn.qq span { color: #12B7F5; }
.social-btn.apple span { color: #000; }

.auth-footer { text-align: center; margin-top: 24px; font-size: 14px; color: var(--text3); }
.auth-footer a { color: var(--primary); font-weight: 600; margin-left: 4px; }

.auth-agreement { text-align: center; margin-top: 16px; font-size: 12px; color: var(--text3); }
.auth-agreement a { color: var(--primary); }

@media (max-width: 768px) {
  .auth-container { flex-direction: column; }
  .auth-left { padding: 40px 32px; }
  .auth-right { padding: 32px; }
}
</style>
