<template>
  <view class="page">
    <text class="page-title">{{ hwName }}</text>
    <text class="page-sub">{{ className }} · {{ date }} · 错误率 {{ overallErrorRate }}%</text>

    <!-- 错题列表（按错误率排序） -->
    <view v-for="(q, idx) in questions" :key="idx" class="q-card">
      <view class="q-header">
        <text class="q-num">第{{ q.questionNum }}题</text>
        <view class="q-err-badge"><text>{{ q.errorCount }}/{{ q.totalCount }}人答错 ({{ q.errorRate }}%)</text></view>
      </view>
      <text class="q-content">{{ q.content }}</text>
      <view class="q-correct">
        <text class="q-correct-label">正确答案：</text>
        <text class="q-correct-val">{{ q.correctAnswer }}</text>
      </view>

      <!-- 错误答案分布 -->
      <view class="err-dist">
        <text class="err-dist-title">错误答案分布</text>
        <view v-for="ea in q.errorAnswers" :key="ea.answer" class="err-row">
          <text class="err-answer">{{ ea.answer }}</text>
          <view class="err-bar-bg">
            <view class="err-bar-fill" :style="{ width: (ea.count / q.errorCount * 100) + '%' }"></view>
          </view>
          <text class="err-count">{{ ea.count }}人</text>
        </view>
      </view>

      <!-- 展开学生名单 -->
      <view class="expand-btn" @tap="q.expanded = !q.expanded">
        <text>{{ q.expanded ? '收起' : '展开' }}错题学生名单</text>
      </view>
      <view v-if="q.expanded" class="student-list">
        <view v-for="s in q.errorStudents" :key="s.name" class="err-student">
          <text class="es-name">{{ s.name }}</text>
          <text class="es-answer">作答：{{ s.answer }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <view class="action-btn primary" @tap="generateConsolidation">
        <text>📝 一键生成班级巩固卷</text>
      </view>
      <view class="action-btn" @tap="exportPdf">
        <text>📄 导出错题PDF</text>
      </view>
    </view>

    <view style="height: 40rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hwName = ref('第三章导数练习')
const className = ref('高一2班数学')
const date = ref('2025-05-03')
const overallErrorRate = ref(35)

interface ErrorAnswer { answer: string; count: number }
interface ErrorStudent { name: string; answer: string }
interface Question {
  questionNum: number; content: string; correctAnswer: string;
  errorCount: number; totalCount: number; errorRate: number;
  errorAnswers: ErrorAnswer[]; errorStudents: ErrorStudent[]; expanded: boolean;
}

const questions = ref<Question[]>([
  {
    questionNum: 3, content: '函数 f(x)=x³-3x 在 x=1 处的导数值为？',
    correctAnswer: '0', errorCount: 15, totalCount: 32, errorRate: 47,
    errorAnswers: [{ answer: '3', count: 8 }, { answer: '-3', count: 4 }, { answer: '1', count: 3 }],
    errorStudents: [{ name: '张三', answer: '3' }, { name: '李四', answer: '-3' }, { name: '王五', answer: '3' }, { name: '赵六', answer: '1' }],
    expanded: false,
  },
  {
    questionNum: 5, content: '求函数 f(x)=2x²+3x-1 的导函数 f\'(x)=？',
    correctAnswer: '4x+3', errorCount: 12, totalCount: 32, errorRate: 38,
    errorAnswers: [{ answer: '4x', count: 6 }, { answer: '2x+3', count: 4 }, { answer: '4x-1', count: 2 }],
    errorStudents: [{ name: '钱七', answer: '4x' }, { name: '孙八', answer: '2x+3' }, { name: '周九', answer: '4x' }],
    expanded: false,
  },
  {
    questionNum: 8, content: '已知 f(x)=x²-4x+3，求 f(x) 的极小值',
    correctAnswer: '-1', errorCount: 10, totalCount: 32, errorRate: 31,
    errorAnswers: [{ answer: '0', count: 5 }, { answer: '3', count: 3 }, { answer: '1', count: 2 }],
    errorStudents: [{ name: '吴十', answer: '0' }, { name: '郑一', answer: '3' }],
    expanded: false,
  },
])

function generateConsolidation() {
  uni.showModal({
    title: '生成巩固卷',
    content: '基于班级错题生成巩固练习，发布给全班学生？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: 'AI生成中...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({ title: '巩固卷已生成', icon: 'success' })
        }, 2000)
      }
    },
  })
}

function exportPdf() {
  uni.showToast({ title: '导出功能开发中', icon: 'none' })
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.page-title { font-size: 34rpx; font-weight: 800; color: var(--c-t1); display: block; margin-bottom: 6rpx; }
.page-sub { font-size: 24rpx; color: var(--c-t3); display: block; margin-bottom: 24rpx; }
.q-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; margin-bottom: 16rpx; border: 1rpx solid var(--c-border); }
.q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rpx; }
.q-num { font-size: 28rpx; font-weight: 700; color: var(--c-primary); }
.q-err-badge { padding: 6rpx 14rpx; border-radius: 8rpx; background: rgba(255,107,107,0.15); }
.q-err-badge text { font-size: 22rpx; color: #FF6B6B; font-weight: 600; }
.q-content { font-size: 28rpx; color: var(--c-t1); line-height: 1.6; display: block; margin-bottom: 12rpx; }
.q-correct { display: flex; gap: 8rpx; margin-bottom: 16rpx; }
.q-correct-label { font-size: 24rpx; color: var(--c-t3); }
.q-correct-val { font-size: 24rpx; color: #34D399; font-weight: 600; }
.err-dist { margin-bottom: 16rpx; }
.err-dist-title { font-size: 24rpx; color: var(--c-t2); display: block; margin-bottom: 12rpx; }
.err-row { display: flex; align-items: center; gap: 12rpx; margin-bottom: 8rpx; }
.err-answer { font-size: 26rpx; color: #FF6B6B; font-weight: 600; width: 80rpx; }
.err-bar-bg { flex: 1; height: 12rpx; background: #242838; border-radius: 6rpx; overflow: hidden; }
.err-bar-fill { height: 100%; background: #FF6B6B; border-radius: 6rpx; }
.err-count { font-size: 22rpx; color: var(--c-t3); width: 60rpx; text-align: right; }
.expand-btn { text-align: center; padding: 14rpx; background: #242838; border-radius: 10rpx; margin-bottom: 12rpx; }
.expand-btn text { font-size: 24rpx; color: var(--c-primary); }
.student-list { display: flex; flex-direction: column; gap: 8rpx; }
.err-student { display: flex; justify-content: space-between; padding: 10rpx 16rpx; background: #242838; border-radius: 8rpx; }
.es-name { font-size: 26rpx; color: var(--c-t1); }
.es-answer { font-size: 26rpx; color: #FF6B6B; }
.bottom-actions { display: flex; flex-direction: column; gap: 12rpx; margin-top: 24rpx; }
.action-btn { text-align: center; padding: 28rpx; border-radius: 20rpx; background: var(--c-card); border: 1rpx solid var(--c-border); }
.action-btn.primary { background: linear-gradient(145deg, #3D56C6, #5B7BFF); border: none; box-shadow: 0 8rpx 24rpx rgba(91,123,255,0.3); }
.action-btn.primary text { color: #FFF; font-weight: 700; }
.action-btn text { font-size: 28rpx; color: var(--c-t2); }
</style>
