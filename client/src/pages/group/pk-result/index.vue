<template>
  <view class="result-page">
    <!-- 胜负结果 -->
    <view class="result-hero" :class="won ? 'win' : 'lose'">
      <text class="rh-emoji">{{ won ? '🏆' : '💪' }}</text>
      <text class="rh-text">{{ won ? '你赢了！' : '继续加油！' }}</text>
    </view>

    <!-- 分数对比 -->
    <view class="score-compare">
      <view class="sc-side">
        <text class="sc-label">我的得分</text>
        <text class="sc-num my">{{ data.myScore }}</text>
      </view>
      <view class="sc-vs">
        <text class="vs-text">VS</text>
      </view>
      <view class="sc-side">
        <text class="sc-label">对手得分</text>
        <text class="sc-num op">{{ data.opponentScore }}</text>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="stats-card">
      <view class="stat-row">
        <text class="sr-label">正确率</text>
        <text class="sr-value">{{ data.correctCount }}/{{ data.totalCount }}</text>
      </view>
      <view class="stat-row">
        <text class="sr-label">用时</text>
        <text class="sr-value">{{ data.timeUsed }}秒</text>
      </view>
      <view class="stat-row">
        <text class="sr-label">平均每题</text>
        <text class="sr-value">{{ avgTime }}秒</text>
      </view>
    </view>

    <!-- 答题详情 -->
    <view class="section">
      <text class="section-title">答题详情</text>
      <view v-for="(ans, idx) in data.answers" :key="idx" class="answer-item" @tap="viewAnalysis(idx)">
        <view class="ai-num" :class="ans.isCorrect ? 'correct' : 'wrong'">
          <text class="ai-num-text">{{ idx + 1 }}</text>
        </view>
        <view class="ai-info">
          <text class="ai-q">{{ getQuestion(idx) }}</text>
          <text class="ai-status" :class="ans.isCorrect ? 'correct' : 'wrong'">{{ ans.isCorrect ? '正确' : '错误' }}</text>
        </view>
        <view class="ai-arrow"></view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-btns">
      <view class="retry-btn" @tap="retryPk">
        <text class="rb-text">再来一局</text>
      </view>
      <view class="btn-primary back-btn" @tap="goBack">
        <text>返回小组</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const data = ref<any>({ myScore: 0, opponentScore: 0, correctCount: 0, totalCount: 0, timeUsed: 0, answers: [], questions: [] });
const groupId = ref('');

onLoad((options) => {
  groupId.value = options?.groupId || '';
  if (options?.data) {
    try { data.value = JSON.parse(decodeURIComponent(options.data)); } catch {}
  }
});

const won = computed(() => data.value.myScore > data.value.opponentScore);
const avgTime = computed(() => {
  if (data.value.totalCount === 0) return 0;
  return Math.round(data.value.timeUsed / data.value.totalCount);
});

function getQuestion(idx: number) {
  const q = data.value.questions?.[idx];
  if (!q) return `第${idx + 1}题`;
  return q.question?.length > 20 ? q.question.slice(0, 20) + '...' : q.question;
}

function viewAnalysis(idx: number) {
  const ans = data.value.answers[idx];
  const q = data.value.questions?.[idx];
  const analysisData = encodeURIComponent(JSON.stringify({
    question: q,
    answer: ans,
    source: 'pk',
  }));
  uni.navigateTo({ url: `/pages/exercise/analysis/index?data=${analysisData}` });
}

function retryPk() {
  uni.redirectTo({ url: `/pages/group/pk/index?groupId=${groupId.value}` });
}

function goBack() {
  uni.navigateBack({ delta: 3 });
}
</script>

<style scoped>
.result-page {
  background: #0F1118;
  min-height: 100vh;
  padding: 0 32rpx 140rpx;
}

.result-hero { text-align: center; padding: 60rpx 0 40rpx; }
.result-hero .rh-emoji { font-size: 80rpx; display: block; margin-bottom: 12rpx; }
.result-hero.win .rh-text { font-size: 40rpx; font-weight: 800; color: #34D399; }
.result-hero.lose .rh-text { font-size: 40rpx; font-weight: 800; color: #FFBA4A; }

.score-compare {
  display: flex; align-items: center; justify-content: center; gap: 24rpx;
  background: #1A1D2E; border-radius: 24rpx; padding: 32rpx;
  border: 1rpx solid #2A2E3F; margin-bottom: 20rpx;
}
.sc-side { text-align: center; flex: 1; }
.sc-label { font-size: 24rpx; color: #4D5466; display: block; margin-bottom: 8rpx; }
.sc-num { font-size: 56rpx; font-weight: 800; }
.sc-num.my { color: #5B7BFF; }
.sc-num.op { color: #FF6B6B; }
.sc-vs { }
.vs-text { font-size: 28rpx; font-weight: 700; color: #4D5466; }

.stats-card {
  background: #1A1D2E; border-radius: 20rpx; padding: 24rpx;
  border: 1rpx solid #2A2E3F; margin-bottom: 20rpx;
}
.stat-row { display: flex; justify-content: space-between; padding: 12rpx 0; border-bottom: 1rpx solid #2A2E3F; }
.stat-row:last-child { border-bottom: none; }
.sr-label { font-size: 26rpx; color: #8B92A5; }
.sr-value { font-size: 26rpx; font-weight: 600; color: #E8ECF4; }

.section {
  background: #1A1D2E; border-radius: 24rpx; padding: 24rpx;
  border: 1rpx solid #2A2E3F; margin-bottom: 20rpx;
}
.section-title { font-size: 30rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 20rpx; }

.answer-item {
  display: flex; align-items: center; gap: 16rpx;
  padding: 16rpx 0; border-bottom: 1rpx solid #2A2E3F;
}
.answer-item:last-child { border-bottom: none; }
.ai-num {
  width: 44rpx; height: 44rpx; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ai-num.correct { background: rgba(52,211,153,0.15); }
.ai-num.wrong { background: rgba(255,107,107,0.15); }
.ai-num-text { font-size: 24rpx; font-weight: 700; color: #E8ECF4; }
.ai-info { flex: 1; }
.ai-q { font-size: 26rpx; color: #E8ECF4; display: block; }
.ai-status { font-size: 22rpx; font-weight: 600; display: block; margin-top: 4rpx; }
.ai-status.correct { color: #34D399; }
.ai-status.wrong { color: #FF6B6B; }
.ai-arrow { width: 12rpx; height: 12rpx; border-right: 2rpx solid #4D5466; border-top: 2rpx solid #4D5466; transform: rotate(45deg); flex-shrink: 0; }

.bottom-btns {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; gap: 16rpx; padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: linear-gradient(transparent, #0F1118 30%);
}
.retry-btn { flex: 1; background: rgba(91,123,255,0.15); border-radius: 16rpx; padding: 28rpx 0; text-align: center; }
.rb-text { font-size: 30rpx; color: #5B7BFF; font-weight: 600; }
.back-btn { flex: 1; padding: 28rpx 0; }
</style>
