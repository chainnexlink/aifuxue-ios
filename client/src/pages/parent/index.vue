<template>
  <view class="parent-page">
    <!-- 未设置密码：引导设置 -->
    <view v-if="!hasPassword && !verified" class="setup-area card">
      <text class="setup-title">首次使用，请设置家长密码</text>
      <text class="setup-hint">家长密码用于查看答案解析、管控使用时长等</text>
      <view class="input-group">
        <text class="input-label">设置密码（4-6位数字）</text>
        <input v-model="newPassword" type="number" maxlength="6" password placeholder="请输入密码" class="input-field" />
      </view>
      <view class="input-group">
        <text class="input-label">确认密码</text>
        <input v-model="confirmPassword" type="number" maxlength="6" password placeholder="再次输入密码" class="input-field" />
      </view>
      <view class="btn-primary" @tap="setPassword">
        <text>设置密码</text>
      </view>
    </view>

    <!-- 已设置密码但未验证：验证 -->
    <view v-if="hasPassword && !verified" class="verify-area card">
      <view class="lock-icon-wrap">
        <image src="/static/icons/lock.svg" class="lock-icon-img" mode="aspectFit" />
      </view>
      <text class="verify-title">请输入家长密码</text>
      <view class="password-dots">
        <view v-for="i in 6" :key="i" class="dot" :class="{ filled: password.length >= i }" />
      </view>
      <input v-model="password" type="number" maxlength="6" password class="hidden-input" focus @input="onPasswordInput" />
      <text v-if="errorMsg" class="error-text">{{ errorMsg }}</text>
    </view>

    <!-- 验证通过：家长功能面板 -->
    <view v-if="verified" class="panel">
      <view class="panel-header">
        <text class="panel-title">家长中心</text>
        <text class="panel-badge">已验证</text>
      </view>

      <!-- 搜索栏 -->
      <SearchBar placeholder="搜索功能、作业、成绩..." />

      <view class="menu-section card">
        <view class="menu-item" @tap="goTimeControl">
          <view class="menu-icon-wrap mi-bg-yellow">
            <image src="/static/icons/clock.svg" class="menu-icon-img" mode="aspectFit" />
          </view>
          <text class="menu-label">使用时长管控</text>
          <view class="menu-arrow-icon"></view>
        </view>
        <view class="menu-item" @tap="goHomework">
          <view class="menu-icon-wrap mi-bg-blue">
            <image src="/static/icons/book.svg" class="menu-icon-img" mode="aspectFit" />
          </view>
          <text class="menu-label">作业完成情况</text>
          <view class="menu-arrow-icon"></view>
        </view>
        <view class="menu-item" @tap="goGradeSet">
          <view class="menu-icon-wrap mi-bg-green">
            <image src="/static/icons/chart.svg" class="menu-icon-img" mode="aspectFit" />
          </view>
          <text class="menu-label">设置年级/学科</text>
          <view class="menu-arrow-icon"></view>
        </view>
        <view class="menu-item" @tap="goResetPassword">
          <view class="menu-icon-wrap mi-bg-red">
            <image src="/static/icons/key.svg" class="menu-icon-img" mode="aspectFit" />
          </view>
          <text class="menu-label">修改家长密码</text>
          <view class="menu-arrow-icon"></view>
        </view>
      </view>

      <!-- 更多功能 -->
      <view class="menu-section card">
        <view class="section-label">更多功能</view>
        <view class="menu-item" @tap="goGrades">
          <view class="menu-icon-wrap mi-bg-blue">
            <image src="/static/icons/chart.svg" class="menu-icon-img" mode="aspectFit" />
          </view>
          <text class="menu-label">成绩查看</text>
          <view class="menu-arrow-icon"></view>
        </view>
        <view class="menu-item" @tap="goWeeklyReport">
          <view class="menu-icon-wrap mi-bg-green">
            <image src="/static/icons/chart.svg" class="menu-icon-img" mode="aspectFit" />
          </view>
          <text class="menu-label">学习周报</text>
          <view class="menu-arrow-icon"></view>
        </view>
        <view class="menu-item" @tap="goMultiChild">
          <view class="menu-icon-wrap mi-bg-purple">
            <image src="/static/icons/multi-child.svg" class="menu-icon-img" mode="aspectFit" />
          </view>
          <text class="menu-label">多娃管理</text>
          <view class="menu-arrow-icon"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { parentApi, userApi } from '@/utils/api';
import { tryPlayAd, AD_UNIT_IDS } from '@/utils/ad-reward';
import SearchBar from '@/components/SearchBar/index.vue';

const userStore = useUserStore();
const hasPassword = ref(false);
const verified = ref(false);
const password = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');

onMounted(async () => {
  try {
    const res = await parentApi.hasPassword();
    hasPassword.value = res.hasPassword;
  } catch {
    uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
  }
});

