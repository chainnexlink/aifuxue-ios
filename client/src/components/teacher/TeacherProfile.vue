<template>
  <view class="teacher-profile">
    <!-- 教师卡片 -->
    <view class="teacher-card">
      <view class="avatar">
        <text class="avatar-text">{{ avatarChar }}</text>
      </view>
      <view class="teacher-info">
        <view class="name-row">
          <text class="t-name">{{ userStore.user?.teacherName || '老师' }}</text>
          <view class="verify-tag">
            <text>已认证</text>
          </view>
        </view>
        <text class="t-school">{{ userStore.user?.school || '未设置学校' }}</text>
        <text class="t-subject">{{ userStore.user?.subject || '未设置科目' }}</text>
      </view>
    </view>

    <!-- VIP会员卡片 -->
    <view class="vip-card" @tap="goMembership">
      <view class="vip-card-left">
        <text class="vip-card-icon">👑</text>
        <view class="vip-card-info">
          <text class="vip-card-title" v-if="userStore.isVip">VIP会员</text>
          <text class="vip-card-title" v-else>开通VIP会员</text>
          <text class="vip-card-desc" v-if="userStore.isVip">AI批改无限次·智能出卷无限制</text>
          <text class="vip-card-desc" v-else>解锁无限AI批改、智能出卷等功能</text>
        </view>
      </view>
      <view class="vip-card-arrow"></view>
    </view>

    <!-- 批改额度 -->
    <view class="section-card">
      <text class="section-title">批改额度</text>
      <view v-if="userStore.isVip" class="quota-vip-hint">
        <text class="quota-vip-text">VIP会员：无限次使用</text>
      </view>
      <view v-else class="quota-grid">
        <view class="quota-block" @tap="goMembership">
          <text class="quota-num">0</text>
          <text class="quota-label">线上AI批改剩余</text>
        </view>
        <view class="quota-block" @tap="goMembership">
          <text class="quota-num">0</text>
          <text class="quota-label">线下AI辅助剩余</text>
        </view>
      </view>
      <view v-if="!userStore.isVip" class="buy-btn" @tap="goMembership">
        <text class="buy-text">开通VIP获取无限批改次数</text>
      </view>
    </view>

    <!-- 我的邀请码 -->
    <view class="section-card">
      <text class="section-title">我的邀请码</text>
      <view class="invite-code-area">
        <text class="invite-code">TEACHER-{{ teacherCode }}</text>
        <view class="copy-btn" @tap="copyInviteCode">
          <text class="copy-text">复制</text>
        </view>
      </view>
      <text class="invite-desc">分享给学生/家长注册，可获得30天全功能体验</text>
      <view class="share-btn" @tap="shareInvite">
        <text class="share-text">生成分享海报</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="section-card">
      <view class="menu-list">
        <view class="menu-item" @tap="goTeachingInfo">
          <text class="mi-icon">📚</text>
          <text class="mi-label">教材与教学信息</text>
          <text class="mi-hint">教材版本/进度</text>
          <view class="mi-arrow"></view>
        </view>
        <view class="menu-item" @tap="goReminderSettings">
          <text class="mi-icon">🔔</text>
          <text class="mi-label">默认提醒规则</text>
          <text class="mi-hint">催交设置</text>
          <view class="mi-arrow"></view>
        </view>
        <view class="menu-item" @tap="toggleView">
          <text class="mi-icon">👀</text>
          <text class="mi-label">切换身份视图</text>
          <text class="mi-hint">预览学生端</text>
          <view class="mi-arrow"></view>
        </view>
        <view class="menu-item" @tap="goTeacherAuth">
          <text class="mi-icon">📋</text>
          <text class="mi-label">认证信息</text>
          <view class="mi-arrow"></view>
        </view>
        <view class="menu-item" @tap="goSettings">
          <text class="mi-icon">⚙️</text>
          <text class="mi-label">设置</text>
          <view class="mi-arrow"></view>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" @tap="handleLogout">
      <text>退出登录</text>
    </view>

    <view style="height: 140rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

const avatarChar = computed(() => {
  const name = userStore.user?.teacherName || '';
  return name.charAt(0) || '师';
});

const teacherCode = computed(() => {
  return userStore.user?.id?.slice(-6)?.toUpperCase() || 'X9K2M7';
});

function copyInviteCode() {
  uni.setClipboardData({
    data: `TEACHER-${teacherCode.value}`,
    success: () => uni.showToast({ title: '已复制', icon: 'success' }),
  });
}

function shareInvite() {
  uni.showToast({ title: '海报生成中...', icon: 'loading' });
}

function toggleView() {
  userStore.toggleViewMode();
}

function goTeacherAuth() {
  uni.navigateTo({ url: '/pages/teacher/auth/index' });
}

function goSettings() {
  uni.navigateTo({ url: '/pages/settings/index' });
}

function goMembership() {
  uni.navigateTo({ url: '/pages/membership/index' });
}

function goTeachingInfo() {
  uni.navigateTo({ url: '/pages/teacher/teaching-info/index' });
}

function goReminderSettings() {
  uni.navigateTo({ url: '/pages/teacher/reminder-settings/index' });
}

