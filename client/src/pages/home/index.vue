<template>
  <view class="page-wrap">
    <!-- 学生端首页 -->
    <view v-if="!userStore.isTeacherView" class="home-page">
      <!-- 顶部：问候 + 日期 -->
      <view class="header">
        <view class="greeting-area">
          <text class="greeting">{{ greetingText }}，{{ userStore.user?.nickname || '同学' }}</text>
          <text class="date-text">{{ dateText }}</text>
        </view>
      </view>

      <!-- 搜索栏 -->
      <SearchBar placeholder="搜索笔记、错题、功能..." />

      <!-- 两个大卡片：课后笔记 + 拍错题录入 -->
      <view class="main-cards">
        <view class="main-card card-notes" @tap="takeNotePhoto">
          <view class="mc-icon-wrap">
            <text class="mc-emoji">📷</text>
          </view>
          <text class="mc-title">课后笔记</text>
          <text class="mc-desc">拍照 · AI整理 · 生成文档</text>
        </view>
        <view class="main-card card-mistakes" @tap="takeMistakePhoto">
          <view class="mc-icon-wrap">
            <text class="mc-emoji">📝</text>
          </view>
          <text class="mc-title">拍错题录入</text>
          <text class="mc-desc">拍照 · AI诊断 · 错因分析</text>
        </view>
      </view>

      <!-- 快捷功能小卡片 -->
      <view class="quick-grid">
        <view class="quick-card" @tap="goTargetPractice">
          <text class="qc-emoji">🎯</text>
          <text class="qc-name">靶向练习</text>
        </view>
        <view class="quick-card" @tap="goMockExam">
          <text class="qc-emoji">📋</text>
          <text class="qc-name">模拟考试</text>
        </view>
        <view class="quick-card" @tap="goExamSprint">
          <text class="qc-emoji">🚀</text>
          <text class="qc-name">考前冲刺</text>
        </view>
        <view class="quick-card" @tap="goOral">
          <text class="qc-emoji">🗣️</text>
          <text class="qc-name">英语口语</text>
        </view>
      </view>

      <!-- 班级作业 (已加入班级才显示) -->
      <view v-if="joinedClass" class="section-card">
        <view class="section-header">
          <text class="section-title">班级作业</text>
          <view class="hw-badge" v-if="pendingHomework > 0">
            <text class="badge-num">{{ pendingHomework }}</text>
          </view>
          <text class="more-link" @tap="goClassHomework">查看全部</text>
        </view>
        <view v-for="hw in classHomework" :key="hw.id" class="hw-item" @tap="goHomeworkDetail(hw.id)">
          <view class="hw-dot" :class="{ urgent: hw.urgent }"></view>
          <view class="hw-info">
            <text class="hw-name">{{ hw.name }}</text>
            <text class="hw-deadline">截止 {{ hw.deadline }}</text>
          </view>
          <view class="hw-status-tag" :class="hw.status">
            <text>{{ hw.statusText }}</text>
          </view>
        </view>
      </view>

      <!-- 我的成绩 -->
      <view v-if="joinedClass" class="section-card">
        <view class="section-header">
          <text class="section-title">我的成绩</text>
          <text class="more-link" @tap="goGrades">查看全部</text>
        </view>
        <view v-if="recentGrades.length === 0" class="empty-hint">
          <text class="empty-text">暂无成绩通知</text>
        </view>
        <view v-for="g in recentGrades" :key="g.id" class="grade-item" @tap="goGrades">
          <view class="gi-info">
            <text class="gi-name">{{ g.examName }}</text>
            <text class="gi-meta">{{ g.subject }} · {{ g.date }}</text>
          </view>
          <text class="gi-score">{{ g.score }}<text class="gi-full">/{{ g.fullScore }}</text></text>
        </view>
      </view>

      <!-- 今日状态条 -->
      <view class="today-stats">
        <view class="ts-item">
          <text class="ts-num">{{ todayStats.notes }}</text>
          <text class="ts-label">笔记整理</text>
        </view>
        <view class="ts-sep"></view>
        <view class="ts-item">
          <text class="ts-num">{{ todayStats.exercises }}</text>
          <text class="ts-label">练习题目</text>
        </view>
        <view class="ts-sep"></view>
        <view class="ts-item">
          <text class="ts-num">{{ todayStats.mistakes }}</text>
          <text class="ts-label">待消灭错题</text>
        </view>
      </view>

      <view style="height: 140rpx;"></view>
    </view>

    <!-- 教师端首页 -->
    <TeacherHome v-else />

    <CustomTabBar :current="0" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';
