<template>
  <view class="page">
    <!-- 余额显示 -->
    <view class="balance-bar">
      <text class="balance-label">可用积分</text>
      <text class="balance-num">{{ balance }}</text>
    </view>

    <!-- 抵扣会员 -->
    <view class="section-card">
      <text class="section-title">抵扣会员购买</text>
      <text class="section-desc">积分可抵扣会员价格的50%，1积分=1元</text>

      <view class="plan-list">
        <view class="plan-item" :class="{ active: selectedPlan === 'monthly' }" @tap="selectedPlan = 'monthly'">
          <text class="plan-name">月度订阅</text>
          <text class="plan-price">¥30/月</text>
          <text class="plan-max">最多抵扣15积分</text>
        </view>
        <view class="plan-item" :class="{ active: selectedPlan === 'yearly' }" @tap="selectedPlan = 'yearly'">
          <text class="plan-name">年度会员</text>
          <text class="plan-price">¥128/年</text>
          <text class="plan-max">最多抵扣64积分</text>
        </view>
      </view>

      <view class="input-row">
        <text class="input-label">使用积分</text>
        <input class="input-field" type="number" v-model="membershipCredits" :placeholder="`最多${maxMembershipDeduction}积分`" />
      </view>

      <view class="action-btn" @tap="handleUseMembership">
        <text class="action-text">确认抵扣 (实付¥{{ membershipActualPrice }})</text>
      </view>
    </view>

    <!-- 抵扣消耗次数 -->
    <view class="section-card">
      <text class="section-title">兑换使用次数</text>
      <text class="section-desc">1积分=1元，1元=2次使用额度，无上限</text>

      <view class="input-row">
        <text class="input-label">使用积分</text>
        <input class="input-field" type="number" v-model="quotaCredits" placeholder="输入要兑换的积分数" />
      </view>

      <view class="preview-row" v-if="Number(quotaCredits) > 0">
        <text class="preview-text">将获得 {{ Number(quotaCredits) * 2 }} 次使用额度</text>
      </view>

      <view class="action-btn green" @tap="handleUseQuota">
        <text class="action-text">确认兑换</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { creditsApi } from '@/utils/api';

const balance = ref(0);
const selectedPlan = ref<'monthly' | 'yearly'>('monthly');
const membershipCredits = ref('');
const quotaCredits = ref('');

const planPrices: Record<string, number> = { monthly: 30, yearly: 128 };

const maxMembershipDeduction = computed(() => {
  const price = planPrices[selectedPlan.value];
  return Math.min(Math.floor(price * 0.5), balance.value);
});

const membershipActualPrice = computed(() => {
  const price = planPrices[selectedPlan.value];
  const credits = Math.min(Number(membershipCredits.value) || 0, maxMembershipDeduction.value);
  return price - credits;
});

onShow(() => {
  loadBalance();
});

async function loadBalance() {
  try {
    const res = await creditsApi.getBalance();
    balance.value = res.credits;
  } catch {}
}

async function handleUseMembership() {
  const credits = Number(membershipCredits.value);
  if (!credits || credits <= 0) {
    uni.showToast({ title: '请输入积分数量', icon: 'none' });
    return;
  }
  if (credits > maxMembershipDeduction.value) {
    uni.showToast({ title: `最多可使用${maxMembershipDeduction.value}积分`, icon: 'none' });
    return;
  }
  try {
    const res = await creditsApi.useForMembership(credits, selectedPlan.value);
    uni.showToast({ title: `抵扣成功，实付¥${res.actualPrice}`, icon: 'success' });
    balance.value = res.remainingCredits;
    membershipCredits.value = '';
  } catch {}
}

async function handleUseQuota() {
  const credits = Number(quotaCredits.value);
  if (!credits || credits <= 0) {
    uni.showToast({ title: '请输入积分数量', icon: 'none' });
    return;
  }
  if (credits > balance.value) {
    uni.showToast({ title: '积分余额不足', icon: 'none' });
    return;
  }
  try {
    const res = await creditsApi.useForQuota(credits);
    uni.showToast({ title: `兑换成功，获得${res.quotaGained}次额度`, icon: 'success' });
    balance.value = res.remainingCredits;
    quotaCredits.value = '';
  } catch {}
}
</script>

<style scoped>
.page {
  --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF;
  --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F;
  padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box;
}

.balance-bar {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--c-card); border-radius: 16rpx; padding: 24rpx 28rpx;
  margin-bottom: 24rpx; border: 1rpx solid var(--c-border);
}
.balance-label { font-size: 28rpx; color: var(--c-t2); }
.balance-num { font-size: 40rpx; font-weight: 800; color: var(--c-primary); }

.section-card {
  background: var(--c-card); border-radius: 24rpx; padding: 28rpx 24rpx;
  margin-bottom: 24rpx; border: 1rpx solid var(--c-border);
}
.section-title { font-size: 30rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.section-desc { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 20rpx; }

.plan-list { display: flex; gap: 16rpx; margin-bottom: 20rpx; }
.plan-item {
  flex: 1; text-align: center; background: #242838; border-radius: 16rpx;
  padding: 20rpx 12rpx; border: 2rpx solid var(--c-border);
}
.plan-item.active { border-color: var(--c-primary); background: rgba(91,123,255,0.1); }
.plan-name { font-size: 26rpx; color: var(--c-t2); display: block; margin-bottom: 8rpx; }
.plan-price { font-size: 30rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 6rpx; }
.plan-max { font-size: 20rpx; color: var(--c-primary); display: block; }

.input-row { display: flex; align-items: center; gap: 16rpx; margin-bottom: 20rpx; }
.input-label { font-size: 28rpx; color: var(--c-t2); white-space: nowrap; }
.input-field {
  flex: 1; background: #242838; border-radius: 12rpx; padding: 20rpx;
  font-size: 28rpx; color: var(--c-t1);
}

.preview-row { margin-bottom: 20rpx; padding: 16rpx; background: rgba(52,211,153,0.1); border-radius: 12rpx; }
.preview-text { font-size: 26rpx; color: #34D399; font-weight: 600; }

.action-btn {
  background: var(--c-primary); border-radius: 16rpx; padding: 24rpx; text-align: center;
}
.action-btn.green { background: #34D399; }
.action-text { font-size: 30rpx; font-weight: 700; color: #FFF; }
</style>
