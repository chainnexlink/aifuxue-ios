<template>
  <view class="result-page">
    <!-- 家长密码验证 -->
    <view v-if="!verified" class="verify-area card">
      <view class="lock-icon-wrap">
        <image src="/static/icons/lock.svg" class="lock-icon-img" mode="aspectFit" />
      </view>
      <text class="verify-title">查看答案需要家长验证</text>
      <text class="verify-desc">得分：{{ score }} 分</text>
      <view class="password-input-area">
        <text class="input-label">请输入家长密码</text>
        <input v-model="password" type="number" maxlength="6" password placeholder="4-6位数字密码" class="input-field" />
      </view>
      <view class="btn-primary" @tap="verifyPassword">
        <text>验证密码</text>
      </view>
      <view class="btn-secondary" style="margin-top: 20rpx;" @tap="goBack">
        <text>返回</text>
      </view>
    </view>

    <!-- 答案解析 -->
    <view v-else class="answers-area">
      <view class="score-header card">
        <text class="big-score">{{ score }}</text>
        <text class="score-label">本次得分</text>
      </view>

      <view v-for="(q, idx) in answers" :key="idx" class="answer-card card" @tap="goAnalysis(q, idx)">
        <view class="answer-header">
          <text class="q-num">第{{ idx + 1 }}题</text>
          <text :class="['q-status', q.isCorrect ? 'correct' : 'wrong']">
            {{ q.isCorrect ? '正确' : '错误' }}
          </text>
        </view>
        <text class="q-text">{{ q.question }}</text>
        <text class="q-answer">正确答案：{{ q.correctAnswer }}</text>
        <view class="q-detail-hint">
          <text class="qdh-text">点击查看详细分析</text>
          <view class="qdh-arrow"></view>
        </view>
      </view>

      <view class="bottom-actions">
        <view class="btn-secondary" @tap="goBack">
          <text>返回笔记</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { parentApi } from '@/utils/api';

const exerciseId = ref('');
const score = ref('0');
const password = ref('');
const verified = ref(false);

const answers = ref<Array<{ question: string; correctAnswer: string; isCorrect: boolean; explanation: string }>>([]);

onLoad((options) => {
  if (options?.exerciseId) exerciseId.value = options.exerciseId;
  if (options?.score) score.value = options.score;
});

async function verifyPassword() {
  if (password.value.length < 4) {
    uni.showToast({ title: '请输入完整密码', icon: 'none' });
    return;
  }
  try {
    const res = await parentApi.verifyPassword(password.value);
    uni.setStorageSync('parentToken', res.token);
    verified.value = true;
  } catch {
    uni.showToast({ title: '密码错误', icon: 'none' });
  }
}

function goBack() {
  const pages = getCurrentPages();
  if (pages.length > 2) {
    uni.navigateBack({ delta: 2 });
  } else {
    uni.switchTab({ url: '/pages/home/index' });
  }
}

function goAnalysis(q: any, idx: number) {
  const data = encodeURIComponent(JSON.stringify({
    question: { question: q.question, options: ['A', 'B', 'C', 'D'], correctIndex: 0, subject: '' },
    answer: { selected: q.isCorrect ? 0 : 1, isCorrect: q.isCorrect },
    source: 'exercise',
  }));
  uni.navigateTo({ url: `/pages/exercise/analysis/index?data=${data}` });
}
</script>

<style scoped>
.result-page {
  padding: 24rpx 32rpx;
  background: #0F1118;
  min-height: 100vh;
}

.card {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 36rpx 28rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}

.verify-area { text-align: center; padding: 60rpx 40rpx; }
.lock-icon-wrap {
  width: 100rpx;
  height: 100rpx;
  background: rgba(255,186,74,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28rpx;
}
.lock-icon-img {
  width: 48rpx;
  height: 48rpx;
}
.verify-title { font-size: 36rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 12rpx; }
.verify-desc { font-size: 28rpx; color: #5B7BFF; display: block; margin-bottom: 40rpx; font-weight: 600; }
.password-input-area { text-align: left; margin-bottom: 30rpx; }
.input-label { font-size: 28rpx; color: #8B92A5; margin-bottom: 12rpx; display: block; }
.input-field { background: #242838; border-radius: 14rpx; padding: 24rpx; font-size: 30rpx; color: #E8ECF4; }

.btn-primary {
  background: linear-gradient(145deg, #3D56C6, #5B7BFF);
  color: #FFF;
  text-align: center;
  padding: 24rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 16rpx rgba(91,123,255,0.3);
}

.btn-secondary {
  text-align: center;
  padding: 24rpx;
  color: #5B7BFF;
  font-size: 30rpx;
  background: transparent;
  border-radius: 16rpx;
  border: 2rpx solid #5B7BFF;
}

.score-header { text-align: center; margin-bottom: 24rpx; padding: 48rpx; }
.big-score { font-size: 80rpx; font-weight: 800; color: #5B7BFF; display: block; line-height: 1; margin-bottom: 8rpx; }
.score-label { font-size: 26rpx; color: #4D5466; }

.answer-card { margin-bottom: 16rpx; }
.answer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.q-num { font-size: 28rpx; font-weight: 600; color: #E8ECF4; }
.q-status { font-size: 24rpx; padding: 6rpx 18rpx; border-radius: 10rpx; font-weight: 600; }
.q-status.correct { color: #34D399; background: rgba(52,211,153,0.15); }
.q-status.wrong { color: #FF6B6B; background: rgba(255,107,107,0.15); }
.q-text { font-size: 30rpx; color: #E8ECF4; line-height: 1.6; display: block; margin-bottom: 12rpx; }
.q-answer { font-size: 28rpx; color: #5B7BFF; display: block; margin-bottom: 8rpx; font-weight: 500; }
.q-detail-hint { display: flex; align-items: center; justify-content: center; gap: 6rpx; margin-top: 12rpx; padding-top: 12rpx; border-top: 1rpx solid #2A2E3F; }
.qdh-text { font-size: 24rpx; color: #5B7BFF; }
.qdh-arrow { width: 12rpx; height: 12rpx; border-right: 2rpx solid #5B7BFF; border-top: 2rpx solid #5B7BFF; transform: rotate(45deg); }

.bottom-actions { margin-top: 40rpx; }
</style>
