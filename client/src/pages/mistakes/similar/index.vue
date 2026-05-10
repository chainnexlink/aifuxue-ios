<template>
  <view class="similar-page">
    <view v-if="loading" class="loading-state">
      <text>正在生成同类变式题...</text>
    </view>

    <template v-else>
      <text class="page-title">同类变式题</text>

      <view v-for="(q, idx) in questions" :key="idx" class="question-card card">
        <text class="q-num">第{{ idx + 1 }}题</text>
        <text class="q-text">{{ q.question }}</text>

        <view v-if="q.type === 'choice'" class="options">
          <view
            v-for="(opt, oi) in q.options" :key="oi"
            class="option-item"
            :class="{ selected: answers[idx] === oi, correct: submitted && oi === q.correctIndex, wrong: submitted && answers[idx] === oi && oi !== q.correctIndex }"
            @tap="!submitted && selectAnswer(idx, oi)"
          >
            <text class="opt-label">{{ ['A','B','C','D'][oi] }}</text>
            <text>{{ opt }}</text>
          </view>
        </view>

        <view v-if="q.type === 'fill'">
          <input v-model="fillAnswers[idx]" placeholder="请输入答案" class="fill-input" :disabled="submitted" />
        </view>
      </view>

      <view v-if="!submitted" class="btn-primary" @tap="submitAnswers">
        <text>提交答案</text>
      </view>

      <view v-if="submitted" class="result-area card">
        <text class="result-text">答对 {{ correctCount }} / {{ questions.length }} 题</text>
        <view class="btn-primary" @tap="viewAnswerKey">
          <text>查看答案解析（需家长密码）</text>
        </view>
        <view class="btn-secondary" style="margin-top: 16rpx;" @tap="goBack">
          <text>返回错题详情</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const mistakeId = ref('');
const loading = ref(true);
const submitted = ref(false);
const correctCount = ref(0);
const answers = ref<Record<number, number>>({});
const fillAnswers = ref<Record<number, string>>({});

const questions = ref([
  { type: 'choice', question: '函数g(x)=2x^3-6x+5的极小值点是？', options: ['x=0', 'x=1', 'x=-1', 'x=2'], correctIndex: 1 },
  { type: 'choice', question: '函数h(x)=x^3-12x在哪个区间递减？', options: ['(-2,2)', '(-∞,-2)', '(2,+∞)', '(-∞,+∞)'], correctIndex: 0 },
  { type: 'fill', question: '函数f(x)=x^4-2x^2的极值点有____个。', correctAnswer: '3', correctIndex: -1 },
]);

onLoad((options) => {
  if (options?.mistakeId) mistakeId.value = options.mistakeId;
  setTimeout(() => { loading.value = false; }, 1500);
});

function selectAnswer(qIdx: number, optIdx: number) {
  answers.value[qIdx] = optIdx;
}

function submitAnswers() {
  let correct = 0;
  questions.value.forEach((q, i) => {
    if (q.type === 'fill') {
      if (fillAnswers.value[i]?.trim() === (q as any).correctAnswer) correct++;
    } else {
      if (answers.value[i] === q.correctIndex) correct++;
    }
  });
  correctCount.value = correct;
  submitted.value = true;
}

function viewAnswerKey() {
  uni.navigateTo({ url: `/pages/exercise/result/index?score=${correctCount.value * 10}` });
}

function goBack() { uni.navigateBack(); }
</script>

<style scoped>
.similar-page { padding: 24rpx; background: #0F1118; min-height: 100vh; }
.loading-state { text-align: center; padding: 200rpx 0; color: #4D5466; font-size: 30rpx; }
.page-title { font-size: 36rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 24rpx; }

.question-card { margin-bottom: 20rpx; }
.q-num { font-size: 24rpx; color: #5B7BFF; font-weight: 600; display: block; margin-bottom: 12rpx; }
.q-text { font-size: 30rpx; color: #E8ECF4; line-height: 1.6; display: block; margin-bottom: 20rpx; }

.options { display: flex; flex-direction: column; gap: 12rpx; }
.option-item { display: flex; align-items: center; gap: 12rpx; padding: 20rpx; border: 2rpx solid #2A2E3F; border-radius: 12rpx; font-size: 28rpx; color: #8B92A5; }
.option-item.selected { border-color: #5B7BFF; background: rgba(91,123,255,0.15); }
.option-item.correct { border-color: #34D399; background: rgba(52,211,153,0.15); }
.option-item.wrong { border-color: #FF6B6B; background: rgba(255,107,107,0.15); }
.opt-label { width: 44rpx; height: 44rpx; border-radius: 50%; background: #242838; display: flex; align-items: center; justify-content: center; font-size: 24rpx; font-weight: 600; flex-shrink: 0; color: #8B92A5; }

.fill-input { background: #242838; border-radius: 12rpx; padding: 24rpx; font-size: 30rpx; color: #E8ECF4; }

.result-area { text-align: center; margin-top: 30rpx; padding: 40rpx; }
.result-text { font-size: 36rpx; font-weight: 700; color: #5B7BFF; display: block; margin-bottom: 30rpx; }
</style>