function handleLogout() {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => { if (res.confirm) userStore.logout(); },
  });
}
</script>

<style scoped>
.teacher-profile {
  --c-bg: #0F1118;
  --c-card: #1A1D2E;
  --c-primary: #5B7BFF;
  --c-t1: #E8ECF4;
  --c-t2: #8B92A5;
  --c-t3: #4D5466;
  --c-border: #2A2E3F;
  padding: 24rpx 32rpx;
  background: var(--c-bg);
  min-height: 100vh;
  box-sizing: border-box;
}

.teacher-card {
  background: linear-gradient(145deg, #2D6B4E, #34D399);
  border-radius: 28rpx;
  padding: 48rpx 36rpx;
  display: flex;
  align-items: center;
  gap: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 28rpx rgba(52,211,153,0.3);
}
.avatar {
  width: 100rpx; height: 100rpx;
  background: rgba(255,255,255,0.25); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.avatar-text { font-size: 44rpx; color: #FFF; font-weight: 700; }
.name-row { display: flex; align-items: center; gap: 12rpx; margin-bottom: 8rpx; }
.t-name { font-size: 36rpx; font-weight: 700; color: #FFF; }
.verify-tag { background: rgba(255,255,255,0.25); padding: 4rpx 14rpx; border-radius: 10rpx; }
.verify-tag text { font-size: 20rpx; color: #FFF; }
.t-school { font-size: 24rpx; color: rgba(255,255,255,0.8); display: block; margin-bottom: 4rpx; }
.t-subject { font-size: 22rpx; color: rgba(255,255,255,0.6); }

.section-card {
  background: var(--c-card); border-radius: 24rpx; padding: 28rpx 24rpx;
  margin-bottom: 20rpx; border: 1rpx solid var(--c-border);
}
.section-title { font-size: 28rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 20rpx; }

.quota-vip-hint { text-align: center; padding: 24rpx 0; background: rgba(255,215,0,0.08); border-radius: 14rpx; }
.quota-vip-text { font-size: 28rpx; font-weight: 600; color: #FFD700; }

.quota-grid { display: flex; gap: 16rpx; margin-bottom: 16rpx; }
.quota-block {
  flex: 1; text-align: center; background: #242838; border-radius: 16rpx; padding: 24rpx 0;
}
.quota-num { font-size: 44rpx; font-weight: 800; color: var(--c-primary); display: block; margin-bottom: 6rpx; }
.quota-label { font-size: 22rpx; color: var(--c-t3); }
.buy-btn { text-align: center; padding: 18rpx 0; background: rgba(91,123,255,0.15); border-radius: 14rpx; }
.buy-text { font-size: 26rpx; font-weight: 600; color: var(--c-primary); }

.invite-code-area {
  display: flex; align-items: center; gap: 12rpx;
  background: #242838; border-radius: 12rpx; padding: 20rpx 24rpx; margin-bottom: 12rpx;
}
.invite-code { font-size: 32rpx; font-weight: 800; color: var(--c-primary); flex: 1; letter-spacing: 2rpx; }
.copy-btn { background: rgba(91,123,255,0.15); padding: 8rpx 20rpx; border-radius: 10rpx; }
.copy-text { font-size: 22rpx; color: var(--c-primary); font-weight: 600; }
.invite-desc { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 16rpx; }
.share-btn { text-align: center; padding: 18rpx 0; background: var(--c-primary); border-radius: 14rpx; }
.share-text { font-size: 26rpx; font-weight: 600; color: #FFF; }

.menu-list {}
.menu-item {
  display: flex; align-items: center; padding: 24rpx 0;
  border-bottom: 1rpx solid var(--c-border);
}
.menu-item:last-child { border-bottom: none; }
.mi-icon { font-size: 36rpx; margin-right: 16rpx; }
.mi-label { flex: 1; font-size: 30rpx; color: var(--c-t1); }
.mi-hint { font-size: 24rpx; color: var(--c-t3); margin-right: 12rpx; }
.mi-arrow {
  width: 14rpx; height: 14rpx;
  border-right: 2.5rpx solid var(--c-t3); border-top: 2.5rpx solid var(--c-t3);
  transform: rotate(45deg); flex-shrink: 0;
}

.logout-btn {
  text-align: center; padding: 30rpx; color: #FF6B6B; font-size: 30rpx;
  background: var(--c-card); border-radius: 24rpx; margin-top: 20rpx;
  border: 1rpx solid var(--c-border);
}

.vip-card {
  background: linear-gradient(135deg, #3D2E0A, #5C4A14);
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1rpx solid rgba(255,215,0,0.3);
}
.vip-card-left { display: flex; align-items: center; gap: 16rpx; }
.vip-card-icon { font-size: 40rpx; }
.vip-card-info { display: flex; flex-direction: column; gap: 6rpx; }
.vip-card-title { font-size: 30rpx; font-weight: 700; color: #FFD700; }
.vip-card-desc { font-size: 24rpx; color: rgba(255,215,0,0.7); }
.vip-card-arrow {
  width: 14rpx; height: 14rpx;
  border-right: 2.5rpx solid #FFD700; border-top: 2.5rpx solid #FFD700;
  transform: rotate(45deg); flex-shrink: 0;
}
</style>
