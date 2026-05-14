<template>
  <view class="search-bar" @tap="goSearch">
    <view class="search-inner">
      <text class="search-icon">🔍</text>
      <text class="search-placeholder">{{ placeholder }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  placeholder?: string;
}>();

function goSearch() {
  uni.navigateTo({ url: '/pages/search/index' });
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 24rpx;
}
.search-inner {
  display: flex;
  align-items: center;
  gap: 12rpx;
  background: #1A1D2E;
  border: 1rpx solid #2A2E3F;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
}
.search-icon {
  font-size: 28rpx;
}
.search-placeholder {
  font-size: 28rpx;
  color: #4D5466;
}
</style>
