<template>
  <view class="teacher-home">
    <!-- 顶部问候 -->
    <view class="header">
      <view class="greeting-area">
        <text class="greeting">{{ greetingText }}，{{ userStore.user?.teacherName || '老师' }}</text>
        <text class="date-text">{{ dateText }}</text>
      </view>
    </view>

    <!-- 搜索栏 -->
    <SearchBar placeholder="搜索学生、作业、功能..." />

    <!-- 教学概览 -->
    <view class="overview-card">
      <text class="card-title">教学概览</text>
      <view class="overview-grid">
        <view class="ov-item">
          <text class="ov-num">{{ overview.pendingGrade }}</text>
          <text class="ov-label">待批改</text>
        </view>
        <view class="ov-sep"></view>
        <view class="ov-item">
          <text class="ov-num">{{ overview.weekHomework }}</text>
          <text class="ov-label">本周作业</text>
        </view>
        <view class="ov-sep"></view>
        <view class="ov-item">
          <text class="ov-num">{{ overview.studentCount }}</text>
          <text class="ov-label">学生总数</text>
        </view>
        <view class="ov-sep"></view>
        <view class="ov-item">
          <text class="ov-num" style="color:#FF6B6B;">{{ overview.unsubmittedCount }}</text>
          <text class="ov-label">未交作业</text>
        </view>
      </view>
    </view>

    <!-- 批改额度 -->
    <view class="quota-card">
      <text class="card-title">AI批改额度</text>
      <view class="quota-row">
        <view class="quota-item">
          <view class="quota-bar-bg">
            <view class="quota-bar-fill" :style="{ width: (overview.onlineUsed / overview.onlineTotal * 100) + '%' }"></view>
          </view>
          <text class="quota-text">线上AI批改 {{ overview.onlineUsed }}/{{ overview.onlineTotal }}</text>
        </view>
        <view class="quota-item">
          <view class="quota-bar-bg">
            <view class="quota-bar-fill offline" :style="{ width: (overview.offlineUsed / overview.offlineTotal * 100) + '%' }"></view>
          </view>
          <text class="quota-text">线下AI辅助 {{ overview.offlineUsed }}/{{ overview.offlineTotal }}</text>
        </view>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-actions">
      <view class="qa-btn" @tap="goPublishHomework">
        <text class="qa-icon">📝</text>
        <text class="qa-text">发布作业</text>
      </view>
      <view class="qa-btn" @tap="goMyClass">
        <text class="qa-icon">🏫</text>
        <text class="qa-text">我的班级</text>
      </view>
      <view class="qa-btn" @tap="goExamGen">
        <text class="qa-icon">📄</text>
        <text class="qa-text">AI出卷</text>
      </view>
      <view class="qa-btn" @tap="goTeachingPlan">
        <text class="qa-icon">📋</text>
        <text class="qa-text">AI教案</text>
      </view>
      <view class="qa-btn" @tap="goClassMistakes">
        <text class="qa-icon">📊</text>
        <text class="qa-text">班级错题集</text>
      </view>
      <view class="qa-btn" @tap="goGrading">
        <text class="qa-icon">✅</text>
        <text class="qa-text">查看批改</text>
      </view>
      <view class="qa-btn" @tap="goGradePublish">
        <text class="qa-icon">📊</text>
        <text class="qa-text">发成绩</text>
      </view>
    </view>

    <!-- 最近作业 -->
    <view class="section-card">
      <view class="section-header">
        <text class="card-title">最近作业</text>
        <text class="more-link" @tap="goHomeworkList">全部</text>
      </view>
      <view v-if="recentHomework.length === 0" class="empty-hint">
        <text class="empty-text">还没有发布作业</text>
      </view>
      <view v-for="hw in recentHomework" :key="hw.id" class="hw-item" @tap="goHomeworkDetail(hw.id)">
        <view class="hw-info">
          <text class="hw-name">{{ hw.name }}</text>
          <text class="hw-meta">{{ hw.className }} · {{ hw.submitCount }}/{{ hw.totalCount }}人提交</text>
        </view>
        <view class="hw-status" :class="hw.status">
          <text>{{ hw.statusText }}</text>
        </view>
      </view>
    </view>

    <view style="height: 140rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import SearchBar from '@/components/SearchBar/index.vue';

const userStore = useUserStore();

const overview = ref({
  pendingGrade: 3, weekHomework: 2, studentCount: 87, unsubmittedCount: 15,
  onlineUsed: 8, onlineTotal: 50, offlineUsed: 3, offlineTotal: 50,
});

const recentHomework = ref<any[]>([
  { id: '1', name: '第三章导数练习', className: '高一2班', submitCount: 32, totalCount: 45, status: 'grading', statusText: '批改中' },
  { id: '3', name: '古诗词默写', className: '高一1班', submitCount: 28, totalCount: 42, status: 'collecting', statusText: '收集中' },
]);

