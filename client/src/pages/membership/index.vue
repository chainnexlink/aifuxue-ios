<template>
  <view class="membership-page">
    <!-- 当前状态 -->
    <view class="status-area">
      <view v-if="userStore.isVip" class="vip-active">
        <text class="vip-badge">VIP</text>
        <text class="vip-title">会员生效中</text>
        <text class="vip-expire">有效期至 {{ expireDate }}</text>
      </view>
      <view v-else class="vip-inactive">
        <text class="vip-icon">👑</text>
        <text class="vip-title">开通VIP会员</text>
        <text class="vip-subtitle">解锁全部高级功能，无广告畅学</text>
      </view>
    </view>

    <!-- VIP权益列表 -->
    <view class="benefits-card">
      <text class="card-title">VIP专属权益</text>
      <view class="benefit-list">
        <view class="benefit-item">
          <text class="benefit-icon">🚫</text>
          <view class="benefit-info">
            <text class="benefit-name">去除广告</text>
            <text class="benefit-desc">所有功能直接使用，无需观看广告</text>
          </view>
        </view>
        <view class="benefit-item">
          <text class="benefit-icon">♾️</text>
          <view class="benefit-info">
            <text class="benefit-name">无限使用</text>
            <text class="benefit-desc">AI出题、靶向练习、知识图谱等无次数限制</text>
          </view>
        </view>
        <view class="benefit-item">
          <text class="benefit-icon">📤</text>
          <view class="benefit-info">
            <text class="benefit-name">数据导出</text>
            <text class="benefit-desc">笔记、错题本、学习报告一键导出</text>
          </view>
        </view>
        <view class="benefit-item">
          <text class="benefit-icon">🤖</text>
          <view class="benefit-info">
            <text class="benefit-name">AI深度辅导</text>
            <text class="benefit-desc">更精准的知识点分析与个性化学习建议</text>
          </view>
        </view>
        <view class="benefit-item">
          <text class="benefit-icon">📊</text>
          <view class="benefit-info">
            <text class="benefit-name">教师专属</text>
            <text class="benefit-desc">AI批改无限次、智能出卷无限制</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 订阅方案 -->
    <view v-if="!userStore.isVip" class="plans-card">
      <text class="card-title">选择方案</text>

      <!-- 教师定价 -->
      <view v-if="isTeacher" class="plan-list">
        <view class="plan-item recommended" :class="{ active: selectedPlan === 'monthly', dimmed: selectedPlan !== 'monthly' }" @tap="selectedPlan = 'monthly'">
          <view class="plan-badge"><text>推荐</text></view>
          <text class="plan-name">月度订阅</text>
          <view class="plan-price-row">
            <text class="plan-price">¥30</text>
            <text class="plan-unit">/月</text>
          </view>
          <text class="plan-save">无限AI批改·出卷</text>
        </view>
        <view class="plan-item" :class="{ active: selectedPlan === 'per-use', dimmed: selectedPlan !== 'per-use' }" @tap="selectedPlan = 'per-use'">
          <text class="plan-name">按次计费</text>
          <view class="plan-price-row">
            <text class="plan-price">¥1</text>
            <text class="plan-unit">/2次</text>
          </view>
          <text class="plan-save">AI批改/出卷/导出</text>
        </view>
      </view>

      <!-- 学生/家长定价 -->
      <view v-else class="plan-list">
        <view class="plan-item" :class="{ active: selectedPlan === 'monthly' }" @tap="selectedPlan = 'monthly'">
          <text class="plan-name">月度会员</text>
          <view class="plan-price-row">
            <text class="plan-price">¥18</text>
            <text class="plan-unit">/月</text>
          </view>
        </view>
        <view class="plan-item recommended" :class="{ active: selectedPlan === 'yearly' }" @tap="selectedPlan = 'yearly'">
          <view class="plan-badge"><text>推荐</text></view>
          <text class="plan-name">年度会员</text>
          <view class="plan-price-row">
            <text class="plan-price">¥128</text>
            <text class="plan-unit">/年</text>
          </view>
          <text class="plan-save">省¥88</text>
        </view>
      </view>

      <!-- 教师免费试用提示 -->
      <view v-if="isTeacher" class="trial-hint">
        <text class="trial-text">新注册教师账户可免费体验全部功能1个月</text>
      </view>
    </view>

    <!-- 购买按钮 -->
    <view v-if="!userStore.isVip" class="purchase-area">
      <view class="purchase-btn" @tap="handlePurchase">
        <text class="purchase-text">立即开通</text>
      </view>
      <text class="purchase-hint">开通即表示同意《会员服务协议》</text>
      <text class="purchase-restore" @tap="handleRestore">恢复已购买的会员</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const isTeacher = computed(() => userStore.user?.role === 'teacher');