async function setPassword() {
  if (newPassword.value.length < 4) {
    uni.showToast({ title: '密码至少4位数字', icon: 'none' });
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' });
    return;
  }
  try {
    await parentApi.setPassword(newPassword.value);
    uni.showToast({ title: '密码设置成功', icon: 'success' });
    hasPassword.value = true;
    verified.value = true;
  } catch {
    uni.showToast({ title: '设置失败，请稍后重试', icon: 'none' });
  }
}

async function onPasswordInput() {
  if (password.value.length === 6) {
    try {
      errorMsg.value = '';
      const res = await parentApi.verifyPassword(password.value);
      uni.setStorageSync('parentToken', res.token);
      verified.value = true;
    } catch (e: any) {
      errorMsg.value = e?.message || '密码错误';
      password.value = '';
    }
  }
}

function goTimeControl() {
  uni.navigateTo({ url: '/pages/settings/index?tab=time' });
}

function goGradeSet() {
  uni.navigateTo({ url: '/pages/settings/index?tab=grade' });
}

function goResetPassword() {
  hasPassword.value = false;
  verified.value = false;
  password.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
}

function goWeeklyReport() {
  uni.navigateTo({ url: '/pages/parent/weekly-report/index' });
}

function goGrades() {
  uni.navigateTo({ url: '/pages/class/grades/index' });
}

function goHomework() {
  uni.navigateTo({ url: '/pages/class/homework/index' });
}

async function goMultiChild() {
  const ok = await tryPlayAd(AD_UNIT_IDS.MULTI_CHILD, '多娃管理');
  if (ok) uni.navigateTo({ url: '/pages/settings/index?tab=grade' });
}
</script>

<style scoped>
.parent-page {
  padding: 30rpx;
  background: #0F1118;
  min-height: 100vh;
}

.card {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 36rpx 28rpx;
  border: 1rpx solid #2A2E3F;
}

.setup-area, .verify-area { text-align: center; }
.setup-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #E8ECF4;
  display: block;
  margin-bottom: 16rpx;
}
.setup-hint {
  font-size: 26rpx;
  color: #4D5466;
  display: block;
  margin-bottom: 40rpx;
}

.input-group { margin-bottom: 30rpx; text-align: left; }
.input-label {
  font-size: 28rpx;
  color: #8B92A5;
  margin-bottom: 12rpx;
  display: block;
}
.input-field {
  background: #242838;
  border-radius: 14rpx;
  padding: 24rpx;
  font-size: 30rpx;
  color: #E8ECF4;
}

.lock-icon-wrap {
  width: 100rpx;
  height: 100rpx;
  background: rgba(255,186,74,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28rpx;
}
.lock-icon-img {
  width: 48rpx;
  height: 48rpx;
}

.verify-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #E8ECF4;
  display: block;
  margin-bottom: 50rpx;
}
.password-dots {
  display: flex;
  justify-content: center;
  gap: 24rpx;
  margin-bottom: 40rpx;
}
.dot {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 3rpx solid #4D5466;
}
.dot.filled {
  background: #5B7BFF;
  border-color: #5B7BFF;
}
.hidden-input {
  opacity: 0;
  position: absolute;
  left: -999rpx;
}
.error-text {
  color: #FF6B6B;
  font-size: 26rpx;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.panel-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #E8ECF4;
}
.panel-badge {
  font-size: 22rpx;
  color: #34D399;
  background: rgba(52,211,153,0.15);
  padding: 6rpx 18rpx;
  border-radius: 12rpx;
  font-weight: 600;
}

.menu-section {
  margin-bottom: 24rpx;
}
.section-label {
  font-size: 24rpx;
  color: #4D5466;
  margin-bottom: 16rpx;
  display: block;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #2A2E3F;
}
.menu-item:last-child { border-bottom: none; }

.menu-icon-wrap {
  width: 44rpx;
  height: 44rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}
.menu-icon-img {
  width: 26rpx;
  height: 26rpx;
}
.mi-bg-yellow { background: rgba(255,186,74,0.15); }
.mi-bg-blue { background: rgba(91,123,255,0.15); }
.mi-bg-red { background: rgba(255,107,107,0.15); }
.mi-bg-green { background: rgba(52,211,153,0.15); }
.mi-bg-purple { background: rgba(167,139,250,0.15); }

.menu-label {
  flex: 1;
  font-size: 30rpx;
  color: #E8ECF4;
}
.menu-arrow-icon {
  width: 14rpx;
  height: 14rpx;
  border-right: 2.5rpx solid #4D5466;
  border-top: 2.5rpx solid #4D5466;
  transform: rotate(45deg);
  flex-shrink: 0;
}

.btn-primary {
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  color: #FFF;
  text-align: center;
  padding: 24rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 16rpx rgba(91,123,255,0.3);
}
</style>
