<template>
  <view class="oral-page">
    <view class="hero">
      <view class="hero-icon">
        <image src="/static/icons/speaker-white.svg" class="hero-img" mode="aspectFit" />
      </view>
      <text class="hero-title">英语口语练习</text>
      <text class="hero-desc">拍照学英语，AI当外教</text>
    </view>

    <!-- 两个入口 -->
    <view class="entry-cards">
      <view class="entry-card" @tap="takePhoto">
        <view class="ec-icon-wrap ec-camera">
          <image src="/static/icons/camera.svg" class="ec-icon-img" mode="aspectFit" />
        </view>
        <view class="ec-info">
          <text class="ec-title">拍照识别</text>
          <text class="ec-desc">拍摄英文单词、句子、课文页，AI自动识别</text>
        </view>
        <view class="ec-arrow"></view>
      </view>

      <view class="entry-card" @tap="fromNotes">
        <view class="ec-icon-wrap ec-notes">
          <image src="/static/icons/notes.svg" class="ec-icon-img" mode="aspectFit" />
        </view>
        <view class="ec-info">
          <text class="ec-title">从笔记选择</text>
          <text class="ec-desc">从已有的英语笔记中选取单词或句子练习</text>
        </view>
        <view class="ec-arrow"></view>
      </view>
    </view>

    <!-- 练习记录 -->
    <view class="section">
      <text class="section-title">最近练习</text>
      <view v-if="history.length === 0" class="empty-hint">
        <text class="empty-text">还没有练习记录</text>
      </view>
      <view v-for="item in history" :key="item.id" class="history-item">
        <view class="hi-content">
          <text class="hi-title">{{ item.title }}</text>
          <view class="hi-meta">
            <text class="hi-count">{{ item.wordCount }}个单词</text>
            <text class="hi-time">{{ item.time }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';

const history = ref<any[]>([]);

onShow(() => {
  // 无后端时显示空状态
  history.value = [];
});

function takePhoto() {
  // #ifdef MP-WEIXIN
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['camera', 'album'],
    sizeType: ['compressed'],
    success: (res) => {
      const paths = encodeURIComponent(JSON.stringify([res.tempFiles[0].tempFilePath]));
      uni.navigateTo({ url: `/pages/oral/confirm/index?images=${paths}` });
    },
    fail: (err) => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        uni.showToast({ title: '请允许相机权限', icon: 'none' });
      }
    },
  });
  // #endif
  // #ifndef MP-WEIXIN
  uni.chooseImage({
    count: 1, sizeType: ['compressed'], sourceType: ['camera', 'album'],
    success: (res) => {
      const paths = encodeURIComponent(JSON.stringify(res.tempFilePaths));
      uni.navigateTo({ url: `/pages/oral/confirm/index?images=${paths}` });
    },
    fail: (err: any) => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        uni.showToast({ title: '请允许相机权限', icon: 'none' });
      }
    },
  });
  // #endif
}

function fromNotes() {
  uni.switchTab({ url: '/pages/notes/index' });
  uni.showToast({ title: '请选择一篇英语笔记', icon: 'none' });
}

</script>

<style scoped>
.oral-page {
  --c-primary: #5B7BFF;
  --c-card: #1A1D2E;
  --c-card2: #242838;
  --c-t1: #E8ECF4;
  --c-t2: #8B92A5;
  --c-t3: #4D5466;
  --c-border: #2A2E3F;
  --c-success: #34D399;
  --c-warning: #FFBA4A;
  --c-danger: #FF6B6B;
  background: #0F1118;
  min-height: 100vh;
  padding: 0 32rpx 40rpx;
}

.hero {
  text-align: center;
  padding: 60rpx 0 40rpx;
}
.hero-icon {
  width: 96rpx; height: 96rpx;
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  border-radius: 28rpx;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(91,123,255,0.3);
}
.hero-img { width: 48rpx; height: 48rpx; }
.hero-title { font-size: 38rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.hero-desc { font-size: 26rpx; color: var(--c-t3); }

/* Entry Cards */
.entry-cards { margin-bottom: 32rpx; }
.entry-card {
  background: var(--c-card);
  border-radius: 24rpx;
  padding: 36rpx 28rpx;
  display: flex; align-items: center; gap: 24rpx;
  border: 1rpx solid var(--c-border);
  margin-bottom: 16rpx;
}
.ec-icon-wrap {
  width: 84rpx; height: 84rpx;
  border-radius: 22rpx;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ec-camera { background: rgba(91,123,255,0.15); }
.ec-notes { background: rgba(52,211,153,0.15); }
.ec-icon-img { width: 44rpx; height: 44rpx; }
.ec-info { flex: 1; }
.ec-title { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.ec-desc { font-size: 24rpx; color: var(--c-t3); display: block; }
.ec-arrow {
  width: 16rpx; height: 16rpx;
  border-right: 3rpx solid var(--c-t3);
  border-top: 3rpx solid var(--c-t3);
  transform: rotate(45deg); flex-shrink: 0;
}

/* Section */
.section {
  background: var(--c-card);
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
  border: 1rpx solid var(--c-border);
  margin-bottom: 20rpx;
}
.section-title { font-size: 30rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 20rpx; }

.empty-hint { padding: 40rpx 0; text-align: center; }
.empty-text { font-size: 26rpx; color: var(--c-t3); }

/* History */
.history-item {
  display: flex; align-items: center; gap: 16rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--c-border);
}
.history-item:last-child { border-bottom: none; }
.hi-content { flex: 1; }
.hi-title { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.hi-meta { display: flex; gap: 16rpx; }
.hi-count, .hi-time { font-size: 22rpx; color: var(--c-t3); }
</style>
