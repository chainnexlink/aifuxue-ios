<template>
  <view class="exercise-page">
    <view v-if="loading" class="loading-state">
      <text>正在生成练习题...</text>
    </view>

    <template v-else-if="questions.length > 0">
      <!-- 进度条 -->
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: `${((currentIndex + 1) / questions.length) * 100}%` }" />
      </view>
      <text class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</text>

      <!-- 当前题目 -->
      <view class="question-card card">
        <text class="question-type">{{ currentQuestion.type === 'choice' ? '选择题' : currentQuestion.type === 'fill' ? '填空题' : '判断题' }}</text>
        <text class="question-text">{{ currentQuestion.question }}</text>

        <!-- 选择题 -->
        <view v-if="currentQuestion.type === 'choice'" class="options">
          <view
            v-for="(opt, idx) in currentQuestion.options"
            :key="idx"
            class="option-item"
            :class="{
              selected: answers[currentIndex] === idx,
              correct: submitted && idx === currentQuestion.correctIndex,
              wrong: submitted && answers[currentIndex] === idx && idx !== currentQuestion.correctIndex
            }"
            @tap="!submitted && selectOption(idx)"
          >
            <text class="option-label">{{ ['A', 'B', 'C', 'D'][idx] }}</text>
            <text class="option-text">{{ opt }}</text>
          </view>
        </view>

        <!-- 填空题 -->
        <view v-if="currentQuestion.type === 'fill'" class="fill-area">
          <input v-model="fillAnswers[currentIndex]" placeholder="请输入答案" class="fill-input" :disabled="submitted" />
        </view>

        <!-- 判断题 -->
        <view v-if="currentQuestion.type === 'judge'" class="judge-area">
          <view class="judge-btn" :class="{ selected: answers[currentIndex] === 1, correct: submitted && currentQuestion.correctIndex === 1 }" @tap="!submitted && selectOption(1)">
            <text>对 ✓</text>
          </view>
          <view class="judge-btn" :class="{ selected: answers[currentIndex] === 0, correct: submitted && currentQuestion.correctIndex === 0 }" @tap="!submitted && selectOption(0)">
            <text>错 ✗</text>
          </view>
        </view>
      </view>

      <!-- 导航按钮 -->
      <view class="nav-btns">
        <view v-if="currentIndex > 0" class="btn-secondary nav-btn" @tap="prevQuestion">
          <text>上一题</text>
        </view>
        <view v-if="currentIndex < questions.length - 1" class="btn-primary nav-btn" @tap="nextQuestion">
          <text>下一题</text>
        </view>
        <view v-else-if="!submitted" class="btn-primary nav-btn submit" @tap="submitExercise">
          <text>提交答案</text>
        </view>
      </view>

      <!-- 提交后 -->
      <view v-if="submitted" class="result-area card">
        <text class="result-score">得分：{{ score }} / {{ questions.length * 10 }}</text>
        <text class="result-hint">查看答案和解析需要家长密码验证</text>
        <view class="btn-primary" @tap="goViewAnswers">
          <text>查看答案解析</text>
        </view>
        <view class="btn-secondary" style="margin-top: 20rpx;" @tap="goBack">
          <text>返回笔记</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { request } from '@/utils/request';

const noteId = ref('');
const loading = ref(true);
const questions = ref<any[]>([]);
const currentIndex = ref(0);
const answers = ref<Record<number, number>>({});
const fillAnswers = ref<Record<number, string>>({});
const submitted = ref(false);
const score = ref(0);
const exerciseId = ref('');

const currentQuestion = computed(() => questions.value[currentIndex.value] || {});

onLoad((options) => {
  if (options?.noteId) {
    noteId.value = options.noteId;
    generateExercise();
  }
  if (options?.exerciseId) {
    exerciseId.value = options.exerciseId;
    loadExercise();
  }
});

async function generateExercise() {
  loading.value = true;
  try {
    const res = await request({
      url: '/exercises/generate',
      method: 'POST',
      data: { noteId: noteId.value },
    });
    exerciseId.value = res.id;
    questions.value = res.questions || getMockQuestions();
  } catch {
    questions.value = getMockQuestions();
  } finally {
    loading.value = false;
  }
}

async function loadExercise() {
  loading.value = true;
  try {
    const res = await request({ url: `/exercises/${exerciseId.value}` });
    questions.value = res.questions || getMockQuestions();
  } catch {
    questions.value = getMockQuestions();
  } finally {
    loading.value = false;
  }
}

