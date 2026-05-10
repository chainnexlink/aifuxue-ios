<template>
  <view class="pk-page">
    <!-- 倒计时 & 进度 -->
    <view class="pk-header">
      <view class="timer">
        <text class="timer-num">{{ countdown }}</text>
        <text class="timer-label">秒</text>
      </view>
      <view class="progress-info">
        <text class="pi-text">第 {{ currentIndex + 1 }}/{{ questions.length }} 题</text>
      </view>
    </view>

    <view class="progress-bar">
      <view class="pb-fill" :style="{ width: ((currentIndex + 1) / questions.length) * 100 + '%' }"></view>
    </view>

    <!-- 题目区 -->
    <view class="question-card">
      <text class="q-subject">{{ currentQ.subject }}</text>
      <text class="q-text">{{ currentQ.question }}</text>

      <view class="options">
        <view
          v-for="(opt, idx) in currentQ.options"
          :key="idx"
          class="option-item"
          :class="{
            selected: selectedAnswer === idx,
            correct: submitted && idx === currentQ.correctIndex,
            wrong: submitted && selectedAnswer === idx && idx !== currentQ.correctIndex
          }"
          @tap="selectOption(idx)"
        >
          <text class="opt-letter">{{ ['A','B','C','D'][idx] }}</text>
          <text class="opt-text">{{ opt }}</text>
        </view>
      </view>
    </view>

    <!-- 对手状态 -->
    <view class="opponent-bar">
      <text class="ob-text">对手进度：{{ opponentProgress }}/{{ questions.length }}</text>
    </view>

    <!-- 提交/下一题 -->
    <view class="bottom-bar">
      <view v-if="!submitted" class="btn-primary submit-btn" :class="{ disabled: selectedAnswer === -1 }" @tap="submitAnswer">
        <text>确认答案</text>
      </view>
      <view v-else class="btn-primary submit-btn" @tap="nextQuestion">
        <text>{{ isLast ? '查看结果' : '下一题' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const groupId = ref('');
const questions = ref<any[]>([]);
const currentIndex = ref(0);
const selectedAnswer = ref(-1);
const submitted = ref(false);
const countdown = ref(120);
const opponentProgress = ref(0);
const answers = ref<any[]>([]);
let timer: ReturnType<typeof setInterval> | null = null;
let opTimer: ReturnType<typeof setInterval> | null = null;

const currentQ = computed(() => questions.value[currentIndex.value] || {});
const isLast = computed(() => currentIndex.value >= questions.value.length - 1);

onLoad((options) => {
  groupId.value = options?.groupId || '';
  questions.value = [
    { subject: '数学', question: '已知函数 f(x) = x³ - 3x + 1，则 f(x) 的极大值为?', options: ['3', '1', '-1', '-3'], correctIndex: 0 },
    { subject: '数学', question: '设等差数列 {aₙ} 的前 n 项和为 Sₙ，若 a₃ = 7，S₇ = 49，则公差 d =', options: ['1', '2', '3', '4'], correctIndex: 1 },
    { subject: '数学', question: '在△ABC中，若 a=2, b=√3, A=60°，则 B =', options: ['30°', '45°', '60°', '90°'], correctIndex: 1 },
    { subject: '数学', question: '若向量 a=(1,2)，b=(x,1)，且 a⊥b，则 x =', options: ['2', '-2', '1', '-1'], correctIndex: 1 },
    { subject: '数学', question: '函数 y=ln(x-1) 的定义域为', options: ['(0,+∞)', '(1,+∞)', '(-∞,1)', '[1,+∞)'], correctIndex: 1 },
  ];
  startTimer();
  startOpponentSimulation();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  if (opTimer) clearInterval(opTimer);
});

function startTimer() {
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      finishPk();
    }
  }, 1000);
}

function startOpponentSimulation() {
  opTimer = setInterval(() => {
    if (opponentProgress.value < questions.value.length) {
      opponentProgress.value++;
    }
  }, 8000 + Math.random() * 6000);
}

function selectOption(idx: number) {
  if (submitted.value) return;
  selectedAnswer.value = idx;
}

