<template>
  <view class="page">
    <!-- 作业信息 -->
    <view class="hw-info-card">
      <view class="hw-type" :class="homework.type"><text>{{ homework.type === 'online' ? '线上作业' : '线下作业' }}</text></view>
      <text class="hw-name">{{ homework.name }}</text>
      <text class="hw-meta">{{ homework.className }} · {{ homework.teacher }}</text>
      <text class="hw-deadline" :class="{ urgent: homework.urgent }">截止: {{ homework.deadline }}</text>
    </view>

    <!-- 线上作业：在线作答 -->
    <view v-if="homework.type === 'online' && homework.myStatus === 'pending'" class="answer-area">
      <view v-for="(q, idx) in questions" :key="idx" class="q-card">
        <text class="q-num">第{{ idx + 1 }}题</text>
        <text class="q-text">{{ q.question }}</text>
        <view v-if="q.options" class="q-options">
          <view v-for="opt in q.options" :key="opt" class="q-option" :class="{ selected: answers[idx] === opt }" @tap="answers[idx] = opt">
            <text>{{ opt }}</text>
          </view>
        </view>
        <textarea v-else class="q-textarea" v-model="answers[idx]" placeholder="输入你的答案..." />
      </view>
      <view class="submit-btn" @tap="submitOnline"><text class="submit-text">提交作业</text></view>
    </view>

    <!-- 线下作业：拍照提交 -->
    <view v-if="homework.type === 'offline' && homework.myStatus === 'pending'" class="offline-area">
      <text class="offline-hint">{{ homework.requirement }}</text>
      <view class="upload-btn" @tap="uploadSubmission">
        <text class="upload-emoji">📷</text>
        <text class="upload-text">拍照提交</text>
      </view>
    </view>

    <!-- 已提交/已批改 -->
    <view v-if="homework.myStatus === 'submitted'" class="status-card">
      <text class="status-icon">⏳</text>
      <text class="status-title">已提交，等待批改</text>
    </view>
    <view v-if="homework.myStatus === 'graded'" class="result-card">
      <text class="result-score">{{ homework.score }}</text>
      <text class="result-label">得分</text>
      <text class="result-comment">{{ homework.comment }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const homework = ref({
  id: '1', name: '第三章导数练习', className: '高一2班数学', teacher: '王老师',
  type: 'online', myStatus: 'pending', deadline: '明天 23:59', urgent: true,
  requirement: '请拍照提交手写作业', score: null, comment: '',
});

const questions = ref([
  { question: '求函数f(x)=x³-3x+1的极值点', options: null },
  { question: 'lim(x→0) sin(x)/x 等于?', options: ['0', '1', '∞', '不存在'] },
  { question: '求导: f(x)=e^(2x)', options: null },
]);

const answers = ref<string[]>(new Array(questions.value.length).fill(''));

function submitOnline() {
  const unanswered = answers.value.filter(a => !a).length;
  if (unanswered > 0) {
    uni.showModal({ title: '提示', content: `还有${unanswered}题未作答，确认提交？`,
      success: (res) => { if (res.confirm) doSubmit(); },
    });
  } else { doSubmit(); }
}

function doSubmit() {
  homework.value.myStatus = 'submitted';
  uni.showToast({ title: '提交成功', icon: 'success' });
}

function uploadSubmission() {
  uni.chooseImage({ count: 3, sizeType: ['compressed'], sourceType: ['camera', 'album'],
    success: () => { homework.value.myStatus = 'submitted'; uni.showToast({ title: '提交成功', icon: 'success' }); },
  });
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.hw-info-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; margin-bottom: 24rpx; border: 1rpx solid var(--c-border); }
.hw-type { display: inline-block; padding: 6rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; margin-bottom: 10rpx; }
.hw-type.online { background: rgba(91,123,255,0.15); color: var(--c-primary); }
.hw-type.offline { background: rgba(167,139,250,0.15); color: #A78BFA; }
.hw-name { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.hw-meta { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 8rpx; }
.hw-deadline { font-size: 24rpx; color: var(--c-t3); }
.hw-deadline.urgent { color: #FF6B6B; font-weight: 600; }

.q-card { background: var(--c-card); border-radius: 20rpx; padding: 28rpx; margin-bottom: 16rpx; border: 1rpx solid var(--c-border); }
.q-num { font-size: 24rpx; font-weight: 700; color: var(--c-primary); display: block; margin-bottom: 10rpx; }
.q-text { font-size: 28rpx; color: var(--c-t1); line-height: 1.5; display: block; margin-bottom: 16rpx; }
.q-options { display: flex; flex-direction: column; gap: 12rpx; }
.q-option { padding: 20rpx; border-radius: 14rpx; background: #242838; border: 2rpx solid var(--c-border); font-size: 28rpx; color: var(--c-t1); }
.q-option.selected { border-color: var(--c-primary); background: rgba(91,123,255,0.15); color: var(--c-primary); font-weight: 600; }
.q-textarea { width: 100%; min-height: 120rpx; background: #242838; border-radius: 14rpx; padding: 20rpx; font-size: 28rpx; color: var(--c-t1); box-sizing: border-box; }
.submit-btn { background: var(--c-primary); border-radius: 20rpx; padding: 28rpx; text-align: center; margin-top: 16rpx; }
.submit-text { font-size: 30rpx; font-weight: 700; color: #FFF; }

.offline-area { text-align: center; padding: 40rpx 0; }
.offline-hint { font-size: 26rpx; color: var(--c-t3); display: block; margin-bottom: 32rpx; }
.upload-btn { background: var(--c-card); border: 2rpx dashed var(--c-border); border-radius: 20rpx; padding: 60rpx; display: flex; flex-direction: column; align-items: center; gap: 12rpx; }
.upload-emoji { font-size: 60rpx; }
.upload-text { font-size: 28rpx; font-weight: 600; color: var(--c-t1); }

.status-card { background: var(--c-card); border-radius: 24rpx; padding: 60rpx; text-align: center; border: 1rpx solid var(--c-border); }
.status-icon { font-size: 64rpx; display: block; margin-bottom: 16rpx; }
.status-title { font-size: 30rpx; font-weight: 600; color: var(--c-t1); }

.result-card { background: var(--c-card); border-radius: 24rpx; padding: 48rpx; text-align: center; border: 1rpx solid var(--c-border); }
.result-score { font-size: 80rpx; font-weight: 800; color: var(--c-primary); display: block; }
.result-label { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 20rpx; }
.result-comment { font-size: 28rpx; color: var(--c-t1); line-height: 1.6; text-align: left; }
</style>