const selectedPlan = ref<'monthly' | 'yearly' | 'per-use'>('monthly');

const expireDate = computed(() => {
  if (!userStore.user?.vipExpireAt) return '';
  const d = new Date(userStore.user.vipExpireAt);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
});

function handlePurchase() {
  let planText = '';
  if (isTeacher.value) {
    planText = selectedPlan.value === 'monthly' ? '月度订阅(¥30/月)' : '按次计费(¥1/2次)';
  } else {
    planText = selectedPlan.value === 'monthly' ? '月度会员' : '年度会员';
  }
  uni.showModal({
    title: '支付功能开发中',
    content: `您选择了${planText}方案，支付功能将在正式上线时开通。`,
    showCancel: false,
  });
}

function handleRestore() {
  uni.showToast({ title: '正在查询购买记录...', icon: 'loading', duration: 2000 });
  setTimeout(() => {
    uni.showToast({ title: '未找到购买记录', icon: 'none' });
  }, 2000);
}
</script>

<style scoped>
.membership-page {
  --c-primary: #5B7BFF;
  --c-gold: #FFD700;
  --c-card: #1A1D2E;
  --c-t1: #E8ECF4;
  --c-t2: #8B92A5;
  --c-t3: #4D5466;
  --c-border: #2A2E3F;
  background: #0F1118;
  min-height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
}

.status-area {
  text-align: center;
  padding: 60rpx 0 40rpx;
}
.vip-active { display: flex; flex-direction: column; align-items: center; gap: 12rpx; }
.vip-badge {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1A1D2E;
  font-size: 28rpx;
  font-weight: 800;
  padding: 8rpx 32rpx;
  border-radius: 20rpx;
}
.vip-inactive { display: flex; flex-direction: column; align-items: center; gap: 12rpx; }
.vip-icon { font-size: 64rpx; }
.vip-title { font-size: 40rpx; font-weight: 800; color: var(--c-t1); }
.vip-subtitle { font-size: 28rpx; color: var(--c-t3); }
.vip-expire { font-size: 26rpx; color: var(--c-t2); }

.benefits-card, .plans-card {
  background: var(--c-card);
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid var(--c-border);
}
.card-title { font-size: 30rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 24rpx; }

.benefit-list { display: flex; flex-direction: column; gap: 24rpx; }
.benefit-item { display: flex; align-items: flex-start; gap: 20rpx; }
.benefit-icon { font-size: 36rpx; flex-shrink: 0; margin-top: 4rpx; }
.benefit-info { flex: 1; }
.benefit-name { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 4rpx; }
.benefit-desc { font-size: 24rpx; color: var(--c-t3); display: block; }

.plan-list { display: flex; gap: 16rpx; }
.plan-item {
  flex: 1;
  background: #242838;
  border-radius: 20rpx;
  padding: 28rpx 16rpx;
  text-align: center;
  border: 2rpx solid var(--c-border);
  position: relative;
}
.plan-item.active { border-color: var(--c-primary); background: rgba(91,123,255,0.1); }
.plan-item.recommended { border-color: var(--c-gold); }
.plan-item.recommended.active { background: rgba(255,215,0,0.08); border-color: var(--c-gold); }
.plan-item.dimmed { opacity: 0.4; }
.plan-badge {
  position: absolute; top: -14rpx; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #FFD700, #FFA500);
  padding: 2rpx 16rpx; border-radius: 10rpx;
}
.plan-badge text { font-size: 20rpx; color: #1A1D2E; font-weight: 700; }
.plan-name { font-size: 26rpx; color: var(--c-t2); display: block; margin-bottom: 12rpx; }
.plan-price-row { display: flex; align-items: baseline; justify-content: center; gap: 4rpx; margin-bottom: 8rpx; }
.plan-price { font-size: 40rpx; font-weight: 800; color: var(--c-t1); }
.plan-unit { font-size: 22rpx; color: var(--c-t3); }
.plan-save { font-size: 20rpx; color: var(--c-gold); display: block; }

.purchase-area { padding: 20rpx 0 40rpx; }
.purchase-btn {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 20rpx;
  padding: 30rpx;
  text-align: center;
  box-shadow: 0 8rpx 24rpx rgba(255,215,0,0.3);
}
.purchase-text { font-size: 34rpx; font-weight: 800; color: #1A1D2E; }
.purchase-hint { font-size: 22rpx; color: var(--c-t3); text-align: center; display: block; margin-top: 16rpx; }
.purchase-restore { font-size: 24rpx; color: var(--c-primary); text-align: center; display: block; margin-top: 20rpx; }

.trial-hint { margin-top: 20rpx; padding: 16rpx; background: rgba(52,211,153,0.1); border-radius: 12rpx; text-align: center; }
.trial-text { font-size: 24rpx; color: #34D399; font-weight: 600; }
</style>
