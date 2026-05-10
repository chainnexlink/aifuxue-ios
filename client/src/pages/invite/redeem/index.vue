<template>
  <view class="page">
    <view class="redeem-card">
      <text class="redeem-icon">🎁</text>
      <text class="redeem-title">兑换邀请码</text>
      <text class="redeem-desc">输入邀请码，获得功能体验时长</text>

      <view class="code-input-area">
        <input class="code-input" v-model="code" placeholder="输入邀请码" />
      </view>

      <view class="tip-area">
        <text class="tip-text">支持两种邀请码:</text>
        <text class="tip-item">TEACHER-XXXXXX → 30天全功能体验</text>
        <text class="tip-item">USER-XXXXXX → 7天全功能体验</text>
      </view>

      <view class="submit-btn" :class="{ disabled: !code }" @tap="handleRedeem">
        <text class="submit-text">确认兑换</text>
      </view>

      <text class="rule-text">每个账号仅可兑换一次邀请码</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const code = ref('');

function handleRedeem() {
  if (!code.value) return;
  if (userStore.user?.inviteCodeUsed) {
    uni.showToast({ title: '您已使用过邀请码，每个账号限用一次', icon: 'none', duration: 3000 });
    return;
  }
  uni.showLoading({ title: '验证中...' });
  setTimeout(() => {
    uni.hideLoading();
    const isTeacher = code.value.toUpperCase().startsWith('TEACHER-');
    const days = isTeacher ? 30 : 7;
    uni.showModal({
      title: '兑换成功',
      content: `恭喜获得${days}天全功能体验！`,
      showCancel: false,
      success: () => {
        userStore.updateUser({
          inviteCodeUsed: true,
        });
        uni.navigateBack();
      },
    });
  }, 1000);
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.redeem-card { background: var(--c-card); border-radius: 24rpx; padding: 48rpx 32rpx; border: 1rpx solid var(--c-border); text-align: center; }
.redeem-icon { font-size: 80rpx; display: block; margin-bottom: 16rpx; }
.redeem-title { font-size: 36rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 10rpx; }
.redeem-desc { font-size: 26rpx; color: var(--c-t3); display: block; margin-bottom: 40rpx; }
.code-input-area { margin-bottom: 24rpx; }
.code-input { background: #242838; border-radius: 16rpx; padding: 28rpx; font-size: 32rpx; font-weight: 700; color: var(--c-t1); text-align: center; letter-spacing: 2rpx; width: 100%; box-sizing: border-box; }
.tip-area { background: rgba(91,123,255,0.1); border-radius: 14rpx; padding: 20rpx; margin-bottom: 32rpx; text-align: left; }
.tip-text { font-size: 24rpx; font-weight: 600; color: var(--c-primary); display: block; margin-bottom: 8rpx; }
.tip-item { font-size: 24rpx; color: var(--c-t2); display: block; margin-bottom: 4rpx; }
.submit-btn { background: var(--c-primary); border-radius: 20rpx; padding: 26rpx; margin-bottom: 16rpx; }
.submit-btn.disabled { opacity: 0.4; }
.submit-text { font-size: 30rpx; font-weight: 700; color: #FFF; }
.rule-text { font-size: 22rpx; color: var(--c-t3); }
</style>