import { userApi } from '@/utils/api';
import { tryPlayAd, AD_UNIT_IDS } from '@/utils/ad-reward';
import CustomTabBar from '@/components/CustomTabBar/index.vue';
import TeacherHome from '@/components/teacher/TeacherHome.vue';
import SearchBar from '@/components/SearchBar/index.vue';

const userStore = useUserStore();
const todayStats = ref({ notes: 0, exercises: 0, mistakes: 0 });
const joinedClass = ref(false);
const pendingHomework = ref(0);
const classHomework = ref<{ id: string; name: string; deadline: string; urgent: boolean; status: string; statusText: string }[]>([]);
const recentGrades = ref<{ id: string; examName: string; subject: string; score: number; fullScore: number; date: string }[]>([]);

const greetingText = (() => {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 12) return '上午好';
  if (hour < 18) return '下午好';
  return '晚上好';
})();

const dateText = (() => {
  const now = new Date();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${now.getMonth() + 1}月${now.getDate()}日 星期${weekdays[now.getDay()]}`;
})();

onShow(() => {
  loadTodayStats();
  loadClassData();
});

async function loadClassData() {
  // 检测是否已加入班级
  if (userStore.user?.classIds && userStore.user.classIds.length > 0) {
    joinedClass.value = true;
  }
  // 测试账户显示示例数据
  if (userStore.token?.startsWith('test-token-')) {
    joinedClass.value = true;
    pendingHomework.value = 2;
    classHomework.value = [
      { id: '1', name: '第三章导数练习', deadline: '明天 23:59', urgent: true, status: 'pending', statusText: '待完成' },
      { id: '2', name: '古诗词默写', deadline: '05-10 18:00', urgent: false, status: 'pending', statusText: '待完成' },
      { id: '3', name: '虚拟语气专项', deadline: '05-02 23:59', urgent: false, status: 'done', statusText: '已批改' },
    ];
    recentGrades.value = [
      { id: '1', examName: '期中考试', subject: '数学', score: 85, fullScore: 100, date: '05-08' },
      { id: '2', examName: '第三章测验', subject: '数学', score: 92, fullScore: 100, date: '04-28' },
    ];
  }
}

async function loadTodayStats() {
  // 测试账户不请求后端
  if (userStore.token?.startsWith('test-token-')) {
    todayStats.value = { notes: 0, exercises: 0, mistakes: 0 };
    return;
  }
  try {
    const res = await userApi.getTodayStats();
    todayStats.value = res;
  } catch {}
}

function takeNotePhoto() {
  // #ifdef MP-WEIXIN
  uni.chooseMedia({
    count: 9,
    mediaType: ['image'],
    sourceType: ['camera', 'album'],
    sizeType: ['compressed'],
    success: (res) => {
      const paths = encodeURIComponent(JSON.stringify(res.tempFiles.map((f: any) => f.tempFilePath)));
      uni.navigateTo({ url: `/pages/notes/preview/index?images=${paths}` });
    },
    fail: (err) => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        uni.showToast({ title: '无法打开相机，请检查权限设置', icon: 'none' });
      }
    },
  });
  // #endif
  // #ifndef MP-WEIXIN
  uni.chooseImage({
    count: 9, sizeType: ['compressed'], sourceType: ['camera', 'album'],
    success: (res) => {
      const paths = encodeURIComponent(JSON.stringify(res.tempFilePaths));
      uni.navigateTo({ url: `/pages/notes/preview/index?images=${paths}` });
    },
  });
  // #endif
}

function takeMistakePhoto() {
  // #ifdef MP-WEIXIN
  uni.chooseMedia({
    count: 9,
    mediaType: ['image'],
    sourceType: ['camera', 'album'],
    sizeType: ['compressed'],
    success: (res) => {
      const paths = encodeURIComponent(JSON.stringify(res.tempFiles.map((f: any) => f.tempFilePath)));
      uni.navigateTo({ url: `/pages/mistakes/detail/index?images=${paths}&mode=create` });
    },
    fail: (err) => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        uni.showToast({ title: '无法打开相机，请检查权限设置', icon: 'none' });
      }
    },
  });
  // #endif
  // #ifndef MP-WEIXIN
  uni.chooseImage({
    count: 9, sizeType: ['compressed'], sourceType: ['camera', 'album'],
    success: (res) => {
      const paths = encodeURIComponent(JSON.stringify(res.tempFilePaths));
      uni.navigateTo({ url: `/pages/mistakes/detail/index?images=${paths}&mode=create` });
    },
  });
  // #endif
}

function goTargetPractice() { uni.switchTab({ url: '/pages/practice/index' }); }
async function goMockExam() {
  const ok = await tryPlayAd(AD_UNIT_IDS.MOCK_EXAM, '模拟考试');
  if (ok) uni.navigateTo({ url: '/pages/mock-exam/index?type=exam' });
}
async function goExamSprint() {
  const ok = await tryPlayAd(AD_UNIT_IDS.EXAM_SPRINT, '考前冲刺');
  if (ok) uni.navigateTo({ url: '/pages/exam-sprint/index' });
}
function goOral() { uni.navigateTo({ url: '/pages/oral/index' }); }
function goClassHomework() { uni.navigateTo({ url: '/pages/class/homework/index' }); }
function goGrades() { uni.navigateTo({ url: '/pages/class/grades/index' }); }
function goHomeworkDetail(id: string) { uni.navigateTo({ url: `/pages/class/homework-detail/index?id=${id}` }); }
</script>

<style scoped>
.page-wrap { min-height: 100vh; }
.home-page {
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
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40rpx; }
.greeting { font-size: 40rpx; font-weight: 800; color: var(--c-t1); display: block; line-height: 1.3; }
.date-text { font-size: 26rpx; color: var(--c-t2); display: block; margin-top: 10rpx; }

.main-cards { display: flex; gap: 20rpx; margin-bottom: 28rpx; }
.main-card { flex: 1; border-radius: 28rpx; padding: 36rpx 28rpx; display: flex; flex-direction: column; gap: 16rpx; position: relative; overflow: hidden; }
.main-card::after { content: ''; position: absolute; top: -40rpx; right: -40rpx; width: 140rpx; height: 140rpx; background: rgba(255,255,255,0.06); border-radius: 50%; }
.card-notes { background: linear-gradient(145deg, #3D56C6, #5B7BFF); box-shadow: 0 8rpx 28rpx rgba(91,123,255,0.3); }
.card-mistakes { background: linear-gradient(145deg, #C04040, #FF6B6B); box-shadow: 0 8rpx 28rpx rgba(255,107,107,0.3); }
.mc-icon-wrap { width: 72rpx; height: 72rpx; background: rgba(255,255,255,0.18); border-radius: 18rpx; display: flex; align-items: center; justify-content: center; }
.mc-emoji { font-size: 36rpx; }
.mc-title { font-size: 32rpx; font-weight: 700; color: #FFF; }
.mc-desc { font-size: 22rpx; color: rgba(255,255,255,0.6); }

.quick-grid { display: flex; gap: 16rpx; margin-bottom: 28rpx; }
.quick-card { flex: 1; background: var(--c-card); border-radius: 20rpx; padding: 28rpx 0; display: flex; flex-direction: column; align-items: center; gap: 14rpx; border: 1rpx solid var(--c-border); }
.qc-emoji { font-size: 40rpx; }
.qc-name { font-size: 24rpx; font-weight: 600; color: var(--c-t2); }

/* 班级作业区域 */
.section-card { background: var(--c-card); border-radius: 24rpx; padding: 28rpx; margin-bottom: 20rpx; border: 1rpx solid var(--c-border); }
.section-header { display: flex; align-items: center; margin-bottom: 16rpx; }
.section-title { font-size: 28rpx; font-weight: 700; color: var(--c-t1); flex: 1; }
.more-link { font-size: 24rpx; color: var(--c-primary); }
.hw-badge { background: #FF6B6B; width: 36rpx; height: 36rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12rpx; }
.badge-num { font-size: 20rpx; color: #FFF; font-weight: 800; }
.hw-item { display: flex; align-items: center; padding: 16rpx 0; border-bottom: 1rpx solid var(--c-border); gap: 16rpx; }
.hw-item:last-child { border-bottom: none; }
.hw-dot { width: 12rpx; height: 12rpx; border-radius: 50%; background: var(--c-primary); flex-shrink: 0; }
.hw-dot.urgent { background: #FF6B6B; }
.hw-info { flex: 1; }
.hw-name { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; }
.hw-deadline { font-size: 22rpx; color: var(--c-t3); }
.hw-status-tag { padding: 4rpx 12rpx; border-radius: 8rpx; font-size: 20rpx; flex-shrink: 0; }
.hw-status-tag.pending { background: rgba(255,186,74,0.15); color: #FFBA4A; }
.hw-status-tag.done { background: rgba(52,211,153,0.15); color: #34D399; }

/* 成绩区域 */
.empty-hint { padding: 24rpx 0; text-align: center; }
.empty-text { font-size: 26rpx; color: var(--c-t3); }
.grade-item { display: flex; align-items: center; padding: 16rpx 0; border-bottom: 1rpx solid var(--c-border); }
.grade-item:last-child { border-bottom: none; }
.gi-info { flex: 1; }
.gi-name { font-size: 28rpx; font-weight: 600; color: var(--c-t1); display: block; }
.gi-meta { font-size: 22rpx; color: var(--c-t3); }
.gi-score { font-size: 36rpx; font-weight: 800; color: var(--c-primary); flex-shrink: 0; }
.gi-full { font-size: 22rpx; color: var(--c-t3); font-weight: 400; }

.today-stats { background: var(--c-card); border-radius: 24rpx; padding: 36rpx 0; display: flex; align-items: center; border: 1rpx solid var(--c-border); }
.ts-item { flex: 1; text-align: center; }
.ts-num { font-size: 48rpx; font-weight: 800; color: var(--c-primary); display: block; line-height: 1; margin-bottom: 10rpx; }
.ts-label { font-size: 22rpx; color: var(--c-t3); }
.ts-sep { width: 1rpx; height: 52rpx; background: var(--c-border); }

/* iPad适配 */
@media screen and (min-width: 768px) {
  .home-page {
    padding: 24px;
    padding-top: 60px;
  }
  .greeting { font-size: 28px; }
  .date-text { font-size: 14px; }
  .main-card { border-radius: 16px; padding: 24px 20px; }
  .mc-icon-wrap { width: 44px; height: 44px; border-radius: 12px; }
  .mc-emoji { font-size: 22px; }
  .mc-title { font-size: 18px; }
  .mc-desc { font-size: 12px; }
  .quick-card { border-radius: 14px; padding: 18px 0; }
  .qc-emoji { font-size: 26px; }
  .qc-name { font-size: 13px; }
  .section-card { border-radius: 14px; padding: 18px; }
  .section-title { font-size: 16px; }
  .hw-name { font-size: 15px; }
  .today-stats { border-radius: 14px; padding: 22px 0; }
  .ts-num { font-size: 28px; }
  .ts-label { font-size: 12px; }
}
</style>
