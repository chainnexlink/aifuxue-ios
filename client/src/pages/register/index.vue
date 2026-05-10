<template>
  <view class="register-page">
    <view class="form-area">
      <text class="form-title">创建账号</text>

      <!-- 身份选择 -->
      <view class="input-group">
        <text class="input-label">我是</text>
        <view class="role-selector">
          <view class="role-card" :class="{ active: form.role === 'student' }" @tap="form.role = 'student'">
            <text class="role-emoji">🎒</text>
            <text class="role-name">学生</text>
          </view>
          <view class="role-card" :class="{ active: form.role === 'parent' }" @tap="form.role = 'parent'">
            <text class="role-emoji">👨‍👩‍👧</text>
            <text class="role-name">家长</text>
          </view>
          <view class="role-card" :class="{ active: form.role === 'teacher' }" @tap="form.role = 'teacher'">
            <text class="role-emoji">👨‍🏫</text>
            <text class="role-name">老师</text>
          </view>
        </view>
      </view>

      <view class="input-group">
        <text class="input-label">手机号</text>
        <input v-model="form.phone" type="number" maxlength="11" placeholder="请输入手机号" class="input-field" />
      </view>

      <view class="input-group">
        <text class="input-label">验证码</text>
        <view class="code-row">
          <input v-model="form.code" type="number" maxlength="6" placeholder="请输入验证码" class="input-field code-input" />
          <view class="code-btn" :class="{ disabled: countdown > 0 }" @tap="sendCode">
            <text>{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
          </view>
        </view>
      </view>

      <view class="input-group">
        <text class="input-label">昵称</text>
        <input v-model="form.nickname" maxlength="20" placeholder="给自己取个名字" class="input-field" />
      </view>

      <view class="input-group">
        <text class="input-label">学段</text>
        <picker :range="gradeLevels" :range-key="'label'" @change="onGradeChange">
          <view class="picker-field">
            <text :class="{ placeholder: !form.gradeLevel }">
              {{ selectedGradeLabel || '请选择学段' }}
            </text>
            <text class="arrow">▸</text>
          </view>
        </picker>
      </view>

      <view class="input-group">
        <text class="input-label">地区</text>
        <text class="input-hint">不同地区教材版本和试卷难度不同，将用于匹配精准内容</text>
        <view class="region-row">
          <input v-model="form.province" placeholder="省份" class="input-field region-input" />
          <input v-model="form.city" placeholder="城市" class="input-field region-input" />
        </view>
      </view>

      <!-- 邀请码（选填） -->
      <view class="input-group">
        <text class="input-label">邀请码（选填）</text>
        <input v-model="form.inviteCode" placeholder="TEACHER-XXXXXX 或 USER-XXXXXX" class="input-field" />
        <text class="input-hint">输入邀请码可获得全功能体验</text>
      </view>

      <view class="btn-primary register-btn" @tap="handleRegister">
        <text>注册</text>
      </view>

      <view class="login-link" @tap="goLogin">
        <text>已有账号？去登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { authApi } from '@/utils/api';
import { useUserStore } from '@/store/user';

const gradeLevels = [
  { label: '小学', value: 'PRIMARY' },
  { label: '初中', value: 'JUNIOR' },
  { label: '高中', value: 'SENIOR' },
  { label: '大学', value: 'COLLEGE' },
  { label: '成人', value: 'ADULT' },
];

const form = ref({
  phone: '',
  code: '',
  nickname: '',
  gradeLevel: '',
  province: '',
  city: '',
  role: 'student' as 'student' | 'parent' | 'teacher',
  inviteCode: '',
});

const countdown = ref(0);
const loading = ref(false);
const userStore = useUserStore();

let timer: number | null = null;

const selectedGradeLabel = computed(() => {
  const g = gradeLevels.find((l) => l.value === form.value.gradeLevel);
  return g?.label || '';
});

function onGradeChange(e: any) {
  form.value.gradeLevel = gradeLevels[e.detail.value].value;
}

function sendCode() {
  if (countdown.value > 0) return;
  if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  authApi.sendCode(form.value.phone).then(() => {
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

async function handleRegister() {
  if (loading.value) return;
  const f = form.value;
  if (!f.phone || !f.code || !f.nickname || !f.gradeLevel || !f.province || !f.city) {
    uni.showToast({ title: '请填写所有必填项', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    const res = await authApi.register(f);
    userStore.setLogin(res.token, res.user);
    uni.switchTab({ url: '/pages/home/index' });
  } catch (err: any) {
    uni.showToast({ title: err?.message || '注册失败，请检查网络后重试', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

function goLogin() {
  uni.navigateBack();
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: #0F1118;
  padding: 40rpx;
}

.form-area {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 50rpx 40rpx;
  border: 1rpx solid #2A2E3F;
}

.form-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #E8ECF4;
  margin-bottom: 50rpx;
  display: block;
}

.input-group { margin-bottom: 36rpx; }
.input-label { font-size: 28rpx; color: #8B92A5; margin-bottom: 12rpx; display: block; }
.input-hint { font-size: 24rpx; color: #4D5466; margin-bottom: 12rpx; display: block; }
.input-field { background: #242838; border-radius: 12rpx; padding: 24rpx; font-size: 30rpx; color: #E8ECF4; }
.code-row { display: flex; gap: 20rpx; align-items: center; }
.code-input { flex: 1; }
.code-btn { background: #5B7BFF; color: #fff; border-radius: 12rpx; padding: 24rpx 28rpx; font-size: 26rpx; white-space: nowrap; }
.code-btn.disabled { background: #2A2E3F; color: #4D5466; }

.picker-field {
  background: #242838;
  border-radius: 12rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #E8ECF4;
}

.placeholder { color: #4D5466; }
.arrow { color: #4D5466; }

.region-row { display: flex; gap: 20rpx; }
.region-input { flex: 1; }

.register-btn { margin-top: 30rpx; }
.login-link { text-align: center; margin-top: 30rpx; color: #5B7BFF; font-size: 28rpx; }

.role-selector { display: flex; gap: 16rpx; }
.role-card { flex: 1; padding: 24rpx 0; border-radius: 16rpx; background: #242838; border: 2rpx solid #2A2E3F; text-align: center; }
.role-card.active { border-color: #5B7BFF; background: rgba(91,123,255,0.15); }
.role-emoji { font-size: 36rpx; display: block; margin-bottom: 8rpx; }
.role-name { font-size: 26rpx; color: #8B92A5; font-weight: 600; }
.role-card.active .role-name { color: #5B7BFF; }
</style>
