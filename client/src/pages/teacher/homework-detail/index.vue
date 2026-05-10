<template>
  <view class="page">
    <!-- 作业信息 -->
    <view class="hw-header">
      <view class="hw-type-tag" :class="homework.type"><text>{{ homework.type === 'online' ? '线上作业' : '线下作业' }}</text></view>
      <text class="hw-name">{{ homework.name }}</text>
      <text class="hw-meta">{{ homework.className }} · 截止 {{ homework.deadline }}</text>
    </view>

    <!-- 提交进度 -->
    <view class="progress-card">
      <view class="prog-header">
        <text class="prog-title">提交进度</text>
        <text class="prog-num">{{ homework.submitCount }}/{{ homework.totalCount }}</text>
      </view>
      <view class="prog-bar-bg"><view class="prog-bar-fill" :style="{ width: (homework.submitCount / homework.totalCount * 100) + '%' }"></view></view>
    </view>

    <!-- 学生提交列表 -->
    <view class="section-card">
      <text class="section-title">学生列表</text>
      <view v-for="s in students" :key="s.id" class="student-row" @tap="goStudentDetail(s)">
        <view class="s-avatar"><text>{{ s.name.charAt(0) }}</text></view>
        <view class="s-info">
          <text class="s-name">{{ s.name }}</text>
          <text class="s-time">{{ s.submitTime || '未提交' }}</text>
        </view>
        <view class="s-status" :class="s.status">
          <text>{{ statusText(s.status) }}</text>
        </view>
        <view v-if="s.status === 'submitted'" class="grade-btn" @tap.stop="goGrade(s.id)">
          <text>批改</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮组 -->
    <view class="action-group">
      <view v-if="hasPending" class="action-btn remind" @tap="sendReminder">
        <text class="action-text">🔔 催交提醒（{{ pendingCount }}人未交）</text>
      </view>
      <view class="action-btn mistakes" @tap="goClassMistakes">
        <text class="action-text">📊 查看班级错题集</text>
      </view>
    </view>

    <!-- AI批量批改 -->
    <view v-if="hasSubmitted" class="batch-grade-btn" @tap="batchAiGrade">
      <text class="batch-text">🤖 AI批量批改（今日免费剩余{{ aiGradeRemaining }}次）</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { tryPlayAd, AD_UNIT_IDS } from '@/utils/ad-reward';
import { hasFreeQuota, consumeFreeQuota, getRemainingCount } from '@/utils/daily-limit';

const homework = ref({
  id: '1', name: '第三章导数练习', className: '高一2班数学',
  type: 'online', deadline: '05-04 23:59', submitCount: 32, totalCount: 45,
});

const students = ref([
  { id: '1', name: '张三', status: 'graded', submitTime: '05-03 10:20', score: 85 },
  { id: '2', name: '李四', status: 'submitted', submitTime: '05-03 11:00', score: null },
  { id: '3', name: '王五', status: 'submitted', submitTime: '05-03 14:30', score: null },
  { id: '4', name: '赵六', status: 'pending', submitTime: '', score: null },
  { id: '5', name: '钱七', status: 'graded', submitTime: '05-02 22:10', score: 72 },
]);

const hasSubmitted = computed(() => students.value.some(s => s.status === 'submitted'));
const hasPending = computed(() => students.value.some(s => s.status === 'pending'));
const submittedCount = computed(() => students.value.filter(s => s.status === 'submitted').length);
const pendingCount = computed(() => students.value.filter(s => s.status === 'pending').length);
const gradeKey = computed(() => homework.value.type === 'online' ? 'AI_GRADE_ONLINE' : 'AI_GRADE_OFFLINE');
const aiGradeRemaining = computed(() => getRemainingCount(gradeKey.value as any));

function statusText(s: string) {
  const m: Record<string, string> = { pending: '未提交', submitted: '待批改', graded: '已批改' };
  return m[s] || s;
}

// 手动批改始终免费
function goGrade(studentId: string) {
  uni.navigateTo({ url: `/pages/teacher/homework-grade/index?hwId=${homework.value.id}&studentId=${studentId}` });
}

// 点击学生行查看详情
function goStudentDetail(student: any) {
  if (student.status === 'graded') {
    uni.navigateTo({ url: `/pages/teacher/homework-grade/index?hwId=${homework.value.id}&studentId=${student.id}&readonly=1` });
  } else if (student.status === 'submitted') {
    uni.navigateTo({ url: `/pages/teacher/homework-grade/index?hwId=${homework.value.id}&studentId=${student.id}` });
  }
}

