<template>
  <view class="report-page">
    <!-- 周报概览 -->
    <view class="overview-card">
      <text class="oc-period">{{ reportPeriod }}</text>
      <text class="oc-title">学习周报</text>
      <view class="oc-stats">
        <view class="os-item">
          <text class="os-num">{{ overview.studyMinutes }}</text>
          <text class="os-unit">分钟</text>
          <text class="os-label">学习时长</text>
        </view>
        <view class="os-divider"></view>
        <view class="os-item">
          <text class="os-num">{{ overview.exerciseCount }}</text>
          <text class="os-unit">题</text>
          <text class="os-label">练习题目</text>
        </view>
        <view class="os-divider"></view>
        <view class="os-item">
          <text class="os-num">{{ overview.accuracy }}%</text>
          <text class="os-unit"></text>
          <text class="os-label">正确率</text>
        </view>
      </view>
    </view>

    <!-- 趋势对比 -->
    <view class="trend-card">
      <text class="card-title">与上周对比</text>
      <view class="trend-items">
        <view v-for="t in trends" :key="t.label" class="trend-item">
          <text class="ti-label">{{ t.label }}</text>
          <text class="ti-change" :class="t.up ? 'up' : 'down'">{{ t.up ? '↑' : '↓' }} {{ t.value }}</text>
        </view>
      </view>
    </view>

    <!-- 各科成绩 -->
    <view class="section">
      <text class="section-title">各科表现</text>
      <view v-for="s in subjects" :key="s.name" class="subject-row" @tap="goSubjectDetail(s)">
        <view class="sr-color" :style="{ background: s.color }"></view>
        <view class="sr-info">
          <text class="sr-name">{{ s.name }}</text>
          <view class="sr-bar-bg">
            <view class="sr-bar-fill" :style="{ width: s.score + '%', background: s.color }"></view>
          </view>
        </view>
        <text class="sr-score">{{ s.score }}分</text>
        <view class="sr-arrow"></view>
      </view>
    </view>

    <!-- 薄弱知识点 -->
    <view class="section">
      <text class="section-title">薄弱知识点</text>
      <view v-for="(w, idx) in weakPoints" :key="idx" class="weak-item">
        <text class="wi-subject">{{ w.subject }}</text>
        <text class="wi-point">{{ w.point }}</text>
        <text class="wi-rate">正确率 {{ w.accuracy }}%</text>
      </view>
    </view>

    <!-- 建议 -->
    <view class="advice-card">
      <text class="card-title">AI 学习建议</text>
      <text class="advice-text">{{ advice }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const reportPeriod = ref('2025.04.28 - 2025.05.04');
const overview = ref({ studyMinutes: 320, exerciseCount: 156, accuracy: 78 });
const trends = ref([
  { label: '学习时长', value: '+45分钟', up: true },
  { label: '练习量', value: '+23题', up: true },
  { label: '正确率', value: '-3%', up: false },
]);
const subjects = ref([
  { name: '数学', score: 82, color: '#5B7BFF' },
  { name: '英语', score: 75, color: '#34D399' },
  { name: '物理', score: 68, color: '#FFBA4A' },
  { name: '化学', score: 85, color: '#A78BFA' },
  { name: '生物', score: 90, color: '#FF6B6B' },
]);
const weakPoints = ref([
  { subject: '数学', point: '导数应用', accuracy: 42 },
  { subject: '物理', point: '电磁感应', accuracy: 50 },
  { subject: '英语', point: '虚拟语气', accuracy: 55 },
]);
const advice = ref('本周数学的导数应用和物理电磁感应正确率较低，建议本周重点复习这两个模块。英语虚拟语气可以通过靶向练习巩固。总体学习时间有增长，继续保持！');

onLoad(() => {});

function goSubjectDetail(s: any) {
  const data = encodeURIComponent(JSON.stringify(s));
  uni.navigateTo({ url: `/pages/parent/report-detail/index?data=${data}` });
}
</script>

<style scoped>
.report-page {
  background: #0F1118;
  min-height: 100vh;
  padding: 24rpx 32rpx 40rpx;
}

.overview-card {
  background: linear-gradient(145deg, #1A2744, #1A1D2E);
  border-radius: 24rpx;
  padding: 32rpx 28rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.oc-period { font-size: 24rpx; color: #4D5466; display: block; margin-bottom: 4rpx; }
.oc-title { font-size: 36rpx; font-weight: 800; color: #E8ECF4; display: block; margin-bottom: 24rpx; }
.oc-stats { display: flex; align-items: flex-start; justify-content: space-around; }
.os-item { text-align: center; }
.os-num { font-size: 44rpx; font-weight: 800; color: #5B7BFF; }
.os-unit { font-size: 22rpx; color: #8B92A5; }
.os-label { font-size: 22rpx; color: #4D5466; display: block; margin-top: 4rpx; }
.os-divider { width: 1rpx; height: 48rpx; background: #2A2E3F; margin-top: 12rpx; }

.trend-card, .advice-card {
  background: #1A1D2E; border-radius: 24rpx; padding: 24rpx;
  border: 1rpx solid #2A2E3F; margin-bottom: 20rpx;
}
.card-title { font-size: 28rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 16rpx; }
.trend-items { display: flex; justify-content: space-around; }
.trend-item { text-align: center; }
.ti-label { font-size: 24rpx; color: #4D5466; display: block; margin-bottom: 8rpx; }
.ti-change { font-size: 28rpx; font-weight: 700; }
.ti-change.up { color: #34D399; }
.ti-change.down { color: #FF6B6B; }

.section {
  background: #1A1D2E; border-radius: 24rpx; padding: 24rpx;
  border: 1rpx solid #2A2E3F; margin-bottom: 20rpx;
}
.section-title { font-size: 30rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 20rpx; }

.subject-row {
  display: flex; align-items: center; gap: 16rpx;
  padding: 16rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.subject-row:last-child { border-bottom: none; }
.sr-color { width: 8rpx; height: 40rpx; border-radius: 4rpx; flex-shrink: 0; }
.sr-info { flex: 1; }
.sr-name { font-size: 28rpx; font-weight: 600; color: #E8ECF4; display: block; margin-bottom: 8rpx; }
.sr-bar-bg { height: 8rpx; background: #242838; border-radius: 4rpx; overflow: hidden; }
.sr-bar-fill { height: 100%; border-radius: 4rpx; }
.sr-score { font-size: 28rpx; font-weight: 700; color: #E8ECF4; flex-shrink: 0; }
.sr-arrow { width: 12rpx; height: 12rpx; border-right: 2rpx solid #4D5466; border-top: 2rpx solid #4D5466; transform: rotate(45deg); flex-shrink: 0; }

.weak-item {
  display: flex; align-items: center; gap: 12rpx;
  padding: 14rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.weak-item:last-child { border-bottom: none; }
.wi-subject { font-size: 22rpx; color: #5B7BFF; background: rgba(91,123,255,0.15); padding: 4rpx 12rpx; border-radius: 6rpx; flex-shrink: 0; }
.wi-point { font-size: 28rpx; color: #E8ECF4; flex: 1; }
.wi-rate { font-size: 24rpx; color: #FF6B6B; flex-shrink: 0; }

.advice-text { font-size: 26rpx; color: #8B92A5; line-height: 1.8; }
</style>
