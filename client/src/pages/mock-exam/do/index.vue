<template>
  <view class="exam-do-page">
    <!-- 计时器 -->
    <view class="timer-bar">
      <text class="timer-icon">⏱️</text>
      <text class="timer-text">{{ formatCountdown }}</text>
      <text class="exam-subject">{{ subject }}</text>
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="loading-area card">
      <text class="loading-text">正在生成试卷...</text>
    </view>

    <!-- 加载失败 -->
    <view v-else-if="loadError || (questions.length === 0 && !loading)" class="loading-area card">
      <text class="loading-text">题库加载中，请稍后重试</text>
      <view class="btn-secondary" style="margin-top:30rpx;" @tap="goHome">
        <text>返回首页</text>
      </view>
    </view>

    <!-- 题目 -->
    <view v-else-if="!finished" class="question-area">
      <view class="progress-info">
        <text>第 {{ currentIndex + 1 }} / {{ questions.length }} 题</text>
      </view>

      <view class="question-card card">
        <text class="q-text">{{ currentQuestion.question }}</text>
        <view class="options">
          <view
            v-for="(opt, idx) in currentQuestion.options"
            :key="idx"
            class="option-item"
            :class="{ selected: answers[currentIndex] === idx }"
            @tap="selectAnswer(idx)"
          >
            <text class="opt-label">{{ ['A', 'B', 'C', 'D'][idx] }}</text>
            <text class="opt-text">{{ opt }}</text>
          </view>
        </view>
      </view>

      <view class="nav-btns">
        <view v-if="currentIndex > 0" class="btn-secondary" @tap="currentIndex--">
          <text>上一题</text>
        </view>
        <view v-if="currentIndex < questions.length - 1" class="btn-primary" @tap="currentIndex++">
          <text>下一题</text>
        </view>
        <view v-else class="btn-primary submit-btn" @tap="finishExam">
          <text>交卷</text>
        </view>
      </view>

      <!-- 题号网格 -->
      <view class="question-grid card">
        <text class="grid-title">答题卡</text>
        <view class="grid-dots">
          <view
            v-for="(_, idx) in questions"
            :key="idx"
            class="grid-dot"
            :class="{ answered: answers[idx] !== undefined, current: idx === currentIndex }"
            @tap="currentIndex = idx"
          >
            <text>{{ idx + 1 }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 交卷结果 -->
    <view v-else class="result-area card">
      <text class="result-title">考试结束</text>
      <text class="result-score">{{ score }} / {{ totalScore }} 分</text>
      <text class="result-answered">已答 {{ Object.keys(answers).length }} / {{ questions.length }} 题</text>

      <view class="btn-primary" @tap="goViewResult">
        <text>查看答案解析（需家长密码）</text>
      </view>
      <view class="btn-secondary" style="margin-top: 20rpx;" @tap="goHome">
        <text>返回首页</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

interface ExamSection {
  name: string;
  count: number;
  score: number;
}
interface ExamConfig {
  sections: ExamSection[];
  total: number;
  duration: number;
}

const subject = ref('数学');
const examType = ref('exam');
const grade = ref('');
const region = ref('');
const currentIndex = ref(0);
const answers = ref<Record<number, number>>({});
const finished = ref(false);
const score = ref(0);
const countdown = ref(90 * 60);
const totalScore = ref(100);
let timer: any = null;

const examConfig = ref<ExamConfig>({
  sections: [{ name: '选择题', count: 10, score: 5 }],
  total: 100,
  duration: 90,
});

// 根据科目和配置生成题目（通过后端 AI 服务）
async function generateQuestions(subj: string, config: ExamConfig) {
  try {
    // 调用后端 AI 出题接口
    const res = await uni.request({
      url: 'https://aifuxue.cn/api/exercises/exam-generate',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token')}`,
      },
      data: {
        subject: subj,
        questionCount: config.sections.reduce((sum, s) => sum + s.count, 0),
        sections: config.sections,
      },
    });
    if (res.statusCode === 200 && (res.data as any)?.questions) {
      return (res.data as any).questions;
    }
  } catch {
    // API 不可用
  }
  return [];
}

const questions = ref<Array<{ question: string; options: string[]; correct: number; type: string; scoreValue: number }>>([]);
const loading = ref(true);
const loadError = ref(false);

const currentQuestion = computed(() => questions.value[currentIndex.value] || {});

const formatCountdown = computed(() => {
  const min = Math.floor(countdown.value / 60);
  const sec = countdown.value % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
});

