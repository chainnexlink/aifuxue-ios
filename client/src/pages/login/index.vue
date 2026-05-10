<template>
  <scroll-view scroll-y class="login-scroll" :style="{ height: '100vh' }">
    <view class="login-page">
      <view class="logo-area">
        <view class="logo-icon">
          <text class="logo-letter">爱</text>
        </view>
        <text class="app-name">爱辅学</text>
        <text class="app-desc">AI智能学习助手</text>
      </view>

      <view class="form-area">
        <view class="input-group">
          <text class="input-label">手机号</text>
          <input
            v-model="phone"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
            placeholder-style="color: #4D5466;"
            class="input-field"
            :adjust-position="true"
          />
        </view>

        <view class="input-group">
          <text class="input-label">验证码</text>
          <view class="code-row">
            <input
              v-model="code"
              type="number"
              maxlength="6"
              placeholder="请输入验证码"
              placeholder-style="color: #4D5466;"
              class="input-field code-input"
              :adjust-position="true"
            />
            <view
              class="code-btn"
              :class="{ disabled: countdown > 0 }"
              @tap="sendCode"
            >
              <text>{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
            </view>
          </view>
        </view>

        <view class="btn-primary login-btn" @tap="handleLogin">
          <text>登录</text>
        </view>

        <view class="register-link" @tap="goRegister">
          <text>没有账号？去注册</text>
        </view>
      </view>

      <!-- 底部留白，防止键盘遮挡 -->
      <view style="height: 200rpx;"></view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { authApi } from '@/utils/api';
import { useUserStore } from '@/store/user';

const phone = ref('');
const code = ref('');
const countdown = ref(0);
const loading = ref(false);

let timer: number | null = null;

const userStore = useUserStore();

function sendCode() {
  if (countdown.value > 0) return;
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }

  authApi.sendCode(phone.value).then(() => {
    uni.showToast({ title: '验证码已发送', icon: 'success' });
    countdown.value = 60;
    timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    }, 1000) as unknown as number;
  });
}

async function handleLogin() {
  if (loading.value) return;
  if (!phone.value || !code.value) {
    uni.showToast({ title: '请填写手机号和验证码', icon: 'none' });
    return;
  }

  // 系统测试账号：无需后端，本地直接登录
  const testAccount = getTestAccount(phone.value, code.value);
  if (testAccount) {
    userStore.setLogin(testAccount.token, testAccount.user);
    uni.switchTab({ url: '/pages/home/index' });
    return;
  }

  loading.value = true;
  try {
    const res = await authApi.login({ phone: phone.value, code: code.value });
    userStore.setLogin(res.token, res.user);
    uni.switchTab({ url: '/pages/home/index' });
  } catch (e: any) {
    // 错误已在request中处理
  } finally {
    loading.value = false;
  }
}

/** 系统测试账号 - 验证码统一为 000000 */
function getTestAccount(phone: string, code: string) {
  if (code !== '000000') return null;
  const accounts: Record<string, any> = {
    '13000000001': {
      token: 'test-token-student',
      user: {
        id: 'test-student-001',
        phone: '13000000001',
        nickname: '测试学生',
        gradeLevel: 'JUNIOR',
        province: '广东',
        city: '潮州',
        membershipType: 'FREE',
        role: 'student',
        inviteCodeUsed: false,
        classIds: [],
      },
    },
    '13000000002': {
      token: 'test-token-parent',
      user: {
        id: 'test-parent-002',
        phone: '13000000002',
        nickname: '测试家长',
        gradeLevel: 'JUNIOR',
        province: '广东',
        city: '潮州',
        membershipType: 'FREE',
        role: 'parent',
      },
    },
    '13000000003': {
      token: 'test-token-teacher',
      user: {
        id: 'test-teacher-003',
        phone: '13000000003',
        nickname: '测试老师',
        gradeLevel: 'JUNIOR',
        province: '广东',
        city: '潮州',
        membershipType: 'FREE',
        role: 'teacher',
        teacherVerified: true,
        teacherName: '张老师',
        school: '潮州中学',
        subject: '数学',
      },
    },
  };
  return accounts[phone] || null;
}

function goRegister() {
  uni.navigateTo({ url: '/pages/register/index' });
}
</script>

<style scoped>
.login-scroll {
  background: linear-gradient(180deg, #141722 0%, #0F1118 40%);
}

.login-page {
  min-height: 100vh;
  padding: 0 60rpx;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 140rpx;
  padding-bottom: 60rpx;
}

.logo-icon {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 28rpx rgba(91,123,255,0.3);
}
.logo-letter {
  font-size: 56rpx;
  font-weight: 800;
  color: #FFF;
}

.app-name {
  font-size: 48rpx;
  font-weight: 700;
  color: #E8ECF4;
  margin-bottom: 12rpx;
}

.app-desc {
  font-size: 28rpx;
  color: #4D5466;
}

.form-area {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 50rpx 40rpx;
  border: 1rpx solid #2A2E3F;
}

.input-group {
  margin-bottom: 40rpx;
}

.input-label {
  font-size: 28rpx;
  color: #8B92A5;
  margin-bottom: 16rpx;
  display: block;
}

.input-field {
  background: #242838;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  height: 88rpx;
  line-height: 88rpx;
  width: 100%;
  box-sizing: border-box;
  color: #E8ECF4;
  border: 2rpx solid #2A2E3F;
}

.code-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.code-input {
  flex: 1;
}

.code-btn {
  background: #5B7BFF;
  color: #fff;
  border-radius: 16rpx;
  padding: 0 28rpx;
  font-size: 26rpx;
  white-space: nowrap;
  flex-shrink: 0;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
}

.code-btn.disabled {
  background: #2A2E3F;
  color: #4D5466;
}

.login-btn {
  margin-top: 20rpx;
  height: 92rpx;
  line-height: 92rpx;
  padding: 0;
}

.register-link {
  text-align: center;
  margin-top: 30rpx;
  color: #5B7BFF;
  font-size: 28rpx;
}

/* iPad适配 */
@media screen and (min-width: 768px) {
  .login-page {
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .logo-area {
    padding-top: 120px;
    padding-bottom: 50px;
  }
  .logo-icon { width: 72px; height: 72px; border-radius: 18px; }
  .logo-letter { font-size: 36px; }
  .app-name { font-size: 28px; }
  .app-desc { font-size: 15px; }
  .form-area {
    width: 100%;
    max-width: 420px;
    border-radius: 16px;
    padding: 36px 32px;
  }
  .input-label { font-size: 15px; }
  .input-field { font-size: 16px; height: 48px; line-height: 48px; padding: 0 14px; border-radius: 10px; }
  .code-btn { font-size: 14px; height: 48px; line-height: 48px; padding: 0 18px; border-radius: 10px; }
  .login-btn { margin-top: 16px; font-size: 17px; height: 50px; line-height: 50px; border-radius: 10px; }
  .register-link { font-size: 15px; margin-top: 20px; }
}
</style>
