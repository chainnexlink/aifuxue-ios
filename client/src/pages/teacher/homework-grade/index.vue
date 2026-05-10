<template>
  <view class="page">
    <view class="student-header">
      <view class="s-avatar"><text>{{ student.name.charAt(0) }}</text></view>
      <view class="s-info">
        <text class="s-name">{{ student.name }}的作业</text>
        <text class="s-time">提交时间: {{ student.submitTime }}</text>
      </view>
    </view>

    <!-- 学生答案展示 -->
    <view class="answer-card">
      <text class="card-title">学生作答</text>
      <view v-for="(q, idx) in questions" :key="idx" class="q-item">
        <view class="q-header">
          <text class="q-num">第{{ idx + 1 }}题</text>
          <view class="q-result" :class="q.correct ? 'correct' : 'wrong'">
            <text>{{ q.correct ? '正确' : '错误' }}</text>
          </view>
        </view>
        <text class="q-text">{{ q.question }}</text>
        <view class="q-answer-row">
          <text class="q-label">学生答案:</text>
          <text class="q-student-ans" :class="{ wrong: !q.correct }">{{ q.studentAnswer }}</text>
        </view>
        <view class="q-answer-row">
          <text class="q-label">正确答案:</text>
          <text class="q-correct-ans">{{ q.correctAnswer }}</text>
        </view>
        <!-- 教师评分 -->
        <view class="score-row">
          <text class="score-label">得分:</text>
          <input class="score-input" type="number" v-model="q.score" :placeholder="String(q.maxScore)" />
          <text class="score-max">/ {{ q.maxScore }}</text>
        </view>
      </view>
    </view>

    <!-- 教师评语 -->
    <view class="comment-card">
      <text class="card-title">教师评语</text>
      <textarea class="comment-input" v-model="comment" placeholder="输入评语..." />
    </view>

    <view class="actions">
      <view class="action-btn ai" @tap="aiAssist">
        <text>🤖 AI辅助评语</text>
      </view>
      <view class="action-btn confirm" @tap="confirmGrade">
        <text>确认批改</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const student = ref({ name: '李四', submitTime: '05-03 11:00' });
const comment = ref('');

const questions = ref([
  { question: '求函数f(x)=x³-3x+1的极值点', studentAnswer: 'x=1', correctAnswer: 'x=1, x=-1', correct: false, score: 3, maxScore: 5 },
  { question: '计算lim(x→0) sin(x)/x', studentAnswer: '1', correctAnswer: '1', correct: true, score: 5, maxScore: 5 },
  { question: '求导: f(x)=e^(2x)', studentAnswer: 'e^(2x)', correctAnswer: '2e^(2x)', correct: false, score: 2, maxScore: 5 },
]);

function aiAssist() {
  uni.showToast({ title: 'AI生成评语中...', icon: 'loading', duration: 1500 });
  setTimeout(() => {
    comment.value = '整体表现不错，第1题注意不要遗漏负根，第3题复合函数求导需要用链式法则。建议加强导数基础练习。';
  }, 1500);
}

function confirmGrade() {
  uni.showModal({
    title: '确认批改',
    content: '确认后学生端将收到批改结果',
    success: (res) => { if (res.confirm) { uni.showToast({ title: '批改完成', icon: 'success' }); setTimeout(() => uni.navigateBack(), 1000); } },
  });
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.student-header { display: flex; align-items: center; gap: 20rpx; margin-bottom: 24rpx; }
.s-avatar { width: 80rpx; height: 80rpx; background: rgba(91,123,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.s-avatar text { font-size: 32rpx; font-weight: 700; color: var(--c-primary); }
.s-name { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; }
.s-time { font-size: 24rpx; color: var(--c-t3); }

.answer-card, .comment-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; margin-bottom: 20rpx; border: 1rpx solid var(--c-border); }
.card-title { font-size: 28rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 20rpx; }
.q-item { padding: 20rpx 0; border-bottom: 1rpx solid var(--c-border); }
.q-item:last-child { border-bottom: none; }
.q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10rpx; }
.q-num { font-size: 26rpx; font-weight: 700; color: var(--c-primary); }
.q-result { padding: 4rpx 14rpx; border-radius: 8rpx; font-size: 22rpx; }
.q-result.correct { background: rgba(52,211,153,0.15); color: #34D399; }
.q-result.wrong { background: rgba(255,107,107,0.15); color: #FF6B6B; }
.q-text { font-size: 28rpx; color: var(--c-t1); display: block; margin-bottom: 12rpx; line-height: 1.5; }
.q-answer-row { display: flex; align-items: center; gap: 8rpx; margin-bottom: 6rpx; }
.q-label { font-size: 24rpx; color: var(--c-t3); }
.q-student-ans { font-size: 26rpx; color: var(--c-t1); }
.q-student-ans.wrong { color: #FF6B6B; }
.q-correct-ans { font-size: 26rpx; color: #34D399; }
.score-row { display: flex; align-items: center; gap: 8rpx; margin-top: 12rpx; }
.score-label { font-size: 24rpx; color: var(--c-t2); }
.score-input { width: 80rpx; background: #242838; border-radius: 10rpx; padding: 8rpx 12rpx; font-size: 28rpx; color: var(--c-primary); text-align: center; font-weight: 700; }
.score-max { font-size: 24rpx; color: var(--c-t3); }

.comment-input { width: 100%; min-height: 160rpx; background: #242838; border-radius: 14rpx; padding: 20rpx; font-size: 28rpx; color: var(--c-t1); box-sizing: border-box; }

.actions { display: flex; gap: 16rpx; }
.action-btn { flex: 1; padding: 24rpx; border-radius: 16rpx; text-align: center; font-size: 28rpx; font-weight: 600; }
.action-btn.ai { background: rgba(91,123,255,0.15); color: var(--c-primary); }
.action-btn.confirm { background: var(--c-primary); color: #FFF; }
</style>