function getMockQuestions() {
  return [
    { type: 'choice', question: '函数f(x) = x^2的导数是？', options: ['x', '2x', 'x^2', '2'], correctIndex: 1 },
    { type: 'choice', question: '以下哪个是定积分的性质？', options: ['可加性', '可减性', '可乘性', '可除性'], correctIndex: 0 },
    { type: 'judge', question: '连续函数一定可导。', correctIndex: 0 },
    { type: 'fill', question: 'e^x的导数是____。', correctAnswer: 'e^x', correctIndex: -1 },
    { type: 'choice', question: 'ln(e) 的值等于？', options: ['0', '1', 'e', '不存在'], correctIndex: 1 },
  ];
}

function selectOption(idx: number) {
  answers.value[currentIndex.value] = idx;
}

function prevQuestion() { if (currentIndex.value > 0) currentIndex.value--; }
function nextQuestion() { if (currentIndex.value < questions.value.length - 1) currentIndex.value++; }

async function submitExercise() {
  let correct = 0;
  questions.value.forEach((q, i) => {
    if (q.type === 'fill') {
      if (fillAnswers.value[i]?.trim() === q.correctAnswer) correct++;
    } else {
      if (answers.value[i] === q.correctIndex) correct++;
    }
  });
  score.value = correct * 10;
  submitted.value = true;
}

function goViewAnswers() {
  uni.navigateTo({ url: `/pages/exercise/result/index?exerciseId=${exerciseId.value}&score=${score.value}` });
}

function goBack() { uni.navigateBack(); }
</script>

<style scoped>
.exercise-page { padding: 24rpx; background: #0F1118; min-height: 100vh; }
.loading-state { text-align: center; padding: 200rpx 0; color: #4D5466; font-size: 30rpx; }

.progress-bar { height: 8rpx; background: #2A2E3F; border-radius: 4rpx; margin-bottom: 12rpx; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #3D56C6, #5B7BFF); border-radius: 4rpx; transition: width 0.3s; }
.progress-text { font-size: 24rpx; color: #4D5466; text-align: right; display: block; margin-bottom: 24rpx; }

.question-card { margin-bottom: 30rpx; }
.question-type { font-size: 24rpx; color: #5B7BFF; background: rgba(91,123,255,0.15); padding: 4rpx 16rpx; border-radius: 8rpx; display: inline-block; margin-bottom: 20rpx; }
.question-text { font-size: 32rpx; color: #E8ECF4; line-height: 1.6; display: block; margin-bottom: 30rpx; }

.options { display: flex; flex-direction: column; gap: 16rpx; }
.option-item { display: flex; align-items: center; gap: 16rpx; padding: 24rpx; border-radius: 12rpx; border: 2rpx solid #2A2E3F; }
.option-item.selected { border-color: #5B7BFF; background: rgba(91,123,255,0.15); }
.option-item.correct { border-color: #34D399; background: rgba(52,211,153,0.15); }
.option-item.wrong { border-color: #FF6B6B; background: rgba(255,107,107,0.15); }
.option-label { width: 48rpx; height: 48rpx; border-radius: 50%; background: #242838; display: flex; align-items: center; justify-content: center; font-size: 26rpx; font-weight: 600; color: #8B92A5; }
.option-text { flex: 1; font-size: 28rpx; color: #E8ECF4; }

.fill-area { margin-top: 20rpx; }
.fill-input { background: #242838; border-radius: 12rpx; padding: 24rpx; font-size: 30rpx; color: #E8ECF4; }

.judge-area { display: flex; gap: 30rpx; justify-content: center; margin-top: 20rpx; }
.judge-btn { padding: 24rpx 60rpx; border-radius: 16rpx; border: 2rpx solid #2A2E3F; font-size: 32rpx; color: #E8ECF4; }
.judge-btn.selected { border-color: #5B7BFF; background: rgba(91,123,255,0.15); }
.judge-btn.correct { border-color: #34D399; background: rgba(52,211,153,0.15); }

.nav-btns { display: flex; gap: 20rpx; }
.nav-btn { flex: 1; }
.nav-btn.submit { background: linear-gradient(135deg, #FF9800, #FF5722); }

.result-area { text-align: center; margin-top: 30rpx; }
.result-score { font-size: 40rpx; font-weight: 700; color: #5B7BFF; display: block; margin-bottom: 16rpx; }
.result-hint { font-size: 26rpx; color: #4D5466; display: block; margin-bottom: 30rpx; }
</style>
