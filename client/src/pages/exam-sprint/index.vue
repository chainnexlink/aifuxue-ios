<template>
  <view class="sprint-page">
    <view class="header">
      <text class="title">考前冲刺中心</text>
      <text class="desc">根据你的笔记和错题，AI为你量身定制</text>
    </view>

    <view class="sprint-cards">
      <view class="sprint-card" @tap="goPushExam">
        <view class="card-icon-wrap ci-bg-red">
          <image src="/static/icons/target.svg" class="card-icon-img" mode="aspectFit" />
        </view>
        <view class="card-info">
          <text class="card-title">押题卷</text>
          <text class="card-desc">基于笔记和错题历史，AI预测高频考点生成模拟卷</text>
        </view>
        <view class="card-arrow"></view>
      </view>

      <view class="sprint-card" @tap="goFlashCards">
        <view class="card-icon-wrap ci-bg-purple">
          <image src="/static/icons/card.svg" class="card-icon-img" mode="aspectFit" />
        </view>
        <view class="card-info">
          <text class="card-title">背诵卡</text>
          <text class="card-desc">核心知识点转卡片，正反面翻看快速记忆</text>
        </view>
        <view class="card-arrow"></view>
      </view>

      <view class="sprint-card" @tap="goStudyPlan">
        <view class="card-icon-wrap ci-bg-blue">
          <image src="/static/icons/calendar.svg" class="card-icon-img" mode="aspectFit" />
        </view>
        <view class="card-info">
          <text class="card-title">备考计划</text>
          <text class="card-desc">输入考试日期，AI生成每日复习计划</text>
        </view>
        <view class="card-arrow"></view>
      </view>
    </view>

    <view class="back-btn" @tap="goHome">
      <text>返回首页</text>
    </view>
  </view>
</template>

<script setup lang="ts">
function goPushExam() {
  uni.navigateTo({ url: '/pages/mock-exam/index?type=push' });
}

function goFlashCards() {
  uni.switchTab({ url: '/pages/notes/index' });
  uni.showToast({ title: '请选择笔记生成背诵卡', icon: 'none' });
}

function goStudyPlan() {
  uni.navigateTo({ url: '/pages/mock-exam/index?type=plan' });
}

function goHome() {
  uni.switchTab({ url: '/pages/home/index' });
}
</script>

<style scoped>
.sprint-page {
  padding: 30rpx;
  background: #0F1118;
  min-height: 100vh;
}

.header {
  text-align: center;
  padding: 50rpx 0 40rpx;
}
.title {
  font-size: 40rpx;
  font-weight: 700;
  color: #E8ECF4;
  display: block;
  margin-bottom: 12rpx;
}
.desc {
  font-size: 28rpx;
  color: #4D5466;
}

.sprint-cards { margin-bottom: 40rpx; }
.sprint-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 20rpx;
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 36rpx 28rpx;
  border: 1rpx solid #2A2E3F;
}

.card-icon-wrap {
  width: 76rpx;
  height: 76rpx;
  flex-shrink: 0;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-icon-img {
  width: 40rpx;
  height: 40rpx;
}
.ci-bg-red { background: rgba(255,107,107,0.15); }
.ci-bg-purple { background: rgba(167,139,250,0.15); }
.ci-bg-blue { background: rgba(91,123,255,0.15); }

.card-info { flex: 1; }
.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #E8ECF4;
  display: block;
  margin-bottom: 8rpx;
}
.card-desc {
  font-size: 26rpx;
  color: #8B92A5;
  line-height: 1.5;
}

.card-arrow {
  width: 16rpx;
  height: 16rpx;
  border-right: 3rpx solid #4D5466;
  border-top: 3rpx solid #4D5466;
  transform: rotate(45deg);
  flex-shrink: 0;
}

.back-btn {
  text-align: center;
  padding: 28rpx;
  color: #5B7BFF;
  font-size: 30rpx;
  background: #1A1D2E;
  border-radius: 20rpx;
  border: 1rpx solid #2A2E3F;
}
</style>
