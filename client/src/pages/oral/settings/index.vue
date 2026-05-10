<template>
  <view class="settings-page">
    <view class="setting-card">
      <text class="card-title">发音风格</text>
      <view class="option-row">
        <view class="option-item" :class="{ active: accent === 'us' }" @tap="accent = 'us'">
          <text class="oi-label">美式发音</text>
          <text class="oi-tag free">免费</text>
        </view>
        <view class="option-item" :class="{ active: accent === 'uk' }" @tap="accent = 'uk'">
          <text class="oi-label">英式发音</text>
          <text class="oi-tag free">免费</text>
        </view>
      </view>
    </view>

    <view class="setting-card">
      <text class="card-title">语速</text>
      <view class="option-row">
        <view class="option-item" :class="{ active: speed === 'normal' }" @tap="speed = 'normal'">
          <text class="oi-label">常速</text>
          <text class="oi-tag free">免费</text>
        </view>
        <view class="option-item" :class="{ active: speed === 'slow' }" @tap="speed = 'slow'">
          <text class="oi-label">慢速</text>
          <text class="oi-tag free">免费</text>
        </view>
      </view>
    </view>

    <view class="setting-card">
      <text class="card-title">练习模式</text>
      <view class="option-row">
        <view class="option-item" :class="{ active: mode === 'single' }" @tap="mode = 'single'">
          <text class="oi-label">逐词模式</text>
          <text class="oi-desc">一个词读熟再下一个</text>
        </view>
        <view class="option-item" :class="{ active: mode === 'continuous' }" @tap="mode = 'continuous'">
          <text class="oi-label">连续模式</text>
          <text class="oi-desc">一口气读完所有</text>
        </view>
      </view>
    </view>

    <view class="info-card">
      <text class="info-text">本次将练习 {{ wordCount }} 个内容</text>
    </view>

    <view class="btn-primary go-btn" @tap="startPractice">
      <text>开始练习</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const accent = ref<'us' | 'uk'>('us');
const speed = ref<'normal' | 'slow'>('normal');
const mode = ref<'single' | 'continuous'>('single');
const words = ref<string[]>([]);
const wordCount = ref(0);

onLoad((options) => {
  if (options?.words) {
    try {
      words.value = JSON.parse(decodeURIComponent(options.words));
      wordCount.value = words.value.length;
    } catch {}
  }
});

function startPractice() {
  const wordsParam = encodeURIComponent(JSON.stringify(words.value));
  uni.navigateTo({
    url: `/pages/oral/practice/index?words=${wordsParam}&accent=${accent.value}&speed=${speed.value}&mode=${mode.value}`,
  });
}
</script>

<style scoped>
.settings-page {
  background: #0F1118;
  min-height: 100vh;
  padding: 24rpx 32rpx;
}

.setting-card {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.card-title {
  font-size: 30rpx; font-weight: 700;
  color: #E8ECF4; display: block; margin-bottom: 20rpx;
}

.option-row { display: flex; gap: 16rpx; }
.option-item {
  flex: 1;
  background: #242838;
  border-radius: 16rpx;
  padding: 24rpx 20rpx;
  border: 2rpx solid transparent;
  text-align: center;
}
.option-item.active {
  border-color: #5B7BFF;
  background: rgba(91,123,255,0.15);
}
.option-item.locked { opacity: 0.5; }
.oi-label { font-size: 30rpx; font-weight: 600; color: #E8ECF4; display: block; margin-bottom: 8rpx; }
.oi-desc { font-size: 22rpx; color: #4D5466; display: block; }
.oi-tag {
  font-size: 20rpx; padding: 2rpx 12rpx;
  border-radius: 8rpx; display: inline-block;
}
.oi-tag.free { color: #34D399; background: rgba(52,211,153,0.15); }
.oi-tag.ad { color: #5B7BFF; background: rgba(91,123,255,0.15); }

.info-card {
  background: rgba(91,123,255,0.1);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 32rpx;
  text-align: center;
}
.info-text { font-size: 28rpx; color: #5B7BFF; }

.go-btn { padding: 28rpx 0; }
</style>