async function batchAiGrade() {
  const key = gradeKey.value as any;
  if (hasFreeQuota(key)) {
    // 有免费额度，逐个消耗
    uni.showModal({
      title: 'AI批量批改',
      content: `今日免费剩余${aiGradeRemaining.value}次，将消耗${submittedCount.value}次，确认继续？`,
      success: (res) => {
        if (res.confirm) {
          for (let i = 0; i < submittedCount.value; i++) consumeFreeQuota(key);
          doAiGrade();
        }
      },
    });
  } else {
    // 免费次数用完，提示观看广告或手动批改
    uni.showModal({
      title: '今日AI批改次数已用完',
      content: '可观看广告解锁一次AI批改，或使用手动批改（免费）',
      confirmText: '观看广告',
      cancelText: '手动批改',
      success: async (res) => {
        if (res.confirm) {
          const ok = await tryPlayAd(AD_UNIT_IDS.AI_GRADE, 'AI批改');
          if (ok) doAiGrade();
        }
        // 取消则用户自行手动批改
      },
    });
  }
}

function doAiGrade() {
  uni.showToast({ title: 'AI批改中...', icon: 'loading', duration: 2000 });
  setTimeout(() => {
    students.value.forEach(s => {
      if (s.status === 'submitted') {
        s.status = 'graded';
        s.score = Math.floor(Math.random() * 30) + 70;
      }
    });
    uni.showToast({ title: '批改完成', icon: 'success' });
  }, 2000);
}

function sendReminder() {
  uni.showModal({
    title: '催交提醒',
    content: `将向${pendingCount.value}名未提交学生发送催交通知，确认？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已发送催交提醒', icon: 'success' });
      }
    },
  });
}

function goClassMistakes() {
  uni.navigateTo({ url: `/pages/teacher/class-mistakes/detail?hwId=${homework.value.id}` });
}
</script>

<style scoped>
.page { --c-bg: #0F1118; --c-card: #1A1D2E; --c-primary: #5B7BFF; --c-t1: #E8ECF4; --c-t2: #8B92A5; --c-t3: #4D5466; --c-border: #2A2E3F; padding: 32rpx; background: var(--c-bg); min-height: 100vh; box-sizing: border-box; }
.hw-header { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; margin-bottom: 20rpx; border: 1rpx solid var(--c-border); }
.hw-type-tag { display: inline-block; padding: 6rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; margin-bottom: 12rpx; }
.hw-type-tag.online { background: rgba(91,123,255,0.15); color: var(--c-primary); }
.hw-type-tag.offline { background: rgba(167,139,250,0.15); color: #A78BFA; }
.hw-name { font-size: 32rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 8rpx; }
.hw-meta { font-size: 24rpx; color: var(--c-t3); }

.progress-card { background: var(--c-card); border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; border: 1rpx solid var(--c-border); }
.prog-header { display: flex; justify-content: space-between; margin-bottom: 12rpx; }
.prog-title { font-size: 26rpx; color: var(--c-t2); }
.prog-num { font-size: 26rpx; font-weight: 700; color: var(--c-primary); }
.prog-bar-bg { height: 12rpx; background: #242838; border-radius: 6rpx; overflow: hidden; }
.prog-bar-fill { height: 100%; background: var(--c-primary); border-radius: 6rpx; }

.section-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; border: 1rpx solid var(--c-border); margin-bottom: 20rpx; }
.section-title { font-size: 28rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 16rpx; }
.student-row { display: flex; align-items: center; gap: 16rpx; padding: 16rpx 0; border-bottom: 1rpx solid var(--c-border); }
.student-row:last-child { border-bottom: none; }
.s-avatar { width: 56rpx; height: 56rpx; background: rgba(91,123,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.s-avatar text { font-size: 24rpx; font-weight: 700; color: var(--c-primary); }
.s-info { flex: 1; }
.s-name { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; }
.s-time { font-size: 22rpx; color: var(--c-t3); }
.s-status { padding: 6rpx 14rpx; border-radius: 8rpx; font-size: 22rpx; }
.s-status.pending { background: rgba(107,114,128,0.15); color: #6B7280; }
.s-status.submitted { background: rgba(255,186,74,0.15); color: #FFBA4A; }
.s-status.graded { background: rgba(52,211,153,0.15); color: #34D399; }
.grade-btn { padding: 8rpx 20rpx; border-radius: 10rpx; background: var(--c-primary); margin-left: 8rpx; }
.grade-btn text { font-size: 22rpx; color: #FFF; font-weight: 600; }

.batch-grade-btn { background: linear-gradient(145deg, #3D56C6, #5B7BFF); border-radius: 20rpx; padding: 28rpx; text-align: center; box-shadow: 0 8rpx 24rpx rgba(91,123,255,0.3); }
.batch-text { font-size: 30rpx; font-weight: 700; color: #FFF; }

.action-group { display: flex; flex-direction: column; gap: 12rpx; margin-bottom: 16rpx; }
.action-btn { border-radius: 16rpx; padding: 24rpx; text-align: center; border: 1rpx solid var(--c-border); }
.action-btn.remind { background: rgba(255,107,107,0.1); border-color: rgba(255,107,107,0.3); }
.action-btn.mistakes { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3); }
.action-text { font-size: 28rpx; font-weight: 600; color: var(--c-t1); }
</style>
