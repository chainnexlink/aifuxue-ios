<template>
  <view class="km-page">
    <!-- 雷达图区域（CSS模拟） -->
    <view class="radar-card">
      <text class="card-title">知识掌握雷达</text>
      <view class="radar-chart">
        <view v-for="(s, idx) in subjects" :key="idx" class="radar-item" :style="radarStyle(idx)">
          <view class="ri-bar" :style="{ height: s.mastery + '%' }" :class="masteryLevel(s.mastery)"></view>
          <text class="ri-label">{{ s.name }}</text>
          <text class="ri-value">{{ s.mastery }}%</text>
        </view>
      </view>
    </view>

    <!-- 科目列表 -->
    <view class="section">
      <text class="section-title">各科详情</text>
      <view v-for="s in subjects" :key="s.name" class="subject-card" @tap="goSubjectKnowledge(s)">
        <view class="sc-header">
          <view class="sc-dot" :class="masteryLevel(s.mastery)"></view>
          <text class="sc-name">{{ s.name }}</text>
          <text class="sc-mastery" :class="masteryLevel(s.mastery)">{{ s.mastery }}%</text>
        </view>
        <view class="sc-bar-bg">
          <view class="sc-bar-fill" :class="masteryLevel(s.mastery)" :style="{ width: s.mastery + '%' }"></view>
        </view>
        <view class="sc-knowledge">
          <view v-for="(k, idx) in s.points.slice(0, 3)" :key="idx" class="sk-item">
            <text class="sk-name">{{ k.name }}</text>
            <text class="sk-val" :class="masteryLevel(k.mastery)">{{ k.mastery }}%</text>
          </view>
        </view>
        <view class="sc-footer">
          <text class="sf-text">查看详细知识点</text>
          <view class="sf-arrow"></view>
        </view>
      </view>
    </view>

    <!-- 学习建议 -->
    <view class="advice-card">
      <text class="card-title">综合建议</text>
      <text class="advice-text">{{ overallAdvice }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const subjects = ref([
  { name: '数学', mastery: 78, points: [
    { name: '函数与导数', mastery: 85 }, { name: '三角函数', mastery: 72 },
    { name: '数列', mastery: 90 }, { name: '概率统计', mastery: 65 }, { name: '立体几何', mastery: 58 },
  ]},
  { name: '英语', mastery: 72, points: [
    { name: '语法填空', mastery: 80 }, { name: '阅读理解', mastery: 75 },
    { name: '虚拟语气', mastery: 55 }, { name: '写作', mastery: 68 },
  ]},
  { name: '物理', mastery: 65, points: [
    { name: '力学', mastery: 78 }, { name: '电磁学', mastery: 52 },
    { name: '光学', mastery: 70 }, { name: '热学', mastery: 60 },
  ]},
  { name: '化学', mastery: 82, points: [
    { name: '有机化学', mastery: 88 }, { name: '无机化学', mastery: 80 },
    { name: '化学平衡', mastery: 75 },
  ]},
  { name: '生物', mastery: 88, points: [
    { name: '遗传与进化', mastery: 92 }, { name: '细胞生物', mastery: 85 },
    { name: '生态学', mastery: 88 },
  ]},
]);

const overallAdvice = computed(() => {
  const weak = subjects.value.filter(s => s.mastery < 70);
  if (weak.length === 0) return '各科掌握程度均衡良好，建议继续巩固并尝试拓展提高。';
  const names = weak.map(s => s.name).join('、');
  return `${names} 的知识掌握度偏低，建议重点加强。可通过错题巩固卷和靶向练习有针对性地提升。`;
});

onLoad(() => {});

function radarStyle(idx: number) {
  return {};
}

function masteryLevel(m: number) {
  if (m >= 80) return 'good';
  if (m >= 60) return 'mid';
  return 'bad';
}

function goSubjectKnowledge(s: any) {
  const data = encodeURIComponent(JSON.stringify(s));
  uni.navigateTo({ url: `/pages/parent/report-detail/index?data=${data}` });
}
</script>

<style scoped>
.km-page {
  background: #0F1118;
  min-height: 100vh;
  padding: 24rpx 32rpx 40rpx;
}

.radar-card {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.card-title { font-size: 28rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 20rpx; }

.radar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 240rpx;
  padding: 0 12rpx;
}
.radar-item {
  display: flex; flex-direction: column; align-items: center; gap: 8rpx;
  flex: 1;
}
.ri-bar {
  width: 40rpx; border-radius: 8rpx 8rpx 0 0;
  min-height: 20rpx;
  transition: height 0.5s;
}
.ri-bar.good { background: linear-gradient(180deg, #34D399, #27B08B); }
.ri-bar.mid { background: linear-gradient(180deg, #FFBA4A, #E6A23C); }
.ri-bar.bad { background: linear-gradient(180deg, #FF6B6B, #E6574A); }
.ri-label { font-size: 22rpx; color: #8B92A5; }
.ri-value { font-size: 20rpx; font-weight: 700; color: #E8ECF4; }

.section {
  margin-bottom: 20rpx;
}
.section-title { font-size: 30rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 16rpx; }

.subject-card {
  background: #1A1D2E;
  border-radius: 20rpx;
  padding: 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 16rpx;
}
.sc-header { display: flex; align-items: center; gap: 12rpx; margin-bottom: 12rpx; }
.sc-dot { width: 12rpx; height: 12rpx; border-radius: 50%; }
.sc-dot.good { background: #34D399; }
.sc-dot.mid { background: #FFBA4A; }
.sc-dot.bad { background: #FF6B6B; }
.sc-name { font-size: 30rpx; font-weight: 700; color: #E8ECF4; flex: 1; }
.sc-mastery { font-size: 30rpx; font-weight: 800; }
.sc-mastery.good { color: #34D399; }
.sc-mastery.mid { color: #FFBA4A; }
.sc-mastery.bad { color: #FF6B6B; }

.sc-bar-bg { height: 8rpx; background: #242838; border-radius: 4rpx; overflow: hidden; margin-bottom: 16rpx; }
.sc-bar-fill { height: 100%; border-radius: 4rpx; }
.sc-bar-fill.good { background: #34D399; }
.sc-bar-fill.mid { background: #FFBA4A; }
.sc-bar-fill.bad { background: #FF6B6B; }

.sc-knowledge { display: flex; flex-wrap: wrap; gap: 12rpx; margin-bottom: 12rpx; }
.sk-item { display: flex; align-items: center; gap: 8rpx; background: #242838; padding: 8rpx 16rpx; border-radius: 10rpx; }
.sk-name { font-size: 22rpx; color: #8B92A5; }
.sk-val { font-size: 22rpx; font-weight: 700; }
.sk-val.good { color: #34D399; }
.sk-val.mid { color: #FFBA4A; }
.sk-val.bad { color: #FF6B6B; }

.sc-footer { display: flex; align-items: center; justify-content: center; gap: 6rpx; padding-top: 12rpx; border-top: 1rpx solid #2A2E3F; }
.sf-text { font-size: 24rpx; color: #5B7BFF; }
.sf-arrow { width: 12rpx; height: 12rpx; border-right: 2rpx solid #5B7BFF; border-top: 2rpx solid #5B7BFF; transform: rotate(45deg); }

.advice-card {
  background: rgba(91,123,255,0.06);
  border-radius: 20rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(91,123,255,0.15);
}
.advice-text { font-size: 26rpx; color: #8B92A5; line-height: 1.8; }
</style>