function submitAnswer() {
  if (selectedAnswer.value === -1) return;
  submitted.value = true;
  answers.value.push({
    questionIndex: currentIndex.value,
    selected: selectedAnswer.value,
    correct: currentQ.value.correctIndex,
    isCorrect: selectedAnswer.value === currentQ.value.correctIndex,
  });
}

function nextQuestion() {
  if (isLast.value) {
    finishPk();
    return;
  }
  currentIndex.value++;
  selectedAnswer.value = -1;
  submitted.value = false;
}

function finishPk() {
  if (timer) { clearInterval(timer); timer = null; }
  if (opTimer) { clearInterval(opTimer); opTimer = null; }
  const correctCount = answers.value.filter(a => a.isCorrect).length;
  const myScore = Math.round((correctCount / questions.value.length) * 100);
  const opponentScore = Math.floor(Math.random() * 40) + 50;
  const data = encodeURIComponent(JSON.stringify({
    myScore,
    opponentScore,
    correctCount,
    totalCount: questions.value.length,
    timeUsed: 120 - countdown.value,
    answers: answers.value,
    questions: questions.value,
  }));
  uni.redirectTo({ url: `/pages/group/pk-result/index?data=${data}&groupId=${groupId.value}` });
}
</script>

<style scoped>
.pk-page {
  background: #0F1118;
  min-height: 100vh;
  padding: 24rpx 32rpx 140rpx;
}

.pk-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.timer { display: flex; align-items: baseline; gap: 4rpx; }
.timer-num { font-size: 48rpx; font-weight: 800; color: #FF6B6B; }
.timer-label { font-size: 24rpx; color: #4D5466; }
.pi-text { font-size: 26rpx; color: #8B92A5; }

.progress-bar { height: 6rpx; background: #2A2E3F; border-radius: 3rpx; margin-bottom: 32rpx; overflow: hidden; }
.pb-fill { height: 100%; background: linear-gradient(90deg, #3D56C6, #5B7BFF); border-radius: 3rpx; transition: width 0.3s; }

.question-card {
  background: #1A1D2E;
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
  border: 1rpx solid #2A2E3F;
  margin-bottom: 20rpx;
}
.q-subject { font-size: 22rpx; color: #5B7BFF; background: rgba(91,123,255,0.15); padding: 4rpx 16rpx; border-radius: 8rpx; display: inline-block; margin-bottom: 16rpx; }
.q-text { font-size: 30rpx; font-weight: 600; color: #E8ECF4; display: block; margin-bottom: 24rpx; line-height: 1.6; }

.options { display: flex; flex-direction: column; gap: 12rpx; }
.option-item {
  display: flex; align-items: center; gap: 16rpx;
  background: #242838; border-radius: 16rpx; padding: 24rpx 20rpx;
  border: 2rpx solid transparent; transition: all 0.2s;
}
.option-item.selected { border-color: #5B7BFF; background: rgba(91,123,255,0.1); }
.option-item.correct { border-color: #34D399; background: rgba(52,211,153,0.1); }
.option-item.wrong { border-color: #FF6B6B; background: rgba(255,107,107,0.1); }
.opt-letter {
  width: 44rpx; height: 44rpx; border-radius: 50%;
  background: #2A2E3F; display: flex; align-items: center; justify-content: center;
  font-size: 24rpx; font-weight: 700; color: #8B92A5; flex-shrink: 0;
  text-align: center; line-height: 44rpx;
}
.option-item.selected .opt-letter { background: #5B7BFF; color: #FFF; }
.option-item.correct .opt-letter { background: #34D399; color: #FFF; }
.option-item.wrong .opt-letter { background: #FF6B6B; color: #FFF; }
.opt-text { font-size: 28rpx; color: #E8ECF4; flex: 1; }

.opponent-bar {
  background: rgba(255,186,74,0.08);
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  text-align: center;
  border: 1rpx solid rgba(255,186,74,0.15);
}
.ob-text { font-size: 24rpx; color: #FFBA4A; }

.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: linear-gradient(transparent, #0F1118 30%);
}
.submit-btn { padding: 28rpx 0; }
.submit-btn.disabled { opacity: 0.4; }
</style>