const greetingText = (() => {
  const h = new Date().getHours();
  if (h < 6) return '夜深了';
  if (h < 12) return '上午好';
  if (h < 18) return '下午好';
  return '晚上好';
})();

const dateText = (() => {
  const now = new Date();
  const w = ['日','一','二','三','四','五','六'];
  return `${now.getMonth() + 1}月${now.getDate()}日 星期${w[now.getDay()]}`;
})();

function goPublishHomework() {
  uni.navigateTo({ url: '/pages/teacher/homework-publish/index' });
}
function goMyClass() {
  uni.switchTab({ url: '/pages/notes/index' });
}
function goExamGen() {
  uni.navigateTo({ url: '/pages/teacher/exam-gen/index' });
}
function goTeachingPlan() {
  uni.navigateTo({ url: '/pages/teacher/teaching-plan/index' });
}
function goClassMistakes() {
  uni.navigateTo({ url: '/pages/teacher/class-mistakes/index' });
}
function goGrading() {
  uni.switchTab({ url: '/pages/practice/index' });
}
function goGradePublish() {
  uni.navigateTo({ url: '/pages/teacher/grade-publish/index' });
}
function goHomeworkList() {
  uni.switchTab({ url: '/pages/practice/index' });
}
function goHomeworkDetail(id: string) {
  uni.navigateTo({ url: `/pages/teacher/homework-detail/index?id=${id}` });
}
</script>

<style scoped>
.teacher-home {
  --c-bg: #0F1118;
  --c-card: #1A1D2E;
  --c-primary: #5B7BFF;
  --c-t1: #E8ECF4;
  --c-t2: #8B92A5;
  --c-t3: #4D5466;
  --c-border: #2A2E3F;
  padding: 32rpx;
  padding-top: 88rpx;
  background: var(--c-bg);
  min-height: 100vh;
  box-sizing: border-box;
}
.header { margin-bottom: 36rpx; }
.greeting { font-size: 40rpx; font-weight: 800; color: var(--c-t1); display: block; line-height: 1.3; }
.date-text { font-size: 26rpx; color: var(--c-t2); display: block; margin-top: 10rpx; }

.overview-card, .quota-card, .section-card {
  background: var(--c-card);
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid var(--c-border);
}
.card-title { font-size: 28rpx; font-weight: 700; color: var(--c-t1); display: block; margin-bottom: 20rpx; }
.overview-grid { display: flex; align-items: center; }
.ov-item { flex: 1; text-align: center; }
.ov-num { font-size: 48rpx; font-weight: 800; color: var(--c-primary); display: block; line-height: 1; margin-bottom: 8rpx; }
.ov-label { font-size: 22rpx; color: var(--c-t3); }
.ov-sep { width: 1rpx; height: 52rpx; background: var(--c-border); }

.quota-row { display: flex; flex-direction: column; gap: 16rpx; }
.quota-item { display: flex; flex-direction: column; gap: 8rpx; }
.quota-bar-bg { height: 12rpx; background: #242838; border-radius: 6rpx; overflow: hidden; }
.quota-bar-fill { height: 100%; background: var(--c-primary); border-radius: 6rpx; transition: width 0.3s; }
.quota-bar-fill.offline { background: #34D399; }
.quota-text { font-size: 24rpx; color: var(--c-t2); }

.quick-actions { display: flex; flex-wrap: wrap; gap: 16rpx; margin-bottom: 20rpx; }
.qa-btn {
  width: calc(33.33% - 12rpx);
  background: var(--c-card);
  border-radius: 20rpx;
  padding: 28rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  border: 1rpx solid var(--c-border);
  box-sizing: border-box;
}
.qa-icon { font-size: 44rpx; }
.qa-text { font-size: 24rpx; font-weight: 600; color: var(--c-t2); }

.section-header { display: flex; justify-content: space-between; align-items: center; }
.more-link { font-size: 24rpx; color: var(--c-primary); }
.hw-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24rpx 0; border-bottom: 1rpx solid var(--c-border);
}
.hw-item:last-child { border-bottom: none; }
.hw-name { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; margin-bottom: 6rpx; }
.hw-meta { font-size: 22rpx; color: var(--c-t3); }
.hw-status {
  padding: 6rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; flex-shrink: 0;
}
.hw-status.collecting { background: rgba(91,123,255,0.15); color: var(--c-primary); }
.hw-status.grading { background: rgba(255,186,74,0.15); color: #FFBA4A; }
.hw-status.done { background: rgba(52,211,153,0.15); color: #34D399; }
.empty-hint { padding: 40rpx 0; text-align: center; }
.empty-text { font-size: 28rpx; color: var(--c-t3); }
</style>
