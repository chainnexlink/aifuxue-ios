<template>
  <view class="consolidation-page">
    <view class="header-card">
      <text class="hc-title">错题巩固卷</text>
      <text class="hc-desc">基于错题本中的高频错题，AI 生成专项强化练习</text>
    </view>

    <!-- 筛选 -->
    <view class="filter-card">
      <text class="card-title">选择科目</text>
      <view class="subject-chips">
        <view v-for="s in subjects" :key="s" class="chip" :class="{ active: selectedSubject === s }" @tap="selectedSubject = s">
          <text class="chip-text">{{ s }}</text>
        </view>
      </view>
    </view>

    <view class="filter-card">
      <text class="card-title">难度偏好</text>
      <view class="subject-chips">
        <view v-for="d in difficulties" :key="d.value" class="chip" :class="{ active: selectedDiff === d.value }" @tap="selectedDiff = d.value">
          <text class="chip-text">{{ d.label }}</text>
        </view>
      </view>
    </view>

    <view class="filter-card">
      <text class="card-title">题目数量</text>
      <view class="subject-chips">
        <view v-for="n in counts" :key="n" class="chip" :class="{ active: selectedCount === n }" @tap="selectedCount = n">
          <text class="chip-text">{{ n }}题</text>
        </view>
      </view>
    </view>

    <!-- 错题预览 -->
    <view class="preview-card">
      <text class="card-title">将从以下错题中出题</text>
      <view v-for="(m, idx) in filteredMistakes" :key="idx" class="preview-item">
        <view class="pi-dot" :class="m.difficulty"></view>
        <text class="pi-text">{{ m.question }}</text>
        <text class="pi-count">错{{ m.errorCount }}次</text>
      </view>
      <view v-if="filteredMistakes.length === 0" class="empty-hint">
        <text class="empty-text">该科目暂无错题</text>
      </view>
    </view>

    <view class="btn-primary generate-btn" @tap="generatePaper">
      <text>生成巩固卷</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { tryPlayAd, AD_UNIT_IDS } from '@/utils/ad-reward';

const subjects = ['数学', '英语', '物理', '化学', '生物'];
const difficulties = [
  { label: '基础', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '困难', value: 'hard' },
  { label: '混合', value: 'mix' },
];
const counts = [5, 10, 15, 20];
const selectedSubject = ref('数学');
const selectedDiff = ref('mix');
const selectedCount = ref(10);

const allMistakes = ref([
  { question: '已知 f(x)=x³-3x，求极值', subject: '数学', difficulty: 'medium', errorCount: 3 },
  { question: '等差数列求前n项和', subject: '数学', difficulty: 'easy', errorCount: 5 },
  { question: '导数应用：切线方程', subject: '数学', difficulty: 'hard', errorCount: 2 },
  { question: '三角函数恒等变换', subject: '数学', difficulty: 'medium', errorCount: 4 },
  { question: '虚拟语气主从句搭配', subject: '英语', difficulty: 'medium', errorCount: 6 },
  { question: '定语从句关系词选择', subject: '英语', difficulty: 'easy', errorCount: 3 },
  { question: '力的分解与合成', subject: '物理', difficulty: 'medium', errorCount: 4 },
]);

const filteredMistakes = computed(() => {
  return allMistakes.value.filter(m => m.subject === selectedSubject.value);
});

async function generatePaper() {
  const mistakes = filteredMistakes.value.slice(0, selectedCount.value);
  if (mistakes.length === 0) {
    uni.showToast({ title: '该科目暂无错题', icon: 'none' });
    return;
  }
  const ok = await tryPlayAd(AD_UNIT_IDS.MISTAKE_EXPORT, '错题巩固卷');
  if (!ok) return;
  uni.navigateTo({ url: `/pages/exercise/index?noteId=consolidation&subject=${selectedSubject.value}` });
}
</script>

<style scoped>
.consolidation-page {
  background: #0F1118;
  min-height: 100vh;
  padding: 24rpx 32rpx 40rpx;
}

.header-card {
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  border-radius: 24rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 20rpx;
}
.hc-title { font-size: 36rpx; font-weight: 800; color: #FFF; display: block; margin-bottom: 8rpx; }
.hc-desc { font-size: 26rpx; color: rgba(255,255,255,0.7); }

.filter-card, .preview-card {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 16rpx;
}
.card-title { font-size: 28rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 16rpx; }

.subject-chips { display: flex; flex-wrap: wrap; gap: 12rpx; }
.chip {
  padding: 12rpx 28rpx; border-radius: 24rpx;
  background: #242838; border: 1rpx solid #2A2E3F;
}
.chip.active { background: rgba(91,123,255,0.15); border-color: #5B7BFF; }
.chip-text { font-size: 26rpx; color: #8B92A5; }
.chip.active .chip-text { color: #5B7BFF; font-weight: 600; }

.preview-item {
  display: flex; align-items: center; gap: 12rpx;
  padding: 14rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.preview-item:last-child { border-bottom: none; }
.pi-dot { width: 12rpx; height: 12rpx; border-radius: 50%; flex-shrink: 0; }
.pi-dot.easy { background: #34D399; }
.pi-dot.medium { background: #FFBA4A; }
.pi-dot.hard { background: #FF6B6B; }
.pi-text { font-size: 26rpx; color: #E8ECF4; flex: 1; }
.pi-count { font-size: 22rpx; color: #FF6B6B; flex-shrink: 0; }

.empty-hint { padding: 40rpx 0; text-align: center; }
.empty-text { font-size: 26rpx; color: #4D5466; }

.generate-btn { padding: 28rpx 0; margin-top: 12rpx; }
</style>
