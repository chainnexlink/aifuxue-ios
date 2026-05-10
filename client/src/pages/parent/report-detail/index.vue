<template>
  <view class="detail-page">
    <!-- 科目总览 -->
    <view class="subject-header" :style="{ borderColor: subject.color }">
      <view class="sh-left">
        <text class="sh-name">{{ subject.name }}</text>
        <text class="sh-score-label">综合得分</text>
      </view>
      <view class="sh-right">
        <text class="sh-score" :style="{ color: subject.color }">{{ subject.score }}</text>
      </view>
    </view>

    <!-- 练习统计 -->
    <view class="stats-card">
      <view class="stat-row">
        <text class="sr-label">本周练习题数</text>
        <text class="sr-value">{{ stats.exerciseCount }}题</text>
      </view>
      <view class="stat-row">
        <text class="sr-label">正确率</text>
        <text class="sr-value">{{ stats.accuracy }}%</text>
      </view>
      <view class="stat-row">
        <text class="sr-label">学习时长</text>
        <text class="sr-value">{{ stats.minutes }}分钟</text>
      </view>
      <view class="stat-row">
        <text class="sr-label">错题消灭数</text>
        <text class="sr-value">{{ stats.killed }}个</text>
      </view>
    </view>

    <!-- 知识点掌握度 -->
    <view class="section">
      <text class="section-title">知识点掌握度</text>
      <view v-for="(k, idx) in knowledgePoints" :key="idx" class="kp-item" @tap="goKnowledgePractice(k)">
        <view class="kp-info">
          <text class="kp-name">{{ k.name }}</text>
          <view class="kp-bar-bg">
            <view class="kp-bar-fill" :class="kpLevel(k.mastery)" :style="{ width: k.mastery + '%' }"></view>
          </view>
        </view>
        <text class="kp-percent" :class="kpLevel(k.mastery)">{{ k.mastery }}%</text>
        <view class="kp-arrow"></view>
      </view>
    </view>

    <!-- 错题分布 -->
    <view class="section">
      <text class="section-title">高频错题</text>
      <view v-for="(e, idx) in topErrors" :key="idx" class="error-item" @tap="goErrorDetail(e)">
        <text class="ei-num">{{ idx + 1 }}</text>
        <view class="ei-info">
          <text class="ei-text">{{ e.question }}</text>
          <text class="ei-count">错{{ e.count }}次</text>
        </view>
        <view class="ei-arrow"></view>
      </view>
    </view>

    <!-- 建议 -->
    <view class="advice-card">
      <text class="card-title">针对性建议</text>
      <text class="advice-text">{{ adviceText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const subject = ref<any>({ name: '', score: 0, color: '#5B7BFF' });
const stats = ref({ exerciseCount: 42, accuracy: 78, minutes: 95, killed: 8 });
const knowledgePoints = ref<any[]>([]);
const topErrors = ref<any[]>([]);

onLoad((options) => {
  if (options?.data) {
    try { subject.value = JSON.parse(decodeURIComponent(options.data)); } catch {}
  }
  loadSubjectData();
});

function loadSubjectData() {
  const name = subject.value.name;
  if (name === '数学') {
    knowledgePoints.value = [
      { name: '函数与导数', mastery: 85 },
      { name: '三角函数', mastery: 72 },
      { name: '数列', mastery: 90 },
      { name: '概率统计', mastery: 65 },
      { name: '立体几何', mastery: 58 },
    ];
    topErrors.value = [
      { question: '导数求极值类型判断', count: 5 },
      { question: '立体几何空间角计算', count: 4 },
      { question: '概率分布表求期望', count: 3 },
    ];
  } else {
    knowledgePoints.value = [
      { name: '基础知识', mastery: 80 },
      { name: '综合应用', mastery: 60 },
      { name: '拓展提高', mastery: 45 },
    ];
    topErrors.value = [
      { question: '综合应用题', count: 3 },
      { question: '计算推理', count: 2 },
    ];
  }
}

const adviceText = computed(() => {
  const weak = knowledgePoints.value.filter(k => k.mastery < 70);
  if (weak.length === 0) return `${subject.value.name}整体掌握较好，继续保持！可以尝试挑战更高难度的题目。`;
  const names = weak.map(w => w.name).join('、');
  return `${names} 是本周薄弱环节，建议本周安排专项练习。可以先做相关错题巩固卷，再通过靶向练习加强。`;
});

function kpLevel(mastery: number) {
  if (mastery >= 80) return 'good';
  if (mastery >= 60) return 'mid';
  return 'bad';
}

function goKnowledgePractice(k: any) {
  uni.navigateTo({ url: `/pages/exercise/index?noteId=knowledge&subject=${subject.value.name}` });
}

function goErrorDetail(e: any) {
  uni.navigateTo({ url: `/pages/mistakes/detail/index?id=report_${Date.now()}` });
}
</script>

<style scoped>
.detail-page {
  background: #0F1118;
  min-height: 100vh;
  padding: 24rpx 32rpx 40rpx;
}

.subject-header {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
  border: 1rpx solid #2A2E3F;
  border-left: 8rpx solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.sh-name { font-size: 34rpx; font-weight: 700; color: #E8ECF4; display: block; }
.sh-score-label { font-size: 24rpx; color: #4D5466; display: block; margin-top: 4rpx; }
.sh-score { font-size: 56rpx; font-weight: 800; }

.stats-card {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.stat-row { display: flex; justify-content: space-between; padding: 14rpx 0; border-bottom: 1rpx solid #2A2E3F; }
.stat-row:last-child { border-bottom: none; }
.sr-label { font-size: 26rpx; color: #8B92A5; }
.sr-value { font-size: 26rpx; font-weight: 600; color: #E8ECF4; }

.section {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.section-title { font-size: 30rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 20rpx; }

.kp-item {
  display: flex; align-items: center; gap: 16rpx;
  padding: 14rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.kp-item:last-child { border-bottom: none; }
.kp-info { flex: 1; }
.kp-name { font-size: 26rpx; color: #E8ECF4; display: block; margin-bottom: 8rpx; }
.kp-bar-bg { height: 8rpx; background: #242838; border-radius: 4rpx; overflow: hidden; }
.kp-bar-fill { height: 100%; border-radius: 4rpx; }
.kp-bar-fill.good { background: #34D399; }
.kp-bar-fill.mid { background: #FFBA4A; }
.kp-bar-fill.bad { background: #FF6B6B; }
.kp-percent { font-size: 26rpx; font-weight: 700; flex-shrink: 0; }
.kp-percent.good { color: #34D399; }
.kp-percent.mid { color: #FFBA4A; }
.kp-percent.bad { color: #FF6B6B; }
.kp-arrow { width: 12rpx; height: 12rpx; border-right: 2rpx solid #4D5466; border-top: 2rpx solid #4D5466; transform: rotate(45deg); flex-shrink: 0; }

.error-item {
  display: flex; align-items: center; gap: 16rpx;
  padding: 16rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.error-item:last-child { border-bottom: none; }
.ei-num { font-size: 28rpx; font-weight: 700; color: #FF6B6B; width: 32rpx; text-align: center; flex-shrink: 0; }
.ei-info { flex: 1; }
.ei-text { font-size: 26rpx; color: #E8ECF4; display: block; }
.ei-count { font-size: 22rpx; color: #4D5466; display: block; margin-top: 4rpx; }
.ei-arrow { width: 12rpx; height: 12rpx; border-right: 2rpx solid #4D5466; border-top: 2rpx solid #4D5466; transform: rotate(45deg); flex-shrink: 0; }

.advice-card {
  background: rgba(91,123,255,0.06);
  border-radius: 20rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(91,123,255,0.15);
}
.card-title { font-size: 28rpx; font-weight: 700; color: #5B7BFF; display: block; margin-bottom: 12rpx; }
.advice-text { font-size: 26rpx; color: #8B92A5; line-height: 1.8; }
</style>
