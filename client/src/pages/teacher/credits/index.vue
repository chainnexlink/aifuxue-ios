<template>
  <view class="page">
    <!-- 积分卡片 -->
    <view class="credit-card">
      <view class="credit-header">
        <text class="credit-label">我的积分</text>
        <text class="credit-guide" @tap="goGuide">使用规则 ></text>
      </view>
      <text class="credit-num">{{ overview.balance }}</text>
      <view class="credit-stats">
        <view class="stat-block">
          <text class="stat-val">{{ overview.totalEarned }}</text>
          <text class="stat-lbl">累计获得</text>
        </view>
        <view class="stat-sep"></view>
        <view class="stat-block">
          <text class="stat-val">{{ overview.totalSpent }}</text>
          <text class="stat-lbl">累计消费</text>
        </view>
        <view class="stat-sep"></view>
        <view class="stat-block">
          <text class="stat-val">{{ overview.referralCount }}</text>
          <text class="stat-lbl">推荐注册</text>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="section-card">
      <text class="section-title">积分使用</text>
      <view class="menu-list">
        <view class="menu-item" @tap="goUseCredits">
          <text class="mi-icon">💰</text>
          <text class="mi-label">积分兑换</text>
          <text class="mi-hint">抵扣会员/消耗次数</text>
          <view class="mi-arrow"></view>
        </view>
        <view class="menu-item" @tap="goHistory">
          <text class="mi-icon">📋</text>
          <text class="mi-label">积分明细</text>
          <text class="mi-hint">收入/支出记录</text>
          <view class="mi-arrow"></view>
        </view>
        <view class="menu-item" @tap="goGuide">
          <text class="mi-icon">📖</text>
          <text class="mi-label">积分说明</text>
          <text class="mi-hint">获取与使用规则</text>
          <view class="mi-arrow"></view>
        </view>
      </view>
    </view>

    <!-- 邀请提示 -->
    <view class="invite-card">
      <view class="invite-header">
        <text class="invite-title">邀请学生注册赚积分</text>
        <text class="invite-desc">每位学生通过您的邀请码注册成功，即可获得1积分</text>
      </view>
      <view class="invite-code-row">
        <text class="invite-code">TEACHER-{{ teacherCode }}</text>
        <view class="copy-btn" @tap="copyCode">
          <text class="copy-text">复制</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';
import { creditsApi } from '@/utils/api';

const userStore = useUserStore();
const overview = ref({ balance: 0, totalEarned: 0, totalSpent: 0, referralCount: 0 });

const teacherCode = computed(() => {
  return userStore.user?.id?.slice(-6)?.toUpperCase() || 'X9K2M7';
});

onShow(() => {
  loadOverview();
});

async function loadOverview() {
  try {
    const res = await creditsApi.getOverview();
    overview.value = res;
  } catch {}
}

function goHistory() {
  uni.navigateTo({ url: '/pages/teacher/credits-history/index' });
}

function goUseCredits() {
  uni.navigateTo({ url: '/pages/teacher/credits-use/index' });
}

function goGuide() {
  uni.navigateTo({ url: '/pages/teacher/credits-guide/index' });
}

function copyCode() {
  uni.setClipboardData({
    data: `TEACHER-${teacherCode.value}`,
    success: () => uni.showToast({ title: '已复制', icon: 'success' }),
  });
}
</script>

<style scoped>
.page {
  --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF;
  --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F;
  padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box;
}

.credit-card {
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  border-radius: 28rpx; padding: 40rpx 36rpx; margin-bottom: 24rpx;
  box-shadow: 0 8rpx 28rpx rgba(91,123,255,0.3);
}
.credit-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.credit-label { font-size: 28rpx; color: rgba(255,255,255,0.8); }
.credit-guide { font-size: 24rpx; color: rgba(255,255,255,0.7); }
.credit-num { font-size: 72rpx; font-weight: 800; color: #FFF; display: block; margin-bottom: 28rpx; }
.credit-stats { display: flex; align-items: center; background: rgba(255,255,255,0.12); border-radius: 16rpx; padding: 20rpx 0; }
.stat-block { flex: 1; text-align: center; }
.stat-val { font-size: 32rpx; font-weight: 700; color: #FFF; display: block; margin-bottom: 4rpx; }
.stat-lbl { font-size: 22rpx; color: rgba(255,255,255,0.7); }
.stat-sep { width: 1rpx; height: 40rpx; background: rgba(255,255,255,0.2); }

.section-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx 24rpx; margin-bottom: 24rpx; border: 1rpx solid var(--c-border); }
.section-title { font-size: 28rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 16rpx; }
.menu-list {}
.menu-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid var(--c-border); }
.menu-item:last-child { border-bottom: none; }
.mi-icon { font-size: 36rpx; margin-right: 16rpx; }
.mi-label { flex: 1; font-size: 30rpx; color: var(--c-t1); }
.mi-hint { font-size: 24rpx; color: var(--c-t3); margin-right: 12rpx; }
.mi-arrow { width: 14rpx; height: 14rpx; border-right: 2.5rpx solid var(--c-t3); border-top: 2.5rpx solid var(--c-t3); transform: rotate(45deg); flex-shrink: 0; }

.invite-card {
  background: var(--c-card); border-radius: 24rpx; padding: 28rpx 24rpx;
  border: 1rpx solid rgba(52,211,153,0.3); margin-bottom: 24rpx;
}
.invite-header { margin-bottom: 20rpx; }
.invite-title { font-size: 30rpx; font-weight: 700; color: #34D399; display: block; margin-bottom: 8rpx; }
.invite-desc { font-size: 24rpx; color: var(--c-t3); display: block; }
.invite-code-row { display: flex; align-items: center; gap: 12rpx; background: #242838; border-radius: 12rpx; padding: 20rpx 24rpx; }
.invite-code { font-size: 32rpx; font-weight: 800; color: var(--c-primary); flex: 1; letter-spacing: 2rpx; }
.copy-btn { background: rgba(91,123,255,0.15); padding: 8rpx 20rpx; border-radius: 10rpx; }
.copy-text { font-size: 22rpx; color: var(--c-primary); font-weight: 600; }
</style>
