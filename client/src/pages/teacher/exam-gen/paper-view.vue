<template>
  <view class="page">
    <!-- 试卷头部信息 -->
    <view class="paper-header">
      <text class="paper-title">{{ paperData.title }}</text>
      <view class="paper-meta">
        <text class="meta-item">{{ paperData.type }} · {{ paperData.tab }}卷</text>
        <text class="meta-item">共{{ paperData.count }}题 · {{ paperData.totalScore }}分</text>
      </view>
      <text class="paper-time">生成时间：{{ paperData.time }}</text>
    </view>

    <!-- 题目列表 -->
    <view class="questions-area">
      <view v-for="(q, idx) in paperData.questions" :key="idx" class="q-block">
        <view class="q-title-row">
          <text class="q-number">{{ idx + 1 }}.</text>
          <text class="q-type-badge">{{ q.type }}</text>
          <text class="q-score-badge">{{ q.score }}分</text>
        </view>
        <text class="q-text">{{ q.content }}</text>
        <view v-if="q.options && q.options.length" class="q-opts">
          <text v-for="(opt, oi) in q.options" :key="oi" class="q-opt-item">{{ optLabels[oi] }}. {{ opt }}</text>
        </view>

        <!-- 答案区域（可切换显示） -->
        <view v-if="showAnswers" class="answer-block">
          <text class="ans-label">答案：</text>
          <text class="ans-value">{{ formatAnswer(q.answer) }}</text>
        </view>
        <view v-if="showAnswers && q.analysis" class="analysis-block">
          <text class="analysis-label">解析：</text>
          <text class="analysis-text">{{ q.analysis }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-bar">
      <view class="toggle-btn" @tap="showAnswers = !showAnswers">
        <text class="toggle-text">{{ showAnswers ? '隐藏答案' : '显示答案' }}</text>
      </view>
      <view class="action-btn-row">
        <view class="act-btn" @tap="handleCopy">
          <text class="act-text">复制内容</text>
        </view>
        <view class="act-btn primary" @tap="handleShare">
          <text class="act-text-w">分享文件</text>
        </view>
      </view>
    </view>

    <view style="height: 200rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const optLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
const showAnswers = ref(false);

interface QuestionData {
  type: string;
  content: string;
  options?: string[];
  answer?: string | string[];
  analysis?: string;
  score: number;
  difficulty: string;
}

const paperData = ref<{
  title: string;
  type: string;
  tab: string;
  count: number;
  totalScore: number;
  time: string;
  format: string;
  questions: QuestionData[];
}>({
  title: '',
  type: '',
  tab: '',
  count: 0,
  totalScore: 0,
  time: '',
  format: '',
  questions: [],
});

onLoad(() => {
  // 从本地存储读取生成的试卷数据
  try {
    const data = uni.getStorageSync('exam_export_data');
    if (data) {
      paperData.value = JSON.parse(data);
    }
  } catch {}
});

function formatAnswer(answer: string | string[] | undefined): string {
  if (!answer) return '（无）';
  if (Array.isArray(answer)) return answer.join(', ');
  return answer;
}

function handleCopy() {
  let text = `${paperData.value.title}\n${paperData.value.type} · ${paperData.value.tab}卷\n共${paperData.value.count}题，满分${paperData.value.totalScore}分\n\n`;

  paperData.value.questions.forEach((q, idx) => {
    text += `${idx + 1}. [${q.type}] (${q.score}分)\n${q.content}\n`;
    if (q.options && q.options.length) {
      q.options.forEach((opt, oi) => {
        text += `  ${optLabels[oi]}. ${opt}\n`;
      });
    }
    if (showAnswers.value) {
      text += `  答案：${formatAnswer(q.answer)}\n`;
      if (q.analysis) text += `  解析：${q.analysis}\n`;
    }
    text += '\n';
  });

  uni.setClipboardData({
    data: text,
    success: () => uni.showToast({ title: '已复制到剪贴板', icon: 'success' }),
  });
}

function handleShare() {
  // #ifdef MP-WEIXIN
  uni.showToast({ title: '请使用右上角"..."分享', icon: 'none' });
  // #endif
  // #ifndef MP-WEIXIN
  uni.showToast({ title: '分享功能暂不支持当前平台', icon: 'none' });
  // #endif
}
</script>

<style scoped>
.page {
  --c-bg: #0F1118;
  --c-card: #1A1D2E;
  --c-primary: #5B7BFF;
  --c-t1: #E8ECF4;
  --c-t2: #8B92A5;
  --c-t3: #4D5466;
  --c-border: #2A2E3F;
  padding: 32rpx;
  background: var(--c-bg);
  min-height: 100vh;
  box-sizing: border-box;
}

.paper-header {
  background: var(--c-card);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid var(--c-border);
  text-align: center;
}
.paper-title {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--c-t1);
  display: block;
  margin-bottom: 12rpx;
}
.paper-meta {
  display: flex;
  justify-content: center;
  gap: 24rpx;
  margin-bottom: 8rpx;
}
.meta-item {
  font-size: 24rpx;
  color: var(--c-primary);
  font-weight: 600;
}
.paper-time {
  font-size: 22rpx;
  color: var(--c-t3);
}

.questions-area {
  background: var(--c-card);
  border-radius: 24rpx;
  padding: 28rpx;
  border: 1rpx solid var(--c-border);
}

.q-block {
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--c-border);
}
.q-block:last-child {
  border-bottom: none;
}
.q-title-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}
.q-number {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--c-primary);
}
.q-type-badge {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  background: rgba(91,123,255,0.1);
  color: var(--c-primary);
}
.q-score-badge {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  background: rgba(255,186,74,0.1);
  color: #FFBA4A;
}
.q-text {
  font-size: 28rpx;
  color: var(--c-t1);
  line-height: 1.7;
  display: block;
  margin-bottom: 12rpx;
}
.q-opts {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 12rpx;
  padding-left: 16rpx;
}
.q-opt-item {
  font-size: 26rpx;
  color: var(--c-t2);
  line-height: 1.6;
}

.answer-block {
  display: flex;
  gap: 8rpx;
  margin-top: 12rpx;
  padding: 12rpx 16rpx;
  background: rgba(52,211,153,0.08);
  border-radius: 10rpx;
}
.ans-label {
  font-size: 24rpx;
  color: var(--c-t3);
  white-space: nowrap;
}
.ans-value {
  font-size: 24rpx;
  color: #34D399;
  font-weight: 600;
}

.analysis-block {
  margin-top: 8rpx;
  padding: 12rpx 16rpx;
  background: rgba(91,123,255,0.05);
  border-radius: 10rpx;
}
.analysis-label {
  font-size: 22rpx;
  color: var(--c-t3);
  display: block;
  margin-bottom: 4rpx;
}
.analysis-text {
  font-size: 24rpx;
  color: var(--c-t2);
  line-height: 1.6;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: var(--c-bg);
  border-top: 1rpx solid var(--c-border);
}
.toggle-btn {
  text-align: center;
  margin-bottom: 16rpx;
}
.toggle-text {
  font-size: 26rpx;
  color: var(--c-primary);
  font-weight: 600;
}
.action-btn-row {
  display: flex;
  gap: 16rpx;
}
.act-btn {
  flex: 1;
  text-align: center;
  padding: 22rpx;
  border-radius: 14rpx;
  background: var(--c-card);
  border: 1rpx solid var(--c-border);
}
.act-btn.primary {
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  border: none;
}
.act-text {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--c-t2);
}
.act-text-w {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFF;
}
</style>