onLoad(async (options) => {
  if (options?.subject) subject.value = options.subject;
  if (options?.type) examType.value = options.type;
  if (options?.grade) grade.value = options.grade;
  if (options?.region) region.value = options.region;

  if (options?.config) {
    try {
      const cfg = JSON.parse(decodeURIComponent(options.config)) as ExamConfig;
      examConfig.value = cfg;
      totalScore.value = cfg.total;
      countdown.value = cfg.duration * 60;
    } catch {
      // fallback
    }
  }

  loading.value = true;
  try {
    questions.value = await generateQuestions(subject.value, examConfig.value);
  } catch {
    loadError.value = true;
  }
  loading.value = false;
});

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      finishExam();
    }
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function selectAnswer(idx: number) {
  answers.value[currentIndex.value] = idx;
}

function finishExam() {
  if (timer) clearInterval(timer);
  let earned = 0;
  questions.value.forEach((q, i) => {
    if (answers.value[i] === q.correct) {
      earned += q.scoreValue;
    }
  });
  score.value = earned;
  finished.value = true;
}

function goViewResult() {
  uni.navigateTo({ url: `/pages/exercise/result/index?score=${score.value}` });
}

function goHome() { uni.switchTab({ url: '/pages/home/index' }); }
</script>

<style scoped>
.exam-do-page { padding: 24rpx; background: #0F1118; min-height: 100vh; }

.timer-bar { display: flex; align-items: center; gap: 16rpx; background: #1A1D2E; border-radius: 12rpx; padding: 20rpx; margin-bottom: 20rpx; border: 1rpx solid #2A2E3F; }
.timer-icon { font-size: 32rpx; }
.timer-text { font-size: 36rpx; font-weight: 700; color: #FF6B6B; font-family: monospace; }
.exam-subject { margin-left: auto; font-size: 26rpx; color: #5B7BFF; background: rgba(91,123,255,0.15); padding: 6rpx 16rpx; border-radius: 8rpx; }

.progress-info { font-size: 26rpx; color: #4D5466; margin-bottom: 16rpx; }

.question-card { margin-bottom: 24rpx; }
.q-text { font-size: 32rpx; color: #E8ECF4; line-height: 1.6; display: block; margin-bottom: 28rpx; }

.options { display: flex; flex-direction: column; gap: 14rpx; }
.option-item { display: flex; align-items: center; gap: 16rpx; padding: 22rpx; border-radius: 12rpx; border: 2rpx solid #2A2E3F; }
.option-item.selected { border-color: #5B7BFF; background: rgba(91,123,255,0.15); }
.opt-label { width: 44rpx; height: 44rpx; border-radius: 50%; background: #242838; display: flex; align-items: center; justify-content: center; font-size: 24rpx; font-weight: 600; flex-shrink: 0; color: #8B92A5; }
.opt-text { font-size: 28rpx; color: #E8ECF4; }

.nav-btns { display: flex; gap: 20rpx; margin-bottom: 24rpx; }
.nav-btns > view { flex: 1; }
.submit-btn { background: linear-gradient(135deg, #FF9800, #FF5722) !important; }

.question-grid { margin-bottom: 20rpx; }
.grid-title { font-size: 28rpx; font-weight: 600; color: #E8ECF4; display: block; margin-bottom: 16rpx; }
.grid-dots { display: flex; flex-wrap: wrap; gap: 12rpx; }
.grid-dot { width: 56rpx; height: 56rpx; border-radius: 8rpx; background: #242838; display: flex; align-items: center; justify-content: center; font-size: 24rpx; color: #4D5466; }
.grid-dot.answered { background: #5B7BFF; color: #fff; }
.grid-dot.current { border: 3rpx solid #FF9800; }

.result-area { text-align: center; padding: 60rpx 40rpx; }
.result-title { font-size: 40rpx; font-weight: 700; color: #E8ECF4; display: block; margin-bottom: 20rpx; }
.result-score { font-size: 60rpx; font-weight: 700; color: #5B7BFF; display: block; margin-bottom: 12rpx; }
.result-answered { font-size: 26rpx; color: #4D5466; display: block; margin-bottom: 40rpx; }

.loading-area { text-align: center; padding:80rpx 40rpx; }
.loading-text { font-size:28rpx; color:#8B92A5; display:block; }

.btn-primary { background: linear-gradient(145deg, #3D56C6, #5B7BFF); color:#FFF; text-align:center; padding:24rpx; border-radius:16rpx; font-size:30rpx; font-weight:600; }
.btn-secondary { text-align:center; padding:24rpx; color:#5B7BFF; font-size:30rpx; background:transparent; border-radius:16rpx; border:2rpx solid #5B7BFF; }
</style>
